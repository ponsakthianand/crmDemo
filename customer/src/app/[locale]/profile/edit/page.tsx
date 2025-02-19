'use client'
import { baseUrl, confidentialDataField, personalDataField } from '@/global';
import isAuth from '@/src/app/protect/withAuth';
import { useAppSelector } from '@/src/app/store/hooks';
import { FormEvent, useState } from 'react';
import { RiLoader5Fill } from 'react-icons/ri';
import { toast } from 'sonner';
import { TbUserEdit } from "react-icons/tb";
import { LuUserSquare } from "react-icons/lu";
import { VscGistSecret } from "react-icons/vsc";

const ProfileEditPage = () => {
  const [loader, setLoader] = useState(false);
  const accessToken = useAppSelector((state) => state.authToken);
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const currentUser = getCustomerInfo?.data;

  const personalDataMapped = personalDataField?.map(item => {
    return {
      ...item,
      value: currentUser[item.key]
    }
  })

  const confidentialDataMapped = confidentialDataField?.map(item => {
    return {
      ...item,
      value: currentUser[item.key]
    }
  })

  const [personalData, setPersonalData] = useState(personalDataMapped);
  const [confidentialData, setConfidentialData] = useState(confidentialDataMapped);

  const valueWithoutNull = (data) => {
    return data?.map(item => item.value).filter(el => el);
  }
  const profileDataValue = valueWithoutNull(personalData)
  const profileDataValueMapped = valueWithoutNull(personalDataMapped)
  const confidentialDataValue = valueWithoutNull(confidentialData)
  const confidentialDataValueMapped = valueWithoutNull(confidentialDataMapped)

  const disabled = JSON.stringify(profileDataValue.sort()) === JSON.stringify(profileDataValueMapped.sort()) && JSON.stringify(confidentialDataValue.sort()) === JSON.stringify(confidentialDataValueMapped.sort())

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoader(true)
    const formData = new FormData(event.currentTarget)

    let payload = {};

    for (const [key, value] of Object.entries(currentUser)) {
      if (formData.get(key)) {
        payload = { ...payload, [key]: formData.get(key) }
      }
    }

    const response = await fetch(`${baseUrl}/edit/customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      toast('Changes succesfully updated!')
      setLoader(false)
    } else {
      toast("Something went wrong")
      setLoader(false)
    }
  }

  const onChange = (event, section) => {
    event.preventDefault()
    if (section === 'personal') {
      const updatedPersonalData = personalData?.map(item => {
        const updatedValue = item?.key === event.target.name ? event.target.value : item.value

        return {
          ...item,
          value: updatedValue
        }
      })
      setPersonalData(updatedPersonalData)
    } else {
      const updatedConfiData = confidentialData?.map(item => {
        const updatedValue = item?.key === event.target.name ? event.target.value : item.value

        return {
          ...item,
          value: updatedValue
        }
      })
      setConfidentialData(updatedConfiData)
    }
  }

  return (
    <div>

      <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#673AB7]">
        <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
          <span className="text-[#673AB7]">
            <TbUserEdit />
          </span>
          <span className="tracking-wide">Edit Profile</span>
        </div>

        <div className='ml-8 mb-7'>
          <div className={`${loader ? 'opacity-20 pointer-events-none	' : ''}`}>
            <form className="w-full" method="POST" onSubmit={(event) => handleSubmit(event)}>

              <div className='flex items-center space-x-2 mt-10 mb-4'>
                <span className="text-[#673AB7]">
                  <LuUserSquare />
                </span>
                <span className="tracking-wide">Personal Information</span>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                {
                  personalData?.map((field, index) => {
                    return (
                      <div className="relative z-0 w-full group" key={index}>
                        <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field.name}</label>
                        <input onChange={(e) => onChange(e, 'personal')} value={field.value || ''} placeholder={field.placeholder} type={field.type} name={field.key} id={field.key} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                      </div>
                    );
                  })
                }
              </div>
              <div className='flex items-center space-x-2 mt-10'>
                <span className="text-[#ef233c]">
                  <VscGistSecret />
                </span>
                <span className="tracking-wide">Confidential Information</span>
              </div>
              <div className='ml-7 mb-8 text-xs'>Your data will not shared with anyone. Even admin needs your approval to view below data</div>

              <div className="grid md:grid-cols-2 md:gap-6 mb-4">
                {
                  confidentialData?.map((field, index) => {
                    return (
                      (field?.name === 'Address' || field?.name === 'Permanent address') ? <div className="relative z-0 w-full group" key={index}>
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field.name}</label>
                        <textarea value={field.value || ''} onChange={(e) => onChange(e, 'confi')} placeholder={field.placeholder} id={field.key} name={field.key} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                      </div> :
                        <div className="relative z-0 w-full group" key={index}>
                          <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field.name}</label>
                          <input onChange={(e) => onChange(e, 'confi')} value={field.value || ''} placeholder={field.placeholder} type={field.type} name={field.key} id={field.key} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                        </div>
                    );
                  })
                }
              </div>
              <div className='flex justify-end'>
                <button disabled={disabled} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:pointer-events-none disabled:opacity-50">
                  Save
                </button>
              </div>

            </form>
            {loader ? <div role="status" className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'>
              <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
              <span className="sr-only">Loading...</span>
            </div> : <></>}
          </div>
        </div>
      </div >

    </div >
  )
}

export default isAuth(ProfileEditPage);