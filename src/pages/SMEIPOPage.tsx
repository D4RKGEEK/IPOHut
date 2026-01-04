import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useSMEIPOs } from "@/hooks/useIPO";
import { IPOTable, IPOTableColumn, IPOTableRow, IPOCard } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const tableColumns: IPOTableColumn[] = [
  { key: "name", label: "IPO Name", sortable: true },
  { key: "status", label: "Status" },
  { key: "openDate", label: "Open Date", hideOnMobile: true },
  { key: "closeDate", label: "Close Date", hideOnMobile: true },
  { key: "listingDate", label: "Listing Date", hideOnMobile: true },
  { key: "issuePrice", label: "Price", sortable: true },
  { key: "gmp", label: "GMP", sortable: true },
  { key: "subscriptionTimes", label: "Subscription", sortable: true, hideOnMobile: true },
];

export default function SMEIPOPage() {
  const { settings } = useAdmin();
  const { data, isLoading } = useSMEIPOs(100);
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const pageSettings = settings.pages.sme;

  const allData = data?.data || [];
  
  const filteredData = statusFilter === "all" 
    ? allData 
    : allData.filter(ipo => ipo.status === statusFilter);

  const tableData: IPOTableRow[] = filteredData.map(ipo => ({
    slug: ipo.slug,
    name: ipo.name,
    status: ipo.status,
    ipoType: ipo.ipo_type,
    openDate: ipo.open_date,
    closeDate: ipo.close_date,
    listingDate: ipo.listing_date,
    issuePrice: ipo.issue_price,
    gmp: ipo.gmp,
    gmpPercent: ipo.gmp_percent,
    subscriptionTimes: ipo.subscription_times,
  }));

  const openCount = allData.filter(i => i.status === "open").length;
  const upcomingCount = allData.filter(i => i.status === "upcoming").length;
  const closedCount = allData.filter(i => i.status === "closed").length;
  const listedCount = allData.filter(i => i.status === "listed").length;

  return (
    <MainLayout 
      title={pageSettings.title}
      description={pageSettings.description}
    >
      <div className="container py-6 md:py-8 space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{pageSettings.h1}</h1>
          <p className="text-muted-foreground">{pageSettings.subheading}</p>
        </header>

        {/* Tabs for filtering */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="all">All ({allData.length})</TabsTrigger>
            <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingCount})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedCount})</TabsTrigger>
            <TabsTrigger value="listed">Listed ({listedCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-6">
            {isMobile ? (
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="h-40 bg-muted animate-pulse rounded-md" />
                  ))
                ) : filteredData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No IPOs found in this category.
                  </div>
                ) : (
                  filteredData.map(ipo => (
                    <IPOCard
                      key={ipo.ipo_id}
                      name={ipo.name}
                      slug={ipo.slug}
                      status={ipo.status}
                      ipoType={ipo.ipo_type}
                      issuePrice={ipo.issue_price}
                      gmp={ipo.gmp}
                      gmpPercent={ipo.gmp_percent}
                      subscriptionTimes={ipo.subscription_times}
                      closeDate={ipo.close_date}
                      listingDate={ipo.listing_date}
                    />
                  ))
                )}
              </div>
            ) : (
              <IPOTable
                columns={tableColumns}
                data={tableData}
                isLoading={isLoading}
                emptyMessage="No IPOs found in this category"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
