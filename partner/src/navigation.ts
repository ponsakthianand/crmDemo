'use client';
import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from 'next-intl/navigation';
import { locales } from './i18n';

export const localePrefix = 'always';

export const pathnames = {
  '/': '/',
  '/about': '/about',
  '/login': '/login',
  '/signup': '/signup',
  '/forgot-password': '/forgot-password',
  '/profile': '/profile',
  '/settings': '/profile/settings',
  '/profile/edit': '/profile/edit',
  '/profile/security': '/profile/security',
  '/profile/help': '/profile/help',
  '/profile/customer': '/profile/customer',
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });
