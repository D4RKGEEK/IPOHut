import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface BrokerSentimentProps {
  subscribe: number;
  mayApply: number;
  neutral: number;
  avoid: number;
  className?: string;
}

const COLORS = {
  subscribe: "hsl(var(--success))",
  mayApply: "hsl(var(--chart-3))",
  neutral: "hsl(var(--muted-foreground))",
  avoid: "hsl(var(--destructive))",
};

export function BrokerSentiment({ subscribe, mayApply, neutral, avoid, className }: BrokerSentimentProps) {
  const total = subscribe + mayApply + neutral + avoid;
  
  if (total === 0) {
    return null;
  }

  const data = [
    { name: "Subscribe", value: subscribe, color: COLORS.subscribe },
    { name: "May Apply", value: mayApply, color: COLORS.mayApply },
    { name: "Neutral", value: neutral, color: COLORS.neutral },
    { name: "Avoid", value: avoid, color: COLORS.avoid },
  ].filter(d => d.value > 0);

  const positivePercent = ((subscribe + mayApply) / total * 100).toFixed(0);

  return (
    <Card className={cn("border", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Broker Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} brokers`, ""]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-success">{positivePercent}%</div>
          <div className="text-sm text-muted-foreground">
            {subscribe + mayApply} of {total} brokers recommend
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <div className="font-tabular font-medium text-success">{subscribe}</div>
            <div className="text-muted-foreground">Subscribe</div>
          </div>
          <div>
            <div className="font-tabular font-medium text-primary">{mayApply}</div>
            <div className="text-muted-foreground">May Apply</div>
          </div>
          <div>
            <div className="font-tabular font-medium text-muted-foreground">{neutral}</div>
            <div className="text-muted-foreground">Neutral</div>
          </div>
          <div>
            <div className="font-tabular font-medium text-destructive">{avoid}</div>
            <div className="text-muted-foreground">Avoid</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
