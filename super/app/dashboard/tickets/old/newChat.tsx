'use client'
import { FormEvent, useState } from 'react'
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { RiLoader5Fill } from 'react-icons/ri';
import { baseUrl } from '@/global';
import { toast } from 'sonner';
import { fetchTicketsDataAPI } from '@/app/store/reducers/allTicketChat';

export default function NewChat({ buttonName }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loader, setLoader] = useState(false);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.authToken);

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoader(true)
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title')
    const description = formData.get('description')

    const response = await fetch(`${baseUrl}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`
      },
      body: JSON.stringify({ title, description }),
    })

    if (response.ok) {
      setTitle('')
      setDescription('')
      close();
      accessToken?.access_token?.length && dispatch(fetchTicketsDataAPI(accessToken?.access_token));
      toast('New chat created.')
      setLoader(false)
    } else {
      accessToken?.access_token?.length && dispatch(fetchTicketsDataAPI(accessToken?.access_token));
      toast("Something went wrong! Please try again")
      setLoader(false)
    }
  }

  return (
    <>
      <Button
        onClick={open}
        className="rounded-md  bg-blue-700 hover:bg-blue-800 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:[#008756] data-[focus]:outline-1 data-[focus]:outline-white"
      >
        {buttonName ? buttonName : 'New chat'}
      </Button>
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
                <form className="" action="#" method="POST" onSubmit={(event) => handleSubmit(event)}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left">
                        <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          New chat
                        </DialogTitle>
                        <div className="mt-2">
                          <div className='mt-5'>
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                              Title
                            </label>
                            <div className="mt-2">
                              <input
                                id="title"
                                name="title"
                                type="title"
                                autoComplete="title"
                                required
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div className='mt-5'>
                            <div className="flex items-center justify-between">
                              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                description
                              </label>
                            </div>
                            <div className="mt-2">
                              <textarea
                                id="description"
                                name="description"
                                cols={4}
                                autoComplete="current-description"
                                required
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                className="block w-full h-36 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 mt-0 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-blue-700 hover:bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                    >
                      Start
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
                </form>
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
