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
  gmp?: number;
  gmp_percent?: number;
  estimated_listing?: number;
  lot_size?: number;
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
  "IPO Open": string;
  "IPO Close": string;
  "Allotment"?: string;
  "Refund"?: string;
  "Credit of Shares"?: string;
  "Listing": string;
}

export interface IPOFinancials {
  Assets?: Record<string, string | number>;
  "Total Income"?: Record<string, string | number>;
  "Profit After Tax"?: Record<string, string | number>;
  EBITDA?: Record<string, string | number>;
  "NET Worth"?: Record<string, string | number>;
}

export interface IPOSubscriptionRow {
  category: string;
  Category?: string;
  subscription_times?: number;
  "Subscription (times)"?: string;
  shares_offered?: number | string;
  shares_bid?: number | string;
  "Shares Offered"?: number | string;
  "Shares Bid For"?: number | string;
  "Shares bid for"?: number | string;
}

export interface IPOSubscriptionStatus {
  SubscriptionTable: IPOSubscriptionRow[];
  TotalApplications?: number;
}

export interface IPOListingInfo {
  ListingDetails?: Record<string, string | number>;
  ListingDayTradingInfo?: Array<Record<string, string | number>>;
  IssuePrice?: number;
  OpenPrice?: number;
  ListingGainPercent?: number;
}

export interface IPOGMPRating {
  score: number;
  display: string;
}

export interface IPOGMPData {
  current_gmp?: number;
  estimated_listing?: number;
  rating?: IPOGMPRating;
  trend?: "up" | "down" | "stable";
  gmp_range?: {
    low: number;
    high: number;
  };
  profit_per_lot?: number;
  profit_per_share?: number;
  last_updated?: string;
  history?: Array<{
    date: string;
    gmp: number;
  }>;
}

export interface IPOLotSizeRow {
  application: string;
  lots: string;
  shares: string;
  amount: string;
}

export interface IPOReservationRow {
  category: string;
  shares_offered: string;
  percentage?: string;
  max_allottees?: string;
}

export interface IPOPromoterHolding {
  table?: Record<string, string | number>;
  promoters?: string[];
}

export interface IPOPEMetrics {
  KPI?: {
    RoNW?: string;
    "Price to Book Value"?: string;
    ROE?: string;
  };
}

export interface IPOObjective {
  serial_no: string;
  objective: string;
  expected_amount?: string;
}

export interface IPOLeadManager {
  name: string;
  profile_url?: string;
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
  lead_managers?: IPOLeadManager[];
}

export interface IPOMarketCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IPOMarketDataSummary {
  open: number;
  high: number;
  low: number;
  close: number;
  prev_close: number;
  total_volume: number;
  updated_at: string;
}

export interface IPOMarketData {
  date: string;
  exchange: string;
  isin: string;
  candles: IPOMarketCandle[];
  summary: IPOMarketDataSummary;
}

export interface IPOAnchorInvestor {
  name?: string;
  bid_amount?: string;
  shares_allocated?: string;
}

export interface AIData {
  seo_about: string;
  pros: string[];
  cons: string[];
  key_highlights: string[];
  financial_summary: string;
  sector: string;
}

export interface IPODetail {
  logo_about?: {
    logo?: string;
    about?: string;
  };
  objectives?: IPOObjective[];
  basic_info: IPOBasicInfo;
  ipo_timeline: IPOTimeline;
  lot_size_table?: Array<Array<string | number>>;
  reservation_table?: Array<Array<string | number>>;
  promoter_holding?: IPOPromoterHolding;
  anchor_investors?: Record<string, string | number> | IPOAnchorInvestor[];
  about_company?: {
    about_company?: string;
    lists?: string[];
  };
  financials?: IPOFinancials;
  pe_metrics?: IPOPEMetrics;
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
  }> | IPOMarketData;
  slug: string;
  ipo_type: "mainboard" | "sme";
  gain_loss_percent?: number;
  ai_data?: AIData;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  limit?: number;
  offset?: number;
  error?: string;
}

export interface IPOGMPListItem {
  slug: string;
  name: string;
  current_gmp: number;
  gmp_percent: number | null;
  estimated_listing: number;
  last_updated: string;
  rating: {
    label: string;
    score: number;
  };
  dates: {
    open: string;
    close: string;
    boa: string;
    listing: string;
  };
  ipo_details: {
    price: string;
    lot: string;
    size: string;
    subscription: string;
  };
}

export interface IPOGMPResponse {
  data: IPOGMPListItem[];
}
