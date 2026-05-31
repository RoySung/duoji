## Why

The app currently seeds two hardcoded mock users (Roy and Patty) on first install, and `buildAccountBookPayload()` reads `userList[0]` to set the account book owner. Real users never have the opportunity to identify themselves, so account books are always owned by a fake identity. This blocks any future support for cloud sync, multi-device access, or meaningful user attribution.

## What Changes

- **Remove** mock user entries from `apps/web/src/mocks/user.ts` (empty the `userList`)
- **Remove** `initializeMockData()` and its call from `apps/web/src/lib/dexie.ts`
- **Add** onboarding step 2: Profile Step — collects name and email, creates a real `RegisteredUser` in IndexedDB
- **Renumber** onboarding steps: Language=1, Profile=2, Ledger=3, Tutorial=4–9 (the separate `?onboarding=3–8` URL params used by coachmarks remain unchanged)
- **Update** `buildAccountBookPayload()` to accept an `ownerId` parameter instead of reading from mock data
- **Add** `UserLocalRepo.create()` to support writing new users
- **Add** `userStore.createRegisteredUser()` action called by `ProfileStep`

## Non-Goals

- No multi-device sync or cloud account system
- No profile editing after onboarding completes (separate feature)
- The `apps/web/src/mocks/` directory is kept as an empty module to avoid breaking existing imports

## Capabilities

### New Capabilities

- `user-profile-setup`: User enters name and email during onboarding; the system creates a unique `RegisteredUser` and uses it as the account book owner

### Modified Capabilities

- `onboarding`: Setup expands from 2 to 3 steps (Language → Profile → Ledger); step routing updated accordingly
- `user-repo`: `UserRepo` gains write capability via a new `create` method; no longer read-only

## Impact

- Affected specs: `user-profile-setup` (new), `onboarding` (modified), `user-repo` (modified)
- Affected code:
  - New: `apps/web/src/components/onboarding/ProfileStep.tsx`
  - Modified: `apps/web/src/mocks/user.ts`
  - Modified: `apps/web/src/lib/dexie.ts`
  - Modified: `apps/web/src/repositories/userRepo/userLocalRepo.ts`
  - Modified: `apps/web/src/stores/user/userStore.ts`
  - Modified: `apps/web/src/utils/accountBookUtils.ts`
  - Modified: `apps/web/src/components/onboarding/LedgerStep.tsx`
  - Modified: `apps/web/src/pages/onboarding/index.tsx`
  - Modified: `apps/web/src/i18n/messages/en-US.json`
  - Modified: `apps/web/src/i18n/messages/zh-TW.json`
