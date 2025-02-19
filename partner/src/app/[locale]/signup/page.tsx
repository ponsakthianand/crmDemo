'use client'
import { Link } from '@/src/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { baseUrl } from '@/global';
import { RiLoader5Fill } from 'react-icons/ri';
import { toast } from 'sonner';
import 'react-phone-number-input/style.css'
import PhoneInput, {
  isValidPhoneNumber
} from 'react-phone-number-input'
import { restrictedKeywords } from '@/src/bad_keywords';
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoCloseCircle } from "react-icons/io5";
import { useDebounce } from "use-debounce";

export default function SignupPage() {
  const router = useRouter()
  const [loader, setLoader] = useState(false);
  const [usernameloader, setUsernameLoader] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameFinal] = useDebounce(username, 500);
  const [usernameValid, setUsernameValid] = useState(null);
  const [usernameMessage, setUsernameMessage] = useState('');
  const [email, setemail] = useState()
  const [name, setName] = useState()
  const [phoneNumber, setPhoneNumber] = useState('')
  const disableButton = !usernameValid || email || name || (phoneNumber ? !isValidPhoneNumber(phoneNumber) : true);

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

  const checkUsernameChar = (e) => {
    if (!/[0-9a-zA-Z]/.test(e.key)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (usernameFinal?.length >= 3) {
      setUsernameMessage('')
      if (!restrictedKeywords?.includes(usernameFinal)) {
        setUsernameLoader(true)
        setUsernameMessage('')
        fetch(`${baseUrl}/member/${usernameFinal}`, {
          method: 'GET'
        }).then((res) => {
          return res.json()
        }).then(response => {
          setUsernameValid(response)
          setUsernameLoader(false)
        }).catch(err => {
          console.log(err);
        })
      } else {
        setUsernameValid(null)
        setUsernameMessage('Unacceptable keyword. Please try something related to your name')
      }
    } else {
      usernameFinal?.length && setUsernameValid(null)
      usernameFinal?.length && setUsernameMessage('Please enter minimum 3 characters')
    }
  }, [usernameFinal, usernameValid])

  const usernameValidState = () => {
    let updated
    if (!usernameloader && usernameValid !== null) {
      updated = usernameValid ? <span className='text-xs text-green-600 w-[35px]' title='Username availalbe'>
        <IoCheckmarkCircle size={32} />
      </span> : <span className='text-rose-600 text-xs w-[35px]' title='Username already exists!'>
        <IoCloseCircle size={32} />
      </span>
    }
    return updated
  }


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoader(true)
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const name = formData.get('name')
    const phone = phoneNumber
    const partner_user_id = username

    const response = await fetch(`/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, partner_user_id, phone }),
    })

    if (response.ok) {
      toast('Signup completed. Please wait for the admin to approve your account')
      router.push('/login');
    } else {
      toast.error('Something went wrong')
      setLoader(false)
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className='relative'>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up
          </h2>
        </div>

        <div className={`sm:mx-auto sm:w-full sm:max-w-sm items-center ${loader ? 'opacity-20 pointer-events-none	' : ''}`}>
          <form className="space-y-3" action="#" method="POST" onSubmit={(event) => handleSubmit(event)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  required
                  onKeyDown={(e) => checkSpecialChar(e)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onKeyDown={(e) => checkEmailSpaceChar(e)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Phone
              </label>
              <div className="mt-1">
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
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username <span className='text-gray-500 text-xs'>(This will be used as your reference)</span>
              </label>
              <div className="mt-1">
                <div className='flex items-center justify-center'>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => checkUsernameChar(e)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <div className={`relative  ${usernameloader ? 'w-[35px]' : ''}`}>
                    {usernameloader ? <div role="status" className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'>
                      <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
                      <span className="sr-only">Loading...</span>
                    </div> : <></>}
                    {usernameValidState()}
                  </div>
                </div>
                {usernameMessage?.length ? <span className='text-gray-500 text-xs'>{usernameMessage}</span> : <></>}
                {
                  (usernameValid !== null && usernameValid === true) ? <span className='text-xs text-green-600'>Good to go</span> : usernameValid === null ? '' : <span className='text-rose-600 text-xs'>Username already exists!</span>
                }
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