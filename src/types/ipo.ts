// IPO API Response Types

export interface IPOGain {
  ipo_id: string;
  name: string;
  slug: string;
  issue_price: number;
  current_price: number;
  listing_gain_percent: number;
  listing_date: string;
  subscription_times: number;
  ipo_type: "mainboard" | "sme";
  listing_at: string;
}

export interface IPOStatus {
  ipo_id: string;
  name: string;
  slug: string;
  status: "open" | "closed" | "recently_listed" | "upcoming" | "listed";
  open_date: string;
  close_date: string;
  listing_date: string;
  issue_price: number;
  current_price?: number;
  gain_loss_percent?: number;
  subscription_times?: number;
  listed_on?: string;
  ipo_type: "mainboard" | "sme";
}

export interface IPONews {
  ipo_id: string;
  ipo_name: string;
  ipo_slug: string;
  type: "announcement" | "opening_today" | "closing_today" | "listing" | "subscription" | "gmp" | "allotment_date" | "shares_credited";
  title: string;
  description: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
}

export interface IPOCalendar {
  ipo_id: string;
  name: string;
  slug: string;
  status: "open" | "closed" | "upcoming" | "listed";
  ipo_type: "mainboard" | "sme";
  listing_at: string;
  open_date: string;
  close_date: string;
  listing_date: string;
  allotment_date?: string;
  issue_price: number;
  price_band?: string;
  lot_size: number;
  issue_size: number;
  fresh_issue?: number;
  offer_for_sale?: number;
  subscription_times?: number;
  retail_subscription?: number;
  qib_subscription?: number;
  nii_subscription?: number;
  gmp?: number;
  gmp_percent?: number;
  estimated_listing?: number;
  listing_gain_percent?: number;
}

export interface IPOBasicInfo {
  "IPO Name": string;
  "IPO Date": string;
  "Listed on"?: string;
  "Face Value": string;
  "Price Band": string;
  "Issue Price": string;
  "Lot Size": string;
  "Sale Type"?: string;
  "Issue Type"?: string;
  "Listing At": string;
  "Total Issue Size": string;
  "Fresh Issue"?: string;
  "Offer for Sale"?: string;
  "ISIN"?: string;
  "BSE Script Code / NSE Symbol"?: string;
}

export interface IPOTimeline {
  "IPO Open Date": string;
  "IPO Close Date": string;
  "Tentative Allotment"?: string;
  "Initiation of Refunds"?: string;
  "Credit of Shares to Demat"?: string;
  "Tentative Listing Date": string;
}

export interface IPOFinancials {
  Assets?: Record<string, string | number>;
  "Total Income"?: Record<string, string | number>;
  "Profit After Tax"?: Record<string, string | number>;
  EBITDA?: Record<string, string | number>;
  "NET Worth"?: Record<string, string | number>;
}

export interface IPOSubscriptionStatus {
  SubscriptionTable: Array<{
    category: string;
    subscription_times: number;
    shares_offered: number;
    shares_bid: number;
  }>;
  TotalApplications?: number;
}

export interface IPOListingInfo {
  ListingDetails?: Record<string, string | number>;
  ListingDayTradingInfo?: Array<Record<string, string | number>>;
  IssuePrice?: number;
  OpenPrice?: number;
  ListingGainPercent?: number;
}

export interface IPOGMPData {
  current_gmp?: number;
  estimated_listing?: number;
  history?: Array<{
    date: string;
    gmp: number;
  }>;
}

export interface IPORecommendation {
  brokers?: {
    subscribe: number;
    may_apply: number;
    neutral: number;
    avoid: number;
  };
  members?: Record<string, number>;
}

export interface IPORegistrar {
  registrar?: {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  lead_managers?: Array<{
    name: string;
  }>;
}

export interface IPODetail {
  logo_about?: {
    logo?: string;
    about?: string;
  };
  objectives?: Array<{
    serial_no: string;
    objective: string;
    expected_amount: string;
  }>;
  basic_info: IPOBasicInfo;
  ipo_timeline: IPOTimeline;
  lot_size_table?: Array<Array<string | number>>;
  reservation_table?: Array<Array<string | number>>;
  promoter_holding?: {
    table?: Record<string, string | number>;
    promoters?: string[];
  };
  anchor_investors?: Record<string, string | number>;
  about_company?: {
    about_company?: string;
    lists?: string[];
  };
  financials?: IPOFinancials;
  pe_metrics?: {
    KPI?: {
      RoNW?: string;
      "Price to Book Value"?: string;
    };
  };
  subscription_status?: IPOSubscriptionStatus;
  listing_info?: IPOListingInfo;
  contact_and_registrar?: {
    ipo_registrar_lead_managers?: IPORegistrar;
  };
  ipo_recommendation_summary?: IPORecommendation;
  gmp_data?: IPOGMPData;
  market_data?: Record<string, {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  slug: string;
  ipo_type: "mainboard" | "sme";
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  limit?: number;
  offset?: number;
  error?: string;
}
