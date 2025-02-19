interface LeadField {
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  conditional?: (data: { category: string }) => boolean;
}

export interface LeadFieldsSchema {
  _id: string;
  full_Name: LeadField;
  mobile: LeadField;
  email: LeadField;
  category: LeadField;
  sub_category: LeadField;
  mobileTwo: LeadField;
  gender: LeadField;
  dob: LeadField;
  age: LeadField;
  annualIncome: LeadField;
  employmentType: LeadField;
  lead_from: LeadField;
  referral_id: LeadField;
  street: LeadField;
  city: LeadField;
  zipCode: LeadField;
  state: LeadField;
  country: LeadField;
  panNumber: LeadField;
  aadharNumber: LeadField;
  filingType: LeadField;
  loanType: LeadField;
  insuranceType: LeadField;
  healthCondition: LeadField;
  residentialStatus: LeadField;
  lifeStyleHabits: LeadField;
  review_status: LeadField;
  status: LeadField;
  callSchedule: LeadField;
  delayInPayment: LeadField;
  cibilIssues: LeadField;
  isKnownCoverage: LeadField;
  differentlyAbled: LeadField;
  isIncomeTaxFiled: LeadField;
  note: LeadField;
  comment: LeadField;
}

export type FormDataValue = {
  [key in keyof LeadFieldsSchema]?: string | boolean | undefined;
};

export const leadFieldsSchema = {
  full_Name: {
    label: 'Full Name*',
    type: 'text',
    required: true,
    placeholder: 'Enter full name',
  },
  mobile: {
    label: 'Mobile*',
    type: 'mobile',
    required: true,
    placeholder: 'Enter mobile number',
  },
  email: { label: 'Email*', type: 'email', placeholder: 'Enter email address' },
  category: {
    label: 'Category',
    type: 'select',
    options: [
      'Loan',
      'Insurance',
      'Auditing Services',
      'Mutual Fund',
      'Financial Consultation',
      'Fianancial Planning',
      'Creditcard Consultation',
      'Investment Consultation',
      'Tax Consultation',
      'Other',
    ],
    conditional: (data: { category: string }) => data.category === 'No',
    required: true,
    placeholder: 'Select a category',
  },
  gender: {
    label: 'Gender',
    type: 'select',
    options: ['Male', 'Female', 'Transgender'],
    conditional: (data: { category: string }) => data.category !== 'Other',
    placeholder: 'Enter gender',
  },
  dob: {
    label: 'Date of Birth (DD-MM-YYYY)',
    type: 'dob',
    conditional: (data: { category: string }) => data.category !== 'Other',
    placeholder: 'DD-MM-YYYY',
  },
  annualIncome: {
    label: 'Annual Income',
    type: 'text',
    conditional: (data: { category: string }) => data.category !== 'Other',
    placeholder: 'Enter annual income',
  },
  employmentType: {
    label: 'Employment Type',
    type: 'select',
    options: [
      'Salaried',
      'Business',
      'House Wife',
      'Student',
      'Retired',
      'Other',
    ],
    conditional: (data: { category: string }) => data.category !== 'Other',
    placeholder: 'Enter employment type',
  },
  lead_from: {
    label: 'Lead From',
    type: 'select',
    options: [
      'Website',
      'Phone',
      'Email',
      'Walk-in',
      'Reference',
      'Social Media',
      'Other',
    ],
    conditional: (data: { category: string }) => data.category === 'no',
    placeholder: 'Enter lead source',
  },
  panNumber: {
    label: 'PAN Number',
    type: 'text',
    required: true,
    conditional: (data: { category: string }) =>
      ['Auditing Services', 'Loan'].includes(data.category),
    placeholder: 'Enter PAN number',
  },
  aadharNumber: {
    label: 'Aadhar Number',
    type: 'text',
    conditional: (data: { category: string }) =>
      ['Auditing Services', 'Loan'].includes(data.category),
    placeholder: 'Enter Aadhar number',
  },
  filingType: {
    label: 'Filing Type',
    type: 'text',
    conditional: (data: { category: string }) =>
      ['Auditing Services', 'Loan'].includes(data.category),
    placeholder: 'Enter filing type',
  },
  loanType: {
    label: 'Loan Type',
    type: 'select',
    options: [
      'Home',
      'Personal',
      'Car',
      'Education',
      'Reduce my EMI',
      'Conversion of multiple loans',
      'SME (up to 50 crores) & MSME (up to 10 crores)',
      'Small Business Loan',
      'Loan against property',
      'Gold Loan',
      'Other',
    ],
    required: true,
    conditional: (data: { category: string }) =>
      ['Loan'].includes(data.category),
    placeholder: 'Enter loan type',
  },
  insuranceType: {
    label: 'Insurance Type',
    type: 'select',
    options: ['Term Insurance', 'Health Insurance', 'Both', 'Other'],
    required: true,
    conditional: (data: { category: string }) =>
      ['Insurance'].includes(data.category),
    placeholder: 'Enter insurance type',
  },
  healthCondition: {
    label: 'Health Condition',
    type: 'select',
    options: ['Diabetes', 'Blood Pressure', 'Heart Disease', 'Other', 'None'],
    conditional: (data: { category: string }) =>
      ['Insurance'].includes(data.category),
    placeholder: 'Enter health condition',
  },
  residentialStatus: {
    label: 'Residential Status',
    type: 'select',
    options: ['Indian', 'NRI', 'PIO', 'OCI', 'Other'],
    conditional: (data: { category: string }) =>
      ['Insurance'].includes(data.category),
    placeholder: 'Enter residential status',
  },
  lifeStyleHabits: {
    label: 'Lifestyle Habits',
    type: 'select',
    options: ['Smoking or Drinking', 'Healthy', 'Other'],
    conditional: (data: { category: string }) =>
      ['Insurance', 'Financial Consultation'].includes(data.category),
    placeholder: 'Enter lifestyle habits',
  },
  delayInPayment: {
    label: 'Yes',
    type: 'checkbox',
    conditional: (data: { category: string }) =>
      ['Loan'].includes(data.category),
    placeholder: 'Is there a delay in payment?',
  },
  cibilIssues: {
    label: 'Yes',
    type: 'checkbox',
    conditional: (data: { category: string }) =>
      ['Loan'].includes(data.category),
    placeholder: 'Any Cibil issues?',
  },
  isKnownCoverage: {
    label: 'Yes',
    type: 'checkbox',
    conditional: (data: { category: string }) =>
      ['Insurance'].includes(data.category),
    placeholder: 'Lead has known coverage?',
  },
  differentlyAbled: {
    label: 'Yes',
    type: 'checkbox',
    conditional: (data: { category: string }) =>
      ['Insurance'].includes(data.category),
    placeholder: 'Is the lead differently abled?',
  },
  isIncomeTaxFiled: {
    label: 'Yes',
    type: 'checkbox',
    conditional: (data: { category: string }) =>
      ['Insurance'].includes(data.category),
    placeholder: 'Is income tax filed?',
  },
  note: {
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter description',
  },
};
