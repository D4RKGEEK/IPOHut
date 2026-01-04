import { Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Menu, X, TrendingUp, Calendar, BarChart3, CheckCircle, Calculator, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { analytics } from "@/hooks/useAnalytics";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  BarChart3,
  Sparkles,
  CheckCircle,
  Calendar,
  Calculator,
};

export function Header() {
  const { settings } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = settings.site.navigation;
  const visibleMenuItems = navigation.menuItems.filter(item => item.visible);

  const isActive = (href: string) => location.pathname === href;

  const getIcon = (iconName?: string) => {
    if (!iconName) return TrendingUp;
    return iconMap[iconName] || TrendingUp;
  };

  const handleNavClick = (label: string) => {
    analytics.navClick(label);
  };

  const handleLogoClick = () => {
    analytics.logoClick();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-foreground" onClick={handleLogoClick}>
          {navigation.showLogo && (
            settings.site.branding.logoUrl ? (
              <img 
                src={settings.site.branding.logoUrl} 
                alt={settings.site.branding.siteName} 
                className="h-7 w-auto"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <TrendingUp className="h-4 w-4" />
              </div>
            )
          )}
          {navigation.showSiteName && (
            <span className="hidden sm:inline-block text-sm font-medium">
              {settings.site.branding.siteName}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {visibleMenuItems.map((item) => {
            const hasChildren = item.children && item.children.filter(c => c.visible).length > 0;
            const Icon = getIcon(item.icon);

            if (hasChildren) {
              const visibleChildren = item.children!.filter(c => c.visible);
              return (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1",
                        isActive(item.url)
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {visibleChildren.map((child) => (
                      <DropdownMenuItem key={child.id} asChild>
                        <Link to={child.url} onClick={() => handleNavClick(child.label)}>{child.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.url}
                onClick={() => handleNavClick(item.label)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  isActive(item.url)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
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
          mobileMenuOpen ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <nav className="container py-2 space-y-0.5">
          {visibleMenuItems.map((item) => {
            const Icon = getIcon(item.icon);
            const hasChildren = item.children && item.children.filter(c => c.visible).length > 0;

            return (
              <div key={item.id}>
                <Link
                  to={item.url}
                  onClick={() => {
                    if (!hasChildren) {
                      setMobileMenuOpen(false);
                      handleNavClick(item.label);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 text-sm rounded-md transition-colors",
                    isActive(item.url)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
                {hasChildren && (
                  <div className="ml-6 border-l pl-2 space-y-0.5">
                    {item.children!.filter(c => c.visible).map((child) => (
                      <Link
                        key={child.id}
                        to={child.url}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleNavClick(child.label);
                        }}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                          isActive(child.url)
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
