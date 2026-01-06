"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIData } from "@/types/ipo";
import { Sparkles, TrendingUp, Building2 } from "lucide-react";

interface AIInsightsWidgetProps {
    data?: AIData;
    showDummyData?: boolean;
}

const DUMMY_DATA: AIData = {
    seo_about: "ABC Technologies Limited is an IT services company focused on software development, cloud solutions, and digital transformation. The company serves domestic and international clients across banking, retail, and healthcare sectors. ABC Technologies is coming with its IPO to fund business expansion, strengthen working capital, and invest in new technologies. The IPO aims to support long-term growth as demand for digital solutions continues to rise. With an experienced management team and scalable delivery model, the company is positioned to benefit from increasing IT spending and digital adoption across industries.",
    pros: [
        "Diversified client base",
        "Experienced management team",
        "Scalable business model",
        "Growing revenue trend"
    ],
    cons: [
        "High competition in IT services",
        "Dependence on key clients",
        "Margins sensitive to employee costs"
    ],
    key_highlights: [
        "IPO issue size of ₹120 crore",
        "Funds to be used for expansion and working capital",
        "Focus on IT and digital services",
        "Growing demand in core business segments"
    ],
    financial_summary: "The company has shown steady revenue growth with improving profitability over the last three years.",
    sector: "IT"
};

export function AIInsightsWidget({ data, showDummyData = true }: AIInsightsWidgetProps) {
    const displayData = showDummyData ? DUMMY_DATA : data;

    if (!displayData) return null;

    return (
        <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold">AI Analysis</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">Powered by advanced analytics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {displayData.sector && (
                            <Badge variant="outline" className="font-normal text-xs">
                                <Building2 className="h-3 w-3 mr-1" />
                                {displayData.sector}
                            </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px] h-5 px-2 font-normal bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            Beta
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {/* Two Column Layout for Highlights and Pros/Cons */}
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x">

                    {/* Key Highlights */}
                    <div className="p-5 space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-amber-500"></span>
                            Key Highlights
                        </h4>
                        <ul className="space-y-2.5">
                            {displayData.key_highlights.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm group">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pros & Cons */}
                    <div className="p-5 space-y-5">
                        {/* Strengths */}
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                                <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                                Strengths
                            </h4>
                            <ul className="space-y-2">
                                {displayData.pros.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                                        <span className="text-emerald-500 font-medium shrink-0 mt-0.5">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Risks */}
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-1.5">
                                <span className="h-1 w-1 rounded-full bg-rose-500"></span>
                                Risks
                            </h4>
                            <ul className="space-y-2">
                                {displayData.cons.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                                        <span className="text-rose-500 font-medium shrink-0 mt-0.5">⚠</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Financial Outlook */}
                {displayData.financial_summary && (
                    <div className="p-5 border-t bg-slate-50/50 dark:bg-slate-900/30">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                            Financial Outlook
                        </h4>
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {displayData.financial_summary}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
