import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useIPOCalendar } from "@/hooks/useIPO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { parseIPODate } from "@/lib/api";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarEvent {
  date: Date;
  type: "open" | "close" | "listing" | "allotment";
  ipo: {
    name: string;
    slug: string;
  };
}

export default function IPOCalendarPage() {
  const { settings } = useAdmin();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const { data, isLoading } = useIPOCalendar({
    month: currentMonth + 1,
    year: currentYear,
    limit: 100,
  });

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
      <div className="container py-6 md:py-8 space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{pageSettings.h1}</h1>
          <p className="text-muted-foreground">{pageSettings.subheading}</p>
        </header>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>IPO Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>IPO Close</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>Allotment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>Listing</span>
          </div>
        </div>

        {/* Calendar */}
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">
                {MONTHS[currentMonth]} {currentYear}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={goToPrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-24 md:h-28" />;
                }

                const dayEvents = getEventsForDay(day);
                const today = isToday(day);

                return (
                  <div 
                    key={day} 
                    className={cn(
                      "h-24 md:h-28 p-1 border rounded-md overflow-hidden",
                      today && "border-primary bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-1",
                      today && "text-primary"
                    )}>
                      {day}
                    </div>
                    <div className="space-y-0.5 overflow-y-auto max-h-16 md:max-h-20">
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <Link 
                          key={`${event.ipo.slug}-${event.type}-${idx}`}
                          to={`/ipo/${event.ipo.slug}`}
                          className="block"
                        >
                          <div className={cn(
                            "text-[10px] px-1 py-0.5 rounded text-white truncate",
                            getEventColor(event.type)
                          )}>
                            {event.ipo.name.replace(" IPO", "")}
                          </div>
                        </Link>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-muted-foreground px-1">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events List */}
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base">Upcoming Events This Month</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : events.filter(e => e.date >= now).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No upcoming events this month.</p>
            ) : (
              <div className="space-y-2">
                {events
                  .filter(e => e.date >= now)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 10)
                  .map((event, idx) => (
                    <Link 
                      key={`${event.ipo.slug}-${event.type}-${idx}`}
                      to={`/ipo/${event.ipo.slug}`}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className={cn("w-2 h-2 rounded-full", getEventColor(event.type))} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{event.ipo.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {event.type === "open" ? "Opens" : event.type === "close" ? "Closes" : event.type}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
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
