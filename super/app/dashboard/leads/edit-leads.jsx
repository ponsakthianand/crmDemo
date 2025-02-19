import { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { leadFieldsSchema } from './formScema';
import { Button } from '@/registry/new-york/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/new-york/ui/drawer';
import { Input } from '@/registry/new-york/ui/input';
import { Label } from '@/registry/new-york/ui/label';
import { Textarea } from '@/registry/new-york/ui/textarea';
import { Checkbox } from '@/registry/new-york/ui/checkbox';
import { Check, ChevronsUpDown } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/registry/new-york/ui/scroll-area';

import { fetchAllLeadsDataAPI } from '@/app/store/reducers/allLeadsData';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/new-york/ui/command';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/registry/new-york/ui/select';
import DateTimePicker from './datetime';
import { cn } from '@/lib/utils';
import 'react-phone-number-input/style.css';
import './custom.css';

export default function AddLeadFrom({ onSubmitDrawer, initialData }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const accessToken = useAppSelector((state) => state.authToken);
  const partners = useAppSelector((state) => state.partnersDropdownsList);
  const partnerDropDown = partners?.data?.map((partner) => ({
    label: partner.name,
    value: partner._id,
  }));

  const [formData, setFormData] = useState(initialData || {});

  const fieldsToRemove = [
    'updated_history',
    'callScheduleHistory',
    'commentHistory',
    'created_by_id',
    'created_by_name',
    'created_at',
    'updated_at',
    'updated_by_id',
    'updated_by_name',
    '_id',
  ];

  const updatedObject = Object.keys(formData).reduce((acc, key) => {
    const value = formData[key];
    const isEmpty = value === null || value === undefined || value === '';
    if (!fieldsToRemove.includes(key) && !isEmpty) {
      acc[key] = value;
    }
    return acc;
  }, {});

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
        } else {
          pointer[part] = pointer[part] || {};
          pointer = pointer[part];
        }
      });

      return updated;
    });
  };

  const referral_name = formData?.referral_id
    ? partnerDropDown?.find((item) => item.value === formData?.referral_id)
        ?.label
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/leads/${formData?._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({ ...updatedObject, referral_name }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    setDrawerOpen(false);
    onSubmitDrawer(false);
    setFormData({});
    accessToken?.access_token?.length &&
      dispatch(fetchAllLeadsDataAPI(accessToken?.access_token));
    toast({
      title: 'Great work!',
      description: 'Lead updated successfully.',
    });
    console.log(result);
  };

  const handleConvertCustomerSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/customers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({
        name: formData?.full_Name,
        email: formData?.email,
        phone: formData?.mobile,
        partner_id: formData?.referral_id,
        partner_name: referral_name,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      toast({
        title: 'Sorry!',
        description: result?.errors || 'Something went wrong.',
      });
      return;
    }
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    setDrawerOpen(false);
    onSubmitDrawer(false);
    setFormData({});

    await fetch(`/api/leads/${formData?._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({
        isCustomer: true,
      }),
    });

    accessToken?.access_token?.length &&
      dispatch(fetchAllLeadsDataAPI(accessToken?.access_token));
    toast({
      title: 'Great work!',
      description: `${formData?.full_Name} created as a customer.`,
    });
    console.log(result);
  };

  const renderField = (fieldKey, fieldConfig, parentPath = '') => {
    const fieldPath = parentPath ? `${parentPath}.${fieldKey}` : fieldKey;
    // Check if conditional exists and evaluate it
    if (fieldConfig.conditional) {
      try {
        // Pass formData and current fieldPath for evaluation
        const isVisible = fieldConfig.conditional(formData, fieldPath);

        if (!isVisible) {
          return null;
        }
      } catch (error) {
        console.error(`Error evaluating conditional for ${fieldKey}:`, error);
        return null;
      }
    }

    const value =
      fieldConfig.type === 'checkbox'
        ? formData[fieldPath]?.[fieldKey]
        : formData[fieldPath]?.[fieldKey];

    return (
      <>
        {fieldConfig.type === 'textarea' ? (
          <div className='w-full'>
            <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
            <Textarea
              name={fieldKey}
              value={formData?.[fieldKey] || value}
              onChange={(e) => handleInputChange(e, fieldPath)}
              placeholder={fieldConfig.placeholder}
            />
          </div>
        ) : fieldConfig.type === 'select' ? (
          <div className='w-full'>
            <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
            <Select
              defaultValue={formData?.[fieldKey] || value}
              onValueChange={(e) =>
                handleInputChange(
                  { target: { ...fieldConfig, value: e } },
                  fieldPath
                )
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={fieldConfig.placeholder || 'Select'}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {fieldConfig.options.map((option, idx) => (
                    <SelectItem
                      key={`${fieldKey}-${idx}`}
                      className='hover:bg-slate-100 cursor-pointer'
                      value={option}
                      placeholder={fieldConfig.placeholder}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ) : fieldConfig.type === 'mobile' ? (
          <div className='w-full'>
            <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
            <PhoneInput
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 phoneInPut'
              initialValueFormat='national'
              defaultCountry='IN'
              value={value}
              onChange={(e) =>
                handleInputChange(
                  { target: { ...fieldConfig, value: e } },
                  fieldPath
                )
              }
            />
          </div>
        ) : fieldConfig.type === 'date' ? (
          <div className='w-full'>
            <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
            <DateTimePicker
              selectedDate={formData?.[fieldKey] || value}
              onDateChange={(e) =>
                handleInputChange(
                  { target: { ...fieldConfig, value: e } },
                  fieldPath
                )
              }
            />
          </div>
        ) : fieldConfig.type === 'checkbox' ? (
          <div className='w-full'>
            <Label htmlFor={fieldKey}>{fieldConfig.placeholder}</Label>
            <div className='flex items-center space-x-2 mt-2'>
              <Checkbox
                id={fieldKey}
                checked={formData?.[fieldKey] || value}
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
        ) : fieldConfig.type === 'combo' ? (
          <div className='w-full'>
            <div className='flex flex-col'>
              <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-2'
                  >
                    {formData?.referral_id
                      ? partnerDropDown?.find(
                          (item) => item.value === formData?.referral_id
                        )?.label
                      : 'Select partner...'}
                    <ChevronsUpDown className='h-3 w-3 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                    <CommandInput
                      placeholder='Search partner...'
                      className=''
                    />
                    <CommandList className='w-full'>
                      <CommandEmpty>No partners found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className='h-[200px] rounded-md'>
                          {partnerDropDown?.map((partner) => (
                            <CommandItem
                              key={partner.value}
                              value={partner.value}
                              onSelect={(e) => {
                                handleInputChange(
                                  { target: { ...fieldConfig, value: e } },
                                  fieldPath
                                );
                                setOpen(false);
                              }}
                              className='hover:bg-gray-100 cursor-pointer'
                            >
                              {partner.label}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  value === partner.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
          <div className='w-full'>
            <Label htmlFor={fieldKey}>{fieldConfig.label}</Label>
            <Input
              type={fieldConfig.type}
              name={fieldKey}
              placeholder={fieldConfig.placeholder}
              value={formData?.[fieldKey] || value}
              onChange={(e) => handleInputChange(e, fieldPath)}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className='p-4 pt-0'>
      <form onSubmit={handleSubmit}>
        <DrawerHeader className='pt-0'>
          <DrawerTitle>{formData?.full_Name}'s Lead</DrawerTitle>
        </DrawerHeader>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4'>
          {Object.entries(leadFieldsSchema).map(([fieldKey, fieldConfig]) =>
            renderField(fieldKey, fieldConfig)
          )}
        </div>

        <div className='flex justify-end mt-4'>
          {!formData?.isCustomer && (
            <Button
              type='submit'
              onClick={(e) => handleConvertCustomerSubmit(e)}
              variant={'link'}
              className='ml-2'
            >
              Convert lead to customer
            </Button>
          )}
          <DrawerClose asChild>
            <Button className='ml-2' variant='outline'>
              Cancel
            </Button>
          </DrawerClose>
          <Button type='submit' className='ml-2'>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
