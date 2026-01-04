// Admin Panel Types

export interface SocialLinks {
  twitter: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  telegram: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
  visible: boolean;
}

export interface FooterSettings {
  copyrightText: string;
  disclaimer: string;
  customLinks: FooterLink[];
  sections: FooterSection[];
  showSocialLinks: boolean;
  showContact: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  visible: boolean;
  children?: MenuItem[];
}

export interface NavigationSettings {
  menuItems: MenuItem[];
  showLogo: boolean;
  showSiteName: boolean;
}

export interface HomePageConfig {
  showNewsTicker: boolean;
  showOpenIPOs: boolean;
  showUpcomingIPOs: boolean;
  showRecentlyListed: boolean;
  showGainersLosers: boolean;
  announcementBanner: string;
  announcementEnabled: boolean;
}

// Widget definitions for IPO Detail Page
export type WidgetType = 
  | 'timeline'
  | 'subscription_table'
  | 'key_metrics'
  | 'broker_sentiment'
  | 'basic_info'
  | 'lot_size_table'
  | 'reservation_table'
  | 'objectives'
  | 'financials'
  | 'promoter_holding'
  | 'gmp_calculator'
  | 'about_company'
  | 'contact_registrar'
  | 'faq_section'
  | 'vital_stats'
  | 'gmp_widget'
  | 'market_chart';

export interface WidgetConfig {
  id: WidgetType;
  enabled: boolean;
  order: number;
}

export interface TabConfig {
  id: string;
  label: string;
  enabled: boolean;
  widgets: WidgetConfig[];
}

export interface IPODetailPageConfig {
  // Header
  showLogo: boolean;
  showBadges: boolean;
  showShareButton: boolean;
  showPDFDownload: boolean;
  showAllotmentButton: boolean;
  
  // Sections before tabs (above fold)
  aboveFoldWidgets: WidgetConfig[];
  
  // Tabs configuration
  tabs: TabConfig[];
}

// Widget metadata for admin UI
export const WIDGET_METADATA: Record<WidgetType, { label: string; description: string; icon: string }> = {
  timeline: { label: 'IPO Timeline', description: 'Visual timeline of IPO events', icon: 'Calendar' },
  subscription_table: { label: 'Subscription Table', description: 'Category-wise subscription data', icon: 'Table' },
  key_metrics: { label: 'Key Metrics', description: 'RoNW, P/BV, ROE metrics', icon: 'BarChart3' },
  broker_sentiment: { label: 'Broker Sentiment', description: 'Broker recommendations chart', icon: 'ThumbsUp' },
  basic_info: { label: 'Basic Information', description: 'IPO details like price, lot size', icon: 'Info' },
  lot_size_table: { label: 'Lot Size Table', description: 'Application category lot sizes', icon: 'Table' },
  reservation_table: { label: 'Reservation Table', description: 'Category-wise reservation', icon: 'Users' },
  objectives: { label: 'IPO Objectives', description: 'Use of IPO proceeds', icon: 'Target' },
  financials: { label: 'Company Financials', description: 'Revenue, profit, assets data', icon: 'TrendingUp' },
  promoter_holding: { label: 'Promoter Holding', description: 'Shareholding pattern', icon: 'PieChart' },
  gmp_calculator: { label: 'GMP Calculator', description: 'Profit calculation tool', icon: 'Calculator' },
  about_company: { label: 'About Company', description: 'Company description & highlights', icon: 'Building2' },
  contact_registrar: { label: 'Registrar & Contacts', description: 'Lead managers & registrar info', icon: 'Phone' },
  faq_section: { label: 'FAQ Section', description: 'Common questions about this IPO', icon: 'HelpCircle' },
  vital_stats: { label: 'Vital Stats', description: 'Quick stats grid', icon: 'LayoutGrid' },
  gmp_widget: { label: 'GMP Widget', description: 'Grey market premium display', icon: 'Sparkles' },
  market_chart: { label: 'Market Chart', description: 'Price chart for listed IPOs', icon: 'LineChart' },
};

export interface PageVisibility {
  home: boolean;
  mainboard: boolean;
  sme: boolean;
  gmpTracker: boolean;
  allotmentStatus: boolean;
  calendar: boolean;
  performance: boolean;
  tools: boolean;
}

export interface AnalyticsSettings {
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
  facebookPixelId: string;
}

export interface ThemeSettings {
  primaryColor: string;
  enableDarkMode: boolean;
  defaultTheme: 'light' | 'dark' | 'system';
}

export interface ContentLabels {
  checkAllotmentButton: string;
  viewDetailsButton: string;
  noDataMessage: string;
  loadingMessage: string;
  subscribeButton: string;
}

export interface ApiConfig {
  baseUrl: string;
  cacheMinutes: number;
}

