'use client'
import { baseUrl, confidentialDataField, personalDataField } from '@/global';
import isAuth from '@/src/app/protect/withAuth';
import { FormEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/app/store/hooks';
import { RiLoader5Fill } from 'react-icons/ri';
import { toast } from 'sonner';
import { TbUserEdit } from "react-icons/tb";
import { LuUserSquare } from "react-icons/lu";
import { VscGistSecret } from "react-icons/vsc";
import {
  Button, Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { fetchFianacialTrackersDataAPI } from '../../store/reducers/financialTrackers';

const ftFields = [
  { name: 'Take Home', key: "monthly_income", value: '', type: 'text', placeholder: 'In Rupees', required: true },
  { name: 'Rent/EMI', key: "house_emi_or_rent", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Car EMI/Other EMI', key: "emi", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Provisions', key: "provisions_expenses", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Car Expenses/Transportation', key: "carbike_expenses", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Entertainment/OTT/Outing', key: "entertainment_ott_outing", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Telephone & Wifi', key: "telephone_wifi", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'EB & Water', key: "eb_water", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Other Investments / LIC Insurance & Post Office', key: "other_investments", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Any Other Monthly Expenses/Investments', key: "any_other_monthly_expenses", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'LIC Insurance & Post Office', key: "lic_insurance_post_office", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Term & Health Insurance', key: "term_health_insurance", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Bike/Car Insurance', key: "bike_car_insurance", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'School Fee', key: "school_fee", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Entertainment/OTT', key: "entertainment_ott", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Water', key: "water", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Tours and Travels', key: "tours_travels", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Medical', key: "medical_expenses", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Emergency', key: "unexpected_emergency", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Other Annual Expenses / Gym / Swimming', key: "other_annual_expenses", value: '', type: 'text', placeholder: 'In Rupees', required: false },
  { name: 'Any Other Annual Expenses/Investments ', key: "any_other_annual_expenses", value: '', type: 'text', placeholder: 'In Rupees', required: false },
]

const FinanceTracker = () => {
  const dispatch = useAppDispatch()
  const [loader, setLoader] = useState(false);
  const accessToken = useAppSelector((state) => state.authToken);
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const getFinancialTrackersList = useAppSelector((state) => state.financialTrackers);
  const currentUser = getCustomerInfo?.data;
  const [isOpen, setIsOpen] = useState(false);
  const [ftData, setFTData] = useState(ftFields);

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchFianacialTrackersDataAPI(accessToken?.access_token));
  }, [accessToken])


  function open() {
    setIsOpen(true);
  }

  const valueWithoutNull = (data) => {
    return data?.map(item => item.value).filter(el => el);
  }

  const disabled = JSON.stringify(valueWithoutNull(ftFields.sort())) === JSON.stringify(valueWithoutNull(ftData.sort()))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoader(true)
    const formData = new FormData(event.currentTarget)

    let payload = {};

    for (const [index, value] of Object.entries(ftData)) {
      if (formData.get(ftData[index].key)) {
        payload = { ...payload, [ftData[index].key]: formData.get(ftData[index].key) }
      }
    }

    const response = await fetch(`/api/ft`, {
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
      setIsOpen(false)
      setFTData(ftFields)
    } else {
      toast("Something went wrong")
      setLoader(false)
    }
  }

  const onChange = (event) => {
    event.preventDefault()

    const updatedPersonalData = ftData?.map(item => {
      const updatedValue = item?.key === event.target.name ? event.target.value : item.value

      return {
        ...item,
        value: updatedValue
      }
    })
    setFTData(updatedPersonalData)
  }

  return (
    <div>

      <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756]">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
            <span className="text-[#008756]">
              <TbUserEdit />
            </span>
            <span className="tracking-wide">Finance Tracker</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
              onClick={open}
              className="rounded-md  bg-blue-700 hover:bg-blue-800 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:[#008756] data-[focus]:outline-1 data-[focus]:outline-white"
            >
              Add expenses
            </Button>
          </div>
        </div>

        <div className='w-full'>
          <div className="flex flex-wrap items-center gap-y-4 py-3">
            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Date</dt>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Date</dt>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Price</dt>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Status</dt>
            </dl>
            <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Action</dt>
            </div>
          </div>
          {
            getFinancialTrackersList?.data?.length ? getFinancialTrackersList?.data?.map(ft => {
              return (
                <div className="flex flex-wrap items-center gap-y-4 py-2">
                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dd className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">08.12.2023</dd>
                  </dl>

                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dd className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">08.12.2023</dd>
                  </dl>

                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dd className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">$85</dd>
                  </dl>

                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                      <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                      </svg>
                      Good
                    </dd>
                  </dl>

                  <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                    <button type="button" className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto">View details</button>
                  </div>
                </div>
              )
            }) :
              <div>Please submit current expenses</div>
          }
        </div>

        <Dialog open={isOpen} onClose={() => { }} className="relative z-10">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-[80%] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
              >
                <div className={`sm:mx-auto sm:w-full items-center p-6`}>
                  <DialogTitle
                    as="h2"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Finance Tracker
                  </DialogTitle>
                  <div className='mt-4'>
                    <div className={`${loader ? 'opacity-20 pointer-events-none	' : ''}`}>
                      <form className="w-full" method="POST" onSubmit={(event) => handleSubmit(event)}>
                        <div className="grid md:grid-cols-4 md:gap-6">
                          {
                            ftData?.map((field, index) => {
                              return (
                                <div className="relative z-0 w-full group" key={index}>
                                  <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{field.name}</label>
                                  <input onChange={(e) => onChange(e)} value={field.value || ''} placeholder={field.placeholder} type={field.type} name={field.key} id={field.key} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                                </div>
                              );
                            })
                          }
                        </div>
                        <div className='flex justify-end'>
                          <button type='reset' onClick={() => setIsOpen(false)} className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm mr-2 px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            Cancel
                          </button>
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
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div >

    </div >
  )
}

export default isAuth(FinanceTracker);
