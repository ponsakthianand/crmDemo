"use client"
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { dateToLocalDateYear, dateToLocalTimeDateYear } from '@/global';
import { LoaderCircle } from 'lucide-react';
import { OrderConfirmation } from '@/src/app/models/productInterfaces';

export default function Order({ params }) {
  const { orderId } = params;
  const initialized = useRef(false)
  const [noOrder, setNoOrder] = useState(false);
  const [loader, setLoader] = useState(false);
  const [order, setOrder] = useState<OrderConfirmation>(null);

  const loadOrder = useCallback(async () => {
    setLoader(true);
    setNoOrder(false); // Reset `noOrder` before making the API call
    setOrder(null); // Clear previous order if any
    if (!orderId) {
      setLoader(false);
      setNoOrder(true); // If there's no `orderId`, set `noOrder` to true
      return;
    }
    try {
      const response = await fetch(`/api/order/${orderId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData) {
          setOrder(resData); // Set the order if response is valid
          setNoOrder(false); // Order found
        } else {
          setNoOrder(true); // No data returned
        }
      } else {
        setNoOrder(true); // Non-200 response
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setNoOrder(true); // Handle errors as "order not found"
    } finally {
      setLoader(false); // Stop the loader
    }
  }, [orderId]);



  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      loadOrder()
    }
  }, [loadOrder])

  const orderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex uppercase items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-500 text-yellow-50 dark:bg-yellow-800/30 dark:text-yellow-500">{order?.status}</span>
      case 'paid':
        return <span className="inline-flex uppercase items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-500 text-green-50 dark:bg-green-800/30 dark:text-green-500">{order?.status}</span>
      case 'failed':
        return <span className="inline-flex uppercase items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-500 text-red-50 dark:bg-red-800/30 dark:text-red-500">{order?.status}</span>
      default:
        return <></>
    }
  }

  if (loader) return (
    <div className='py-28 px-3 lg:px-20'>
      <div className="container h-screen flex justify-center items-center">
        <LoaderCircle className=" animate-spin h-20 w-20 text-primary" />
      </div>
    </div>
  )
  if (noOrder) return (
    <div className='py-28 px-3 lg:px-20'>
      <div className="container h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-neutral-200">Order not found</h2>
          <p className="text-gray-500 dark:text-neutral-500">The order you are looking for does not exist.</p>
        </div>
      </div>
    </div>
  )
  if (!order) {
    return (
      <div className="container h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-neutral-200">
            Checking for Order
          </h2>
          <p className="text-gray-500 dark:text-neutral-500">Please wait</p>
        </div>
      </div>
    );
  }
  return (
    <main className='main-wrapper relative overflow-hidden'>
      <div className='py-28 px-3 lg:px-20'>
        <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10 text-base">
          <div className="sm:w-11/12 lg:w-3/4 mx-auto">
            {(order?.status === 'paid') ?
              <div className="bg-primary-100 text-primary-800 p-4 rounded-lg shadow-md text-center mb-4 border border-primary-600">
                <h2 className="text-lg font-bold">Thank You!</h2>
                <p className="mt-2">
                  Your transaction was successful. We appreciate your trust in us and look forward to serving you again!
                </p>
                <p className="mt-2 text-sm text-gray-600">If you have any questions, feel free to contact us at info@rxtn.in.</p>
              </div> : <></>}

            {(order?.status === 'failed') ? <div className="bg-red-100 text-red-500 p-4 rounded-lg shadow-md text-center mb-4 border border-red-600">
              <h2 className="text-lg font-bold">Sorry!</h2>
              <p className="mt-2">
                We sincerely apologize, but your order was not successful. If any amount has been deducted from your account, it will be refunded automatically within 3–4 working days (subject to banking holidays). If you need any further assistance, please don’t hesitate to contact us. We’re here to help!
              </p>
              <p className="mt-2 text-sm text-gray-600">Feel free to contact us at info@rxtn.in or +91 99623 40067.</p>
            </div> : <></>}

            {(order?.status === 'pending') ? <div className="bg-yellow-100 text-yellow-900 p-4 rounded-lg shadow-md text-center mb-4 border border-yellow-600">
              <h2 className="text-lg font-bold">Sorry!</h2>
              <p className="mt-2">We sincerely apologize, but your order is currently pending and may have been missed. Sorry for the inconvenience. You can try placing the order again or contact our team for assistance in reinitiating it. We’re here to help!</p>
              <p className="mt-2 text-sm text-gray-600">Feel free to contact us at info@rxtn.in or +91 99623 40067.</p>
            </div> : <></>}

            <div className="flex flex-col p-4 sm:p-10 bg-gray-50 border shadow-md rounded-xl dark:bg-neutral-800">

              <div className="flex justify-between">
                <div>
                  <Image src="https://e5osher1gwoyuako.public.blob.vercel-storage.com/branding/logo-txwRHvZEfWhT2Q6T7G2o0a3sj4zTpy.png" alt="logo" width={100} height={100} />
                </div>
                <div className="text-end">
                  <div className='flex items-center justify-end gap-2'>
                    {orderStatus(order?.status)}
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-neutral-200">Invoice #</h2>
                  </div>
                  <span className="mt-1 block uppercase text-gray-500 dark:text-neutral-500">{order?.orderId}</span>
                </div>
              </div>
              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Bill to:</h3>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">{order?.userInfo ? order?.userInfo?.name : 'Guest'}</h3>
                </div>

                <div className="sm:text-end space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                    <dl className="grid sm:grid-cols-5 gap-x-3">
                      <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Invoice date:</dt>
                      <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{dateToLocalTimeDateYear(order?.createdAt)}</dd>
                    </dl>
                    <dl className="grid sm:grid-cols-5 gap-x-3">
                      <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Due date:</dt>
                      <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{dateToLocalDateYear(order?.createdAt)}</dd>
                    </dl>
                  </div>

                </div>
              </div>

              <div className="mt-6">
                <div className="border border-gray-200 p-4 rounded-lg space-y-4 dark:border-neutral-700">
                  <div className="hidden sm:grid sm:grid-cols-5">
                    <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Item</div>
                    <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Qty</div>
                    <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Rate</div>
                    <div className="text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Amount</div>
                  </div>

                  <div className="hidden sm:block border-b border-gray-200 dark:border-neutral-700"></div>
                  {
                    order?.cart.map((item, index) => (
                      <>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2" key={index}>
                          <div className="col-span-full sm:col-span-2">
                            <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Item</h5>
                            <p className="font-medium text-gray-800 dark:text-neutral-200">{item?.title}</p>
                          </div>
                          <div>
                            <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Qty</h5>
                            <p className="text-gray-800 dark:text-neutral-200">{item?.count}</p>
                          </div>
                          <div>
                            <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Rate</h5>
                            <p className="text-gray-800 dark:text-neutral-200">{item?.salePrice}</p>
                          </div>
                          <div>
                            <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Amount</h5>
                            <p className="sm:text-end text-gray-800 dark:text-neutral-200">{item?.salePrice}</p>
                          </div>
                        </div>

                        <div className="sm:hidden border-b border-gray-200 dark:border-neutral-700"></div>
                      </>
                    ))
                  }

                </div>
              </div>

              <div className="mt-8 flex sm:justify-end">
                <div className="w-full max-w-2xl sm:text-end space-y-2">

                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                    <dl className="grid sm:grid-cols-5 gap-x-3">
                      <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Total:</dt>
                      <dd className="col-span-2 text-gray-500 dark:text-neutral-500">₹{order?.amount / 100}</dd>
                    </dl>
                    {order?.status === 'paid' && (
                      <dl className="grid sm:grid-cols-5 gap-x-3">
                        <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Amount paid:</dt>
                        <dd className="col-span-2 text-gray-500 dark:text-neutral-500">₹{order?.amount / 100}</dd>
                      </dl>)}
                    {(order?.status === 'pending' || order?.status === 'failed') && (
                      <dl className="grid sm:grid-cols-5 gap-x-3">
                        <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Due balance:</dt>
                        <dd className="col-span-2 text-gray-500 dark:text-neutral-500">₹{order?.amount / 100}</dd>
                      </dl>)}
                  </div>
                </div>
              </div>


              <div className="mt-8 sm:mt-12">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Thank you!</h4>
                <p className="text-gray-500 dark:text-neutral-500">If you have any inquiries regarding this invoice, please use the contact information provided below.</p>
                <div className="mt-2">
                  <p className="block text-sm font-medium text-gray-800 dark:text-neutral-200">info@rxtn.in</p>
                  <p className="block text-sm font-medium text-gray-800 dark:text-neutral-200">+91 99623 40067</p>
                </div>
              </div>

              <p className="mt-5 text-sm text-gray-500 dark:text-neutral-500">© 2025 FinTech</p>
            </div>
            {/* 
            <div className="mt-6 flex justify-end gap-x-3">
              <a className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                href="#">
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Invoice PDF
              </a>
              <a className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                href="#">
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect width="12" height="8" x="6" y="14" />
                </svg>
                Print
              </a>
            </div> */}

          </div>
        </div>
      </div>
    </main>
  );
}
