import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge, TypeBadge } from "./StatusBadge";
import { formatCurrency, formatPercent, formatSubscription, getGainLossClass } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowUpDown, TrendingUp, TrendingDown, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface IPOTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  hideOnMobile?: boolean;
}

export interface IPOTableRow {
  slug: string;
  name: string;
  status?: string | React.ReactNode;
  ipoType?: "mainboard" | "sme" | string;
  openDate?: string | React.ReactNode;
  closeDate?: string | React.ReactNode;
  listingDate?: string | React.ReactNode;
  issuePrice?: number | React.ReactNode;
  gmp?: number | React.ReactNode;
  gmpPercent?: number | React.ReactNode;
  subscriptionTimes?: number | React.ReactNode;
  listingGainPercent?: number | React.ReactNode;
  [key: string]: string | number | boolean | React.ReactNode | undefined | null;
}

interface IPOTableProps {
  columns: IPOTableColumn[];
  data: IPOTableRow[];
  isLoading?: boolean;
  emptyMessage?: string;
  onSort?: (key: string, order: "asc" | "desc") => void;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  onRowClick?: (row: any) => void;
  className?: string;
}

export function IPOTable({
  columns,
  data,
  isLoading,
  emptyMessage = "No data available",
  onSort,
  sortKey: initialSortKey, // Renamed to avoid conflict with local state
  sortOrder: initialSortOrder, // Renamed to avoid conflict with local state
  onRowClick,
  className,
}: IPOTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(initialSortKey || null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialSortOrder || "desc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
      onSort?.(key, newDirection);
    } else {
      setSortKey(key);
      setSortDirection("asc");
      onSort?.(key, "asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;

    // Look for a raw value key first for sorting (e.g. rawValue_gmp instead of gmp element)
    const rawKey = `rawValue_${sortKey}`;
    const valA = a[rawKey] !== undefined ? a[rawKey] : a[sortKey];
    const valB = b[rawKey] !== undefined ? b[rawKey] : b[sortKey];

    if (valA === valB) return 0;

    // Handle null/undefined
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    const result = valA < valB ? -1 : 1;
    return sortDirection === "asc" ? result : -result;
  });

  const renderCell = (row: IPOTableRow, key: string) => {
    // If the value is a React node (and not one of the special handled strings/numbers), render it directly
    if (React.isValidElement(row[key])) {
      return row[key] as React.ReactNode;
    }

    switch (key) {
      case "name":
        const showAllotmentLink = row.status && typeof row.status === 'string' && ["closed", "recently_listed", "listed"].includes(row.status.toLowerCase());
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/ipo/${row.slug}`}
              className="font-medium text-foreground hover:text-primary transition-colors"
              onClick={(e) => onRowClick && e.stopPropagation()}
            >
              {row.name}
            </Link>
            {showAllotmentLink && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/ipo/${row.slug}/allotment`}
                    className="text-primary hover:text-primary/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Check Allotment Status</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      case "status":
        return typeof row.status === 'string' ? <StatusBadge status={row.status} /> : "—";
      case "ipoType":
        return typeof row.ipoType === 'string' && (row.ipoType === "mainboard" || row.ipoType === "sme") ? <TypeBadge type={row.ipoType} /> : "—";
      case "issuePrice":
        return typeof row.issuePrice === 'number' ? <span className="font-tabular">{formatCurrency(row.issuePrice)}</span> : row.issuePrice || "—";
      case "gmp":
        if (typeof row.gmp !== 'number') return row.gmp || "—";
        const isPositive = row.gmp >= 0;
        return (
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-success" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
            <span className={cn("font-tabular", isPositive ? "text-success" : "text-destructive")}>
              {formatCurrency(row.gmp)}
            </span>
          </div>
        );
      case "gmpPercent":
        if (typeof row.gmpPercent !== 'number') return row.gmpPercent || "—";
        return (
          <span className={cn("font-tabular", getGainLossClass(row.gmpPercent))}>
            {formatPercent(row.gmpPercent)}
          </span>
        );
      case "subscriptionTimes":
        return typeof row.subscriptionTimes === 'number' ? <span className="font-tabular">{formatSubscription(row.subscriptionTimes)}</span> : row.subscriptionTimes || "—";
      case "listingGainPercent":
        if (typeof row.listingGainPercent !== 'number') return row.listingGainPercent || "—";
        return (
          <span className={cn("font-tabular font-medium", getGainLossClass(row.listingGainPercent))}>
            {formatPercent(row.listingGainPercent)}
          </span>
        );
      default:
        // Use standard renderer for simple types, otherwise assume it's a node if valid
        return row[key] as React.ReactNode ?? "—";
    }
  };

  if (isLoading) {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={cn(col.hideOnMobile && "hidden md:table-cell")}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={cn(col.hideOnMobile && "hidden md:table-cell")}>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="border rounded-md p-8 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("border rounded-md overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "font-semibold",
                  col.hideOnMobile && "hidden md:table-cell"
                )}
              >
                {col.sortable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                ) : (
                  col.label
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow
              key={row.slug}
              className={cn("table-row-hover", onRowClick && "cursor-pointer")}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={cn(col.hideOnMobile && "hidden md:table-cell")}
                >
                  {renderCell(row, col.key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
