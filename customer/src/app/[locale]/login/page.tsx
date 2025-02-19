"use client"
import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/src/app/store/hooks';
import { RiLoader5Fill } from "react-icons/ri";

import { login } from '@/src/app/store/reducers/auth';

import { useSession } from "next-auth/react"
import { getServerSideProps, parseJwt } from '@/global';
import { Link } from '@/src/navigation';
import { toast } from 'sonner';
import PasswordField from '../../common/elements/password';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      const authData = parseJwt(session.accessToken);
      dispatch(login(authData));
      router.push('/');
    }
  }, [status])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true)
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password
    });

    if (result?.error) {
      console.error(result.error);
      setLoader(false)
      toast.error("Please check your username or password")
    } else {
      router.push('/');
    }
  };


  return (
    <div className="flex min-h-full flex-1 flex-col justify-center lg:px-20 lg:py-28 px-8 py-28">
      <div className='relative'>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
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
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link href={`/forgot-password`} className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <PasswordField passwordValue={(value) => setPassword(value)} />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href={`/signup`} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>

        {loader ? <div role="status" className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'>
          <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
          <span className="sr-only">Loading...</span>
        </div> : <></>}
      </div>
    </div>
  );
};

export default Login;
