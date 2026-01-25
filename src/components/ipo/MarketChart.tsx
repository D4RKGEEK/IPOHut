import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { IPOMarketData, IPOMarketCandle } from "@/types/ipo";
import { format, subDays, subMonths } from "date-fns";

interface MarketChartProps {
    marketData?: IPOMarketData | Record<string, { open: number; high: number; low: number; close: number; volume: number }>;
    ipoName: string;
}

type TimePeriod = "1d" | "7d" | "15d" | "1m" | "3m" | "6m" | "1y";

export function MarketChart({ marketData, ipoName }: MarketChartProps) {
    const [period, setPeriod] = useState<TimePeriod>("1m");

    if (!marketData) return null;

    // Check if it's the new format (IPOMarketData) or old format
    const isNewFormat = "candles" in marketData;

    if (!isNewFormat) {
        // Old format - just display message
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Price History</CardTitle>
                    <CardDescription className="text-xs">Market data not available</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const data = marketData as IPOMarketData;
    const candles = data.candles || [];

    if (candles.length === 0) {
        return null;
    }

    // Filter data based on selected period
    const filterByPeriod = (candles: IPOMarketCandle[], period: TimePeriod) => {
        if (candles.length === 0) return [];

        const now = new Date();
        let cutoffDate: Date;

        switch (period) {
            case "1d":
                cutoffDate = subDays(now, 1);
                break;
            case "7d":
                cutoffDate = subDays(now, 7);
                break;
            case "15d":
                cutoffDate = subDays(now, 15);
                break;
            case "1m":
                cutoffDate = subMonths(now, 1);
                break;
            case "3m":
                cutoffDate = subMonths(now, 3);
                break;
            case "6m":
                cutoffDate = subMonths(now, 6);
                break;
            case "1y":
                cutoffDate = subMonths(now, 12);
                break;
            default:
                cutoffDate = subMonths(now, 1);
        }

        const filtered = candles.filter(candle => {
            const candleDate = new Date(candle.time);
            return candleDate >= cutoffDate;
        });

        // If no data in the period, return all data to prevent empty chart
        return filtered.length > 0 ? filtered : candles;
    };

    const filteredCandles = filterByPeriod(candles, period);

    // Transform data for chart
    const chartData = filteredCandles.map(candle => ({
        time: format(new Date(candle.time), "MMM dd"),
        price: candle.close,
        date: new Date(candle.time),
    }));

    // Determine color based on first vs last price
    const firstPrice = chartData[0]?.price || 0;
    const lastPrice = chartData[chartData.length - 1]?.price || 0;
    const isPositive = lastPrice >= firstPrice;
    const lineColor = isPositive ? "#10b981" : "#ef4444";

    // Format last updated
    const lastUpdated = data.summary?.updated_at
        ? format(new Date(data.summary.updated_at), "MMM dd, yyyy • hh:mm a")
        : format(new Date(), "MMM dd, yyyy");

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base">Price History</CardTitle>
                        <CardDescription className="text-xs mt-1">
                            Last updated: {lastUpdated}
                        </CardDescription>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                        {(["1d", "7d", "15d", "1m", "3m", "6m", "1y"] as TimePeriod[]).map((p) => (
                            <Button
                                key={p}
                                variant={period === p ? "default" : "ghost"}
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setPeriod(p)}
                            >
                                {p.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.4)" />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                            minTickGap={40}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={false}
                            domain={["dataMin - 5", "dataMax + 5"]}
                            width={45}
                            tickCount={6}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "12px",
                            }}
                            labelStyle={{ color: "#94a3b8" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
