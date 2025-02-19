'use client';
import NotFound from "@/src/app/common/components/404";
import ProductSkeleton from "@/src/app/common/components/product-skeleton";
import { useEffect, useState } from "react";
import { ProductPage } from "@/src/app/common/library/productPage";

export function EventPage({ params }) {
  const { slug } = params;
  const [loader, setLoader] = useState(true);
  const [event, setEvent] = useState(null);
  useEffect(() => {
    getEvent();
  }, [slug]);

  const getEvent = async () => {
    setLoader(true)

    await fetch(`/api/pages/events/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    }).then(async (response) => {
      return response.json();
    })
      .then((data) => {
        setEvent(data);
        setLoader(false)
      }).catch((error) => {
        setEvent('null');
        setLoader(false)
      });
  }

  return (
    <main className='main-wrapper relative overflow-hidden'>
      <div className='lg:py-44 px-3 py-28 lg:px-20'>
        <div className="max-w-[85rem] mx-auto">
          {loader ? <ProductSkeleton />
            : event ?
              <ProductPage productData={event} />
              : <div className="md:items-center"><NotFound /> </div>
          }
        </div>
      </div>
    </main >
  )
}