export interface SitemapConfig {
  baseUrl: string;
}

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
  socialLinks: SocialLinks;
  contact: ContactInfo;
  footer: FooterSettings;
  navigation: NavigationSettings;
  analytics: AnalyticsSettings;
  theme: ThemeSettings;
  labels: ContentLabels;
  apiConfig: ApiConfig;
  homePageConfig: HomePageConfig;
  ipoDetailConfig: IPODetailPageConfig;
  pageVisibility: PageVisibility;
  sitemapConfig: SitemapConfig;
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
      siteName: "IPOHut",
      logoUrl: "",
      faviconUrl: "",
      tagline: "Your trusted source for IPO insights",
    },
    scripts: {
      headerScripts: "",
      footerScripts: "",
    },
    defaultSeo: {
      titleSuffix: " | IPOHut 2026",
      defaultDescription: "Track live IPO GMP, subscription status, allotment dates, and listing performance. Your complete guide to Indian IPO market.",
      ogImage: "",
      twitterHandle: "",
    },
    socialLinks: {
      twitter: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      telegram: "",
    },
    contact: {
      email: "",
      phone: "",
      address: "",
    },
    footer: {
      copyrightText: "© {year} {siteName}. All rights reserved.",
      disclaimer: "The information provided is for educational purposes only. Please consult with a SEBI registered investment advisor before making any investment decisions.",
      customLinks: [],
      sections: [
        {
          id: "ipo-types",
          title: "IPO Types",
          visible: true,
          links: [
            { id: "1", label: "Mainboard IPO", url: "/mainboard-ipo" },
            { id: "2", label: "SME IPO", url: "/sme-ipo" },
          ],
        },
        {
          id: "tools-resources",
          title: "Tools & Resources",
          visible: true,
          links: [
            { id: "3", label: "GMP Tracker", url: "/ipo-gmp-today" },
            { id: "4", label: "Allotment Status", url: "/ipo-allotment-status" },
            { id: "5", label: "IPO Calendar", url: "/ipo-calendar" },
            { id: "6", label: "Performance Tracker", url: "/ipo-listing-performance" },
            { id: "7", label: "IPO Calculators", url: "/tools" },
          ],
        },
      ],
      showSocialLinks: true,
      showContact: false,
    },
    navigation: {
      showLogo: true,
      showSiteName: true,
      menuItems: [
        { id: "1", label: "Mainboard", url: "/mainboard-ipo", icon: "TrendingUp", visible: true },
        { id: "2", label: "SME", url: "/sme-ipo", icon: "BarChart3", visible: true },
        { id: "3", label: "GMP Today", url: "/ipo-gmp-today", icon: "Sparkles", visible: true },
        { id: "4", label: "Allotment", url: "/ipo-allotment-status", icon: "CheckCircle", visible: true },
        { id: "5", label: "Calendar", url: "/ipo-calendar", icon: "Calendar", visible: true },
        { id: "6", label: "Performance", url: "/ipo-listing-performance", icon: "BarChart3", visible: true },
        { id: "7", label: "Tools", url: "/tools", icon: "Calculator", visible: true },
      ],
    },
    analytics: {
      googleAnalyticsId: "",
      googleSearchConsoleId: "",
      facebookPixelId: "",
    },
    theme: {
      primaryColor: "hsl(142 76% 36%)",
      enableDarkMode: true,
      defaultTheme: 'system',
    },
    labels: {
      checkAllotmentButton: "Check Allotment",
      viewDetailsButton: "View Details",
      noDataMessage: "No data available",
      loadingMessage: "Loading...",
      subscribeButton: "Apply Now",
    },
    apiConfig: {
      baseUrl: "https://beta.ipowatch.in/api",
      cacheMinutes: 5,
    },
    homePageConfig: {
      showNewsTicker: true,
      showOpenIPOs: true,
      showUpcomingIPOs: true,
      showRecentlyListed: true,
      showGainersLosers: true,
      announcementBanner: "",
      announcementEnabled: false,
    },
    ipoDetailConfig: {
      showLogo: true,
      showBadges: true,
      showShareButton: true,
      showPDFDownload: true,
      showAllotmentButton: true,
      aboveFoldWidgets: [
        { id: 'vital_stats', enabled: true, order: 0 },
        { id: 'gmp_widget', enabled: true, order: 1 },
        { id: 'market_chart', enabled: true, order: 2 },
      ],
      tabs: [
        {
          id: 'overview',
          label: 'Overview',
          enabled: true,
          widgets: [
            { id: 'timeline', enabled: true, order: 0 },
            { id: 'subscription_table', enabled: true, order: 1 },
            { id: 'key_metrics', enabled: true, order: 2 },
            { id: 'broker_sentiment', enabled: true, order: 3 },
          ],
        },
        {
          id: 'subscription',
          label: 'Subscription',
          enabled: true,
          widgets: [
            { id: 'subscription_table', enabled: true, order: 0 },
          ],
        },
        {
          id: 'details',
          label: 'Details',
          enabled: true,
          widgets: [
            { id: 'basic_info', enabled: true, order: 0 },
            { id: 'lot_size_table', enabled: true, order: 1 },
            { id: 'reservation_table', enabled: true, order: 2 },
            { id: 'objectives', enabled: true, order: 3 },
          ],
        },
        {
          id: 'financials',
          label: 'Financials',
          enabled: true,
          widgets: [
            { id: 'financials', enabled: true, order: 0 },
            { id: 'key_metrics', enabled: true, order: 1 },
            { id: 'promoter_holding', enabled: true, order: 2 },
          ],
        },
        {
          id: 'about',
          label: 'About',
          enabled: true,
          widgets: [
            { id: 'about_company', enabled: true, order: 0 },
            { id: 'faq_section', enabled: true, order: 1 },
          ],
        },
        {
          id: 'contacts',
          label: 'Contacts',
          enabled: true,
          widgets: [
            { id: 'contact_registrar', enabled: true, order: 0 },
          ],
        },
        {
          id: 'tools',
          label: 'Tools',
          enabled: true,
          widgets: [
            { id: 'gmp_calculator', enabled: true, order: 0 },
            { id: 'broker_sentiment', enabled: true, order: 1 },
          ],
        },
      ],
    },
    pageVisibility: {
      home: true,
      mainboard: true,
      sme: true,
      gmpTracker: true,
      allotmentStatus: true,
      calendar: true,
      performance: true,
      tools: true,
    },
    sitemapConfig: {
      baseUrl: "https://ipohut.in",
    },
  },
  pages: {
    home: {
      title: "IPOHut 2026 | Live GMP, Subscription & Allotment Status",
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
