"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AIData } from "@/types/ipo";
import { Sparkles } from "lucide-react";

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

type TabType = 'highlights' | 'analysis' | 'outlook';

export function AIInsightsWidget({ data, showDummyData = false }: AIInsightsWidgetProps) {
    const displayData = showDummyData ? DUMMY_DATA : data;
    if (!displayData) return null;

    // Filter out empty sections
    const hasPros = displayData.pros && displayData.pros.length > 0;
    const hasCons = displayData.cons && displayData.cons.length > 0;

    if (!hasPros && !hasCons) return null;

    return (
        <Card className="border shadow-none bg-accent/5 overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-4 border-b border-border/50 bg-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">AI Analysis</h3>
                        <p className="text-[10px] text-muted-foreground">Key strengths & risks</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 grid gap-6 md:grid-cols-2">
                {/* Strengths */}
                {hasPros && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"></span>
                            Strengths
                        </h4>
                        <ul className="space-y-2">
                            {displayData.pros.map((item, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                                    <span className="text-emerald-500 text-[10px] mt-0.5 shrink-0">●</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Risks */}
                {hasCons && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.4)]"></span>
                            Risks
                        </h4>
                        <ul className="space-y-2">
                            {displayData.cons.map((item, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                                    <span className="text-rose-500 text-[10px] mt-0.5 shrink-0">●</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
