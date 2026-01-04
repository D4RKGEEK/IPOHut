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
          content="Free IPO calculators and tools - Investment calculator, IPO comparison tool, and return calculator." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="border-b">
        <div className="container py-5 md:py-8">
          <h1 className="text-xl md:text-2xl font-semibold mb-1">
            IPO Tools & Calculators
          </h1>
          <p className="text-sm text-muted-foreground">
            Calculate returns, compare opportunities, and plan investments.
          </p>
        </div>
      </section>

      <div className="container py-4 md:py-6">
        <Tabs defaultValue="investment" className="space-y-4">
          <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-md grid grid-cols-3 gap-0.5">
            <TabsTrigger 
              value="investment" 
              className="flex items-center justify-center gap-1.5 py-2 text-xs md:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Calculator className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Investment</span>
              <span className="sm:hidden">Invest</span>
            </TabsTrigger>
            <TabsTrigger 
              value="compare" 
              className="flex items-center justify-center gap-1.5 py-2 text-xs md:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span>Compare</span>
            </TabsTrigger>
            <TabsTrigger 
              value="returns" 
              className="flex items-center justify-center gap-1.5 py-2 text-xs md:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Returns</span>
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
