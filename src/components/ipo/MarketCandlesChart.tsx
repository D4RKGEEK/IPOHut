import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { IPOMarketData, IPOMarketCandle } from "@/types/ipo";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketCandlesChartProps {
  marketData: IPOMarketData | Record<string, { open: number; high: number; low: number; close: number; volume: number }>;
  issuePrice?: number;
}

export function MarketCandlesChart({ marketData, issuePrice }: MarketCandlesChartProps) {
  // Parse market data - can be candles array or object with time keys
  let chartData: { time: string; close: number; volume: number }[] = [];
  let latestPrice = 0;
  let openPrice = 0;

  if ('candles' in marketData && Array.isArray(marketData.candles)) {
    // New format with candles array
    chartData = marketData.candles.map((candle: IPOMarketCandle) => ({
      time: candle.time,
      close: candle.close,
      volume: candle.volume,
    }));
    if (marketData.summary) {
      latestPrice = marketData.summary.close;
      openPrice = marketData.summary.open;
    }
  } else if (typeof marketData === 'object') {
    // Old format with time as keys
    const entries = Object.entries(marketData)
      .filter(([key]) => key.includes(':')) // Filter only time entries
      .sort(([a], [b]) => a.localeCompare(b));
    
    chartData = entries.map(([time, data]) => ({
      time: time.split(' ')[1] || time, // Extract time part
      close: data.close,
      volume: data.volume,
    }));
    
    if (entries.length > 0) {
      openPrice = entries[0][1].open;
      latestPrice = entries[entries.length - 1][1].close;
    }
  }

  if (chartData.length === 0) {
    return null;
  }

  const priceChange = latestPrice - openPrice;
  const priceChangePercent = openPrice > 0 ? ((priceChange / openPrice) * 100) : 0;
  const isPositive = priceChange >= 0;

  const minPrice = Math.min(...chartData.map(d => d.close)) * 0.995;
  const maxPrice = Math.max(...chartData.map(d => d.close)) * 1.005;

  return (
    <Card className="border">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base">Today's Price Movement</CardTitle>
          <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span className="font-tabular">
              {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[minPrice, maxPrice]}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value.toFixed(0)}`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              {issuePrice && (
                <ReferenceLine 
                  y={issuePrice} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Issue: ₹${issuePrice}`, 
                    position: 'right',
                    fontSize: 10,
                    fill: 'hsl(var(--muted-foreground))'
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="close"
                stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Price Summary */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border">
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-muted-foreground">Open</div>
            <div className="text-xs sm:text-sm font-tabular font-medium">₹{openPrice.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-muted-foreground">High</div>
            <div className="text-xs sm:text-sm font-tabular font-medium text-success">
              ₹{Math.max(...chartData.map(d => d.close)).toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-muted-foreground">Low</div>
            <div className="text-xs sm:text-sm font-tabular font-medium text-destructive">
              ₹{Math.min(...chartData.map(d => d.close)).toFixed(2)}
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
