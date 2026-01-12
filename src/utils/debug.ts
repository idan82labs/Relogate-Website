/**
 * Debug utility for logging auth flow
 * Logs are stored in sessionStorage and can be viewed in browser console
 */

const DEBUG_KEY = 'relogate_debug_logs';
const MAX_LOGS = 100;

interface DebugLog {
  timestamp: string;
  component: string;
  message: string;
  data?: Record<string, unknown>;
}

function getTimestamp(): string {
  return new Date().toISOString();
}

export function debugLog(component: string, message: string, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const log: DebugLog = {
    timestamp: getTimestamp(),
    component,
    message,
    data,
  };

  // Also log to console for immediate visibility
  console.log(`[${log.timestamp}] [${component}] ${message}`, data || '');

  // Store in sessionStorage
  try {
    const existingLogs = sessionStorage.getItem(DEBUG_KEY);
    const logs: DebugLog[] = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(log);

    // Keep only last MAX_LOGS entries
    if (logs.length > MAX_LOGS) {
      logs.splice(0, logs.length - MAX_LOGS);
    }

    sessionStorage.setItem(DEBUG_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to store debug log:', e);
  }
}

export function getDebugLogs(): DebugLog[] {
  if (typeof window === 'undefined') return [];

  try {
    const logs = sessionStorage.getItem(DEBUG_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
}

export function clearDebugLogs(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(DEBUG_KEY);
}

export function printDebugLogs(): void {
  const logs = getDebugLogs();
  console.log('=== RELOGATE DEBUG LOGS ===');
  logs.forEach(log => {
    console.log(`[${log.timestamp}] [${log.component}] ${log.message}`, log.data || '');
  });
  console.log('=== END DEBUG LOGS ===');
}

// Expose to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).relogateDebug = {
    getLogs: getDebugLogs,
    printLogs: printDebugLogs,
    clearLogs: clearDebugLogs,
  };
}
