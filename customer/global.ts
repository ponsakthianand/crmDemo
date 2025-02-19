import { decode, getToken } from 'next-auth/jwt';

// Base URL API
export const baseUrl = 'https://api-v1.rxtn.in';

// Check authendication
export const isAuthenticated = false;

//date converted to local time
export const dateToLocalDateYear = (value: string) => {
  const event = new Date(value);
  return event.toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

//date converted to local time
export const dateToLocalTimeDateYear = (value: string) => {
  const event = new Date(value);
  const dateYear = event.toLocaleString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const hourMinutes = event.toLocaleTimeString('en-US');
  return `${dateYear} ${hourMinutes}`;
};

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export async function getServerSideProps(sessionId) {
  const decoded = await decode({
    token: sessionId,
    secret: process.env.JWT_SECRET,
  });

  return decoded;
}

export enum profileTabs {
  Transactions = 'Orders',
  Settings = 'Settings',
  Activity = 'Activity',
  Information = 'Information',
  MutualFunds = 'Mutual Funds',
  FinanceTracker = 'Finance Tracker',
}

export const personalDataField = [
  {
    name: 'Name',
    placeholder: 'John Doe',
    key: 'name',
    value: '',
    type: 'text',
  },
  {
    name: 'Email',
    placeholder: 'johndoe@gmail.com',
    key: 'email',
    value: '',
    type: 'email',
  },
  {
    name: 'Mobile',
    placeholder: '900xxxxxxx',
    key: 'phone',
    value: '',
    type: 'text',
  },
  {
    name: 'Gender',
    placeholder: 'Male',
    key: 'gender',
    value: '',
    type: 'text',
  },
  {
    name: 'Date of birth',
    placeholder: '12-08-1990',
    key: 'date_of_birth',
    value: '',
    type: 'text',
  },
  {
    name: 'Qualification',
    placeholder: 'Post Graduation',
    key: 'educational_qualification',
    value: '',
    type: 'text',
  },
  {
    name: 'Current city',
    placeholder: 'Chennai',
    key: 'current_city',
    value: '',
    type: 'text',
  },
  {
    name: 'Source of income',
    placeholder: 'Business',
    key: 'source_of_income',
    value: '',
    type: 'text',
  },
  {
    name: 'Marital status',
    placeholder: 'Married',
    key: 'marital_status',
    value: '',
    type: 'text',
  },
  {
    name: 'Secondary contact',
    placeholder: '800xxxxxxx',
    key: 'secondary_contact',
    value: '',
    type: 'text',
  },
  {
    name: 'No.of dependants',
    placeholder: '4',
    key: 'no_of_dependants',
    value: '',
    type: 'number',
  },
];

export const confidentialDataField = [
  {
    name: 'Address',
    placeholder:
      'No.1, Dubai kurukku theru, Vivekananthar Salai, Dubai, 6000021',
    key: 'address',
    type: '',
    value: '',
  },
  {
    name: 'Permanent address',
    placeholder: 'No.812, Kottampatti, Melmadi theru, Kanadukathaan, 6202021',
    key: 'permanent_address',
    type: '',
    value: '',
  },
  {
    name: 'Annual Income',
    placeholder: '35 lakhs',
    key: 'annual_income',
    type: '',
    value: '',
  },
  {
    name: 'Pan number',
    placeholder: 'AAAAA8888A',
    key: 'pan_number',
    type: '',
    value: '',
  },
  {
    name: 'Aadhaar number',
    placeholder: '1111 2222 3333',
    key: 'aadhaar_number',
    type: '',
    value: '',
  },
  {
    name: 'Nominee name',
    placeholder: 'Rose John Doe',
    key: 'nominee_name',
    type: '',
    value: '',
  },
  {
    name: 'Nominee relationship',
    placeholder: 'Wife',
    key: 'nominee_relationship',
    type: '',
    value: '',
  },
  {
    name: 'Nominee dob',
    placeholder: '18-07-1995',
    key: 'nominee_dob',
    type: '',
    value: '',
  },
];

export function formatPrice(price: number): string {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'INR',
  });
}

export const calculateOfferPercentage = (originalPrice, salePrice) => {
  const discount = originalPrice - salePrice;
  return Math.floor((discount / originalPrice) * 100); // Returns whole number
};

export const stripHtmlTags = (html) => {
  return html?.replace(/<[^>]*>/g, '');
};

export function toUrlFriendly(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}
