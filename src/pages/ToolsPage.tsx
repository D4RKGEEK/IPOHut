import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPOInvestmentCalculator, IPOComparisonTool, ReturnCalculator } from "@/components/tools";
import { Calculator, GitCompare, TrendingUp } from "lucide-react";

export default function ToolsPage() {
  return (
    <MainLayout>
      <Helmet>
        <title>IPO Tools & Calculators | IPO Watch</title>
        <meta 
          name="description" 
          content="Free IPO calculators and tools - Investment calculator, IPO comparison tool, and return calculator to help you make informed investment decisions." 
        />
      </Helmet>

      <div className="container py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">IPO Tools & Calculators</h1>
          <p className="text-muted-foreground">
            Use our free tools to analyze IPOs, calculate returns, and compare opportunities
          </p>
        </div>

        <Tabs defaultValue="investment" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3 h-auto p-1">
            <TabsTrigger value="investment" className="flex items-center gap-2 py-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Investment</span>
              <span className="sm:hidden">Invest</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2 py-2">
              <GitCompare className="h-4 w-4" />
              <span className="hidden sm:inline">Compare</span>
              <span className="sm:hidden">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="returns" className="flex items-center gap-2 py-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Returns</span>
              <span className="sm:hidden">Returns</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investment">
            <IPOInvestmentCalculator />
          </TabsContent>

          <TabsContent value="compare">
            <IPOComparisonTool />
          </TabsContent>

          <TabsContent value="returns">
            <ReturnCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
