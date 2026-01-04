"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useIPOCalendar } from "@/hooks/useIPO";
import { BreadcrumbNav } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { parseIPODate } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarEvent {
  date: Date;
  type: "open" | "close" | "listing" | "allotment";
  ipo: {
    name: string;
    slug: string;
  };
}

import { IPOCalendar, APIResponse } from "@/types/ipo";

interface IPOCalendarPageProps {
  initialData?: APIResponse<IPOCalendar[]>;
}

export default function IPOCalendarPage({ initialData }: IPOCalendarPageProps) {
  const { settings } = useAdmin();
  const isMobile = useIsMobile();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  // Check if current view is within the "server fetched" range (approx last 12 months)
  // Server fetches [Now, Now-1 year]
  const isCovered = () => {
    if (!initialData) return false;
    const targetDate = new Date(currentYear, currentMonth, 1);
    const serverNow = new Date(); // Approximation
    const oneYearAgo = new Date(serverNow.getFullYear() - 1, serverNow.getMonth(), 1);

    // Reset times
    targetDate.setHours(0, 0, 0, 0);
    serverNow.setHours(0, 0, 0, 0);
    oneYearAgo.setHours(0, 0, 0, 0);

    // We cover if target is <= now (future covered by query?) AND target >= oneYearAgo
    // Wait, typical use case: User looks at current month or past.
    // Server fetch logic: `for (let i = 0; i < 12; i++)` -> Now back to Now-11.
    // So future months (Next month) are NOT covered.

    // Simplify: If target is in the past 12 months window.
    // Check if target matches any month in the server response range? 
    // Easier: Just check date bounds.
    return targetDate <= serverNow && targetDate >= oneYearAgo;
  };

  const shouldUseInitial = isCovered();

  const { data: queryData, isLoading: queryLoading } = useIPOCalendar({
    month: currentMonth + 1,
    year: currentYear,
    limit: 100,
  }, {
    enabled: !shouldUseInitial
  });

  const data = shouldUseInitial ? initialData : queryData;
  const isLoading = !shouldUseInitial && queryLoading;

  const pageSettings = settings.pages.calendar;
  const ipos = data?.data || [];

  // Build events from IPO data
  const events: CalendarEvent[] = [];
  ipos.forEach(ipo => {
    const openDate = parseIPODate(ipo.open_date);
    const closeDate = parseIPODate(ipo.close_date);
    const listingDate = parseIPODate(ipo.listing_date);
    const allotmentDate = parseIPODate(ipo.allotment_date);

    if (openDate) events.push({ date: openDate, type: "open", ipo: { name: ipo.name, slug: ipo.slug } });
    if (closeDate) events.push({ date: closeDate, type: "close", ipo: { name: ipo.name, slug: ipo.slug } });
    if (listingDate) events.push({ date: listingDate, type: "listing", ipo: { name: ipo.name, slug: ipo.slug } });
    if (allotmentDate) events.push({ date: allotmentDate, type: "allotment", ipo: { name: ipo.name, slug: ipo.slug } });
  });

  // Get first day of month and total days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Navigation
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter(event =>
      event.date.getDate() === day &&
      event.date.getMonth() === currentMonth &&
      event.date.getFullYear() === currentYear
    );
  };

  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getEventColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "open": return "bg-primary";
      case "close": return "bg-destructive";
      case "listing": return "bg-success";
      case "allotment": return "bg-warning";
    }
  };

  const isToday = (day: number) => {
    return day === now.getDate() &&
      currentMonth === now.getMonth() &&
      currentYear === now.getFullYear();
  };

  return (
    <MainLayout
      title={pageSettings.title}
      description={pageSettings.description}
    >
      <div className="container py-4 md:py-6 space-y-4">
        <BreadcrumbNav items={[{ label: "IPO Calendar" }]} />

        {/* Header */}
        <header>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">{pageSettings.h1}</h1>
          <p className="text-sm text-muted-foreground">{pageSettings.subheading}</p>
        </header>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Open</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span>Close</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span>Allotment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>Listing</span>
          </div>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 border-b">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm md:text-base font-medium">
                {MONTHS[currentMonth]} {currentYear}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={goToToday} className="h-7 text-xs hidden sm:inline-flex">
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={goToPrevMonth} className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-7 w-7">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {(isMobile ? WEEKDAYS : WEEKDAYS_FULL).map((day, i) => (
                <div key={i} className="text-center text-[10px] md:text-xs text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-12 md:h-20" />;
                }

                const dayEvents = getEventsForDay(day);
                const today = isToday(day);

                return (
                  <div
                    key={day}
                    className={cn(
                      "h-12 md:h-20 p-0.5 md:p-1 border rounded overflow-hidden",
                      today && "border-primary bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "text-[10px] md:text-xs mb-0.5",
                      today && "text-primary font-medium"
                    )}>
                      {day}
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      {/* Mobile: just show dots */}
                      {isMobile ? (
                        dayEvents.length > 0 && (
                          <div className="flex gap-0.5 flex-wrap">
                            {dayEvents.slice(0, 4).map((event, idx) => (
                              <div
                                key={idx}
                                className={cn("w-1.5 h-1.5 rounded-full", getEventColor(event.type))}
                              />
                            ))}
                          </div>
                        )
                      ) : (
                        <>
                          {dayEvents.slice(0, 2).map((event, idx) => (
                            <Link
                              key={`${event.ipo.slug}-${event.type}-${idx}`}
                              href={`/ipo/${event.ipo.slug}`}
                              className="block"
                            >
                              <div className={cn(
                                "text-[8px] px-1 py-0.5 rounded text-white truncate",
                                getEventColor(event.type)
                              )}>
                                {event.ipo.name.replace(" IPO", "")}
                              </div>
                            </Link>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[8px] text-muted-foreground px-0.5">
                              +{dayEvents.length - 2}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events List */}
        <Card>
          <CardHeader className="p-3 md:p-4 border-b">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-3 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted/50 animate-pulse rounded" />
                ))}
              </div>
            ) : events.filter(e => e.date >= now).length === 0 ? (
              <p className="text-muted-foreground text-center text-sm p-6">No upcoming events.</p>
            ) : (
              <div className="divide-y">
                {events
                  .filter(e => e.date >= now)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 8)
                  .map((event, idx) => (
                    <Link
                      key={`${event.ipo.slug}-${event.type}-${idx}`}
                      href={`/ipo/${event.ipo.slug}`}
                      className="flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", getEventColor(event.type))} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{event.ipo.name}</div>
                        <div className="text-[10px] text-muted-foreground capitalize">
                          {event.type === "open" ? "Opens" : event.type === "close" ? "Closes" : event.type}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0">
                        {event.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
