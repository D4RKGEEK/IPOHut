"use client";

import { MainLayout } from "@/components/layout";

import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { StatusBadge, TypeBadge, BreadcrumbNav } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Search, CheckCircle } from "lucide-react";
import Link from "next/link";

import { IPOStatus, APIResponse } from "@/types/ipo";

interface AllotmentStatusPageProps {
  initialData?: APIResponse<IPOStatus[]>;
}

export default function AllotmentStatusPage({ initialData }: AllotmentStatusPageProps) {
  const { settings } = useAdmin();
  const data = initialData;
  const isLoading = false;

  const pageSettings = settings.pages.allotmentStatus;
  const closedIPOs = data?.data || [];

  return (
    <MainLayout
      title={pageSettings.title}
      description={pageSettings.description}
    >
      <div className="container py-4 md:py-6 space-y-4">
        <BreadcrumbNav items={[{ label: "Allotment Status" }]} />

        {/* Header */}
        <header className="text-center max-w-xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold mb-1">{pageSettings.h1}</h1>
          <p className="text-sm text-muted-foreground">{pageSettings.subheading}</p>
        </header>

        {/* Info Box */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Click "Check Allotment" to visit the registrar's website. Enter your PAN or Application Number to view status.
            </p>
          </CardContent>
        </Card>

        {/* IPO List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : closedIPOs.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No closed IPOs pending allotment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {closedIPOs.map(ipo => (
              <Card key={ipo.ipo_id} className="card-hover">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link href={`/ipo/${ipo.slug}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                      {ipo.name}
                    </Link>
                    <StatusBadge status={ipo.status} />
                  </div>

                  <div className="flex items-center gap-1.5 mb-3">
                    <TypeBadge type={ipo.ipo_type} />
                    <span className="text-[10px] text-muted-foreground">
                      Closed: {ipo.close_date}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Listing</span>
                      <span>{ipo.listing_date || "TBA"}</span>
                    </div>
                    {ipo.subscription_times && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subscription</span>
                        <span className="font-tabular text-primary">
                          {typeof ipo.subscription_times === 'number'
                            ? ipo.subscription_times.toFixed(2)
                            : ipo.subscription_times}x
                        </span>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full h-8 text-xs" asChild>
                    <a
                      href="https://www.linkintime.co.in/MIPO/Ipoallotment.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Check Allotment
                      <ExternalLink className="ml-1.5 h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Registrar List */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-3">IPO Registrars</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <a
                href="https://www.linkintime.co.in/MIPO/Ipoallotment.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md border text-xs hover:bg-muted/50 transition-colors"
              >
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                Link Intime
              </a>
              <a
                href="https://kosmic.kfintech.com/ipostatus/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md border text-xs hover:bg-muted/50 transition-colors"
              >
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                KFin Tech
              </a>
              <a
                href="https://www.bseindia.com/investors/appli_check.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md border text-xs hover:bg-muted/50 transition-colors"
              >
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                BSE India
              </a>
              <a
                href="https://www.bigshare.co.in/ipo_allotment_new.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md border text-xs hover:bg-muted/50 transition-colors"
              >
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                Bigshare
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
