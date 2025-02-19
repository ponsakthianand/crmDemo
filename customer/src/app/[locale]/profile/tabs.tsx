import { useRouter, useSearchParams } from "next/navigation";
import { RxActivityLog } from "react-icons/rx";
import { GrTransaction } from "react-icons/gr";
import { RiListSettingsLine } from "react-icons/ri";
import { MdOutlineMedicalInformation } from "react-icons/md";
import { CustomerData } from "../../store/reducers/profile";
import ProfileInfo from "./info";
import { useCallback, useEffect, useState } from "react";
import Transactions from "./transactions";
import Activity from "./activity";
import Settings from "./settings";
import { profileTabs } from "@/global";
import MutualFunds from "./mutualfunds/mutualfunds";
import FinanceTracker from "./financeTracker";

interface UserData {
  currentUser: CustomerData;
}

const tabsData = [
  // {
  //   name: profileTabs.Activity,
  //   isSelected: false,
  //   icon: <RxActivityLog />,
  // },
  // {
  //   name: profileTabs.FinanceTracker,
  //   isSelected: false,
  //   icon: <RxActivityLog />,
  // },
  // {
  //   name: profileTabs.MutualFunds,
  //   isSelected: false,
  //   icon: <RiListSettingsLine />,
  // },
  {
    name: profileTabs.Transactions,
    isSelected: false,
    icon: <GrTransaction />,
  },
  {
    name: profileTabs.Information,
    isSelected: false,
    icon: <MdOutlineMedicalInformation />,
  },
  // {
  //   name: profileTabs.Settings,
  //   isSelected: false,
  //   icon: <RiListSettingsLine />,
  // }
];

export default function ProfileTabs(props: UserData) {
  const [selectedTab, setSelectedTab] = useState("");
  const [tabsList, setTabsList] = useState(tabsData);
  const params = useSearchParams();
  // const tabFromUrl = params.get('tab')
  const router = useRouter();

  const updateSelectedTab = (tab: string) => {
    const updatedTabList = tabsList?.map((item) => {
      return {
        ...item,
        isSelected: item?.name === tab ? true : false,
      };
    });
    setTabsList(updatedTabList);
  };

  useEffect(() => {
    const selectedTabName = tabsList?.find(
      (item) => item?.isSelected === true
    )?.name;
    // const currentTab = tabFromUrl?.length ? tabFromUrl : selectedTabName;

    setSelectedTab(
      selectedTabName ? selectedTabName : profileTabs.Transactions
    );
  }, [tabsList]);

  const selectedComponent = useCallback(
    (cuserData) => {
      // router.push(`?=${selectedTab}`);
      switch (selectedTab) {
        case profileTabs.Transactions:
          return <Transactions currentUser={cuserData} />;
        case profileTabs.Activity:
          return <Activity currentUser={cuserData} />;
        case profileTabs.Information:
          return <ProfileInfo currentUser={cuserData} />;
        case profileTabs.Settings:
          return <Settings currentUser={cuserData} />;
        case profileTabs.MutualFunds:
          return <MutualFunds currentUser={cuserData} />;
        case profileTabs.FinanceTracker:
          return <FinanceTracker currentUser={cuserData} />;
        default:
          return <Activity currentUser={cuserData} />;
      }
    },
    [selectedTab]
  );

  return (
    <>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 bg-white rounded-md">
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
                  <div className="h-4 me-2">{tab.icon}</div>
                  {tab.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div id="default-styled-tab-content">
        {selectedComponent(props?.currentUser)}
      </div>
    </>
  );
}
