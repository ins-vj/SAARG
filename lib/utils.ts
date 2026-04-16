import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============ TIMEZONE UTILITIES (INDIAN TIMEZONE - IST) ============

const INDIAN_TIMEZONE = 'Asia/Kolkata'
const LOCALE = 'en-IN'

/**
 * Get current timestamp in ISO format with Indian timezone
 * @returns ISO string with Indian timezone info
 */
export function getCurrentTimestampISO(): string {
  return new Date().toISOString()
}

/**
 * Format date to Indian timezone readable string
 * @param date - Date object or string to format
 * @returns Formatted string in Indian timezone (e.g., "17/4/2026, 2:30:45 PM")
 */
export function formatDateToIST(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString(LOCALE, { 
    timeZone: INDIAN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

/**
 * Format date to Indian timezone date only (no time)
 * @param date - Date object or string to format
 * @returns Formatted date string in Indian timezone (e.g., "17/4/2026")
 */
export function formatDateOnlyIST(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(LOCALE, { 
    timeZone: INDIAN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * Format date to Indian timezone time only
 * @param date - Date object or string to format
 * @returns Formatted time string in Indian timezone (e.g., "2:30:45 PM")
 */
export function formatTimeOnlyIST(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString(LOCALE, { 
    timeZone: INDIAN_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

/**
 * Get combined date and time in Indian timezone with custom format
 * @param date - Date object or string to format
 * @returns Formatted string (e.g., "17/4/2026 2:30:45 PM IST")
 */
export function formatDateTimeIST(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const formatted = dateObj.toLocaleString(LOCALE, { 
    timeZone: INDIAN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  return `${formatted} IST`
}
