import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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
  // New dirty state tracking
  isDirty: boolean;
  saveSettings: () => void;
  discardChanges: () => void;
  resetToDefaults: () => void;
  lastSavedAt: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Hardcoded admin credentials (as requested)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source[key] !== undefined) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] as any, source[key] as any);
      } else {
        result[key] = source[key] as any;
      }
    }
  }
  return result;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  // Load saved settings from localStorage
  const loadSavedSettings = useCallback((): AdminSettings => {
    if (typeof window === "undefined") return defaultAdminSettings;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return deepMerge(defaultAdminSettings, JSON.parse(stored));
      } catch {
        return defaultAdminSettings;
      }
    }
    return defaultAdminSettings;
  }, []);

  // Initialize with defaults to match server-side rendering
  const [savedSettings, setSavedSettings] = useState<AdminSettings>(defaultAdminSettings);
  const [settings, setSettings] = useState<AdminSettings>(defaultAdminSettings);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEY);
    const storedAuth = localStorage.getItem(AUTH_KEY);

    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        const merged = deepMerge(defaultAdminSettings, parsed);
        setSettings(merged);
        setSavedSettings(merged);
        setLastSavedAt(merged.updatedAt);
      } catch {
        // Fallback to default
      }
    }

    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Check if there are unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(savedSettings);
  }, [settings, savedSettings]);

  // Explicit save function
  const saveSettings = useCallback(() => {
    const updatedSettings = { ...settings, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
    setSavedSettings(updatedSettings);
    setLastSavedAt(updatedSettings.updatedAt);
  }, [settings]);

  // Discard unsaved changes
  const discardChanges = useCallback(() => {
    setSettings(savedSettings);
  }, [savedSettings]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const resetSettings = { ...defaultAdminSettings, updatedAt: new Date().toISOString() };
    setSettings(resetSettings);
    setSavedSettings(resetSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetSettings));
    setLastSavedAt(resetSettings.updatedAt);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AdminSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  const updateSiteSettings = useCallback((site: Partial<AdminSettings["site"]>) => {
    setSettings(prev => ({
      ...prev,
      site: deepMerge(prev.site, site),
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
      const merged = deepMerge(defaultAdminSettings, imported);
      merged.updatedAt = new Date().toISOString();
      setSettings(merged);
      setSavedSettings(merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      setLastSavedAt(merged.updatedAt);
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
        isDirty,
        saveSettings,
        discardChanges,
        resetToDefaults,
        lastSavedAt,
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
