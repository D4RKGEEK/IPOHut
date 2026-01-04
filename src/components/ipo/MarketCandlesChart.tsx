import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
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

    // New format: candles at root level with exchange, isin, date
    if ('candles' in marketData && Array.isArray(marketData.candles)) {
      candles = marketData.candles;
    }
    // Old format: nested under date key like "2025-12-31": { candles: [...] }
    else if (typeof marketData === 'object') {
      const dateKeys = Object.keys(marketData).filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
      if (dateKeys.length > 0) {
        const dateKey = dateKeys[0];
        const dateData = marketData[dateKey];
        if (dateData?.candles && Array.isArray(dateData.candles)) {
          candles = dateData.candles;
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

    return allCandles.filter(candle => new Date(candle.time) >= cutoffDate);
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
    <Card className="border">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm sm:text-base">Price History</CardTitle>
          <div className={cn(
            "flex items-center gap-1 text-xs sm:text-sm font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span className="font-tabular">
              ₹{latestPrice.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(1)}%)
            </span>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-1 mt-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleRangeChange(range.value)}
              className={cn(
                "px-2 py-1 text-[10px] sm:text-xs font-medium rounded-md transition-colors",
                selectedRange === range.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="px-2 sm:px-6">
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[minPrice, maxPrice]}
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value.toFixed(0)}`}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'close') return [`₹${value.toFixed(2)}`, 'Close'];
                  return [value, name];
                }}
                labelFormatter={(label) => label}
              />
              {issuePrice && (
                <ReferenceLine 
                  y={issuePrice} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Issue: ₹${issuePrice}`, 
                    position: 'insideTopRight',
                    fontSize: 9,
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
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Price Summary */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 mt-3 pt-3 border-t border-border">
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-muted-foreground">Issue</div>
            <div className="text-xs sm:text-sm font-tabular font-medium">₹{issuePrice?.toFixed(0) || '—'}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-muted-foreground">High</div>
            <div className="text-xs sm:text-sm font-tabular font-medium text-success">
              ₹{Math.max(...allHighs).toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-muted-foreground">Low</div>
            <div className="text-xs sm:text-sm font-tabular font-medium text-destructive">
              ₹{Math.min(...allLows).toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-muted-foreground">Current</div>
            <div className="text-xs sm:text-sm font-tabular font-medium">₹{latestPrice.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
