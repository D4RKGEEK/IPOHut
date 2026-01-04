import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useClosedIPOs } from "@/hooks/useIPO";
import { StatusBadge, TypeBadge } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Search, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AllotmentStatusPage() {
  const { settings } = useAdmin();
  const { data, isLoading } = useClosedIPOs(50);

  const pageSettings = settings.pages.allotmentStatus;
  const closedIPOs = data?.data || [];

  return (
    <MainLayout 
      title={pageSettings.title}
      description={pageSettings.description}
    >
      <div className="container py-6 md:py-8 space-y-6">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{pageSettings.h1}</h1>
          <p className="text-muted-foreground">{pageSettings.subheading}</p>
        </header>

        {/* Info Box */}
        <Card className="border bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1">How to Check Allotment Status</h3>
              <p className="text-sm text-muted-foreground">
                Click on "Check Allotment" for the IPO you applied to. You'll be redirected to the registrar's website 
                where you can enter your PAN or Application Number to view your allotment status.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* IPO List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border">
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : closedIPOs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No closed IPOs pending allotment at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closedIPOs.map(ipo => (
              <Card key={ipo.ipo_id} className="border card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Link to={`/ipo/${ipo.slug}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                      {ipo.name}
                    </Link>
                    <StatusBadge status={ipo.status} />
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <TypeBadge type={ipo.ipo_type} />
                    <span className="text-xs text-muted-foreground">
                      Closed: {ipo.close_date}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Listing Date</span>
                      <span className="font-medium">{ipo.listing_date || "TBA"}</span>
                    </div>
                    {ipo.subscription_times && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subscription</span>
                        <span className="font-tabular font-medium text-primary">
                          {ipo.subscription_times.toFixed(2)}x
                        </span>
                      </div>
                    )}
                  </div>

                  {/* This would normally link to the registrar from API data */}
                  <Button variant="outline" className="w-full" asChild>
                    <a 
                      href="https://www.linkintime.co.in/MIPO/Ipoallotment.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Check Allotment
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Registrar List */}
        <Card className="border mt-8">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Popular IPO Registrars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a 
                href="https://www.linkintime.co.in/MIPO/Ipoallotment.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-md border hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Link Intime</span>
              </a>
              <a 
                href="https://kosmic.kfintech.com/ipostatus/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-md border hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">KFin Tech</span>
              </a>
              <a 
                href="https://www.bseindia.com/investors/appli_check.aspx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-md border hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">BSE India</span>
              </a>
              <a 
                href="https://www.bigshare.co.in/ipo_allotment_new.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-md border hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Bigshare</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
