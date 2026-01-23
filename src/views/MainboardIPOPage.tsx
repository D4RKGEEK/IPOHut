"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useMainboardIPOs } from "@/hooks/useIPO";
import { IPOTable, IPOTableColumn, IPOTableRow, IPOCard, BreadcrumbNav } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatCurrency } from "@/lib/api";

const tableColumns: IPOTableColumn[] = [
  { key: "name", label: "IPO Name", sortable: true },
  { key: "status", label: "Status" },
  { key: "openDate", label: "Open", hideOnMobile: true },
  { key: "closeDate", label: "Close", hideOnMobile: true },
  { key: "listingDate", label: "Listing", hideOnMobile: true },
  { key: "issuePrice", label: "Price", sortable: true },
  { key: "subscriptionTimes", label: "Subs", sortable: true, hideOnMobile: true },
];

import { IPOStatus, APIResponse } from "@/types/ipo";

interface MainboardIPOPageProps {
  initialData?: APIResponse<IPOStatus[]>;
}

export default function MainboardIPOPage({ initialData }: MainboardIPOPageProps) {
  const router = useRouter();
  const { settings } = useAdmin();
  const { data: queryData, isLoading: queryLoading } = useMainboardIPOs(100);

  const data = initialData || queryData;
  const isLoading = !initialData && queryLoading;
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const pageSettings = settings.pages.mainboard;

  const allData = data?.data || [];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredData = statusFilter === "all"
    ? allData
    : allData.filter(ipo => ipo.status === statusFilter);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tableData: IPOTableRow[] = paginatedData.map(ipo => {
    // Handle GMP possibly being an object or number
    const gmpValue = typeof ipo.gmp === 'object' ? (ipo.gmp as any)?.gmp_value : ipo.gmp;

    // Parse issue_price to extract numeric value (handles "Price Band\n₹67 to ₹70" format)
    const issuePriceValue = typeof ipo.issue_price === 'string'
      ? parseFloat(ipo.issue_price.replace(/[^\d.]/g, "") || "0")
      : ipo.issue_price;

    return {
      slug: ipo.slug,
      name: ipo.name,
      status: ipo.status,
      ipoType: ipo.ipo_type,
      openDate: ipo.open_date,
      closeDate: ipo.close_date,
      listingDate: ipo.listing_date,
      issuePrice: formatCurrency(issuePriceValue),
      gmp: formatCurrency(gmpValue || 0),
      subscriptionTimes: ipo.subscription_times ? `${ipo.subscription_times}x` : "-",
      // Sort keys
      rawValue_issuePrice: issuePriceValue,
      rawValue_gmp: gmpValue || 0,
      rawValue_subscriptionTimes: ipo.subscription_times || 0
    };
  });

  const openCount = allData.filter(i => i.status === "open").length;
  const upcomingCount = allData.filter(i => i.status === "upcoming").length;
  const closedCount = allData.filter(i => i.status === "closed").length;
  const listedCount = allData.filter(i => i.status === "listed").length;

  // Reset page when filter changes
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <MainLayout
      title={pageSettings.title}
      description={pageSettings.description}
    >
      <div className="container py-4 md:py-6 space-y-4">
        <BreadcrumbNav items={[{ label: "Mainboard IPO" }]} />

        {/* Header */}
        <header>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">{pageSettings.h1}</h1>
          <p className="text-sm text-muted-foreground">{pageSettings.subheading}</p>
        </header>

        {/* Tabs for filtering */}
        <Tabs value={statusFilter} onValueChange={handleFilterChange}>
          <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-md grid grid-cols-5 gap-0.5 text-xs">
            <TabsTrigger value="all" className="py-1.5 px-2 data-[state=active]:bg-background">
              All <span className="hidden sm:inline ml-1">({allData.length})</span>
            </TabsTrigger>
            <TabsTrigger value="open" className="py-1.5 px-2 data-[state=active]:bg-background">
              Open <span className="hidden sm:inline ml-1">({openCount})</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="py-1.5 px-2 data-[state=active]:bg-background">
              Soon <span className="hidden sm:inline ml-1">({upcomingCount})</span>
            </TabsTrigger>
            <TabsTrigger value="closed" className="py-1.5 px-2 data-[state=active]:bg-background">
              Closed <span className="hidden sm:inline ml-1">({closedCount})</span>
            </TabsTrigger>
            <TabsTrigger value="listed" className="py-1.5 px-2 data-[state=active]:bg-background">
              Listed <span className="hidden sm:inline ml-1">({listedCount})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-4">
            {isMobile ? (
              // Card layout for mobile
              <div className="grid grid-cols-1 gap-2">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted/50 animate-pulse rounded-md" />
                  ))
                ) : paginatedData.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No IPOs found.
                  </div>
                ) : (
                  paginatedData.map(ipo => {
                    // Parse issue_price to extract numeric value
                    const issuePriceValue = typeof ipo.issue_price === 'string'
                      ? parseFloat(ipo.issue_price.replace(/[^\d.]/g, "") || "0")
                      : ipo.issue_price;

                    return (
                      <IPOCard
                        key={ipo.ipo_id}
                        name={ipo.name}
                        slug={ipo.slug}
                        status={ipo.status}
                        ipoType={ipo.ipo_type}
                        issuePrice={issuePriceValue}
                        gmp={ipo.gmp}
                        gmpPercent={ipo.gmp_percent}
                        subscriptionTimes={ipo.subscription_times}
                        closeDate={ipo.close_date}
                        listingDate={ipo.listing_date}
                      />
                    );
                  })
                )}
              </div>
            ) : (
              // Table layout for desktop
              <IPOTable
                columns={tableColumns}
                data={tableData}
                isLoading={isLoading}
                emptyMessage="No IPOs found"
                onRowClick={(row) => router.push(`/ipo/${row.slug}`)}
              />
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
