'use client'
import { FormEvent, useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from '@/src/app/store/hooks';
import { RiLoader5Fill } from 'react-icons/ri';
import { baseUrl } from '@/global';
import { toast } from 'sonner';
import { restrictedKeywords } from '@/src/bad_keywords';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { fetchProfileDataAPI } from '../../store/reducers/profile';
import { useDebounce } from "use-debounce";

export default function UsernameUpdater({ buttonName, usernameValue, email }) {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [loader, setLoader] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameFinal] = useDebounce(username, 500);
  const [usernameValid, setUsernameValid] = useState(null);
  const [usernameMessage, setUsernameMessage] = useState('');
  const [usernameloader, setUsernameLoader] = useState(false);
  const accessToken = useAppSelector((state) => state.authToken);
  const disableButton = !username?.length || !usernameValid;

  function open() {
    setUsernameValid(null)
    setUsernameMessage('')
    setUsername('')
    setIsOpen(true)
  }

  function close() {
    setUsernameValid(null)
    setUsernameMessage('')
    setUsername('')
    setIsOpen(false)
  }

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
      setUsernameValid(null)
      setUsernameMessage('Please enter minimum 3 characters')
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

  const handleUpdateSubmit = async () => {
    setLoader(true)

    let payload = { partner_user_id: username, email: email };

    const response = await fetch(`${baseUrl}/edit/partner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      toast.success('Username succesfully updated!')
      accessToken?.access_token?.length && dispatch(fetchProfileDataAPI(accessToken?.access_token));
      setLoader(false)
      setIsOpen(false)
    } else {
      toast.error("Something went wrong")
      setLoader(false)
    }
  }

  return (
    <>
      <span
        onClick={open}
        className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500 cursor-pointer ml-2"
      >
        {buttonName ? buttonName : 'New chat'}
      </span>
      <Dialog open={isOpen} onClose={() => { }} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className={`sm:mx-auto sm:w-full items-center ${loader ? 'opacity-20 pointer-events-none	' : ''}`}>
                {/* <form className="" action="#" method="POST" onSubmit={(event) => handleUpdateSubmit(event)}> */}
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Update username
                      </DialogTitle>
                      <div className="mt-2">
                        <div className='mt-5'>
                          <span className='text-gray-500 text-xs block'>Your current username</span>
                          {usernameValue}
                        </div>
                        <div className='mt-5'>
                          <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                            Username <span className='text-gray-500 text-xs'>(This will be used as your reference)</span>
                          </label>
                          <div>
                            <div className="mt-1">
                              <div className='flex items-center justify-center'>
                                <input
                                  id="username"
                                  name="username"
                                  type="text"
                                  placeholder='Enter new username'
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
                              {username?.length && usernameMessage?.length ? <span className='text-gray-500 text-xs'>{usernameMessage}</span> : <></>}
                              {
                                (usernameValid !== null && usernameValid === true) ? <span className='text-xs text-green-600'>Good to go</span> : usernameValid === null ? '' : <span className='text-rose-600 text-xs'>Username already exists!</span>
                              }
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 mt-0 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button type="submit"
                    onClick={() => handleUpdateSubmit()}
                    className="inline-flex w-full justify-center rounded-md bg-blue-700 hover:bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto disabled:bg-slate-300" disabled={disableButton}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    onClick={close}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
                {/* </form> */}
              </div>
              {loader ? <div role="status" className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'>
                <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
                <span className="sr-only">Loading...</span>
              </div> : <></>}
            </DialogPanel>
          </div>
        </div >
      </Dialog >
    </>
  )
}
