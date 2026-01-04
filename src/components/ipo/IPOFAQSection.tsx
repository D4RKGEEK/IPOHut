import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { IPOBasicInfo, IPOTimeline } from "@/types/ipo";
import { analytics } from "@/hooks/useAnalytics";

interface IPOFAQSectionProps {
  ipoName: string;
  basicInfo: IPOBasicInfo;
  timeline: IPOTimeline;
  gmpValue?: number;
  issuePrice?: number;
  registrarName?: string;
  slug: string;
}

export function IPOFAQSection({ 
  ipoName, 
  basicInfo, 
  timeline, 
  gmpValue = 0, 
  issuePrice = 0,
  registrarName = "Registrar",
  slug 
}: IPOFAQSectionProps) {
  const companyName = ipoName.replace(" IPO", "").replace(" Ltd.", "").replace(" Limited", "");

  const handleFAQExpand = (question: string) => {
    analytics.faqExpand(question, ipoName);
  };

  const faqs = [
    {
      question: `What is the GMP of ${ipoName}?`,
      answer: `The current Grey Market Premium (GMP) of ${ipoName} is ₹${gmpValue}. ${
        issuePrice > 0 
          ? `This indicates an expected listing gain of ${((gmpValue / issuePrice) * 100).toFixed(2)}% over the issue price of ₹${issuePrice}.`
          : ""
      }`
    },
    {
      question: `When is the ${ipoName} allotment date?`,
      answer: `The tentative allotment date for ${ipoName} is ${timeline["Tentative Allotment"] || "to be announced"}. You can check your allotment status on the registrar's website after this date.`
    },
    {
      question: `What is the lot size of ${ipoName}?`,
      answer: `The lot size of ${ipoName} is ${basicInfo["Lot Size"] || "to be announced"}. This is the minimum number of shares you can apply for.`
    },
    {
      question: `What is the issue price of ${ipoName}?`,
      answer: `The issue price of ${ipoName} is ${basicInfo["Issue Price"] || basicInfo["Price Band"] || "to be announced"}.`
    },
    {
      question: `When is the ${ipoName} listing date?`,
      answer: `${ipoName} is expected to list on ${timeline["Tentative Listing Date"] || "a date to be announced"} on ${basicInfo["Listing At"] || "BSE and NSE"}.`
    },
    {
      question: `How to apply for ${ipoName}?`,
      answer: `You can apply for ${ipoName} through your bank's netbanking (ASBA), UPI (using apps like Google Pay, PhonePe, Paytm), or through your broker's trading platform. The IPO was open from ${timeline["IPO Open Date"] || "TBA"} to ${timeline["IPO Close Date"] || "TBA"}.`
    },
    {
      question: `How to check ${ipoName} allotment status?`,
      answer: `You can check ${ipoName} allotment status on the registrar's website (${registrarName}), BSE website, or NSE website using your PAN, Application Number, or Demat Account Number.`
    },
    {
      question: `What is the total issue size of ${ipoName}?`,
      answer: `The total issue size of ${ipoName} is ${basicInfo["Total Issue Size"] || "to be announced"}.`
    }
  ];

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" onValueChange={(value) => {
          if (value) {
            const index = parseInt(value.replace("item-", ""));
            if (faqs[index]) handleFAQExpand(faqs[index].question);
          }
        }}>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-xs sm:text-sm hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
