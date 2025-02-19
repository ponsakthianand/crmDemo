import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  photo: any[];
  phone: string;
  created_at: string;
  partner_user_id: string;
  status: string;
  organization_name: string;
  organization_type: string;
  description: string;
  updated_at: string;
  secondary_contact: string;
  gender: string;
  date_of_birth: string;
  address: string;
  annual_income: number;
  source_of_income: string;
  marital_status: string;
  pan_number: string;
  aadhaar_number: string;
  no_of_dependants: string;
  current_city: string;
  educational_qualification: string;
  permanent_address: string;
  nominee_name: string;
  nominee_relationship: string;
  nominee_dob: string; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'Leads',
    href: '/dashboard/leads',
    icon: 'filter',
    label: 'leads',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: 'user',
    label: 'customers',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'To-dos',
    href: '/dashboard/todos',
    icon: 'todo',
    label: 'todo',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'Task Manager',
    href: '/dashboard/tasks',
    icon: 'task',
    label: 'tasks',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
    icon: 'cart',
    label: 'orders',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'Mutual Funds',
    href: '/dashboard/mutual-funds',
    icon: 'IndianRupee',
    label: 'mutualFunds',
    permission: ['super', 'admin', 'view'],
  },
  // {
  //   title: 'Tickets',
  //   href: '/dashboard/tickets',
  //   icon: 'ticket',
  //   label: 'tickets',
  //   permission: ['super', 'admin', 'view'],
  // },
  {
    title: 'Events',
    href: '/dashboard/events',
    icon: 'event',
    label: 'events',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'Courses',
    href: '/dashboard/courses',
    icon: 'course',
    label: 'courses',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'Questions',
    href: '/dashboard/questions',
    icon: 'question',
    label: 'questions',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'Partners',
    href: '/dashboard/partners',
    icon: 'employee',
    label: 'partners',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'Admin Users',
    href: '/dashboard/admin-users',
    icon: 'admin',
    label: 'admin users',
    permission: ['super', 'admin'],
  },
  {
    title: 'Activity Logs',
    href: '/dashboard/activity-logs',
    icon: 'log',
    label: 'admin users',
    permission: ['super', 'admin'],
  },
  {
    title: 'Web sessions',
    href: '/dashboard/websessions',
    icon: 'webClick',
    label: 'admin users',
    permission: ['super', 'admin', 'view'],
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'profile',
    permission: ['super', 'admin', 'view'],
  },
];
