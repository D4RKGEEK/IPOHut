import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Flame, Calendar, TrendingUp, Info } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/api";

interface IPOGMPCardProps {
    name: string;
    slug: string;
    price: string | number;
    gmp: number;
    gmpPercent: number;
    estListing?: string | number;
    ratingScore?: number;
    index?: number;
    openDate?: string;
    closeDate?: string;
    subscription?: string | number;
    lotSize?: number | string;
    showGMP?: boolean;
}

export function IPOGMPCard({
    name,
    slug,
    price,
    gmp,
    gmpPercent,
    estListing,
    ratingScore,
    index,
    openDate,
    closeDate,
    subscription,
    lotSize,
    showGMP = true
}: IPOGMPCardProps) {
    const hasPrice = price && price !== "—" && price !== 0;
    const hasGMP = showGMP && gmp !== undefined && gmp !== null && gmp !== 0;
    const hasGmpPercent = showGMP && gmpPercent !== undefined && gmpPercent !== null && gmpPercent !== 0;
    const formattedPrice = typeof price === 'number' ? formatCurrency(price) : (price || "—");
    const formattedSubs = subscription && parseFloat(String(subscription)) > 0
        ? (String(subscription).endsWith('x') ? subscription : `${subscription}x`)
        : null;

    return (
        <Link href={`/ipo/${slug}`} className="shrink-0 w-64 md:w-auto group block">
            <Card className={cn(
                "card-hover h-full transition-all duration-500 border-border/40 shadow-sm overflow-hidden",
                index === 0 ? "border-primary/40 bg-gradient-to-br from-primary/10 via-background to-background" : "hover:border-primary/40 bg-background/50 backdrop-blur-sm",
            )}>
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {index !== undefined && (
                                <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">
                                    #{String(index + 1).padStart(2, '0')}
                                </span>
                            )}
                            {formattedSubs && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[9px] font-bold px-2 py-0">
                                    LIVE
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {ratingScore && ratingScore >= 4 && showGMP && (
                                <div className="p-1 rounded-full bg-orange-500/10">
                                    <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                                </div>
                            )}
                        </div>
                    </div>

                    <h3 className="text-sm md:text-base font-bold mb-5 line-clamp-1 group-hover:text-primary transition-colors leading-tight text-foreground/90">
                        {name.replace(' IPO', '')} <span className="text-primary/40">IPO</span>
                    </h3>

                    {(hasPrice || hasGMP || hasGmpPercent) && (
                        <div className="space-y-2.5 mb-6 p-3 rounded-2xl bg-muted/40 border border-border/50 shadow-inner">
                            {hasPrice && (
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-muted-foreground/80 font-medium">
                                        <Info className="h-3.5 w-3.5" />
                                        <span>Price</span>
                                    </div>
                                    <span className="font-bold text-foreground font-tabular tracking-tight">
                                        {formattedPrice}
                                    </span>
                                </div>
                            )}

                            {hasGMP && (
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-muted-foreground/80 font-medium">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        <span>GMP</span>
                                    </div>
                                    <span className={cn(
                                        "font-bold font-tabular tracking-tight",
                                        gmp > 0 ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {formatCurrency(gmp)}
                                    </span>
                                </div>
                            )}

                            {hasGmpPercent && (
                                <div className="flex items-center justify-between text-xs">
                                    <div className="w-5.5" /> {/* Spacer for icon alignment */}
                                    <span className="text-muted-foreground/60 text-[10px] font-medium mr-auto ml-1.5 uppercase tracking-wider">Est. Gain</span>
                                    <span className={cn(
                                        "font-bold font-tabular tracking-tight",
                                        gmpPercent > 0 ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {formatPercent(gmpPercent)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-[10px]">
                            {openDate && (
                                <div className="space-y-1">
                                    <div className="text-muted-foreground/60 text-[8px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3 text-muted-foreground/40" />
                                        Opens
                                    </div>
                                    <div className="font-bold text-foreground/80">{openDate.replace(/,?\s*\d{4}/, '')}</div>
                                </div>
                            )}
                            {closeDate && (
                                <div className="space-y-1 text-right">
                                    <div className="text-muted-foreground/60 text-[8px] uppercase font-bold tracking-widest flex items-center gap-1.5 justify-end">
                                        Ends
                                        <Calendar className="h-3 w-3 text-muted-foreground/40" />
                                    </div>
                                    <div className="font-bold text-foreground/80">{closeDate.replace(/,?\s*\d{4}/, '')}</div>
                                </div>
                            )}
                        </div>

                        {formattedSubs && (
                            <div className="relative group/subs overflow-hidden flex items-center justify-between bg-primary/10 hover:bg-primary/15 transition-colors px-3 py-2 rounded-xl border border-primary/10">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent w-1/2 -skew-x-12 -translate-x-full group-hover/subs:translate-x-[200%] transition-transform duration-1000" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary/70">Subscription</span>
                                <span className="font-black text-sm text-primary font-tabular">
                                    {formattedSubs}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
