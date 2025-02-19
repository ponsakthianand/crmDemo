'use client'
import { useState } from 'react';
import ForgotPassword from './forgotPassword';


const RecoverPassowrd = () => {
  const [email, setEmail] = useState('');

  const getEmail = (userEmail: string) => {
    return setEmail(userEmail);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot password?
        </h2>
        <h6 className=' text-center'>That's okay!</h6>
      </div>
      <ForgotPassword emailOnSuccess={getEmail} />
    </div>
  )
}

export default RecoverPassowrd;