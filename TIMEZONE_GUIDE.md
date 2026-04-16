# Timezone Configuration Guide - Indian Standard Time (IST)

## Overview

This project uses **Indian Standard Time (IST / Asia/Kolkata)** as the uniform timezone across all components, API routes, and database operations.

## Utility Functions

All timezone operations should use the utility functions from `/lib/utils.ts`. These functions ensure consistent formatting across the entire application.

### Available Functions

#### 1. `getCurrentTimestampISO()`
Returns the current timestamp in ISO 8601 format.

```typescript
import { getCurrentTimestampISO } from '@/lib/utils'

const timestamp = getCurrentTimestampISO()
// Output: "2026-04-17T09:30:45.123Z"
```

**Use Case**: Storing timestamps in the database (ISO format is timezone-agnostic and stored as UTC).

---

#### 2. `formatDateToIST(date)`
Formats a date/time to Indian timezone in full format (date + time).

```typescript
import { formatDateToIST } from '@/lib/utils'

const formatted = formatDateToIST(new Date())
// Output: "17/04/2026, 02:30:45 PM"

// Also works with string dates
const formatted2 = formatDateToIST('2026-04-17T09:30:45Z')
// Output: "17/04/2026, 02:30:45 PM"
```

**Use Case**: Displaying timestamps to users (e.g., report creation time).

---

#### 3. `formatDateOnlyIST(date)`
Formats a date to Indian timezone (date only, no time).

```typescript
import { formatDateOnlyIST } from '@/lib/utils'

const formatted = formatDateOnlyIST(new Date())
// Output: "17/04/2026"
```

**Use Case**: Report titles, date labels where time is not needed.

---

#### 4. `formatTimeOnlyIST(date)`
Formats a time to Indian timezone (time only, no date).

```typescript
import { formatTimeOnlyIST } from '@/lib/utils'

const formatted = formatTimeOnlyIST(new Date())
// Output: "02:30:45 PM"
```

**Use Case**: Time-only displays in tables or logs.

---

#### 5. `formatDateTimeIST(date)`
Formats a date/time to Indian timezone with IST suffix.

```typescript
import { formatDateTimeIST } from '@/lib/utils'

const formatted = formatDateTimeIST(new Date())
// Output: "17/04/2026 02:30:45 PM IST"
```

**Use Case**: Reports, PDF documents, formal displays.

---

## Implementation Examples

### In API Routes

```typescript
// app/api/generate-pdf/route.ts
import { formatDateTimeIST, formatDateOnlyIST } from '@/lib/utils'

// For PDF display
pdf.text(`Generated: ${formatDateTimeIST(new Date())}`, ...)

// For report titles
title: `Seed Analysis Report - ${formatDateOnlyIST(new Date())}`
```

### In Client Components

```typescript
// app/dashboard/history/page.tsx
import { formatDateToIST } from '@/lib/utils'

{reports.map((report) => (
  <div key={report.id}>
    <h3>{report.title}</h3>
    <p>{formatDateToIST(report.created_at)}</p>
  </div>
))}
```

### In Backend Utilities

```typescript
import { getCurrentTimestampISO } from '@/lib/utils'

const processedResult = {
  timestamp: getCurrentTimestampISO(),
  prediction: data.prediction,
  // ... other data
}
```

---

## Database Schema

The database stores all timestamps in **UTC** (ISO 8601 format) by default:

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),  -- Stored in UTC
  updated_at TIMESTAMP DEFAULT now()   -- Stored in UTC
);
```

When retrieving from the database, convert using the utility functions:

```typescript
const { data } = await supabase
  .from('reports')
  .select('*')

// Format the timestamp for display
data.forEach(report => {
  console.log(formatDateToIST(report.created_at))
})
```

---

## Timezone Reference

- **Timezone**: `Asia/Kolkata`
- **ISO Code**: `IST` (Indian Standard Time)
- **UTC Offset**: UTC+5:30
- **No Daylight Saving Time**: IST is constant year-round

---

## Best Practices

### ✅ DO

- Use utility functions from `/lib/utils.ts` for all date formatting
- Store timestamps in the database as UTC/ISO format
- Convert to IST only when displaying to users
- Use `getCurrentTimestampISO()` for new timestamps
- Document why a timestamp is used in code comments

### ❌ DON'T

- Use `new Date().toLocaleString()` without timezone specification
- Use `new Date().toLocaleDateString()` without timezone specification
- Mix different timezone formats in the same component
- Assume user's local timezone - always use IST
- Store timestamps in local timezone format

---

## Testing Timestamps

To verify your timestamps are working correctly:

```typescript
import { formatDateToIST, getCurrentTimestampISO } from '@/lib/utils'

// Test 1: Check ISO format
const iso = getCurrentTimestampISO()
console.log('ISO Format:', iso)

// Test 2: Check IST format
const ist = formatDateToIST(new Date())
console.log('IST Format:', ist)

// Test 3: Check with specific date
const testDate = '2026-04-17T09:30:45Z'
console.log('Test Date IST:', formatDateToIST(testDate))
```

---

## Migration Guide

If updating existing code:

### Before
```typescript
{new Date(report.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
```

### After
```typescript
{formatDateToIST(report.created_at)}
```

---

## Files Modified

The following files have been updated to use uniform IST timezone:

1. **`/lib/utils.ts`** - Timezone utility functions added
2. **`/app/api/ml-model/route.ts`** - Uses `getCurrentTimestampISO()`
3. **`/app/api/generate-pdf/route.ts`** - Uses `formatDateTimeIST()` and `formatDateOnlyIST()`
4. **`/app/dashboard/history/page.tsx`** - Uses `formatDateToIST()`

---

## Questions?

For more information about timezone handling, see:
- [JavaScript Date Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)
- [Supabase Timestamp Documentation](https://supabase.com/docs/guides/api/using-timestamps)

---

**Last Updated**: April 17, 2026
