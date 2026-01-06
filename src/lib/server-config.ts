import fs from 'fs';
import path from 'path';
import { AdminSettings, defaultAdminSettings } from '@/types/admin';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'admin-settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Cache settings in memory for zero runtime overhead
let cachedSettings: AdminSettings | null = null;

export function getAdminSettings(): AdminSettings {
    // Return cached settings if available (build-time optimization)
    if (cachedSettings) {
        return cachedSettings;
    }

    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            const fileContent = fs.readFileSync(SETTINGS_FILE, 'utf-8');
            const settings = JSON.parse(fileContent);
            cachedSettings = { ...defaultAdminSettings, ...settings };
            return cachedSettings;
        }
    } catch (error) {
        console.error('Error reading admin settings:', error);
    }

    // Cache and return default settings if file doesn't exist or error occurs
    cachedSettings = defaultAdminSettings;
    return cachedSettings;
}

export function saveAdminSettings(settings: AdminSettings): boolean {
    try {
        const content = JSON.stringify(settings, null, 2);
        fs.writeFileSync(SETTINGS_FILE, content, 'utf-8');

        // Invalidate cache so next request picks up new settings
        cachedSettings = null;

        return true;
    } catch (error) {
        console.error('Error saving admin settings:', error);
        return false;
    }
}
