"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIData } from "@/types/ipo";
import { Sparkles, TrendingUp, Building2, Lightbulb, AlertTriangle, Star } from "lucide-react";

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
    const [activeTab, setActiveTab] = useState<TabType>('highlights');

    if (!displayData) return null;

    return (
        <Card className="border shadow-sm overflow-hidden">
            {/* Compact Header */}
            <CardHeader className="pb-3 pt-3.5 px-4 border-b bg-gradient-to-r from-blue-50/40 to-indigo-50/40 dark:from-blue-950/10 dark:to-indigo-950/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold">AI Analysis</h3>
                            <p className="text-[10px] text-muted-foreground">Advanced analytics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {displayData.sector && (
                            <Badge variant="outline" className="font-normal text-[10px] h-5 px-1.5">
                                <Building2 className="h-2.5 w-2.5 mr-1" />
                                {displayData.sector}
                            </Badge>
                        )}
                        <Badge variant="secondary" className="text-[9px] h-5 px-1.5 font-normal bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            Beta
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            {/* Compact Tab Navigation */}
            <div className="border-b bg-muted/30">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('highlights')}
                        className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${activeTab === 'highlights'
                                ? 'text-blue-600 dark:text-blue-400 bg-background'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-1.5">
                            <Star className="h-3 w-3" />
                            <span>Highlights</span>
                        </div>
                        {activeTab === 'highlights' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('analysis')}
                        className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${activeTab === 'analysis'
                                ? 'text-blue-600 dark:text-blue-400 bg-background'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-1.5">
                            <Lightbulb className="h-3 w-3" />
                            <span>Analysis</span>
                        </div>
                        {activeTab === 'analysis' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('outlook')}
                        className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${activeTab === 'outlook'
                                ? 'text-blue-600 dark:text-blue-400 bg-background'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-1.5">
                            <TrendingUp className="h-3 w-3" />
                            <span>Outlook</span>
                        </div>
                        {activeTab === 'outlook' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                    </button>
                </div>
            </div>

            <CardContent className="p-4">
                {/* Highlights Tab */}
                {activeTab === 'highlights' && (
                    <div className="space-y-2">
                        {displayData.key_highlights.map((item, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs group">
                                <span className="mt-1 h-1 w-1 rounded-full bg-amber-400 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Analysis Tab - Pros & Cons in compact grid */}
                {activeTab === 'analysis' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Strengths */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                                Strengths
                            </h4>
                            <ul className="space-y-1.5">
                                {displayData.pros.map((item, i) => (
                                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                                        <span className="text-emerald-500 text-sm shrink-0">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Risks */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                <span className="h-1 w-1 rounded-full bg-rose-500"></span>
                                Risks
                            </h4>
                            <ul className="space-y-1.5">
                                {displayData.cons.map((item, i) => (
                                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                                        <span className="text-rose-500 text-sm shrink-0">⚠</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Outlook Tab */}
                {activeTab === 'outlook' && displayData.financial_summary && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 mb-2">
                            <TrendingUp className="h-3 w-3 text-blue-500" />
                            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Financial Outlook
                            </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            {displayData.financial_summary}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
