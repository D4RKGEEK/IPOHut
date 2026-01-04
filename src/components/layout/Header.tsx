import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Menu, X, TrendingUp, Calendar, BarChart3, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/mainboard-ipo", label: "Mainboard", icon: TrendingUp },
  { href: "/sme-ipo", label: "SME", icon: BarChart3 },
  { href: "/ipo-gmp-today", label: "GMP Today", icon: TrendingUp },
  { href: "/ipo-allotment-status", label: "Allotment", icon: CheckCircle },
  { href: "/ipo-calendar", label: "Calendar", icon: Calendar },
  { href: "/ipo-listing-performance", label: "Performance", icon: BarChart3 },
];

export function Header() {
  const { settings } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          {settings.site.branding.logoUrl ? (
            <img 
              src={settings.site.branding.logoUrl} 
              alt={settings.site.branding.siteName} 
              className="h-8 w-auto"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground text-sm font-bold">
              IPO
            </div>
          )}
          <span className="hidden sm:inline-block">{settings.site.branding.siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden border-t bg-card overflow-hidden transition-all duration-200",
          mobileMenuOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="container py-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted rounded-md"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
