'use client';
import NotFound from "@/src/app/common/components/404";
import ProductSkeleton from "@/src/app/common/components/product-skeleton";
import { useEffect, useState } from "react";
import { ProductPage } from "@/src/app/common/library/productPage";

export default function CoursePage({ params }) {
  const { slug } = params;
  const [loader, setLoader] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    getCourse();
  }, [slug]);

  const getCourse = async () => {
    setLoader(true)

    await fetch(`/api/pages/courses/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    }).then(async (response) => {
      return response.json();
    })
      .then((data) => {
        setCourse(data);
        setLoader(false)
      }).catch((error) => {
        setCourse('null');
        setLoader(false)
      });
  }

  return (
    <main className='main-wrapper relative overflow-hidden'>
      <div className='lg:py-44 px-3 py-28 lg:px-20'>
        <div className="max-w-[85rem] mx-auto">
          {loader ? <ProductSkeleton />
            : course ?
              <ProductPage productData={course} />
              : <div className="md:items-center"><NotFound /> </div>
          }
        </div>
      </div>
    </main >
  )
}