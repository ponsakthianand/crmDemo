export interface MutualFundsDocument {
  _id: string;
  customer_id: string;
  customer_name: string;
  created_by_id: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  status: string;
  process_status: string;
  requests: MFRequests[];
  description: string;
  approved_at?: string;
  approved_by?: string;
  approved_by_id?: string;
  approved_through?: string;
  reconsider_comment: string;
}

export interface MFRequests {
  id?: string;
  title: string;
  fundType: string;
  fundName: string;
  transactionType: string;
  toScheme?: string;
  frequency?: string;
  installmentDate?: string;
  fromDate?: string;
  toDate?: string;
  amount: string;
}

export interface FundType {
  _id: string;
  name: string;
  fundNames: FundName[];
  created_at: string;
  created_by: string;
  created_by_name: string;
  updated_by_name: string;
  updated_at: string;
  updated_by: string;
}

export interface FundName {
  _id: string;
  name: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  created_by_name: string;
  updated_by_name: string;
}
