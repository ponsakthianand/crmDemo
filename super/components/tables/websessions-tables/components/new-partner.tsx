'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/lib/store';
import { Button } from '@/registry/new-york/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/registry/new-york/ui/input';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { baseUrl } from '@/global';
import { Form } from '@/registry/new-york/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RiLoader5Fill } from 'react-icons/ri';
import 'react-phone-number-input/style.css'
import PhoneInput, {
  isValidPhoneNumber
} from 'react-phone-number-input'
import { toast } from '@/components/ui/use-toast';
import { fetchPartnersDataAPI } from '@/app/store/reducers/allPartners';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string()
});

type UserFormValue = z.infer<typeof formSchema>;

export default function NewPartnerDialog() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const [dialogOpen, setDialogOpen] = useState(false)
  const [value, setValue] = useState("")
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false);
  const [email, setemail] = useState(null)
  const [name, setName] = useState(null)
  const disableButton = !email || !name || (phone ? !isValidPhoneNumber(phone) : true);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const checkPhoneNumber = (e: any) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      return;
    }
    !/[0-9]/.test(e.key) && e.preventDefault()
  };

  const checkSpecialChar = (e: any) => {
    if (/^[a-zA-Z0-9_ ]*$/.test(e.key)) {
      true
    } else {
      e.preventDefault();
    }
  };

  const checkEmailSpaceChar = (e: any) => {
    var key = e.keyCode;
    if (key === 32) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const form = e.currentTarget;
    const formData = new FormData(form);
    const created_at = new Date
    const role = 'partner'
    const partner_user_id = `uid${Math.random().toString(16).slice(10)}`
    const { email, name } = Object.fromEntries(formData);

    await fetch(`${baseUrl}/partner/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({ created_at, role, email, name, phone, partner_user_id })
    })
      .then(async (response) => {
        setLoading(false)
        if (response.ok) {
          dispatch(fetchPartnersDataAPI(accessToken?.access_token as string))
          toast({
            description: `New partner created!`,
          })
          setDialogOpen(false)
        } else if (response.status === 401) {
        }
      })
      .catch((error) => {
        setLoading(false)
        console.error(error)
      });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          ＋ Add New Partner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => {
        e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle>Add New Partner</DialogTitle>
          <DialogDescription>
            Get the new partner today!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className='relative'>
            <div className={`relative ${loading ? ' opacity-20 pointer-events-none	' : ''}`}>
              <form
                id="new-partner-form"
                className="grid gap-4 py-4"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="name"
                    name="name"
                    placeholder="Name..."
                    className="col-span-4"
                    onChange={(e: any) => setName(e)}
                    onKeyDown={(e: any) => checkSpecialChar(e)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="email"
                    name="email"
                    type='email'
                    placeholder="Email..."
                    onKeyDown={(e: any) => checkEmailSpaceChar(e)}
                    onChange={(e: any) => setemail(e)}
                    className="col-span-4"
                  />
                </div>
                <div className="">
                  <PhoneInput
                    placeholder="Enter phone number"
                    defaultCountry="IN"
                    onKeyDown={(e: any) => checkPhoneNumber(e)}
                    value={phone}
                    onChange={(e: any) => setPhone(e)}
                    className="block w-full bg-white rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" size="sm" form="new-partner-form" disabled={disableButton}>
                    Add Partner
                  </Button>
                </DialogFooter>
              </form>
            </div>
            {loading ? <div role="status" className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'>
              <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
              <span className="sr-only">Loading...</span>
            </div> : <></>}
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
