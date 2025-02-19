"use client";

import AddLeadFrom from "@/src/app/[locale]/contact/ContactLeads/new-leads";
import NotFound from "@/src/app/common/components/404";
import { useEffect, useState } from "react";
import { getCategoryDetails } from "./servicesContent";

export default function ServiceRequestForm({ params }) {
  const { serviceId } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const details = getCategoryDetails(serviceId);
    setCategoryData(details);
    setIsLoading(false);
  }, [serviceId]);

  if (isLoading) {
    return <div className="px-5 py-20 lg:px-32 lg:py-24 text-center text-2xl">
      <div className="py-12">
        <div className="overflow-hidden">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative mx-auto max-w-4xl grid space-y-5 sm:space-y-10">
              <div className="text-center">
                <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-48 mx-auto">
                  <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase mb-3 dark:text-neutral-200">
                  </p>
                </div>
                <h1 className="text-2xl text-gray-800 font-bold sm:text-3xl lg:text-4xl lg:leading-tight dark:text-neutral-200">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-72 mx-auto"></div>
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-64 mx-auto mt-2"></div>
                </h1>
              </div>

              <div className="sm:flex sm:justify-center sm:items-center text-center sm:text-start">
                <div className="shrink-0 pb-5 sm:flex sm:pb-0 sm:pe-5">
                  <div className="-space-x-3 rounded-xl border shadow-sm p-5 lg:min-w-[800px] bg-white dark:bg-neutral-800">
                    <div className="text-center">
                      <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-6 w-60 mx-auto"></div>
                      </h1>
                      <div className="mt-2 text-xs text-gray-600 dark:text-neutral-400 mb-5">
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-80 mx-auto"></div>
                        <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-72 mx-auto mt-2"></div>
                      </div>
                    </div>
                    <div className="h-32 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-lg"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>; // Show a loading message or spinner
  }

  if (!categoryData) {
    return (
      <div className="px-5 py-20 lg:px-32 lg:py-24 text-center text-2xl">
        <div className="py-12">
          <NotFound />
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-5 py-20 lg:px-32 lg:py-24 text-center text-2xl">
      <div className="py-12">
        {categoryData.category !== "nope" ? (
          <div className="overflow-hidden">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-6xl grid space-y-5 sm:space-y-10">
                {categoryData.content}
                <div className="sm:flex sm:justify-center sm:items-center text-center sm:text-start">
                  <div className="shrink-0 pb-5 sm:flex sm:pb-0 sm:pe-5">
                    <div className="-space-x-3 rounded-xl border shadow-sm p-5 lg:min-w-[800px] bg-white dark:bg-neutral-800">
                      <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                          Fill the form below!
                        </h1>
                        <p className="mt-2 text-xs text-gray-600 dark:text-neutral-400 mb-5">
                          Let us know your requirements, and we'll get back to you with the best solutions.
                        </p>
                      </div>
                      <AddLeadFrom category={categoryData.category} column={2} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    </div>
  );
}
