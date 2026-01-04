import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIPOCalendar } from "@/hooks/useIPO";

export interface SelectedIPO {
  slug: string;
  name: string;
  issuePrice: number;
  lotSize: number;
  gmp?: number;
  gmpPercent?: number;
  subscriptionTimes?: number;
  ipoType: "mainboard" | "sme";
  status: string;
  openDate?: string;
  closeDate?: string;
  listingDate?: string;
  issueSize?: number;
}

interface IPOSelectorProps {
  value?: SelectedIPO | null;
  onSelect: (ipo: SelectedIPO | null) => void;
  placeholder?: string;
  className?: string;
}

export function IPOSelector({ value, onSelect, placeholder = "Select IPO...", className }: IPOSelectorProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useIPOCalendar({ limit: 100 });

  const ipos = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((ipo) => ({
      slug: ipo.slug,
      name: ipo.name,
      issuePrice: ipo.issue_price || 0,
      lotSize: ipo.lot_size || 0,
      gmp: ipo.gmp,
      gmpPercent: ipo.gmp_percent,
      subscriptionTimes: ipo.subscription_times,
      ipoType: ipo.ipo_type,
      status: ipo.status,
      openDate: ipo.open_date,
      closeDate: ipo.close_date,
      listingDate: ipo.listing_date,
      issueSize: ipo.issue_size,
    }));
  }, [data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal", className)}
        >
          {value ? (
            <span className="truncate">{value.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search IPO..." />
          <CommandList>
            <CommandEmpty>No IPO found.</CommandEmpty>
            <CommandGroup>
              {ipos.map((ipo) => (
                <CommandItem
                  key={ipo.slug}
                  value={ipo.name}
                  onSelect={() => {
                    onSelect(ipo);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.slug === ipo.slug ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">{ipo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{ipo.issuePrice} • {ipo.lotSize} shares
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
