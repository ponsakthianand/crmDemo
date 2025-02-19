'use client'
import { Link } from '@/src/navigation'
import { FormEvent, useState } from 'react'
import { baseUrl } from '@/global';
import { toast } from 'sonner';
import { RiLoader5Fill } from 'react-icons/ri';
import { useRouter } from 'next/navigation'

interface forgotPasswordProps {
  emailOnSuccess: (email: string) => void;
}

export default function ForgotPassword(props: forgotPasswordProps) {
  const router = useRouter()
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoader(true)
    setLoader(true)
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')

    const response = await fetch(`/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (response.ok) {
      props?.emailOnSuccess(email as string)
      toast('Your new password has been sent to your email!')
      setLoader(false)
      router.push('/login')
    } else {
      toast("The email you've entered is not registered yet!")
      setLoader(false)
    }
  }

  return (
    <div className='relative'>
      <div className={`mt-10 sm:mx-auto sm:w-full sm:max-w-sm items-center ${loader ? 'opacity-20 pointer-events-none	' : ''}`}>
        <form className="space-y-6" action="#" method="POST" onSubmit={(event) => handleSubmit(event)}>
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
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 py-1.5 px-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Reset
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Got remember?{' '}
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
  )
} 