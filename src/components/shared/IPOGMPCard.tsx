import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
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
    subscription?: string;
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
    return (
        <Link href={`/ipo/${slug}`} className="shrink-0 w-48 md:w-auto group block">
            <Card className={cn(
                "card-hover h-full transition-all duration-300",
                index === 0 && showGMP ? "border-orange-500/30 bg-orange-500/5 shadow-sm" : "hover:border-primary/20",
                !showGMP && "border-primary/10"
            )}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        {index !== undefined && showGMP && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                                #{index + 1}
                            </Badge>
                        )}
                        <div className={cn("ml-auto", (!index && !showGMP) && "w-full")}>
                            {ratingScore && ratingScore >= 4 && showGMP && (
                                <Flame className="h-3.5 w-3.5 text-orange-500" />
                            )}
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors h-[2.5em]">
                        {name}
                    </h3>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Price</span>
                            <span className="font-medium text-foreground">
                                {typeof price === 'number' ? formatCurrency(price) : price}
                            </span>
                        </div>

                        {lotSize && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Lot Size</span>
                                <span className="font-medium text-foreground">
                                    {lotSize} Shares
                                </span>
                            </div>
                        )}

                        {showGMP && (
                            <>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">GMP</span>
                                    <span className={cn(
                                        "font-bold",
                                        gmp > 0 ? "text-success" : gmp < 0 ? "text-destructive" : ""
                                    )}>
                                        {formatCurrency(gmp)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Est. %</span>
                                    <span className={cn(
                                        "font-medium",
                                        gmpPercent > 0 ? "text-success" : gmpPercent < 0 ? "text-destructive" : ""
                                    )}>
                                        {gmp > 0 ? "+" : ""}{formatPercent(gmpPercent)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {(closeDate || subscription || openDate) && (
                        <div className={cn(
                            "grid gap-x-2 gap-y-1 pt-2 mt-2 border-t text-[10px]",
                            (openDate && closeDate) ? "grid-cols-2" : "grid-cols-2"
                        )}>
                            {openDate && (
                                <div className={cn(!closeDate && "col-span-2")}>
                                    <div className="text-muted-foreground text-[9px] uppercase tracking-wider">Opens</div>
                                    <div className="font-medium truncate">{openDate}</div>
                                </div>
                            )}
                            {closeDate && (
                                <div className={cn(!openDate && "col-span-2")}>
                                    <div className="text-muted-foreground text-[9px] uppercase tracking-wider">Closes</div>
                                    <div className="font-medium truncate">{closeDate}</div>
                                </div>
                            )}
                            {subscription && (
                                <div className={cn("text-right", (openDate || closeDate) && "col-start-2")}>
                                    <div className="text-muted-foreground text-[9px] uppercase tracking-wider">Subs</div>
                                    <div className="font-medium">{subscription}x</div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
