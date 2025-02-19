'use client';
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/store/hooks";
import { BarGraph } from "@/src/app/components/charts/bar-graph";
import { fetchAllStatisticsOverallDataAPI } from "@/src/app/store/reducers/allStatisticsData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RiLoader5Fill } from "react-icons/ri";

export default function Overview() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.authToken);
  const statistics = useAppSelector((state) => state.overallStatistics);
  const statisticsData = statistics?.data;
  const loading = statistics?.loading;

  const loaderAnim = <div role="status" className=''>
    <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
  </div>

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchAllStatisticsOverallDataAPI(accessToken?.access_token, null));
  }, [accessToken])

  return (
    <>
      <div id="default-styled-tab-content">
        <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756]">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-sm font-medium">
                  Customers
                </CardTitle>
                {/* can place icon here */}
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-2xl font-bold">{loading ? loaderAnim : statisticsData?.totalCustomers}</div>
              </CardContent>
            </Card>



            <Card className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-sm font-medium">
                  Leads
                </CardTitle>
                {/* can place icon here */}
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-2xl font-bold">{loading ? loaderAnim : statisticsData?.totalLeads}</div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-sm font-medium">
                  Converted
                </CardTitle>
                {/* can place icon here */}
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-2xl font-bold">{loading ? loaderAnim : statisticsData?.convertedLeads}</div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-sm font-medium">
                  Orders
                </CardTitle>
                {/* can place icon here */}
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-2xl font-bold">{loading ? loaderAnim : statisticsData?.orders}</div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-sm font-medium">
                  Clicks
                </CardTitle>
                {/* can place icon here */}
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-2xl font-bold">{loading ? loaderAnim : statisticsData?.clicks}</div>
              </CardContent>
            </Card>
          </div>
          <div className="relative">
            <BarGraph chartData={statisticsData?.chartData} />
          </div>
        </div>
      </div>
    </>
  );
}
