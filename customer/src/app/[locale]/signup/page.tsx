'use client'
import { Link } from '@/src/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { baseUrl, parseJwt } from '@/global';
import { RiLoader5Fill } from 'react-icons/ri';
import { toast } from 'sonner';
import 'react-phone-number-input/style.css'
import PhoneInput, {
  isValidPhoneNumber
} from 'react-phone-number-input'
import { getCookie } from 'cookies-next';
import { useSession } from 'next-auth/react';


export default function SignupPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loader, setLoader] = useState(false);
  const [email, setemail] = useState(null)
  const [name, setName] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const disableButton = !email || !name || (phoneNumber ? !isValidPhoneNumber(phoneNumber) : true);
  const [referralId, setReferralId] = useState<string>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('partner_ref') : ''
  });

  useEffect(() => {
    setLoader(true)
    if (status === "authenticated") {
      const authData = parseJwt(session.accessToken);
      // dispatch(login(authData));
      router.push('/profile');
      setLoader(false)
    } else {
      setLoader(false)
    }
  }, [status])


  const checkPhoneNumber = (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      return;
    }
    !/[0-9]/.test(e.key) && e.preventDefault()
  };

  const checkSpecialChar = (e) => {
    if (/^[a-zA-Z0-9_ ]*$/.test(e.key)) {
      true
    } else {
      e.preventDefault();
    }
  };

  const checkEmailSpaceChar = (e) => {
    var key = e.keyCode;
    if (key === 32) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoader(true)
    const phone = phoneNumber
    const payload = { email, name, phone, referralId }

    const response = await fetch(`/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      toast.success('Signup completed. Please check your email for temporary password')
      router.push('/login');
    } else {
      toast.error('Something is wrong!. Please try later')
      setLoader(false)
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center lg:px-20 lg:py-28 px-8 py-28">
      <div className='relative'>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up
          </h2>
        </div>

        <div className={`mt-10 sm:mx-auto sm:w-full sm:max-w-sm items-center ${loader ? 'opacity-20 pointer-events-none	' : ''}`}>
          <form className="space-y-6" action="#" method="POST" onSubmit={(event) => handleSubmit(event)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => checkSpecialChar(e)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => setemail(e.target.value)}
                  onKeyDown={(e) => checkEmailSpaceChar(e)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Phone
              </label>
              <div className="mt-2">
                <PhoneInput
                  placeholder="Enter phone number"
                  defaultCountry="IN"
                  onKeyDown={(e) => checkPhoneNumber(e)}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  className="block w-full bg-white rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={disableButton}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href={`/login`} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>

        {loader ? <div role="status" className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'>
          <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
          <span className="sr-only">Loading...</span>
        </div> : <></>}
      </div>
    </div>
  )
}