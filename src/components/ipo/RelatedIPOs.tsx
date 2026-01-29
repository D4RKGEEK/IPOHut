import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, TypeBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import { IPOStatus } from "@/types/ipo";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface RelatedIPOsProps {
    relatedIpos: IPOStatus[];
    title?: string;
}

export function RelatedIPOs({ relatedIpos, title = "Related IPOs" }: RelatedIPOsProps) {
    if (!relatedIpos || !Array.isArray(relatedIpos) || relatedIpos.length === 0) return null;

    return (
        <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                    {String(title)}
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full">
                        {relatedIpos.length} Found
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {relatedIpos.map((ipo) => {
                        if (!ipo) return null;

                        const isPositive = (ipo.gmp ?? 0) >= 0;
                        const ipoName = typeof ipo.name === 'string' ? ipo.name : 'Unknown IPO';
                        const ipoStatus = typeof ipo.status === 'string' ? ipo.status : '—';
                        const ipoType = typeof ipo.ipo_type === 'string' ? ipo.ipo_type : 'mainboard';

                        return (
                            <Link
                                key={ipo.ipo_id || ipo.slug}
                                href={`/ipo/${ipo.slug}`}
                                className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors group"
                            >
                                {/* Logo/Icon placeholder */}
                                <div className="h-10 w-10 rounded-lg border bg-background flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/30 transition-colors shadow-sm">
                                    <span className="text-xs font-bold text-primary/40">
                                        {ipoName.charAt(0)}
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1 space-y-1">
                                    <h4 className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                        {ipoName.replace(' IPO', '')}
                                    </h4>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <StatusBadge status={ipoStatus} className="text-[9px] px-1.5 py-0 h-4" />
                                        <TypeBadge type={ipoType as any} className="text-[9px] px-1.5 py-0 h-4" />
                                    </div>
                                </div>

                                {ipo.gmp !== undefined && ipo.gmp !== null && typeof ipo.gmp !== 'object' && (
                                    <div className="text-right shrink-0">
                                        <div className={cn(
                                            "text-[10px] font-bold font-tabular flex items-center justify-end gap-1",
                                            isPositive ? "text-emerald-600" : "text-rose-600"
                                        )}>
                                            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            ₹{String(ipo.gmp)}
                                        </div>
                                        {ipo.gmp_percent !== undefined && ipo.gmp_percent !== null && typeof ipo.gmp_percent !== 'object' && (
                                            <div className={cn(
                                                "text-[9px] font-medium font-tabular",
                                                isPositive ? "text-emerald-500/80" : "text-rose-500/80"
                                            )}>
                                                {typeof ipo.gmp_percent === 'number' ? ipo.gmp_percent.toFixed(1) : String(ipo.gmp_percent)}%
                                            </div>
                                        )}
                                    </div>
                                )}

                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
