'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { EventProduct } from '../../models/productInterfaces';
import { ProductsList } from '../../common/library/productsList';
import { ProductCardSkeleton } from '../../common/library/productSkeleton';

export default function ProductList() {
  const initialized = useRef(false)
  const [noEvents, setNoEvents] = useState(false);
  const [loader, setLoader] = useState(true);
  const [events, setEvents] = useState<EventProduct[]>([]);

  const loadOrder = useCallback(async () => {
    setLoader(true);
    setNoEvents(false);
    setEvents([]);
    try {
      const response = await fetch(`/api/pages/events`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData) {
          setEvents(resData); // Set the order if response is valid
          setNoEvents(false); // Order found
        } else {
          setNoEvents(true); // No data returned
        }
      } else {
        setNoEvents(true); // Non-200 response
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setNoEvents(true); // Handle errors as "order not found"
    } finally {
      setLoader(false); // Stop the loader
    }
  }, []);


  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      loadOrder()
    }
  }, [loadOrder])

  return (
    <main className='main-wrapper relative overflow-hidden'>
      <div className='py-28 px-3 lg:px-20'>
        <section className="py-4 antialiased md:py-12">
          <div className="mb-5 sm:mb-10 text-center">
            <h2 className="text-2xl font-bold lg:text-3xl lg:leading-tight dark:text-white">Consultation Services</h2>
            <p className="mt-3 text-gray-700 dark:text-neutral-400">Unlock your financial potential with our tailored consultation sessions. Designed to fit your unique needs, these sessions provide expert guidance and practical strategies to help you achieve financial freedom and long-term success. Start your journey to smarter finances today!</p>
          </div>
          <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-0 lg:py-14 lg:pt-8 mx-auto">
            {loader ? <ProductCardSkeleton count={3} /> : events?.length ? <ProductsList productsResponse={events} route="sessions" /> : <div className="text-center">
              <h2 className="text-4xl font-semibold text-gray-800 dark:text-neutral-200">No services added yet</h2>
              <p className="text-gray-500 dark:text-neutral-500">We are preparing some awesome services to offer please comeback soon and check.</p>
            </div>}
          </div>
        </section>
      </div>
    </main>
  );
}
