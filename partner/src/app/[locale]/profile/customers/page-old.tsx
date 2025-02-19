"use client";
import { useAppSelector } from "../../../store/hooks";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { defaultTabs } from "@/global";
import { GrTransaction } from "react-icons/gr";
import { RiListSettingsLine } from "react-icons/ri";
import Overview from "../referral/page";
import Customers from "./page";

const tabsData = [
  {
    name: defaultTabs.Overview,
    isSelected: false,
    icon: <GrTransaction />,
  },
  {
    name: defaultTabs.Customers,
    isSelected: false,
    icon: <RiListSettingsLine />,
  },
];


export default function MyCustomers() {
  const currentUserData = useAppSelector((state) => state.profileData);
  const [selectedTab, setSelectedTab] = useState("");
  const [tabsList, setTabsList] = useState(tabsData);

  const updateSelectedTab = (tab: string) => {
    const updatedTabList = tabsList?.map((item) => {
      return {
        ...item,
        isSelected: item?.name === tab ? true : false,
      };
    });
    setTabsList(updatedTabList);
  };

  const selectedTabElement = useCallback(() => {
    // router.push(`?=${selectedTab}`);
    switch (selectedTab) {
      case defaultTabs.Customers:
        return <Customers />;

      // case profileTabs.MutualFunds:
      //   return null;
      default:
        return <Overview />;
    }
  }, [selectedTab]);

  useEffect(() => {
    const selectedTabName = tabsList?.find(
      (item) => item?.isSelected === true
    )?.name;
    // const currentTab = tabFromUrl?.length ? tabFromUrl : selectedTabName;

    setSelectedTab(selectedTabName ? selectedTabName : defaultTabs.Customers);
  }, [tabsList]);

  return (
    <div className="w-full md:w-12/12 h-64">
      {!currentUserData?.loading ? (
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
                        Overview
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div id="default-styled-tab-content">
            {selectedTabElement()}
          </div>
        </>
      ) : (
        // <CustomerInfoSkeleton />
        null
      )}
    </div>
  );
}
