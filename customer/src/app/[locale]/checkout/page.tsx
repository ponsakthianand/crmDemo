"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { LoaderCircle } from "lucide-react";
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSession, signIn } from 'next-auth/react';
import PhoneInput, {
  isValidPhoneNumber
} from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import './custom.css'
import { CartItem } from "../../models/productInterfaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProfileDataAPI } from "../../store/reducers/profile";
import { parseJwt } from "@/global";
import { login } from "../../store/reducers/auth";
import { updateCartVailableStatus } from "../../store/reducers/isCartAvaialbe";
import EmptyCart from "../../common/components/empty-cart";
import CryptoJS from 'crypto-js';
import { CheckoutSkeleton } from "../../common/library/checkoutSkeleton";

interface CheckoutFields {
  name?: string;
  email?: string;
  phone?: string;
  id?: string;
}

export default function Checkout() {
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()
  const initialized = useRef(false)
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const itemsForCheckout = useAppSelector((state) => state.cartData);
  const [errors, setErrors] = useState<CheckoutFields>({});
  const [userInfo, setUserInfo] = useState<CheckoutFields>({});
  const accessToken = useAppSelector((state) => state.authToken);
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const currentUser = getCustomerInfo?.data;
  const idRef = useRef()

  const searchParams = useSearchParams();
  const [buyNowProduct, setBuyNowProduct] = useState<CartItem | null>(null);

  useEffect(() => {
    const encryptedProduct = searchParams.get('product');
    if (encryptedProduct) {
      const bytes = CryptoJS.AES.decrypt(
        decodeURIComponent(encryptedProduct),
        process.env.ENCRYPTION_KEY || 'fallback-secret-key'
      );
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      const productData = JSON.parse(decryptedData);
      setBuyNowProduct(productData);
    }
  }, [searchParams]);



  const productsToCheckout = buyNowProduct ? [{ ...buyNowProduct, count: 1 }] : itemsForCheckout?.data;

  useEffect(() => {
    if (status === "authenticated") {
      const authData = parseJwt(session.accessToken);
      dispatch(login(authData));
    }
  }, [status])

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchProfileDataAPI(accessToken?.access_token));
  }, [session, accessToken])

  useEffect(() => {
    setUserInfo({
      name: currentUser?.name,
      email: currentUser?.email,
      phone: currentUser?.phone,
      id: currentUser?._id
    })
  }, [currentUser])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, []);

  const removeFromCart = (productId) => {
    if (buyNowProduct) {
      setBuyNowProduct(productsToCheckout.filter((item) => item._id !== productId)[0]);
    } else {
      const removeItem = productsToCheckout?.filter((item) => item._id !== productId)
      dispatch(updateCartVailableStatus(removeItem))
    }

  };

  const salePrice = (price: any) => {
    return parseInt(price.replace(/[^0-9.-]+/g, ""));
  }

  const calculateTotal = () => {
    return productsToCheckout.reduce((total, item) => total + salePrice(item.salePrice) * (item.count), 0);
  };

  const amount = calculateTotal()

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear the error for this field
  };

  const handlePhoneInputChange = (e) => {
    setUserInfo((prev) => ({ ...prev, phone: e }));
    setErrors((prev) => ({ ...prev, phone: '' })); // Clear the error for this field
  };

  const validateUserInfo = () => {
    const newErrors: CheckoutFields = {};
    if (!userInfo.name) newErrors.name = 'Name is required.';
    if (!userInfo.email) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(userInfo.email)) newErrors.email = 'Enter a valid email.';
    if (!userInfo.phone) newErrors.phone = 'Phone number is required.';
    else if (!isValidPhoneNumber(userInfo.phone)) newErrors.phone = 'Enter a valid phone number.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  const createOrderId = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (amount <= 0 || isNaN(amount)) return setLoading(false);
    if (!validateUserInfo()) return setLoading(false);
    const partner_ref = localStorage.getItem('partner_ref');
    setLoading(true)
    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount.toString()) * 100,
          partner_ref,
          userInfo,
          productsToCheckout,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const id = data.orderId
      idRef.current = id;
      setLoading(false)

      processPayment()
      return;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const processPayment = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!validateUserInfo()) return;
    const orderId = idRef.current
    console.log(orderId)
    try {
      const options = {
        key: process.env.RAZORPAY_KEY,
        amount: parseFloat(amount.toString()) * 100,
        currency: "INR",
        name: "Returnx Edumode LLP", //busniess name
        description: "Rxtn.in Website Trasaction",
        order_id: orderId,
        prefill: {
          name: userInfo.name, //user name
          email: userInfo.email, //user email
          contact: userInfo.phone, // user phone number
        },
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            updated_at: new Date(),
            userInfo,
            productsToCheckout
          };

          setLoading(true)
          const result = await fetch("/api/order/complete", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const orderData = await result.json();
          if (orderData.isOk) {
            if (buyNowProduct) {
              setBuyNowProduct(null);
            } else {
              dispatch(updateCartVailableStatus([]))
            }
            localStorage.removeItem("cart");
            router.push(`/order/confirmation/${orderData.orderId}`); //process further request after 
          } else {
            alert(orderData.message);
            localStorage.removeItem("cart");
            router.push(`/order/confirmation/${orderId}`);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      setLoading(false);
      paymentObject.open();
    } catch (error) {
      console.error(error);
    }
  };

  // Scroll to first error field when errors are set
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0]; // Get the first error field
      const field = document.getElementById(firstErrorField); // Get the DOM element by ID
      if (field) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errors]);

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="flex min-h-screen flex-col">
        <form onSubmit={createOrderId}>
          <main className="container mx-auto flex flex-1 flex-col gap-0 md:flex-row md:gap-12 lg:gap-16 lg:px-20 lg:py-28 px-8 py-28">
            {loading ? <CheckoutSkeleton /> : productsToCheckout?.length ? <>
              <div className="flex-1 lg:space-y-6">
                <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Billing Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="name">Name</Label>
                            {errors.name && <p className="text-red-500 text-sm line leading-none">{errors.name}</p>}
                          </div>
                          <Input className={errors.name && 'border-red-500'} name="name" placeholder="John Doe" value={userInfo.name}
                            onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="phone">Phone number</Label>
                            {errors.phone && <p className="text-red-500 text-sm line leading-none">{errors.phone}</p>}
                          </div>
                          <PhoneInput
                            placeholder="Enter phone number"
                            defaultCountry="IN"
                            value={userInfo.phone}
                            onChange={handlePhoneInputChange}
                            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.phone && 'border-red-500'}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="phone">Email</Label>
                            {errors.email && <p className="text-red-500 text-sm line leading-none">{errors.email}</p>}
                          </div>
                          <Input className={errors.email && 'border-red-500'} name="email" type="text" placeholder="john@example.com" value={userInfo.email}
                            onChange={handleInputChange} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button type="submit" variant="default" className="button mt-5 hidden rounded-[50px] border-[#7F8995] bg-transparent text-black after:bg-rxtGreen hover:border-rxtGreen hover:text-white lg:inline-block">
                    Place Order
                  </Button>
                </div>
              </div>
              <div className="w-full max-w-md space-y-6 md:w-[500px]">
                <h1 className="text-2xl font-bold tracking-tight hidden lg:block">&nbsp;</h1>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 min-h-50">
                    <div className=" min-h-[180px]">
                      {productsToCheckout.map((item, index) => (
                        <div className="grid grid-cols-[1fr_auto] gap-4" key={index}>
                          <div className="mb-4">
                            <p className="text-sm font-medium">{item?.title}</p>
                            <div className="flex justify-start items-center">
                              <p className="text-sm text-gray-500">Qty. {item?.count}</p>
                              <p className="text-sm text-gray-500 cursor-pointer ml-3 hover:text-red-500" onClick={() => removeFromCart(item?._id)}>Remove</p>
                            </div>
                          </div>
                          <div className="text-right font-medium">₹{item?.salePrice}</div>
                        </div>
                      )
                      )}
                    </div>
                    <Separator />
                    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                      <div className="text-lg font-medium">Total</div>
                      <div className="text-lg font-medium">₹{calculateTotal()}</div>
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-5 block lg:hidden">
                  <Button type="submit" variant="default" className="button mt-5 rounded-[50px] border-[#7F8995] bg-transparent text-black after:bg-rxtGreen hover:border-rxtGreen hover:text-white w-full">
                    Place Order
                  </Button>
                </div>
              </div>
            </> : <EmptyCart />
            }
          </main>
        </form>
      </div>
    </>
  );
}
