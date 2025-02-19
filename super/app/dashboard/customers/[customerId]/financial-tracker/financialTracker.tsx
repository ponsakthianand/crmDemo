"use client"

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area"
import Image from "next/image"

import { Separator } from "@/registry/new-york/ui/separator"
import LastSeen from '@/components/elements/lastSeen';
import { fetchFinancialTrackerSpecificDataAPI } from '@/app/store/reducers/ftSpecificCustomer';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NoData } from '@/components/no-data/nodata';
import { DataLoader } from '@/components/dataLoader/dataLoader';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/new-york/ui/sheet"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PageContainer from '@/components/layout/page-container';

interface FinancialTrackerTabProps {
  customerID: string;
}

export interface wholeObject {
  tableData: TableDaum[]
  _id: string
  created_by_id: string
  created_by: string
  customer_id: string
  customer_name: string
  created_at: string
  health_status: HealthStatus
  overall_health_status: string
  actualValue: ActualValue
  idealValue: ActualValue
  annualValue: ActualValue
}

export interface TableDaum {
  name: string
  actualValue: number
  idealValue?: number
  annualValue: number
  health_status: string
}

export interface HealthStatus {
  monthly_income: string
  house_emi_or_rent: string
  emi: string
  provisions_expenses: string
  carbike_expenses: string
  entertainment_ott_outing: string
  telephone_wifi: string
  eb_water: string
  other_investments: string
  any_other_monthly_expenses: string
  lic_insurance_post_office: string
  term_health_insurance: string
  bike_car_insurance: string
  school_fee: string
  entertainment_ott: string
  water: string
  tours_travels: string
  medical_expenses: string
  unexpected_emergency: string
  other_annual_expenses: string
  any_other_annual_expenses: string
}

export interface ActualValue {
  monthly_income: number
  house_emi_or_rent: number
  emi: number
  provisions_expenses: number
  carbike_expenses: number
  entertainment_ott_outing: number
  telephone_wifi: number
  eb_water: number
  other_investments: number
  any_other_monthly_expenses: number
  lic_insurance_post_office: number
  term_health_insurance: number
  bike_car_insurance: number
  school_fee: number
  entertainment_ott: number
  water: number
  tours_travels: number
  medical_expenses: number
  unexpected_emergency: number
  other_annual_expenses: number
  any_other_annual_expenses: number
}

