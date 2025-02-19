'use client';
import { useEffect, useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useAppDispatch, useAppSelector } from '@/src/app/store/hooks';
import { FormDataValue, leadFieldsSchema } from './formScema';
import { Button } from '@/registry/new-york/ui/button';
import dobToAge from 'dob-to-age';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/new-york/ui/select';
import DateTimePicker from './datetime';
import 'react-phone-number-input/style.css';
import './custom.css';
import { toast } from 'sonner';
import { Label } from '@/registry/new-york/ui/label';
import { Textarea } from '@/registry/new-york/ui/textarea';
import { Checkbox } from '@/registry/new-york/ui/checkbox';
import { Input } from '@/registry/new-york/ui/input';
import { ScrollArea } from '@/registry/new-york/ui/scroll-area';

export default function AddLeadForm({ column }) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state: { authToken: { access_token: string } }) => state.authToken);
  const [referral_id, setReferralId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const partnerRefId = localStorage.getItem('partner_ref');
      return partnerRefId ? partnerRefId : '';
    }
    return '';
  });
  const [formData, setFormData] = useState<FormDataValue>({});
  const [errors, setErrors] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(true);

  useEffect(() => {
    // Check if the form is hidden due to a recent submission
    const hideUntil = localStorage.getItem('hideFormUntil');
    if (hideUntil && new Date(hideUntil) > new Date()) {
      setIsFormVisible(false);
    }
  }, []);

  const hideFormForTenMinutes = () => {
    const hideUntil = new Date();
    hideUntil.setMinutes(hideUntil.getMinutes() + 10);
    localStorage.setItem('hideFormUntil', hideUntil.toISOString());
    setIsFormVisible(false);
  };

  function convertDOB(dateString) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }

  const handleInputChange = (e, fieldPath) => {
    const { value } = e?.target;
    const fieldValue = value;

    setFormData((prev) => {
      const updated = { ...prev };
      const pathParts = fieldPath.split('.');
      let pointer = updated;

      pathParts.forEach((part, index) => {
        if (index === pathParts.length - 1) {
          pointer[part] = fieldValue;

          if (part === 'dob') {
            const age = dobToAge(convertDOB(fieldValue))?.count;
            updated.age = age ? age.toString() : null;
          }
        } else {
          pointer[part] = pointer[part] || {};
          pointer = pointer[part];
        }
      });

      return updated;
    });
  };

  const validateLead = (data) => {
    const fieldErrors: any = {};

    if (!data.full_Name) fieldErrors.full_Name = 'Name is required.';
    if (!data.mobile) fieldErrors.mobile = 'Mobile number is required.';
    if (!data.email) fieldErrors.email = 'Email is required.';

    return fieldErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldErrors = validateLead(formData);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      toast.error('Please fix the highlighted errors.');
      return;
    }

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({ ...formData, referral_id }),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error(result?.errors[0] || 'Something went wrong.');
      return;
    }

    // On successful submission
    toast.success('Thank you for your submission!');
    setFormData({ category: formData.category }); // Reset form
    hideFormForTenMinutes(); // Hide form for 10 minutes
  };

  const renderField = (fieldKey, fieldConfig, parentPath = '') => {
    const fieldPath = parentPath ? `${parentPath}.${fieldKey}` : fieldKey;
    if (fieldConfig.conditional) {
      try {
        const isVisible = fieldConfig.conditional(formData, fieldPath);
        if (!isVisible) return null;
      } catch (error) {
        console.error(`Error evaluating conditional for ${fieldKey}:`, error);
        return null;
      }
    }

    const value = formData[fieldPath]?.[fieldKey];
    const error = errors[fieldKey];

    return (
      <div className="w-full text-left">
        {fieldConfig.type === 'textarea' ? (
          <>
            <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
            <Textarea
              name={fieldKey}
              value={value}
              onChange={(e) => handleInputChange(e, fieldPath)}
              placeholder={fieldConfig.placeholder}
            />
          </>
        ) : fieldConfig.type === 'select' ? (
          <>
            <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
            <Select
              defaultValue={fieldConfig.defaultValue}
              onValueChange={(e) =>
                handleInputChange(
                  { target: { ...fieldConfig, value: e } },
                  fieldPath
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={fieldConfig.placeholder || 'Select'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {fieldConfig.options.map((option, idx) => (
                    <SelectItem
                      key={`${fieldKey}-${idx}`}
                      className="hover:bg-slate-100 cursor-pointer"
                      value={option}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        ) : fieldConfig.type === 'mobile' ? (
          <>
            <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
            <PhoneInput
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 phoneInPut"
              initialValueFormat="national"
              defaultCountry="IN"
              value={value}
              onChange={(e) =>
                handleInputChange(
                  { target: { ...fieldConfig, value: e } },
                  fieldPath
                )
              }
            />
          </>
        ) : fieldConfig.type === 'checkbox' ? (
          <div className='w-full'>
            <Label htmlFor={fieldKey}>{fieldConfig.placeholder}</Label>
            <div className='flex items-center space-x-2 mt-2'>
              <Checkbox
                id={fieldKey}
                checked={value}
                onCheckedChange={(e) =>
                  handleInputChange(
                    { target: { ...fieldConfig, value: e } },
                    fieldPath
                  )
                }
              />
              <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
            </div>
          </div>
        ) : (
          <>
            <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
            <Input
              type={fieldConfig.type}
              name={fieldKey}
              placeholder={fieldConfig.placeholder}
              value={value}
              onChange={(e) => handleInputChange(e, fieldPath)}
            />
          </>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };

  if (!isFormVisible) {
    return (
      <div className="p-4">
        <p className="text-lg font-semibold text-center">
          Thank you for your submission! You can submit again after 10 minutes.
        </p>
      </div>
    );
  }

  let gridClasses = 'grid gap-4';
  if (column === 1) {
    gridClasses += ' grid-cols-1';
  } else if (column === 2) {
    gridClasses += ' md:grid-cols-1 lg:grid-cols-2';
  } else if (column >= 3) {
    gridClasses += ' md:grid-cols-1 lg:grid-cols-3';
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ height: 'calc(95vh - 100px)' }} className="p-4 overflow-hidden overflow-y-auto">
          <div className={gridClasses}>
            {Object.entries(leadFieldsSchema).map(([fieldKey, fieldConfig]) =>
              renderField(fieldKey, fieldConfig)
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" className="ml-2">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
