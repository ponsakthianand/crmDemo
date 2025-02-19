'use client';
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { dateToLocalDateYear, defaultTabs, parseJwt } from "@/global";
import isAuth from '@/src/app/protect/withAuth';
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { login } from "../../store/reducers/auth";
import { fetchProfileDataAPI } from "../../store/reducers/profile";
import LoaderSpinner from "../../common/elements/loader";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area";
import LastSeen from "../../common/elements/lastSeen";
import { fetchActivityDataAPI } from "../../store/reducers/allActivity";
import { CalendarDateRangePicker } from "../../components/misc/date-range-picker";
import { GrTransaction } from "react-icons/gr";
import { ShoppingCart } from "lucide-react";
import { RiListSettingsLine } from "react-icons/ri";

const tabsData = [
  {
    name: defaultTabs.Overview,
    icon: <GrTransaction />,
    route: "/profile/overview",
  },
  {
    name: defaultTabs.Customers,
    icon: <RiListSettingsLine />,
    route: "/profile/customers",
  },
  {
    name: defaultTabs.Leads,
    icon: <RiListSettingsLine />,
    route: "/profile/leads",
  },
  {
    name: defaultTabs.Orders,
    icon: <ShoppingCart />,
    route: "/profile/orders",
  },
  {
    name: defaultTabs.Clicks,
    icon: <ShoppingCart />,
    route: "/profile/clicks",
  },
  {
    name: defaultTabs.Referral,
    icon: <RiListSettingsLine />,
    route: "/profile/referral",
  },
];

function ProfileRootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const pathname = usePathname(); // Get the current path
  const router = useRouter();

  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const activityResponse = useAppSelector((state) => state.activity);
  const activityData = activityResponse?.data;
  const accessToken = useAppSelector((state) => state.authToken);
  const currentUser = getCustomerInfo?.data;
  const memberSince = dateToLocalDateYear(currentUser?.created_at);

  // Determine the selected tab based on the current path
  const selectedTab = tabsData.find((tab) => pathname.includes(tab.route))?.name || defaultTabs.Overview;

  useEffect(() => {
    if (status === "authenticated") {
      const authData = parseJwt(session.accessToken);
      dispatch(login(authData));
    }
  }, [status]);

  useEffect(() => {
    if (accessToken?.access_token?.length) {
      dispatch(fetchProfileDataAPI(accessToken?.access_token));
      dispatch(fetchActivityDataAPI(accessToken?.access_token));
    }
  }, [accessToken]);

  const updateSelectedTab = (route: string) => {
    router.push(route); // Navigate to the respective route
  };

  return (
    <>
      {currentUser ? (
        <div className="">
          <div className="container mx-auto p-5">
            <div className="md:flex no-wrap md:-mx-2">
              <div className="w-full md:w-9/12 md:mx-2">
                <div className="w-full md:w-12/12 h-64">
                  <div className="mb-4 border-b border-gray-200 dark:border-gray-700 bg-white rounded-md">
                    <div className="flex items-center justify-between rounded-t-lg font-semibold overflow-x-auto overflow-hidden">
                      <ul
                        className="flex -mb-px text-sm font-medium text-center"
                        role="tablist"
                      >
                        {tabsData?.map((tab, index) => (
                          <li className="me-2" role="presentation" key={index}>
                            <button
                              className={
                                selectedTab === tab?.name
                                  ? "flex p-2 lg:p-4 items-center text-[#008756] hover:text-[#008756] dark:text-[#008756] dark:hover:text-[#008756] border-[#008756] dark:border-[#008756] border-b-2"
                                  : "p-2 lg:p-4 inline-flex items-center justify-center rounded-t-lg"
                              }
                              type="button"
                              role="tab"
                              onClick={() => updateSelectedTab(tab?.route)}
                            >
                              {tab.name === defaultTabs.Referral ? (
                                <span>
                                  <span className="lg:inline-block hidden">
                                    Referral{" "}
                                  </span>
                                  URL
                                </span>
                              ) : (
                                tab.name
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="pr-2 bg-white dark:bg-gray-800 rounded-b-lg hidden lg:block">
                        {(selectedTab === defaultTabs.Overview ||
                          selectedTab === defaultTabs.Orders) && (
                            // <CalendarDateRangePicker />
                            <></>
                          )}
                      </div>
                    </div>
                  </div>
                  <div id="default-styled-tab-content">{children}</div>
                </div>
              </div>
              <div className="w-full md:w-3/12 md:mx-2 lg:block hidden">
                <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756]">
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Activity
                  </p>
                  <ScrollArea className="h-[60vh] rounded-md">
                    {activityData?.map((activity, index) => (
                      <div className="relative px-4 pr-0" key={index}>
                        <div className="absolute h-full border border-dashed border-opacity-20 border-secondary"></div>

                        <div className="flex items-center w-full my-3 -ml-1.5">
                          <div className="w-1/12 z-10">
                            <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
                          </div>
                          <div className="w-11/12">
                            <p className="text-sm">
                              Login from{" "}
                              {activity?.userInfo?.system?.model ||
                                "Unknown device"}
                            </p>
                            <p className="text-xs text-gray-500">
                              <LastSeen date={activity?.login_time} />
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756] mt-5">
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Member Since
                  </p>
                  <span>{memberSince}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full min-h-96 mt-10">
          <LoaderSpinner />
        </div>
      )}
    </>
  );
}

export default isAuth(ProfileRootLayout);
