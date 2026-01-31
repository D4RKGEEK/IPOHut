import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";
import { IPOMarketData } from "@/types/ipo";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics } from "@/hooks/useAnalytics";

interface MarketCandlesChartProps {
  marketData: IPOMarketData | Record<string, any>;
  issuePrice?: number;
  ipoSlug?: string;
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type TimeRange = "1D" | "3D" | "7D" | "1M" | "3M" | "ALL";

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: "1D", label: "1D" },
  { value: "3D", label: "3D" },
  { value: "7D", label: "7D" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "ALL", label: "All" },
];

export function MarketCandlesChart({ marketData, issuePrice, ipoSlug }: MarketCandlesChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("7D");

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    analytics.chartPeriodChange(ipoSlug || "unknown", range);
  };

  // Parse all candles from market data
  const allCandles = useMemo(() => {
    let candles: CandleData[] = [];

    if (!marketData) return [];

    // Format 1: IPOMarketData (with candles array at root or in nested object)
    if ('candles' in marketData && Array.isArray(marketData.candles)) {
      candles = marketData.candles;
    }
    // Format 2: Record<string, CandleData> where key is date
    else if (typeof marketData === 'object') {
      const entries = Object.entries(marketData);
      // Check if entries look like date keys with candle data
      const looksLikeDateEntries = entries.every(([key]) => /^\d{4}-\d{2}-\d{2}$/.test(key));

      if (looksLikeDateEntries && entries.length > 0) {
        candles = entries.map(([date, data]) => ({
          time: date,
          open: Number(data.open || 0),
          high: Number(data.high || 0),
          low: Number(data.low || 0),
          close: Number(data.close || 0),
          volume: Number(data.volume || 0),
        }));
      }
      // Format 3: Nested under a date key (older format)
      else {
        const dateKeys = Object.keys(marketData).filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
        if (dateKeys.length > 0) {
          const dateKey = dateKeys[0];
          const dateData = marketData[dateKey];
          if (dateData?.candles && Array.isArray(dateData.candles)) {
            candles = dateData.candles;
          }
        }
      }
    }

    // Sort by time (oldest first)
    return [...candles].sort((a, b) =>
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  }, [marketData]);

  // Filter candles based on selected range
  const filteredCandles = useMemo(() => {
    if (allCandles.length === 0) return [];

    const now = new Date();
    let cutoffDate: Date;

    switch (selectedRange) {
      case "1D":
        cutoffDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
        break;
      case "3D":
        cutoffDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        break;
      case "7D":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "1M":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "3M":
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "ALL":
      default:
        return allCandles;
    }

    const filtered = allCandles.filter(candle => new Date(candle.time) >= cutoffDate);

    // If no filtered data, fallback to ALL to ensure chart is visible
    return filtered.length > 0 ? filtered : allCandles;
  }, [allCandles, selectedRange]);

  // Transform to chart data
  const chartData = useMemo(() => {
    return filteredCandles.map((candle) => ({
      time: new Date(candle.time).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        ...(selectedRange === "1D" ? { hour: '2-digit', minute: '2-digit' } : {})
      }),
      close: candle.close,
      open: candle.open,
      high: candle.high,
      low: candle.low,
    }));
  }, [filteredCandles, selectedRange]);

  if (chartData.length === 0) {
    return null;
  }

  const latestPrice = chartData[chartData.length - 1].close;
  const openPrice = chartData[0].open;
  const priceChange = latestPrice - openPrice;
  const priceChangePercent = openPrice > 0 ? ((priceChange / openPrice) * 100) : 0;
  const isPositive = priceChange >= 0;

  const allHighs = chartData.map(d => d.high);
  const allLows = chartData.map(d => d.low);
  const minPrice = Math.min(...allLows) * 0.99;
  const maxPrice = Math.max(...allHighs) * 1.01;

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-4 border-b bg-muted/20">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base">Price History</CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
              isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            )}>
              {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span className="font-tabular">
                ₹{latestPrice.toFixed(2)}
              </span>
              <span className="font-tabular text-[10px] opacity-80">
                ({isPositive ? '+' : ''}{priceChangePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Time Range Selector */}
        <div className="flex items-center justify-end px-4 py-3 border-b border-border/50">
          <div className="flex p-1 bg-muted rounded-lg">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handleRangeChange(range.value)}
                className={cn(
                  "px-3 py-1 text-[10px] font-medium rounded-md transition-all",
                  selectedRange === range.value
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.4)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                interval="preserveStartEnd"
                minTickGap={30}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value.toFixed(0)}`}
                width={40}
                orientation="left"
                tickCount={6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'close') return [`₹${value.toFixed(2)}`, 'Price'];
                  return [value, name];
                }}
                labelFormatter={(label) => label}
                cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              {issuePrice && (
                <ReferenceLine
                  y={issuePrice}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  label={{
                    value: `Issue: ₹${issuePrice}`,
                    position: 'insideTopLeft',
                    fontSize: 10,
                    fill: 'hsl(var(--muted-foreground))'
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="close"
                stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                strokeWidth={2}
                fill={isPositive ? 'url(#colorGain)' : 'url(#colorLoss)'}
                activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))', stroke: isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Price Summary Grid */}
        <div className="grid grid-cols-3 divide-x border-t mt-4">
          <div className="p-3 text-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Low</div>
            <div className="text-sm font-semibold font-tabular text-destructive">
              ₹{Math.min(...allLows).toFixed(2)}
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">High</div>
            <div className="text-sm font-semibold font-tabular text-success">
              ₹{Math.max(...allHighs).toFixed(2)}
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Issue</div>
            <div className="text-sm font-semibold font-tabular">
              ₹{issuePrice?.toFixed(0) || '—'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
