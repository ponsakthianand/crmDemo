export interface CommonProductData {
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
  slug: string;
}
export interface EventProduct extends CommonProductData {
  eventDuration?: string;
  eventTime?: string;
}

export interface CartItem extends EventProduct {
  count?: number;
}

export interface CourseProduct extends CommonProductData { }



export interface OrderConfirmation {
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
