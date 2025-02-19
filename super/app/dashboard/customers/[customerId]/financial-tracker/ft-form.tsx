"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/registry/new-york/ui/input"
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
import { PlusCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchFinancialTrackerSpecificDataAPI } from "@/app/store/reducers/ftSpecificCustomer";
import PageContainer from "@/components/layout/page-container";

const FormSchema = z.object({
  monthly_income: z.coerce.number().min(2, {
    message: "Monthly income is required.",
  }),
  house_emi_or_rent: z.coerce.number().optional(),
  emi: z.coerce.number().optional(),
  provisions_expenses: z.coerce.number().optional(),
  carbike_expenses: z.coerce.number().optional(),
  entertainment_ott_outing: z.coerce.number().optional(),
  telephone_wifi: z.coerce.number().min(2, {
    message: "Telephone wifi expenses is required.",
  }),
  eb_water: z.coerce.number().optional(),
  other_investments: z.coerce.number().optional(),
  any_other_monthly_expenses: z.coerce.number().min(2, {
    message: "Other expenses is required.",
  }),
  lic_insurance_post_office: z.coerce.number().optional(),
  term_health_insurance: z.coerce.number().optional(),
  bike_car_insurance: z.coerce.number().optional(),
  school_fee: z.coerce.number().optional(),
  entertainment_ott: z.coerce.number().optional(),
  water: z.coerce.number().optional(),
  tours_travels: z.coerce.number().optional(),
  medical_expenses: z.coerce.number().optional(),
  unexpected_emergency: z.coerce.number().optional(),
  other_annual_expenses: z.coerce.number().optional(),
  any_other_annual_expenses: z.coerce.number().optional()
})

// zod condition sample
// calories: z.coerce
//   .number({
//     required_error: "Calories is required",
//     invalid_type_error: "Calories must be a number",
//   })
//   .int()
//   .positive()
//   .min(1, { message: "Calories should be at least 1" }),

export function FinancialTrackerForm({ financialTracker, customerId, token }: any) {
  const dispatch = useAppDispatch()
  const ftdata = financialTracker?.data;
  const ftDataLatest = ftdata?.[0];
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: ftDataLatest?.actualValue,
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const clearUndfined = JSON.parse(JSON.stringify(data));
    const actualValueUpdated = { ...ftDataLatest?.actualValue, ...clearUndfined }
    const checkObjectsEqual = Object.keys(actualValueUpdated).every((key) => actualValueUpdated[key] === ftDataLatest?.actualValue[key])

    if (!checkObjectsEqual) {
      const response = await fetch(`/api/customers/${customerId}/ft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify(actualValueUpdated)
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      dispatch(fetchFinancialTrackerSpecificDataAPI(token, customerId))

      setOpen(false);
      toast({
        title: "Great work!",
        description: 'Your financial status has been updated successfully.',
      })
    } else {
      toast({
        title: "Nothing to update",
        description: "Values are same as previous entry. If you want to update, please modify the specific field.",
      })
    }
  }

  const formFiledsArray = [
    { fieldName: 'monthly_income', title: 'Monthly Income', value: ftDataLatest?.actualValue?.monthly_income },
    { fieldName: 'house_emi_or_rent', title: 'Rent / EMI', value: ftDataLatest?.actualValue?.house_emi_or_rent },
    { fieldName: 'emi', title: 'Car EMI / Other EMI', value: ftDataLatest?.actualValue?.emi },
    { fieldName: 'provisions_expenses', title: 'Provisions', value: ftDataLatest?.actualValue?.provisions_expenses },
    { fieldName: 'carbike_expenses', title: 'Car Expenses / Transportation', value: ftDataLatest?.actualValue?.carbike_expenses },
    { fieldName: 'entertainment_ott_outing', title: 'Entertainment / OTT / Outing', value: ftDataLatest?.actualValue?.entertainment_ott_outing },
    { fieldName: 'telephone_wifi', title: 'Telephone & Wifi', value: ftDataLatest?.actualValue?.telephone_wifi },
    { fieldName: 'eb_water', title: 'EB & Water', value: ftDataLatest?.actualValue?.eb_water },
    { fieldName: 'other_investments', title: 'Other Investments / LIC / Post Office', value: ftDataLatest?.actualValue?.other_investments },
    { fieldName: 'any_other_monthly_expenses', title: 'Any Other Monthly Expenses / Investments', value: ftDataLatest?.actualValue?.any_other_monthly_expenses },
    { fieldName: 'lic_insurance_post_office', title: 'LIC Insurance & Post Office', value: ftDataLatest?.actualValue?.lic_insurance_post_office },
    { fieldName: 'term_health_insurance', title: 'Term & Health Insurance', value: ftDataLatest?.actualValue?.term_health_insurance },
    { fieldName: 'bike_car_insurance', title: 'Bike / Car Insurance', value: ftDataLatest?.actualValue?.bike_car_insurance },
    { fieldName: 'school_fee', title: 'School Fee', value: ftDataLatest?.actualValue?.school_fee },
    { fieldName: 'entertainment_ott', title: 'Entertainment / OTT', value: ftDataLatest?.actualValue?.entertainment_ott },
    { fieldName: 'water', title: 'Water', value: ftDataLatest?.actualValue?.water },
    { fieldName: 'tours_travels', title: 'Tours and Travels', value: ftDataLatest?.actualValue?.tours_travels },
    { fieldName: 'medical_expenses', title: 'Medical', value: ftDataLatest?.actualValue?.medical_expenses },
    { fieldName: 'unexpected_emergency', title: 'Emergency', value: ftDataLatest?.actualValue?.unexpected_emergency },
    { fieldName: 'other_annual_expenses', title: 'Other Annual Expenses / Gym / Swimming', value: ftDataLatest?.actualValue?.other_annual_expenses },
    { fieldName: 'any_other_annual_expenses', title: 'Any Other Annual Expenses / Investments ', value: ftDataLatest?.actualValue?.any_other_annual_expenses },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type='button'>
          <PlusCircle className='pr-2' /> {ftdata?.length ? 'Update ' : 'Add '} Finance Tracker
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:max-w-[1000px]">
        <SheetHeader>
          <SheetTitle>Update Financial Status</SheetTitle>
          <SheetDescription>
            {ftdata?.length ? 'Your previous data auto-filled. You can modify the specific field.' : 'Add your current financial status'}
          </SheetDescription>
        </SheetHeader>
        <PageContainer scrollable={true}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-5">
              {formFiledsArray.map((fie) => (
                <FormField
                  control={form.control}
                  name={fie?.fieldName as keyof z.infer<typeof FormSchema>} key={fie?.fieldName}
                  render={({ field }) => (
                    <FormItem className="">
                      <div className="flex items-center">
                        <FormLabel className="w-[400px]">{formFiledsArray.find(f => f.fieldName === field.name)?.title}</FormLabel>
                        <FormControl>
                          <Input placeholder="10000" {...field} />
                        </FormControl>
                      </div>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
              ))}
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant={'outline'}>Cancel</Button>
                </SheetClose>
                {/* <SheetClose asChild> */}
                <Button type="submit">Save changes</Button>
                {/* </SheetClose> */}
              </SheetFooter>
            </form>
          </Form>
        </PageContainer>
      </SheetContent>
    </Sheet>
  )
}