export default function FinancialTrackerTab({ customerID }: FinancialTrackerTabProps) {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const financialTracker = useAppSelector((state) => state.financialTracker);
  const ftList = financialTracker?.data;
  const [currentFinsStatus, setCurrentFinsStatus] = useState<wholeObject>();

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchFinancialTrackerSpecificDataAPI(accessToken?.access_token, customerID));
  }, [accessToken])

  const groupByYear = (array: any): any => {
    let group: any = {};
    array.forEach((elem: any) => {
      let year = moment(elem.createdDate).format('YYYY');
      if (!group[year]) {
        group[year] = {};
        let month = moment(elem.createdDate).format('MM');
        if (!group[year][month]) {
          group[year][month] = [elem];
        } else {
          group[year][month].push(elem);
        }
      } else {
        let month = moment(elem.createdDate).format('MM');
        if (!group[year][month]) {
          group[year][month] = [elem];
        } else {
          group[year][month].push(elem);
        }
      }
    });
    return group;
  };

  const onDelete = async (id: string) => {
    const response = await fetch(`/api/customers/${id}/ft`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken?.access_token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (accessToken?.access_token) {
      dispatch(fetchFinancialTrackerSpecificDataAPI(accessToken.access_token, customerID));
    }
    return data;
  }

  const formFiledsArray = [
    { fieldName: 'monthly_income', title: 'Monthly Income' },
    { fieldName: 'house_emi_or_rent', title: 'Rent / EMI' },
    { fieldName: 'emi', title: 'Car EMI / Other EMI' },
    { fieldName: 'provisions_expenses', title: 'Provisions' },
    { fieldName: 'carbike_expenses', title: 'Car Expenses / Transportation' },
    { fieldName: 'entertainment_ott_outing', title: 'Entertainment / OTT / Outing' },
    { fieldName: 'telephone_wifi', title: 'Telephone & Wifi' },
    { fieldName: 'eb_water', title: 'EB & Water' },
    { fieldName: 'other_investments', title: 'Other Investments / LIC / Post Office' },
    { fieldName: 'any_other_monthly_expenses', title: 'Any Other Monthly Expenses / Investments' },
    { fieldName: 'lic_insurance_post_office', title: 'LIC Insurance & Post Office' },
    { fieldName: 'term_health_insurance', title: 'Term & Health Insurance' },
    { fieldName: 'bike_car_insurance', title: 'Bike / Car Insurance' },
    { fieldName: 'school_fee', title: 'School Fee' },
    { fieldName: 'entertainment_ott', title: 'Entertainment / OTT' },
    { fieldName: 'water', title: 'Water' },
    { fieldName: 'tours_travels', title: 'Tours and Travels' },
    { fieldName: 'medical_expenses', title: 'Medical' },
    { fieldName: 'unexpected_emergency', title: 'Emergency' },
    { fieldName: 'other_annual_expenses', title: 'Other Annual Expenses / Gym / Swimming' },
    { fieldName: 'any_other_annual_expenses', title: 'Any Other Annual Expenses / Investments' },
  ]

  const fins = (financeStatus: any) => {
    const resultArray = formFiledsArray.map((field) => ({
      key: field.fieldName,
      name: field.title,
      actualValue: financeStatus.actualValue[field.fieldName] ? financeStatus.actualValue[field.fieldName] : 'NA',
      idealValue: financeStatus.idealValue[field.fieldName] ? financeStatus.idealValue[field.fieldName] : 'NA',
      annualValue: financeStatus.annualValue[field.fieldName] ? financeStatus.annualValue[field.fieldName] : 'NA',
      health_status: financeStatus.health_status[field.fieldName] ? financeStatus.health_status[field.fieldName] : 'NA',
    }));
    // const result = Object.keys(financeStatus.actualValue).map((key) => ({
    //   name: key,
    //   actualValue: financeStatus.actualValue[key],
    //   idealValue: financeStatus.idealValue[key],
    //   annualValue: financeStatus.annualValue[key],
    //   health_status: financeStatus.health_status[key],
    // }));
    setCurrentFinsStatus({ tableData: resultArray, ...financeStatus });
  };

  return (
    <>
      <div className="block">
        <div className="border-t">
          <div className="bg-background pt-8">

            {/* <div>
              <div className="ps-2 my-2 first:mt-0">
                <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                  1 Aug, 2023
                </h3>
              </div>

              <div className="flex gap-x-3 relative group rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                <a className="z-[1] absolute inset-0" href="#"></a>

                <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700 dark:group-hover:after:bg-neutral-600">
                  <div className="relative z-10 size-7 flex justify-center items-center">
                    <div className="size-2 rounded-full bg-white border-2 border-gray-300 group-hover:border-gray-600 dark:bg-neutral-800 dark:border-neutral-600 dark:group-hover:border-neutral-600"></div>
                  </div>
                </div>

                <div className="grow p-2 pb-8">
                  <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                    <svg className="shrink-0 size-4 mt-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" x2="8" y1="13" y2="13"></line>
                      <line x1="16" x2="8" y1="17" y2="17"></line>
                      <line x1="10" x2="8" y1="9" y2="9"></line>
                    </svg>
                    Created "Preline in React" task
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                    Find more detailed insctructions here.
                  </p>
                  <button type="button" className="mt-1 -ms-1 p-1 relative z-10 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800">James Collins
                  </button>
                </div>
              </div>

              <div className="flex gap-x-3 relative group rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                <a className="z-[1] absolute inset-0" href="#"></a>

                <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700 dark:group-hover:after:bg-neutral-600">
                  <div className="relative z-10 size-7 flex justify-center items-center">
                    <div className="size-2 rounded-full bg-white border-2 border-gray-300 group-hover:border-gray-600 dark:bg-neutral-800 dark:border-neutral-600 dark:group-hover:border-neutral-600"></div>
                  </div>
                </div>

                <div className="grow p-2 pb-8">
                  <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                    Release v5.2.0 quick bug fix 🐞
                  </h3>
                  <button type="button" className="mt-1 -ms-1 p-1 relative z-10 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800">
                    <span className="flex shrink-0 justify-center items-center size-4 bg-white border border-gray-200 text-[10px] font-semibold uppercase text-gray-600 rounded-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                      A
                    </span>
                    Alex Gregarov
                  </button>
                </div>
              </div>

              <div className="flex gap-x-3 relative group rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                <a className="z-[1] absolute inset-0" href="#"></a>

                <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700 dark:group-hover:after:bg-neutral-600">
                  <div className="relative z-10 size-7 flex justify-center items-center">
                    <div className="size-2 rounded-full bg-white border-2 border-gray-300 group-hover:border-gray-600 dark:bg-neutral-800 dark:border-neutral-600 dark:group-hover:border-neutral-600"></div>
                  </div>
                </div>

                <div className="grow p-2 pb-8">
                  <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                    Marked "Install Charts" completed
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                    Finally! You can check it out here.
                  </p>
                  <button type="button" className="mt-1 -ms-1 p-1 relative z-10 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800">
                    James Collins
                  </button>
                </div>
              </div>

              <div className="ps-2 my-2 first:mt-0">
                <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                  31 Jul, 2023
                </h3>
              </div>

              <div className="flex gap-x-3 relative group rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                <a className="z-[1] absolute inset-0" href="#"></a>

                <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700 dark:group-hover:after:bg-neutral-600">
                  <div className="relative z-10 size-7 flex justify-center items-center">
                    <div className="size-2 rounded-full bg-white border-2 border-gray-300 group-hover:border-gray-600 dark:bg-neutral-800 dark:border-neutral-600 dark:group-hover:border-neutral-600"></div>
                  </div>
                </div>

                <div className="grow p-2 pb-8">
                  <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                    Take a break ⛳️
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                    Just chill for now... 😉
                  </p>
                </div>
              </div>
            </div> */}

            <PageContainer scrollable={true}>
              {
                ftList?.length ? ftList.map((ft, index) => (
                  <div className={`${index === 0 ? ft?.overall_health_status === 'good' ? 'bg-green-50 p-3 flex justify-between items-center rounded mb-3 border border-green-500' : 'bg-red-50 border-red-500 p-3 flex justify-between items-center rounded mb-3 border' : 'p-2 flex justify-between items-center rounded mx-3 gap-x-2 py-3 px-4 text-sm font-medium border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg [&:not(:first-child)]:mx-3 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white hover:bg-gray-100'}`} key={index}>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium leading-none">
                        {index === 0 ? <>Current Status <Badge variant={ft?.overall_health_status === 'good' ? 'good' : 'destructive'}>{ft?.overall_health_status}</Badge></> : ''}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center space-x-2">
                        {index !== 0 ? <>Previously was <span className={`${ft?.overall_health_status === 'good' ? 'text-green-500 pl-2' : 'text-red-500 pl-2'}`}>{ft?.overall_health_status}</span></> : ''} <LastSeen date={ft?.created_at} /> &nbsp; updated by {ft?.created_by}
                      </p>
                    </div>
                    <div className="flex h-5 items-center space-x-4 text-sm">
                      <Sheet onOpenChange={() => { fins(ft) }}>
                        <SheetTrigger asChild>
                          <div className="flex h-5 items-center space-x-4 text-sm cursor-pointer hover:text-blue-500">
                            <div>Actual</div>
                            <Separator orientation="vertical" />
                            <div>Ideal</div>
                            <Separator orientation="vertical" />
                            <div>Annual</div>
                            <Separator orientation="vertical" />
                          </div>
                        </SheetTrigger>
                        <SheetContent className="w-[600px] sm:max-w-[1000px]">
                          <SheetHeader>
                            <SheetTitle>{ft?.customer_name}'s {index === 0 ? 'current' : 'previous'} financial status</SheetTitle>
                            <SheetDescription className='flex'>Updated on &nbsp; <LastSeen date={ft?.created_at} />. Ideal values are approximate.</SheetDescription>
                          </SheetHeader>
                          <div className="pt-4">
                            <PageContainer scrollable={true}>
                              <Table>
                                <TableHeader>
                                  <TableRow className='bg-gray-100'>
                                    <TableHead className='text-gray-900 font-semibold'>Item</TableHead>
                                    <TableHead className='text-gray-900 font-semibold'>Actual</TableHead>
                                    <TableHead className='text-gray-900 font-semibold'>Ideal</TableHead>
                                    <TableHead className='text-gray-900 font-semibold'>Annual</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {currentFinsStatus?.tableData?.map((fin: TableDaum) => (
                                    <TableRow key={fin.name}>
                                      <TableCell>{fin.name}</TableCell>
                                      <TableCell className={fin?.health_status === 'good' ? 'bg-green-200 font-semibold' : 'bg-red-200'}>{fin.actualValue}</TableCell>
                                      <TableCell>{fin.idealValue}</TableCell>
                                      <TableCell>{fin.annualValue}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </PageContainer>
                          </div>
                        </SheetContent>
                      </Sheet>

                      <Dialog>
                        <DialogTrigger asChild>
                          <div className='text-red-600 cursor-pointer'>Delete</div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Delete Financial Entry</DialogTitle>
                            <DialogDescription>
                              Do you really want to delete this entry?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant={'outline'}>Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button type="button" onClick={() => onDelete(ft?._id)}>Delete</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )) : financialTracker?.loading ? <DataLoader /> : <NoData />
              }
            </PageContainer>
          </div>
        </div >
      </div >
    </>
  )
}