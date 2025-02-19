"use client"

import { Row } from "@tanstack/react-table"
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Button } from "@/registry/new-york/ui/button"
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/new-york/ui/dialog"
import { Trash2, UserPlus } from "lucide-react"
import { useState } from "react";
import { fetchOrdersDataAPI, OrdersData } from "@/app/store/reducers/allOrders";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function AddAsCustomer<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const order: any = row.original
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.authToken);
  const [open, setOpen] = useState(false);

  const openPop = (data: OrdersData) => {
    useState(true)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <UserPlus className="h-4 w-4 opacity-70 hover:text-red-500" />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create customer account for {data?.userInfo?.name}?</DialogTitle>
            <DialogDescription>
              Do you really want to create customer account for the one who placed this order?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={'outline'}>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" onClick={() => handleConvertCustomerSubmit(data)}>Create</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const handleConvertCustomerSubmit = async (customer: OrdersData) => {
    const response = await fetch(`/api/customers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({
        name: customer?.userInfo?.name,
        email: customer?.userInfo?.email,
        phone: customer?.userInfo?.phone,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      toast({
        title: 'Sorry!',
        description: result?.errors || 'Something went wrong.',
      });
      return;
    }
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    await fetch(`/api/orders/updateAll`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({
        isCustomer: true,
        email: customer?.userInfo?.email,
      }),
    });

    accessToken?.access_token?.length &&
      dispatch(fetchOrdersDataAPI(accessToken?.access_token));
    toast({
      title: 'Great work!',
      description: `${customer?.userInfo?.name} created as a customer.`,
    });
    console.log(result);
  };

  return (
    <>{openPop(order)}</>
  )
}
