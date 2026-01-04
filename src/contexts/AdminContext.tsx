import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AdminSettings, defaultAdminSettings } from "@/types/admin";

const STORAGE_KEY = "ipo-admin-settings";
const AUTH_KEY = "ipo-admin-auth";

interface AdminContextType {
  settings: AdminSettings;
  updateSettings: (settings: Partial<AdminSettings>) => void;
  updateSiteSettings: (site: Partial<AdminSettings["site"]>) => void;
  updatePageSettings: (page: keyof AdminSettings["pages"], settings: Partial<AdminSettings["pages"][keyof AdminSettings["pages"]]>) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Hardcoded admin credentials (as requested)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AdminSettings>(() => {
    if (typeof window === "undefined") return defaultAdminSettings;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultAdminSettings, ...JSON.parse(stored) };
      } catch {
        return defaultAdminSettings;
      }
    }
    return defaultAdminSettings;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_KEY) === "true";
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<AdminSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateSiteSettings = useCallback((site: Partial<AdminSettings["site"]>) => {
    setSettings(prev => ({
      ...prev,
      site: {
        ...prev.site,
        ...site,
        branding: { ...prev.site.branding, ...site.branding },
        scripts: { ...prev.site.scripts, ...site.scripts },
        defaultSeo: { ...prev.site.defaultSeo, ...site.defaultSeo },
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updatePageSettings = useCallback((
    page: keyof AdminSettings["pages"],
    pageSettings: Partial<AdminSettings["pages"][keyof AdminSettings["pages"]]>
  ) => {
    setSettings(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [page]: {
          ...prev.pages[page],
          ...pageSettings,
        },
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const exportSettings = useCallback((): string => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((json: string): boolean => {
    try {
      const imported = JSON.parse(json);
      setSettings({ ...defaultAdminSettings, ...imported, updatedAt: new Date().toISOString() });
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        settings,
        updateSettings,
        updateSiteSettings,
        updatePageSettings,
        isAuthenticated,
        login,
        logout,
        exportSettings,
        importSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
