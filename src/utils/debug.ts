/**
 * Debug utility for logging auth flow
 * Logs are stored in sessionStorage AND sent to server for file logging
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

// Send log to server API for file-based logging
async function sendLogToServer(
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG',
  source: string,
  message: string,
  data?: Record<string, unknown>
): Promise<void> {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level,
        source,
        message,
        data,
      }),
    });
  } catch (e) {
    // Don't log fetch errors to avoid infinite loops
    console.warn('Failed to send log to server:', e);
  }
}

export function debugLog(
  component: string,
  message: string,
  data?: Record<string, unknown>,
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' = 'INFO'
): void {
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

  // Send to server for file logging (fire and forget)
  sendLogToServer(level, component, message, data);
}

// Convenience methods for different log levels
export function debugInfo(component: string, message: string, data?: Record<string, unknown>): void {
  debugLog(component, message, data, 'INFO');
}

export function debugWarn(component: string, message: string, data?: Record<string, unknown>): void {
  debugLog(component, message, data, 'WARN');
}

export function debugError(component: string, message: string, data?: Record<string, unknown>): void {
  debugLog(component, message, data, 'ERROR');
}

export function debugDebug(component: string, message: string, data?: Record<string, unknown>): void {
  debugLog(component, message, data, 'DEBUG');
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

// Get current session ID from server
export async function getSessionId(): Promise<string | null> {
  try {
    const response = await fetch('/api/log');
    const data = await response.json();
    return data.sessionId || null;
  } catch {
    return null;
  }
}

// Expose to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).relogateDebug = {
    getLogs: getDebugLogs,
    printLogs: printDebugLogs,
    clearLogs: clearDebugLogs,
    getSessionId,
  };
}
