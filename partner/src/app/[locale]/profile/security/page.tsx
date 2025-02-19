'use client'
import { baseUrl } from '@/global';
import isAuth from '@/src/app/protect/withAuth';
import { useAppSelector } from '@/src/app/store/hooks';
import { FormEvent, useState } from 'react';
import { GrSecure } from "react-icons/gr";
import { RiLoader5Fill } from 'react-icons/ri';
import { toast } from 'sonner';

const ProfileSecurityPage = () => {
  const [loader, setLoader] = useState(false);
  const accessToken = useAppSelector((state) => state.authToken);
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const currentUser = getCustomerInfo?.data;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoader(true)
    const formData = new FormData(event.currentTarget)
    const id = currentUser?._id
    const new_password = formData.get('new_password')
    const current_password = formData.get('current_password')

    const response = await fetch(`/api/users/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: `Bearer ${accessToken?.access_token}`, },
      body: JSON.stringify({ id, new_password, current_password }),
    })

    if (response.ok) {
      toast('New password has been succefully updated!')
      setLoader(false)
    } else {
      toast("Current password is not correct")
      setLoader(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756]">
      <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
        <span className="text-[#008756]">
          <GrSecure />
        </span>
        <span className="tracking-wide">Security & Privacy</span>
      </div>

      <div className='ml-8 mb-7'>
        <div className='mt-10 mb-4 text-gray-500 transition-colors duration-200 dark:text-gray-400'>
          Update Password
        </div>

        <div className={`${loader ? 'opacity-20 pointer-events-none	' : ''}`}>
          <form className="w-96" method="POST" onSubmit={(event) => handleSubmit(event)}>
            <div className="mb-5">
              <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New password</label>
              <input type="password" name='new_password' id="new_password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
            </div>
            <div className="mb-5">
              <label htmlFor="current_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current password</label>
              <input type="password" name='current_password' id="current_password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">New Password</button>
          </form>
          {loader ? <div role="status" className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'>
            <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
            <span className="sr-only">Loading...</span>
          </div> : <></>}
        </div>
      </div>

    </div >
  )
}

export default isAuth(ProfileSecurityPage);