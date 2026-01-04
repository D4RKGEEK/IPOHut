import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPOInvestmentCalculator, IPOComparisonTool, ReturnCalculator } from "@/components/tools";
import { Calculator, GitCompare, TrendingUp, Sparkles } from "lucide-react";

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

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="container relative py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Free Tools
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            IPO Tools & Calculators
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Make smarter investment decisions with our free suite of IPO analysis tools. 
            Calculate returns, compare opportunities, and plan your investments.
          </p>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        <Tabs defaultValue="investment" className="space-y-8">
          <TabsList className="w-full h-auto p-1.5 bg-muted/50 rounded-2xl grid grid-cols-3 gap-1">
            <TabsTrigger 
              value="investment" 
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-soft font-medium transition-all"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Investment</span>
              <span className="sm:hidden">Invest</span>
            </TabsTrigger>
            <TabsTrigger 
              value="compare" 
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-soft font-medium transition-all"
            >
              <GitCompare className="h-4 w-4" />
              <span>Compare</span>
            </TabsTrigger>
            <TabsTrigger 
              value="returns" 
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-soft font-medium transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Returns</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investment" className="animate-fade-in">
            <IPOInvestmentCalculator />
          </TabsContent>

          <TabsContent value="compare" className="animate-fade-in">
            <IPOComparisonTool />
          </TabsContent>

          <TabsContent value="returns" className="animate-fade-in">
            <ReturnCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}