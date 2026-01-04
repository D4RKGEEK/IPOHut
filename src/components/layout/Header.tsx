import { Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Menu, X, TrendingUp, Calendar, BarChart3, CheckCircle, Calculator, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const navItems = [
  { href: "/mainboard-ipo", label: "Mainboard", icon: TrendingUp },
  { href: "/sme-ipo", label: "SME", icon: BarChart3 },
  { href: "/ipo-gmp-today", label: "GMP Today", icon: Sparkles },
  { href: "/ipo-allotment-status", label: "Allotment", icon: CheckCircle },
  { href: "/ipo-calendar", label: "Calendar", icon: Calendar },
  { href: "/ipo-listing-performance", label: "Performance", icon: BarChart3 },
  { href: "/tools", label: "Tools", icon: Calculator },
];

export function Header() {
  const { settings } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-foreground">
          {settings.site.branding.logoUrl ? (
            <img 
              src={settings.site.branding.logoUrl} 
              alt={settings.site.branding.siteName} 
              className="h-7 w-auto"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
            </div>
          )}
          <span className="hidden sm:inline-block text-sm font-medium">{settings.site.branding.siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                isActive(item.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden border-t bg-background overflow-hidden transition-all duration-200",
          mobileMenuOpen ? "max-h-[400px]" : "max-h-0"
        )}
      >
        <nav className="container py-2 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 text-sm rounded-md transition-colors",
                isActive(item.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
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