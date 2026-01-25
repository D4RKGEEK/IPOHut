"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout";
import { useIPODetail } from "@/hooks/useIPO";
import { StatusBadge, TypeBadge } from "@/components/shared";
import { parseIPODate } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ExternalLink,
  CheckCircle2,
  Search,
  FileText,
  Globe,
  Smartphone,
  ArrowRight,
  AlertCircle,
  Clock,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { analytics, useScrollTracking, useTimeOnPage } from "@/hooks/useAnalytics";

import { IPODetail, APIResponse } from "@/types/ipo";

interface IPOAllotmentCheckerPageProps {
  initialData?: IPODetail;
}

export default function IPOAllotmentCheckerPage({ initialData }: IPOAllotmentCheckerPageProps) {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: queryData, isLoading, error } = useIPODetail(slug || "", { enabled: !initialData });

  const data = initialData ? { success: true, data: initialData } : queryData;

  // Track page
  useScrollTracking(`allotment-checker-${slug}`);
  useTimeOnPage(`allotment-checker-${slug}`);

  const handleRegistrarClick = (registrarName: string, ipoName: string) => {
    analytics.registrarLinkClick(registrarName, ipoName);
  };

  const handleFAQExpand = (question: string, ipoName: string) => {
    analytics.faqExpand(question, ipoName);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container px-2 sm:px-4 md:px-6 py-4 md:py-8 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <MainLayout title="IPO Not Found">
        <div className="container px-2 sm:px-4 md:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">IPO Not Found</h1>
          <p className="text-muted-foreground mb-6">The IPO you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const ipo = data.data;
  const basicInfo = ipo.basic_info;
  const timeline = ipo.ipo_timeline;
  const registrar = ipo.contact_and_registrar?.ipo_registrar_lead_managers?.registrar;

  const ipoName = basicInfo["IPO Name"] || slug;
  const companyName = ipoName.replace(" IPO", "").replace(" Ltd.", "").replace(" Limited", "");
  const allotmentDate = timeline["Allotment"] || "To be announced";
  const registrarName = registrar?.name || "MUFG Intime India Pvt. Ltd.";
  const registrarWebsite = registrar?.website || "https://ipostatus.mfractiontimelabs.com/";

  // Determine status
  const now = new Date();
  const listingDate = parseIPODate(timeline["Listing"]);
  const closeDate = parseIPODate(timeline["IPO Close"]);
  const openDate = parseIPODate(timeline["IPO Open"]);
  const allotmentDateParsed = parseIPODate(timeline["Allotment"]);

  let status = "upcoming";
  if (listingDate && now > listingDate) status = "listed";
  else if (closeDate && now > closeDate) status = "closed";
  else if (openDate && now >= openDate) status = "open";

  const isAllotmentDone = allotmentDateParsed && now > allotmentDateParsed;

  // Determine registrar portal based on registrar name
  const getRegistrarPortal = () => {
    const name = registrarName.toLowerCase();
    if (name.includes("link intime")) {
      return {
        name: "Link Intime India",
        url: "https://linkintime.co.in/MIPO/Ipoallotment.html",
        panUrl: "https://linkintime.co.in/MIPO/Ipoallotment.html"
      };
    } else if (name.includes("kfin") || name.includes("kfintech")) {
      return {
        name: "KFin Technologies",
        url: "https://kosmic.kfintech.com/ipostatus/",
        panUrl: "https://kosmic.kfintech.com/ipostatus/"
      };
    } else if (name.includes("mufg") || name.includes("bigshare")) {
      return {
        name: "Bigshare Services",
        url: "https://ipo.bigshareonline.com/IPO_Status.html",
        panUrl: "https://ipo.bigshareonline.com/IPO_Status.html"
      };
    } else if (name.includes("skyline")) {
      return {
        name: "Skyline Financial Services",
        url: "https://www.skylinerta.com/ipo-status.php",
        panUrl: "https://www.skylinerta.com/ipo-status.php"
      };
    } else if (name.includes("cameo")) {
      return {
        name: "Cameo Corporate Services",
        url: "https://www.cameoindia.com/ipo/allotment_status.asp",
      };
    }
    return {
      name: registrarName,
      url: registrarWebsite,
      panUrl: registrarWebsite
    };
  };

  const initialRegistrarPortal = getRegistrarPortal();

  // Safeguard against bad URLs (Chittorgarh or empty)
  const registrarPortal = (!initialRegistrarPortal.url || initialRegistrarPortal.url.includes("chittorgarh.com"))
    ? {
      name: registrarName,
      url: "https://www.bseindia.com/investors/appli_check.aspx",
      panUrl: "https://www.bseindia.com/investors/appli_check.aspx"
    }
    : initialRegistrarPortal;

  const pageTitle = `${ipoName} Allotment Status - Check ${companyName} IPO Allotment`;
  const pageDescription = `Check ${ipoName} allotment status online. Step-by-step guide to check ${companyName} IPO allotment using PAN, Application Number, or Demat Account. Allotment date: ${allotmentDate}.`;

  // FAQ data
  const faqs = [
    {
      question: `How to check ${companyName} IPO allotment status?`,
      answer: `You can check ${companyName} IPO allotment status through the registrar's portal (${registrarPortal.name}), BSE website, or NSE website. You'll need either your PAN number, Application Number, or Demat Account Number to check the status.`
    },
    {
      question: `When will ${companyName} IPO allotment be announced?`,
      answer: `The tentative allotment date for ${ipoName} is ${allotmentDate}. The allotment status is usually available by evening on the allotment date.`
    },
    {
      question: `What if I don't get allotment in ${companyName} IPO?`,
      answer: `If you don't receive allotment in ${ipoName}, your application amount will be refunded to your bank account within 1-2 working days after the allotment date. The refund process is automatic.`
    },
    {
      question: `Can I check ${companyName} IPO allotment using PAN?`,
      answer: `Yes, you can check ${ipoName} allotment status using your PAN number on the registrar's website (${registrarPortal.name}), BSE, or NSE portals.`
    },
    {
      question: `How long does it take to credit shares after ${companyName} IPO allotment?`,
      answer: `After successful allotment, shares are credited to your demat account on ${timeline["Credit of Shares"] || "the credit date"}. The shares will be visible in your demat account by end of that day.`
    },
    {
      question: `What is the refund date for ${companyName} IPO?`,
      answer: `The refund initiation date for ${ipoName} is ${timeline["Refund"] || "to be announced"}. Refunds are processed for applicants who did not receive allotment.`
    },
    {
      question: `Who is the registrar for ${companyName} IPO?`,
      answer: `${registrarPortal.name} is the registrar for ${ipoName}. You can check allotment status on their official website.`
    },
    {
      question: `What documents do I need to check ${companyName} IPO allotment?`,
      answer: `To check ${ipoName} allotment, you need any one of the following: PAN Card Number, Application/Bid Number, or your Demat Account Number (DP ID/Client ID).`
    }
  ];

  // JSON-LD structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Check ${ipoName} Allotment Status`,
    "description": pageDescription,
    "step": [
      {
        "@type": "HowToStep",
        "name": "Visit Registrar Website",
        "text": `Go to ${registrarPortal.name} website or BSE/NSE portal`,
        "url": registrarPortal.url
      },
      {
        "@type": "HowToStep",
        "name": "Select IPO",
        "text": `Select ${ipoName} from the dropdown list`
      },
      {
        "@type": "HowToStep",
        "name": "Enter Details",
        "text": "Enter your PAN, Application Number, or Demat Account Number"
      },
      {
        "@type": "HowToStep",
        "name": "Submit and View Status",
        "text": "Click submit to view your allotment status"
      }
    ]
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ipohut.com" },
      { "@type": "ListItem", "position": 2, "name": ipoName, "item": `https://ipohut.com/ipo/${slug}` },
      { "@type": "ListItem", "position": 3, "name": "Allotment Checker", "item": `https://ipohut.com/ipo/${slug}/allotment` }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${companyName} IPO allotment, ${ipoName} allotment status, ${companyName} IPO allotment check, ${ipoName} allotment checker, check ${companyName} IPO allotment online`} />
        <link rel="canonical" href={`https://ipohut.com/ipo/${slug}/allotment`} />
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(howToStructuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbStructuredData)}</script>
      </Helmet>

      <MainLayout>
        <article className="container px-2 sm:px-4 md:px-6 py-4 md:py-8 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/ipo/${slug}`} className="hover:text-foreground transition-colors">{ipoName}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Allotment Checker</span>
          </nav>

          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <TypeBadge type={ipo.ipo_type} />
              <StatusBadge status={status} />
              {isAllotmentDone && (
                <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Allotment Done
                </Badge>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              {ipoName} Allotment Status - Check Online
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Check your {companyName} IPO allotment status online using PAN, Application Number, or Demat Account.
              This step-by-step guide will help you verify if you received shares in the {ipoName}.
            </p>
          </header>

          {/* Quick Status Card */}
          <Card className="border-2 border-primary/20 bg-primary/5 mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Allotment Date</p>
                  <p className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {allotmentDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Registrar</p>
                  <p className="font-semibold">{registrarPortal.name}</p>
                </div>
                <a
                  href={registrarPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button className="w-full sm:w-auto gap-2">
                    Check Allotment Now
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* How to Check Section */}
          <section className="mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              How to Check {companyName} IPO Allotment Status
            </h2>

            <p className="text-muted-foreground mb-6">
              There are three main methods to check your {ipoName} allotment status. Choose the one that's most convenient for you:
            </p>

            {/* Method 1: Registrar Portal */}
            <Card className="mb-4 overflow-hidden">
              <CardHeader className="bg-muted/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">Check via Registrar Portal ({registrarPortal.name})</CardTitle>
                    <CardDescription>Fastest and most reliable method</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">1</span>
                    <div>
                      <p className="font-medium">Visit the Official Registrar Website</p>
                      <a
                        href={registrarPortal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {registrarPortal.url} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">2</span>
                    <p>Select <strong>"{ipoName}"</strong> from the IPO dropdown menu</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">3</span>
                    <p>Choose search type: <strong>PAN</strong>, <strong>Application Number</strong>, or <strong>Demat Account</strong></p>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">4</span>
                    <p>Enter your details and click <strong>Submit</strong></p>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">5</span>
                    <p>View your allotment status - shows number of shares allotted (if any)</p>
                  </li>
                </ol>
                <a
                  href={registrarPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block"
                >
                  <Button variant="outline" className="gap-2">
                    Go to {registrarPortal.name}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Method 2: BSE */}
            <Card className="mb-4 overflow-hidden">
              <CardHeader className="bg-muted/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">Check via BSE Website</CardTitle>
                    <CardDescription>Official stock exchange portal</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">1</span>
                    <div>
                      <p className="font-medium">Visit BSE IPO Status Page</p>
                      <a
                        href="https://www.bseindia.com/investors/appli_check.aspx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        www.bseindia.com/investors/appli_check.aspx <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">2</span>
                    <p>Select issue type: <strong>Equity</strong></p>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">3</span>
                    <p>Select <strong>"{ipoName}"</strong> from the issue name dropdown</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">4</span>
                    <p>Enter your <strong>Application Number</strong> and <strong>PAN</strong></p>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">5</span>
                    <p>Click <strong>Search</strong> to view your status</p>
                  </li>
                </ol>
                <a
                  href="https://www.bseindia.com/investors/appli_check.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block"
                >
                  <Button variant="outline" className="gap-2">
                    Go to BSE Portal
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Method 3: NSE */}
            <Card className="mb-4 overflow-hidden">
              <CardHeader className="bg-muted/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">Check via NSE Website</CardTitle>
                    <CardDescription>National Stock Exchange portal</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">1</span>
                    <div>
                      <p className="font-medium">Visit NSE IPO Status Page</p>
                      <a
                        href="https://www.nseindia.com/products/dynaContent/equities/ipos/ipo_login.jsp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        www.nseindia.com <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">2</span>
                    <p>Enter your <strong>PAN</strong> or <strong>Application Number</strong></p>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">3</span>
                    <p>Complete the captcha verification</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">4</span>
                    <p>Click <strong>Submit</strong> to view allotment details</p>
                  </li>
                </ol>
                <a
                  href="https://www.nseindia.com/products/dynaContent/equities/ipos/ipo_login.jsp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block"
                >
                  <Button variant="outline" className="gap-2">
                    Go to NSE Portal
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </section>

          {/* Important Dates */}
          <section className="mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {companyName} IPO Important Dates
            </h2>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: "IPO Open Date", value: timeline["IPO Open"] || "TBA" },
                    { label: "IPO Close Date", value: timeline["IPO Close"] || "TBA" },
                    { label: "Allotment Date", value: timeline["Allotment"] || "TBA", highlight: true },
                    { label: "Refund Initiation", value: timeline["Refund"] || "TBA" },
                    { label: "Credit to Demat", value: timeline["Credit of Shares"] || "TBA" },
                    { label: "Listing Date", value: timeline["Listing"] || "TBA" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`p-3 rounded-lg ${item.highlight ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}`}
                    >
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className={`font-semibold text-sm ${item.highlight ? 'text-primary' : ''}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Tips Section */}
          <section className="mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Important Tips for Checking Allotment
            </h2>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p>Check allotment status after <strong>6 PM</strong> on the allotment date for best results</p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p>Keep your <strong>PAN number</strong> and <strong>Application number</strong> handy</p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p>If not allotted, your money will be <strong>refunded automatically</strong> within 1-2 working days</p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p>Allotted shares will be credited to your <strong>demat account</strong> on the credit date</p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p>If you don't see your status, wait a few hours and try again - servers may be busy</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* FAQ Section */}
          <section className="mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </h2>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Back to IPO Detail Link */}
          <div className="flex justify-center">
            <Link href={`/ipo/${slug}`}>
              <Button variant="outline" size="lg" className="gap-2">
                <FileText className="h-4 w-4" />
                View Complete {ipoName} Details
              </Button>
            </Link>
          </div>
        </article>
      </MainLayout>
    </>
  );
}
