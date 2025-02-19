"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/src/app/store/hooks";
import { fetchCustomerSpecificDataAPI } from "@/src/app/store/reducers/customerInfo";
import CustomerInfoSkeleton from "@/src/app/common/skeletons/customerInfo";
import { profileTabs } from "@/global";
import Overview from "./overview";

const tabsData = [
  {
    name: profileTabs.Customers,
    isSelected: false,
    // icon: <GrTransaction />,
  },
  // {
  //   name: profileTabs.MutualFunds,
  //   isSelected: false,
  //   // icon: <RiListSettingsLine />,
  // },
];

export default function CustomerView({ params }) {
  const { customer } = params;
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.authToken);
  const currentCustomer = useAppSelector((state) => state.currentCustomer);
  const [selectedTab, setSelectedTab] = useState("");
  const [tabsList, setTabsList] = useState(tabsData);
  const currentUser = currentCustomer?.data;

  useEffect(() => {
    accessToken?.access_token?.length &&
      dispatch(
        fetchCustomerSpecificDataAPI(accessToken?.access_token, customer)
      );
  }, [accessToken]);

  const updateSelectedTab = (tab: string) => {
    const updatedTabList = tabsList?.map((item) => {
      return {
        ...item,
        isSelected: item?.name === tab ? true : false,
      };
    });
    setTabsList(updatedTabList);
  };

  const selectedComponent = useCallback(
    (cuserData) => {
      // router.push(`?=${selectedTab}`);
      switch (selectedTab) {
        case profileTabs.Customers:
          return <Overview params={cuserData} />;

        // case profileTabs.MutualFunds:
        //   return null;
        default:
          return <Overview params={cuserData} />;
      }
    },
    [selectedTab]
  );

  useEffect(() => {
    const selectedTabName = tabsList?.find(
      (item) => item?.isSelected === true
    )?.name;
    // const currentTab = tabFromUrl?.length ? tabFromUrl : selectedTabName;

    setSelectedTab(selectedTabName ? selectedTabName : profileTabs.Customers);
  }, [tabsList]);

  return (
    <div className="w-full md:w-12/12 h-64">
      {!currentCustomer?.loading ? (
        <>
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700 bg-white rounded-md">
            <div className="flex items-center justify-between rounded-t-lg font-semibold">
              <ul
                className="flex -mb-px text-sm font-medium text-center"
                role="tablist"
              >
                {tabsList?.map((tab) => {
                  return (
                    <li className="me-2" role="presentation">
                      <button
                        className={
                          selectedTab === tab?.name
                            ? "flex p-4 items-center text-[#008756] hover:text-[#008756] dark:text-[#008756] dark:hover:text-[#008756] border-[#008756] dark:border-[#008756] border-b-2"
                            : " p-4 inline-flex items-center justify-center rounded-t-lg"
                        }
                        type="button"
                        role="tab"
                        onClick={() => updateSelectedTab(tab?.name)}
                      >
                        {tab.name === "My Customers"
                          ? `${currentUser?.name}'s Overview`
                          : tab.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {selectedComponent(customer)}
        </>
      ) : (
        <CustomerInfoSkeleton />
      )}
    </div>
  );
}
