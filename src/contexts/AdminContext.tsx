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

export function AdminProvider({ children, initialSettings }: { children: React.ReactNode; initialSettings?: AdminSettings }) {
  // Initialize with initialSettings if available, or default
  const [savedSettings, setSavedSettings] = useState<AdminSettings>(initialSettings || defaultAdminSettings);
  const [settings, setSettings] = useState<AdminSettings>(initialSettings || defaultAdminSettings);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialSettings?.updatedAt || null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(!initialSettings);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Create a new effect for auth check only, removing the settings fetch
  useEffect(() => {
    // Check auth
    const storedAuth = localStorage.getItem(AUTH_KEY);
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }

    // We rely purely on initialSettings passed from SSR (RootLayout -> Providers)
    setIsLoading(false);
  }, []);

  // Check if there are unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(savedSettings);
  }, [settings, savedSettings]);

  // Explicit save function
  const saveSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      const updatedSettings = { ...settings, updatedAt: new Date().toISOString() };

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (res.ok) {
        setSettings(updatedSettings);
        setSavedSettings(updatedSettings);
        setLastSavedAt(updatedSettings.updatedAt);
      } else {
        console.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  // Discard unsaved changes
  const discardChanges = useCallback(() => {
    setSettings(savedSettings);
  }, [savedSettings]);

  // Reset to defaults
  const resetToDefaults = useCallback(async () => {
    // Only reset local state, waiting for explicit save to persist default
    // Or we could auto-save. Let's auto-save to ensure state is clean.
    const resetSettings = { ...defaultAdminSettings, updatedAt: new Date().toISOString() };
    setSettings(resetSettings);
    // Note: We don't auto-save here to let user confirm action via "Save Changes" usually,
    // but the request implies "Reset to Defaults" action might want to persist. 
    // For safety, let's keep it as a "draft" state that needs saving.
    // However, the original code did sync to localStorage immediately. 
    // Let's stick to "draft" mode for consistency with isDirty pattern.
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
      // We set this as "draft" settings
      setSettings(merged);
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
