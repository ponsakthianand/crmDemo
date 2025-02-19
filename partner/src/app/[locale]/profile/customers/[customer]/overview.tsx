import { useState } from "react";
import { PiUserLight } from "react-icons/pi";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useAppSelector } from "@/src/app/store/hooks";
import { LuSmartphone } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";
import Avatar from "@/src/app/components/misc/avatar-initials";

export default function Overview({ params }) {
  const currentCustomer = useAppSelector((state) => state.currentCustomer);
  const currentUser = currentCustomer?.data;
  const { customer } = params;

  return (
    <div
      className="w-full bg-white border border-gray-100 text-start rounded-xl shadow-md after:absolute after:top-0 after:-start-4 after:w-4 after:h-full dark:bg-neutral-800 dark:border-neutral-700"
      role="tooltip"
    >
      <div className="p-3 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex gap-x-3">
          <Avatar name={currentUser?.name} userId={currentUser?._id} className="!w-[100px] !h-[100px] text-4xl" />
          <div className="grow">
            <div>
              <div className="flex">
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {currentUser?.name}
                </h4>
                <span className="py-1 px-2 ml-3 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                  <IoCheckmarkCircleOutline />
                  Good
                </span>
              </div>
            </div>
            {currentUser?.gender || currentUser?.current_city ? <p className="text-sm text-gray-500 dark:text-neutral-500">
              {currentUser?.gender && currentUser?.gender + ','}
              {currentUser?.current_city && currentUser?.current_city}
            </p> : null}

            <div className="flex items-center gap-x-2 mt-2 text-sm text-gray-800 dark:text-neutral-200">
              <LuSmartphone /> {currentUser?.phone}
            </div>
            <div className="flex items-center gap-x-2 mt-2 text-sm text-gray-800 dark:text-neutral-200">
              <HiOutlineMail /> {currentUser?.email}
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>

      <div className="py-2 px-4 bg-gray-50 dark:bg-neutral-800 rounded-b-xl">
        <h3 className="mb-5 font-bold">Activity</h3>
        <div>
          <div className="ps-2 my-2 first:mt-0">
            <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
              1 Aug, 2023
            </h3>
          </div>

          <div className="flex gap-x-3">
            <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
              <div className="relative z-10 size-7 flex justify-center items-center">
                <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
              </div>
            </div>

            <div className="grow pt-0.5 pb-2">
              <p className="mt-1 text-sm">Purchased New ticket</p>
              <p className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500">
                2 days ago
              </p>
            </div>
          </div>

          <div className="flex gap-x-3">
            <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
              <div className="relative z-10 size-7 flex justify-center items-center">
                <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
              </div>
            </div>

            <div className="grow pt-0.5 pb-2">
              <p className="mt-1 text-sm">Changed password</p>
              <p className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500">
                2 days ago
              </p>
            </div>
          </div>

          <div className="flex gap-x-3">
            <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
              <div className="relative z-10 size-7 flex justify-center items-center">
                <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
              </div>
            </div>

            <div className="grow pt-0.5 pb-2">
              <p className="mt-1 text-sm">Changed password</p>
              <p className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500">
                2 days ago
              </p>
            </div>
          </div>

          <div className="ps-2 my-2 first:mt-0">
            <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
              31 Jul, 2023
            </h3>
          </div>

          <div className="flex gap-x-3">
            <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
              <div className="relative z-10 size-7 flex justify-center items-center">
                <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
              </div>
            </div>

            <div className="grow pt-0.5 pb-2">
              <p className="mt-1 text-sm">Changed password</p>
              <p className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500">
                2 days ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
