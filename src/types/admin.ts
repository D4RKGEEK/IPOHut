// Admin Panel Types

export interface SiteSettings {
  branding: {
    siteName: string;
    logoUrl: string;
    faviconUrl: string;
    tagline: string;
  };
  scripts: {
    headerScripts: string;
    footerScripts: string;
  };
  defaultSeo: {
    titleSuffix: string;
    defaultDescription: string;
    ogImage: string;
    twitterHandle: string;
  };
}

export interface PageSeoSettings {
  title: string;
  description: string;
  h1: string;
  subheading?: string;
  customText?: string;
}

export interface PageSettings {
  home: PageSeoSettings;
  ipoDetail: PageSeoSettings & {
    titleTemplate: string;
    descriptionTemplate: string;
  };
  mainboard: PageSeoSettings;
  sme: PageSeoSettings;
  gmpTracker: PageSeoSettings;
  allotmentStatus: PageSeoSettings;
  calendar: PageSeoSettings;
  performance: PageSeoSettings;
}

export interface AdminSettings {
  site: SiteSettings;
  pages: PageSettings;
  updatedAt: string;
}

export const defaultAdminSettings: AdminSettings = {
  site: {
    branding: {
      siteName: "IPO Watch",
      logoUrl: "",
      faviconUrl: "",
      tagline: "Your trusted source for IPO insights",
    },
    scripts: {
      headerScripts: "",
      footerScripts: "",
    },
    defaultSeo: {
      titleSuffix: " | IPO Watch 2026",
      defaultDescription: "Track live IPO GMP, subscription status, allotment dates, and listing performance. Your complete guide to Indian IPO market.",
      ogImage: "",
      twitterHandle: "",
    },
  },
  pages: {
    home: {
      title: "IPO Watch 2026 | Live GMP, Subscription & Allotment Status",
      description: "Track live IPO GMP, subscription status, and allotment dates. Get real-time updates on Mainboard and SME IPOs in India.",
      h1: "Live IPO Dashboard",
      subheading: "Real-time GMP, subscription data & allotment updates",
    },
    ipoDetail: {
      title: "{ipo_name} IPO",
      description: "Check {ipo_name} IPO subscription status, allotment date, and financials. Live GMP is ₹{gmp_value}. Listing date is {listing_date}.",
      h1: "{ipo_name} IPO",
      subheading: "Complete IPO details, GMP & subscription status",
      titleTemplate: "{ipo_name} IPO GMP Today: ₹{gmp_value} ({gmp_percent}%) - Live Updates",
      descriptionTemplate: "Check {ipo_name} IPO subscription status, allotment date, and financials. Live GMP is ₹{gmp_value}. Listing date is {listing_date}.",
    },
    mainboard: {
      title: "Mainboard IPO 2026 | Upcoming & Open IPOs",
      description: "Complete list of Mainboard IPOs in 2026. Track open, upcoming, and recently listed Mainboard IPOs with live subscription data.",
      h1: "Mainboard IPO",
      subheading: "All Mainboard IPOs - Open, Upcoming & Listed",
    },
    sme: {
      title: "SME IPO 2026 | NSE & BSE SME IPOs",
      description: "Track all SME IPOs on NSE and BSE. Get live GMP, subscription status, and listing performance for SME segment.",
      h1: "SME IPO",
      subheading: "NSE SME & BSE SME IPO listings",
    },
    gmpTracker: {
      title: "IPO GMP Today | Grey Market Premium Live Updates 2026",
      description: "Live IPO Grey Market Premium (GMP) for all open and upcoming IPOs. Calculate your expected profit with our GMP calculator.",
      h1: "IPO GMP Today",
      subheading: "Live Grey Market Premium with profit calculator",
    },
    allotmentStatus: {
      title: "IPO Allotment Status | Check Your Allotment",
      description: "Check IPO allotment status for recently closed IPOs. Direct links to registrar websites for allotment verification.",
      h1: "IPO Allotment Status",
      subheading: "Check your allotment on registrar websites",
    },
    calendar: {
      title: "IPO Calendar 2026 | Upcoming IPO Schedule",
      description: "Complete IPO calendar with open dates, allotment dates, and listing dates. Plan your IPO investments with our visual calendar.",
      h1: "IPO Calendar",
      subheading: "Upcoming IPO schedule and important dates",
    },
    performance: {
      title: "IPO Listing Performance | Top Gainers & Losers",
      description: "Track IPO listing performance with all-time top gainers and worst performers. Historical data for informed investment decisions.",
      h1: "IPO Listing Performance",
      subheading: "Top gainers and losers from recent listings",
    },
  },
  updatedAt: new Date().toISOString(),
};

// Template variable replacements for dynamic SEO
export interface TemplateVariables {
  ipo_name?: string;
  company_name?: string;
  gmp_value?: string | number;
  gmp_percent?: string | number;
  listing_date?: string;
  open_date?: string;
  close_date?: string;
  issue_price?: string | number;
  subscription_times?: string | number;
}

export function applyTemplate(template: string, variables: TemplateVariables): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value ?? ''));
  });
  return result;
}
