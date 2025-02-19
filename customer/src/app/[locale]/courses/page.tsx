'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LoaderCircle, } from 'lucide-react';
import { CourseProduct } from '../../models/productInterfaces';
import { ProductsList } from '../../common/library/productsList';
import { ProductCardSkeleton } from '../../common/library/productSkeleton';

export default function CoursesList() {
  const initialized = useRef(false)
  const [noOrder, setNoCourses] = useState(false);
  const [loader, setLoader] = useState(true);
  const [courses, setCourses] = useState<CourseProduct[]>([]);

  const loadCourseFromResponse = useCallback(async () => {
    setLoader(true);
    setNoCourses(false);
    setCourses([]);
    try {
      const response = await fetch(`/api/pages/courses`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData) {
          setCourses(resData); // Set the order if response is valid
          setNoCourses(false); // Order found
        } else {
          setNoCourses(true); // No data returned
        }
      } else {
        setNoCourses(true); // Non-200 response
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setNoCourses(true); // Handle errors as "order not found"
    } finally {
      setLoader(false); // Stop the loader
    }
  }, []);


  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      loadCourseFromResponse()
    }
  }, [loadCourseFromResponse])

  return (
    <main className='main-wrapper relative overflow-hidden'>
      <div className='py-28 px-3 lg:px-20'>
        <section className="py-4 antialiased md:py-12">
          <div className="mb-5 sm:mb-10 text-center">
            <h2 className="text-2xl font-bold lg:text-3xl lg:leading-tight dark:text-white">Courses
              {/* <span className="text-blue-600 dark:text-blue-500">Preline UI</span> */}
            </h2>
            <p className="mt-3 text-gray-700 dark:text-neutral-400">Take control of your financial future with our comprehensive courses. Whether you're a beginner or looking to deepen your knowledge, our expertly designed programs offer practical insights and proven strategies to help you master personal finance. Learn at your own pace and unlock the secrets to lasting financial success!</p>
          </div>
          <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-0 lg:py-14 lg:pt-8 mx-auto">
            {loader ? <ProductCardSkeleton count={3} /> : courses?.length ? <ProductsList productsResponse={courses} route="courses" /> : <div className="text-center">
              <h2 className="text-4xl font-semibold text-gray-800 dark:text-neutral-200">No courses added yet</h2>
              <p className="text-gray-500 dark:text-neutral-500">We are preparing some awesome courses to offer please comeback soon and check.</p>
            </div>}
          </div>
        </section>
      </div>
    </main>
  );
}
