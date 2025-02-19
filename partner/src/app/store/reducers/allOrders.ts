import { baseUrl } from '@/global';
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

export interface OrdersData {
  _id: string;
  orderId: string;
  amount: number;
  cart: Cart[];
  currency: any;
  referralId: string;
  createdAt: string;
  status: string;
  razorpayOrderId: string;
  razorpayOrderInfo: RazorpayOrderInfo;
  paymentId: any;
  signature: string;
  userInfo: UserInfo;
  partner: Partner;
}

export interface Cart {
  _id: string;
  title: string;
  category: string;
  description: string;
  stock: string;
  tags: string[];
  regularPrice: string;
  salePrice: string;
  mode: string;
  active: boolean;
  published: boolean;
  image: any[];
  eventDuration: string;
  eventTime: string;
  slug: string;
  count: number;
}

export interface RazorpayOrderInfo {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[];
  offer_id: any;
  receipt: string;
  status: string;
}

export interface UserInfo {
  name: string;
  phone: string;
  email: string;
}

export interface Partner {
  name: string;
  email: string;
  phone: number;
  _id: string;
}

interface OrdersInfo {
  data: OrdersData[];
  loading: boolean;
}

export const initialState: OrdersInfo = {
  data: null as any,
  loading: false,
};

const OrdersSlice = createSlice({
  name: 'All Orders Data',
  initialState,
  reducers: {
    fetchOrders: (state) => {
      state.loading = true;
    },
    ordersSuccess: (state, { payload }) => {
      state.data = payload?.sort(function (a: any, b: any) {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
      });
      state.loading = false;
    },
    ordersFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { fetchOrders, ordersSuccess, ordersFailure } =
  OrdersSlice.actions;

export default OrdersSlice.reducer;

export function fetchOrdersDataAPI(
  seesionId: string,
  body?: { startDate: any; endDate: any }
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchOrders());

    await fetch(`/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${seesionId}`,
      },
      body: JSON.stringify({
        startDate: body ? body?.startDate : '',
        endDate: body ? body?.endDate : '',
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          dispatch(ordersFailure());
          signOut();
        }
      })
      .then((data) => {
        dispatch(ordersSuccess(data));
      })
      .catch((error) => {
        dispatch(ordersFailure(error));
      });
  };
}
