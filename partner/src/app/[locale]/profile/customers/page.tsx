'use client';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Link from "next/link";
import Avatar from "@/src/app/components/misc/avatar-initials";
import { fetchCustomersDataAPI } from "@/src/app/store/reducers/allCutomers";
import { ImUsers } from "react-icons/im";
import CustomerListSkeleton from "@/src/app/common/skeletons/customerList";

export default function Customers() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.authToken);
  const getCustomersData = useAppSelector((state) => state.allCustomersData);
  const getCustomers = getCustomersData?.data;


  useEffect(() => {
    accessToken?.access_token?.length &&
      dispatch(fetchCustomersDataAPI(accessToken?.access_token));
  }, [accessToken]);

  return (
    <>
      <div id="default-styled-tab-content">
        <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756]">
          <div className="relative">
            <div className="w-full md:w-12/12 min-h-[550px]">
              <div className="grid gap-0 lg:grid-cols-3 lg:gap-3">
                {!getCustomersData?.loading && getCustomers?.length ? (
                  getCustomers?.map((customer, index) => {
                    return (
                      <div key={index} className="w-full">
                        <Link
                          className="hs-tooltip-toggle w-full lg:max-w-xs p-3 flex items-center gap-x-3 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700"
                          href={`#`}
                        >
                          <div className="relative w-10 h-10 overflow-hidden">
                            <Avatar name={customer?.name} userId={customer?._id} />
                          </div>
                          <div className="grow">
                            <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                              {customer.name}
                            </h4>
                            <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-neutral-500">
                              {customer.email}
                            </p>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                ) : getCustomersData?.loading ? (
                  ""
                ) : (
                  <div>You don't have a customer yet</div>
                )}
              </div>
              {getCustomersData?.loading ? <CustomerListSkeleton /> : <></>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
