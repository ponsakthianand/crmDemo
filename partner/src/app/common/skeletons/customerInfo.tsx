import { HiOutlineMail } from "react-icons/hi";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { LuSmartphone } from "react-icons/lu";
import { PiUserLight } from "react-icons/pi";

const CustomerInfoSkeleton = () => {
  return (
    <div role="status" className="space-y-2.5 animate-pulse">
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 bg-white rounded-md">
        <ul className="flex -mb-px text-sm font-medium text-center" role="tablist">
          <li className="flex p-4 items-center text-[#008756] hover:text-[#008756] dark:text-[#008756] dark:hover:text-[#008756] border-[#008756] dark:border-[#008756] border-b-2" role="presentation">
            ----
          </li>
        </ul>
      </div>

      <div className="w-full bg-white border border-gray-100 text-start rounded-xl shadow-md after:absolute after:top-0 after:-start-4 after:w-4 after:h-full dark:bg-neutral-800 dark:border-neutral-700" role="tooltip">
        <div className="p-3 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex gap-x-3">
            <div className="shrink-0 flex justify-center items-center size-28 rounded-3xl bg-gray-300 ring-2 ring-white dark:ring-neutral-900">
            </div>
            <div className="grow">
              <div>
                <div className="flex">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    ----
                  </h4>
                  <span className="py-1 px-2 ml-3 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500 h-6 w-16">
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                ----
              </p>
              <div className="flex items-center gap-x-2 mt-2 text-sm text-gray-800 dark:text-neutral-200">
                <LuSmartphone /> ---
              </div>
              <div className="flex items-center gap-x-2 mt-2 text-sm text-gray-800 dark:text-neutral-200">
                <HiOutlineMail /> ---
              </div>
            </div>
            <div>
              <button type="button" className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">

              </button>
            </div>
          </div>
        </div>

        <div className="py-2 px-4 bg-gray-50 dark:bg-neutral-800 rounded-b-xl">
          <h3 className="mb-5 font-bold">---</h3>
          <div>
            <div className="ps-2 my-2 first:mt-0">
              <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                ----
              </h3>
            </div>

            <div className="flex gap-x-3">
              <div
                className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
                <div className="relative z-10 size-7 flex justify-center items-center">
                  <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
                </div>
              </div>

              <div className="grow pt-0.5 pb-2">
                <p className="mt-1 text-sm">
                  ----
                </p>
                <p className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500">--------</p>
              </div>
            </div>

            <div className="flex gap-x-3">
              <div
                className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
                <div className="relative z-10 size-7 flex justify-center items-center">
                  <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
                </div>
              </div>

              <div className="grow pt-0.5 pb-2">
                <p className="mt-1 text-sm">
                  ------
                </p>
                <p className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500">--------</p>
              </div>
            </div>

            <div className="flex gap-x-3">
              <div
                className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
                <div className="relative z-10 size-7 flex justify-center items-center">
                  <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
                </div>
              </div>

              <div className="grow pt-0.5 pb-2">
                <p className="mt-1 text-sm">
                  -----
                </p>
                <p className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500">--------</p>
              </div>
            </div>

            <div className="ps-2 my-2 first:mt-0">
              <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                -------
              </h3>
            </div>

            <div className="flex gap-x-3">
              <div
                className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
                <div className="relative z-10 size-7 flex justify-center items-center">
                  <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
                </div>
              </div>

              <div className="grow pt-0.5 pb-2">
                <p className="mt-1 text-sm">
                  ------
                </p>
                <p className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500">--------</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CustomerInfoSkeleton;