import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { IPOMarketData } from "@/types/ipo";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketCandlesChartProps {
  marketData: IPOMarketData | Record<string, any>;
  issuePrice?: number;
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function MarketCandlesChart({ marketData, issuePrice }: MarketCandlesChartProps) {
  // Parse market data - can be in different formats
  let chartData: { time: string; close: number; open: number; high: number; low: number }[] = [];
  let latestPrice = 0;
  let openPrice = 0;

  // Check if marketData has a date key with candles inside (e.g., "2025-12-31": { candles: [...] })
  const dateKeys = Object.keys(marketData).filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
  
  if (dateKeys.length > 0) {
    // Get the first date key that has candles
    const dateKey = dateKeys[0];
    const dateData = marketData[dateKey];
    
    if (dateData?.candles && Array.isArray(dateData.candles)) {
      // Sort candles by time (oldest first)
      const sortedCandles = [...dateData.candles].sort((a: CandleData, b: CandleData) => 
        new Date(a.time).getTime() - new Date(b.time).getTime()
      );
      
      chartData = sortedCandles.map((candle: CandleData) => ({
        time: new Date(candle.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        close: candle.close,
        open: candle.open,
        high: candle.high,
        low: candle.low,
      }));
      
      if (sortedCandles.length > 0) {
        openPrice = sortedCandles[0].open;
        latestPrice = sortedCandles[sortedCandles.length - 1].close;
      }
    }
  } else if ('candles' in marketData && Array.isArray((marketData as IPOMarketData).candles)) {
    // Direct candles array format
    const candles = (marketData as IPOMarketData).candles;
    chartData = candles.map((candle) => ({
      time: new Date(candle.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      close: candle.close,
      open: candle.open,
      high: candle.high,
      low: candle.low,
    }));
    if ((marketData as IPOMarketData).summary) {
      latestPrice = (marketData as IPOMarketData).summary.close;
      openPrice = (marketData as IPOMarketData).summary.open;
    }
  }

  if (chartData.length === 0) {
    return null;
  }

  const priceChange = latestPrice - openPrice;
  const priceChangePercent = openPrice > 0 ? ((priceChange / openPrice) * 100) : 0;
  const isPositive = priceChange >= 0;

  const minPrice = Math.min(...chartData.map(d => d.close)) * 0.99;
  const maxPrice = Math.max(...chartData.map(d => d.close)) * 1.01;

  return (
    <Card className="border">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm sm:text-base">Price History (Since Listing)</CardTitle>
          <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span className="font-tabular">
              ₹{latestPrice.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(1)}%)
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
        <div className="grid grid-cols-4 gap-1 sm:gap-2 mt-3 pt-3 border-t border-border">
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-muted-foreground">Issue</div>
            <div className="text-xs sm:text-sm font-tabular font-medium">₹{issuePrice?.toFixed(0) || '—'}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-muted-foreground">High</div>
            <div className="text-xs sm:text-sm font-tabular font-medium text-success">
              ₹{Math.max(...chartData.map(d => d.high)).toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-muted-foreground">Low</div>
            <div className="text-xs sm:text-sm font-tabular font-medium text-destructive">
              ₹{Math.min(...chartData.map(d => d.low)).toFixed(2)}
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
