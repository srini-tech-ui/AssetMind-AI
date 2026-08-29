# App Blueprint

## Summary
Fix 21 TypeScript compile-time errors identified during read-only verification of Version 17.

## Changes

### 1. src/components/Header.tsx
- Removed invalid `name` prop from `Avatar`
- Changed to compound pattern: `<Avatar><AvatarImage src={...} alt={...} /></Avatar>`
- Added `AvatarImage` import

### 2. src/hooks/useFilters.ts
- Narrowed `arrayKeys` type from `keyof FilterValues` to `Array<keyof Pick<FilterValues, "assetType" | "location" | "businessUnit" | "owner" | "risk" | "compliance" | "lifecycleState">>` 
- This excludes `dateRange` (an object) which shouldn't be iterated as an array

### 3. src/mocks/audit.ts
- Restructured all 10 mock audit events to match `AuditEvent.changes` type: `Record<string, { before: unknown; after: unknown }>`
- Changed from `{ before: {...}, after: {...} }` to `{ status: { before: "...", after: "..." }, ... }`

### 4. src/mocks/index.ts
- Replaced non-existent `getWorkflowInstances` with `mockWorkflowInstances` in exports

### 5. src/mocks/mockAdapter.ts
- Added missing import: `getAllExplainabilityEvidence` from `./explainability`
