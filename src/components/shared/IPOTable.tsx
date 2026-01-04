import { Link } from "react-router-dom";
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
import { useState } from "react";
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
  status?: string;
  ipoType?: "mainboard" | "sme";
  openDate?: string;
  closeDate?: string;
  listingDate?: string;
  issuePrice?: number;
  gmp?: number;
  gmpPercent?: number;
  subscriptionTimes?: number;
  listingGainPercent?: number;
  [key: string]: string | number | undefined;
}

interface IPOTableProps {
  columns: IPOTableColumn[];
  data: IPOTableRow[];
  isLoading?: boolean;
  emptyMessage?: string;
  onSort?: (key: string, order: "asc" | "desc") => void;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
}

export function IPOTable({
  columns,
  data,
  isLoading,
  emptyMessage = "No IPOs found",
  onSort,
  sortKey,
  sortOrder,
}: IPOTableProps) {
  const [localSortKey, setLocalSortKey] = useState<string | undefined>(sortKey);
  const [localSortOrder, setLocalSortOrder] = useState<"asc" | "desc">(sortOrder || "desc");

  const handleSort = (key: string) => {
    const newOrder = localSortKey === key && localSortOrder === "desc" ? "asc" : "desc";
    setLocalSortKey(key);
    setLocalSortOrder(newOrder);
    onSort?.(key, newOrder);
  };

  const renderCell = (row: IPOTableRow, key: string) => {
    switch (key) {
      case "name":
        const showAllotmentLink = row.status && ["closed", "recently_listed", "listed"].includes(row.status.toLowerCase());
        return (
          <div className="flex items-center gap-2">
            <Link 
              to={`/ipo/${row.slug}`} 
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              {row.name}
            </Link>
            {showAllotmentLink && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to={`/ipo/${row.slug}/allotment`}
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
        return row.status ? <StatusBadge status={row.status} /> : "—";
      case "ipoType":
        return row.ipoType ? <TypeBadge type={row.ipoType} /> : "—";
      case "issuePrice":
        return <span className="font-tabular">{formatCurrency(row.issuePrice)}</span>;
      case "gmp":
        if (row.gmp === undefined) return "—";
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
        if (row.gmpPercent === undefined) return "—";
        return (
          <span className={cn("font-tabular", getGainLossClass(row.gmpPercent))}>
            {formatPercent(row.gmpPercent)}
          </span>
        );
      case "subscriptionTimes":
        return <span className="font-tabular">{formatSubscription(row.subscriptionTimes)}</span>;
      case "listingGainPercent":
        if (row.listingGainPercent === undefined) return "—";
        return (
          <span className={cn("font-tabular font-medium", getGainLossClass(row.listingGainPercent))}>
            {formatPercent(row.listingGainPercent)}
          </span>
        );
      default:
        return row[key] ?? "—";
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
    <div className="border rounded-md overflow-hidden">
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
                {col.sortable && onSort ? (
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
          {data.map((row) => (
            <TableRow key={row.slug} className="table-row-hover">
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
