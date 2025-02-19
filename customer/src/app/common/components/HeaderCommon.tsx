'use client'
import { useTranslations } from 'next-intl'
import { FC, useEffect } from 'react'
import { useState } from 'react'
import Logo from '@/src/app/components/logo/Logo'
import Link from 'next/link';
import Navbar from '@/src/app/components/navbar/Navbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { CartItem } from '../../models/productInterfaces'
import { updateCartVailableStatus } from '../../store/reducers/isCartAvaialbe'
import { ShoppingCart } from 'lucide-react'
import ProfileTopDropdownCommon from './ProfileTopDropdown-common'
interface Props {
  locale: string;
  loginCSS: string;
  signupCSS: string;
  navColor?: string;
  light?: string;
}
export const HeaderCommon: FC<Props> = ({ locale, loginCSS, signupCSS, navColor, light }) => {
  const accessToken = useAppSelector((state) => state.authToken);
  const t = useTranslations('')
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return []; // Default to an empty array during SSR
  });

  const [mobileMenu, setMobileMenu] = useState(false);
  const dispatch = useAppDispatch()
  const cartForCheckout = useAppSelector((state) => state.cartData);
  const getCustomerInfo = useAppSelector((state) => state.profileData);

  useEffect(() => {
    if (cart?.length) {
      dispatch(updateCartVailableStatus(cart))
    } else {
      dispatch(updateCartVailableStatus([]))
    }
  }, [cart]);

  useEffect(() => {
    console.log('Saving cart to localStorage:', cart);
    localStorage.setItem('cart', JSON.stringify(cartForCheckout?.data));
  }, [cartForCheckout]);

  return (
    <header
      className='site-header site-header--absolute is--white py-3'
      id='sticky-menu'
    >
      <div className='global-container'>
        <div className='flex items-center justify-between gap-x-8'>
          {/* Header Logo */}
          <div className='font-bold text-3xl'>FinTech</div>
          {/* Header Logo */}
          {/* Header Navigation */}
          <Navbar
            mobileMenu={mobileMenu}
            setMobileMenu={setMobileMenu}
            color={navColor}
          />
          {/* Header Navigation */}
          {/* Header User Event */}
          {/* <CartSheet /> */}
          <div className='flex items-center gap-3'>
            {cartForCheckout?.data?.length ? (<Link className="m-1 py-3 px-4 items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 lg:inline-flex hidden" href="/checkout">
              <ShoppingCart className="shrink-0 size-4" />
              <div>
                <span className="text-sm block text-gray-900">{cartForCheckout?.data?.length} item(s) in your cart</span>
                <span className="text-xs block text-gray-500">Proceed to payment now</span>
              </div>

            </Link>) : <></>}

            {!accessToken?.access_token ? <Link href='/login' className={loginCSS}>
              Login
            </Link> : <div className="relative overflow-hidden lg:block hidden">
              <ProfileTopDropdownCommon />
            </div>}

            {/* Responsive Off-canvas Menu Button */}
            <div className='block lg:hidden'>
              <div className='flex items-center'>
                {cartForCheckout?.data?.length ? (<Link className="items-center text-sm font-medium rounded-lg inline-flex lg:hidden relative" href="/checkout">
                  <div className="m-1 ms-0 relative inline-flex justify-center items-center size-[32px] w-[55px] mr-3 text-sm font-semibold rounded-lg border">
                    <span className='pr-[2px]'>({cartForCheckout?.data?.length})</span> <ShoppingCart className="shrink-0 size-4" />
                    <span className="flex absolute top-0 end-0 size-3 -mt-1.5 -me-1.5">
                      <span className="animate-ping absolute inline-flex size-full rounded-full bg-red-400 opacity-75 dark:bg-red-600"></span>
                      <span className="relative inline-flex rounded-full size-3 bg-red-500"></span>
                    </span>
                  </div>
                  {/* <ShoppingCart className="shrink-0 size-4" />
                  <span className='badge bg-blue-500 text-white'>{cart?.length}</span> */}
                </Link>) : <></>}
                {!accessToken?.access_token ? <Link href='/login' className='button lg:hidden rounded-[50px] border-[#7F8995] bg-transparent text-black after:bg-rxtGreen hover:border-rxtGreen hover:text-white inline-block px-3 py-1'>
                  Login
                </Link> : <div className="relative overflow-hidden block lg:hidden">
                  <ProfileTopDropdownCommon />
                </div>}
                <button
                  onClick={() => setMobileMenu(true)}
                  className={`mobile-menu-trigger !ml-2 ${light ? 'is-white' : 'is-black'
                    }`}
                >
                  <span />
                </button>
              </div>
            </div>
          </div>
          {/* Header User Event */}
        </div>
      </div>
    </header>
  );
}

