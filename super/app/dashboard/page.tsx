'use client'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentTodos } from '@/components/recent-todos';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { fetchAllStatisticsOverallDataAPI, StatisticsOverallInfo } from '../store/reducers/allStatisticsData';
import { fetchAllTasksDataAPI } from '../store/reducers/allTasks';
import { fetchCustomersListAPI } from '../store/reducers/customersList';
import { useRouter } from 'next/navigation';
import { RiLoader5Fill } from 'react-icons/ri';

export default function page() {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const tasks = useAppSelector((state) => state.allTasks);
  const tasksData = tasks?.data;
  const statistics = useAppSelector((state) => state.overallStatistics);
  const statisticsData = statistics?.data;
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(undefined)
  const loading = statistics?.loading;

  const getSelectedDate = (date: DateRange) => {
    setSelectedDate(date)
  }
  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchAllTasksDataAPI(accessToken?.access_token));
    accessToken?.access_token?.length && dispatch(fetchCustomersListAPI(accessToken?.access_token));
  }, [accessToken])

  useEffect(() => {
    const selectedTange = (selectedDate?.from || selectedDate?.to) ? { startDate: selectedDate?.from, endDate: selectedDate?.to } : { startDate: '', endDate: '' }
    accessToken?.access_token?.length && dispatch(fetchAllStatisticsOverallDataAPI(accessToken?.access_token, selectedTange));
  }, [accessToken, selectedDate])

  const loaderAnim = <div role="status" className=''>
    <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
  </div>

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2 px-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker updatedDate={getSelectedDate} />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className=' cursor-pointer' onClick={() => router.push('/dashboard/leads')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Leads
                  </CardTitle>
                  {/* can place icon here */}
                </CardHeader>
                <CardContent>
                  <div className='flex justify-between'>
                    <div>
                      <div className="text-xs text-muted-foreground">Total</div>
                      <div className="text-2xl font-bold">
                        {loading ? loaderAnim : statisticsData?.totalLeads}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Yet to call</div>
                      <div className="text-2xl font-bold text-fuchsia-600">{loading ? loaderAnim : statisticsData?.leadsWithoutCallSchedule}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                      <div className="text-2xl font-bold text-orange-500">{loading ? loaderAnim : statisticsData?.pendingLeads}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Converted</div>
                      <div className="text-2xl font-bold text-green-600">{loading ? loaderAnim : statisticsData?.convertedLeads}</div>
                    </div>
                  </div>

                  {/* <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p> */}
                </CardContent>
              </Card>

              <Card className=' cursor-pointer' onClick={() => router.push('/dashboard/orders')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  {/* can place icon here */}
                </CardHeader>
                <CardContent>
                  <div className='flex justify-between'>
                    <div>
                      <div className="text-xs text-muted-foreground">Total</div>
                      <div className="text-2xl font-bold">{loading ? loaderAnim : statisticsData?.ordersTotal}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                      <div className="text-2xl font-bold text-orange-500">{loading ? loaderAnim : statisticsData?.ordersPending}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Paid</div>
                      <div className="text-2xl font-bold text-green-600">{loading ? loaderAnim : statisticsData?.ordersPaid}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className=' cursor-pointer' onClick={() => router.push('/dashboard/customers')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Customers
                  </CardTitle>
                  {/* can place icon here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? loaderAnim : statisticsData?.totalCustomers}</div>
                </CardContent>
              </Card>
              <Card className=' cursor-pointer' onClick={() => router.push('/dashboard/partners')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Partners</CardTitle>
                  {/* can place icon here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? loaderAnim : statisticsData?.totalPartners}</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph chartData={statisticsData?.chartData} />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Todos</CardTitle>
                  <CardDescription>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTodos tasksData={tasksData} token={accessToken?.access_token || ''} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer >
  );
}
