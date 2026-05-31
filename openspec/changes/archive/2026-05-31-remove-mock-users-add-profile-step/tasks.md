## 1. Extend UserRepo Interface to Support Writes

- [x] 1.1 Add `create(user: RegisteredUser): Promise<void>` to the `UserRepo` interface in `apps/web/src/entities/user.ts`, so the interface covers both reads and writes (aligns with design decision "Extend UserRepo interface to support writes" and spec "UserRepo interface encapsulates registered user reads and writes"). Verification: TypeScript compiles without errors; `UserLocalRepo` produces a type error if `create` is not implemented.

- [x] 1.2 Implement `create(user: RegisteredUser): Promise<void>` in `apps/web/src/repositories/userRepo/userLocalRepo.ts` by calling `db.users.put(user)` (upsert semantics), completing `UserLocalRepo`'s implementation of the updated `UserRepo` interface (aligns with spec "UserLocalRepo persists to IndexedDB", `create` scenario). Verification: `db.users.put` is called; a subsequent `UserLocalRepo.findByIds([user.id])` returns the same record.

## 2. Add Create User Action to userStore

- [x] 2.1 Add `createRegisteredUser(name: string, email: string): Promise<RegisteredUser | null>` to `apps/web/src/stores/user/userStore.ts`: generate a UUID via `genUuid()`, build an avatar URL via `ui-avatars.com`, assemble the `RegisteredUser` object, call `userRepo.create(user)`, and return the new user; on DB error set `error` state and return `null`. Ensure the action goes through the injected `userRepo` interface and does not access `db` directly (aligns with design decision "Extend UserRepo interface to support writes", "Store creates users via repo" scenario). Verification: unit test with a mock `UserRepo` confirms `userRepo.create` is called and the correct `RegisteredUser` is returned; failure path returns `null`.

## 3. Remove Mock User Data

- [x] 3.1 Clear `apps/web/src/mocks/user.ts` by setting `userList` to an empty array `[]`, removing the Roy and Patty entries, so a fresh install does not seed any users into `db.users` (aligns with spec "No mock users exist after fresh install"). Verification: launch the app and confirm the IndexedDB `users` table starts with 0 records.

- [x] 3.2 In `apps/web/src/lib/dexie.ts`, remove the `initializeMockData()` function, its call inside `initializeDB()`, and the `import { userList } from '@/mocks'` statement, so DB initialization no longer seeds any mock users (aligns with spec "No mock users exist after fresh install"). Verification: TypeScript compiles without errors; `initializeMockData` does not appear in any import or call chain.

- [x] 3.3 Update `apps/web/src/utils/accountBookUtils.ts`: remove `import { userList }` and `const defaultOwner = userList[0]`; change `buildAccountBookPayload` to accept a required `ownerId: string` second parameter instead of reading from mock data (aligns with spec "Account book owner is set to the profile-step user", design decision "Pass ownerId via React state from ProfileStep to LedgerStep"). Verification: TypeScript compiles without errors; all call sites that omit the second argument produce a type error.

## 4. Build ProfileStep Component

- [x] 4.1 Create `apps/web/src/components/onboarding/ProfileStep.tsx`: wrap with `StepShell` (`currentStep={2}`, `totalSteps={3}`); include required name and email fields; block submission when name is empty or email format is invalid; on successful submission call `userStore.createRegisteredUser(name, email)`, then call `onCreated(user.id)` on success or show a toast on failure (aligns with spec "User creates a profile during onboarding before the first account book", all scenarios; design decision "Pass ownerId via React state from ProfileStep to LedgerStep"). Verification: manual test confirms empty name or invalid email cannot be submitted; a valid submission advances to step 3.

## 5. Update LedgerStep to Accept ownerId

- [x] 5.1 Update `apps/web/src/components/onboarding/LedgerStep.tsx`: add required `ownerId: string` prop and pass it to `buildAccountBookPayload(values, ownerId)`; update `StepShell` to `currentStep={3}`, `totalSteps={3}` (aligns with spec "Step 3 creates the first account book", design decision "Pass ownerId via React state from ProfileStep to LedgerStep"). Verification: after creating an account book, `db.accountBooks.toArray()` shows `ownerId` matching the user ID from step 2.

## 6. Update Onboarding Routing Logic

- [x] 6.1 Update `apps/web/src/pages/onboarding/index.tsx`: set `VALID_STEPS` to `[1, 2, 3, 4, 5, 6, 7, 8, 9]`; update `TutorialStep` type to `4 | 5 | 6 | 7 | 8 | 9`; map `tutorialPath(step)` to `?onboarding=(step-1)` (step 4 → `?onboarding=3`, …, step 9 → `?onboarding=8`); set `fallbackStep` to `4` when an account book exists; change the tutorial guard from `currentStep < 3` to `currentStep < 4` (aligns with spec "Onboarding flow consists of eight sequential steps", design decision "Onboarding step numbering strategy"). Verification: full onboarding run advances 1→2→3→4 (entering the account book page) with correct URLs at each step.

- [x] 6.2 In `apps/web/src/pages/onboarding/index.tsx`, add `currentUserId` local state (`useState<string | null>(null)`); render `ProfileStep` at step 2 with `onCreated` setting `currentUserId` and advancing to step 3; render `LedgerStep` at step 3 passing `ownerId={currentUserId ?? ''}` (aligns with design decision "Pass ownerId via React state from ProfileStep to LedgerStep", spec "Account book owner is set to the profile-step user"). Verification: `currentUserId` is non-null after completing step 2; the created account book's `ownerId` equals `currentUserId`.

## 7. Update i18n Dictionaries

- [x] 7.1 In `apps/web/src/i18n/messages/en-US.json`, inside the `onboarding` block: insert a new `step2` key group (title, description, namePlaceholder, emailPlaceholder, cannotSkip); rename the existing `step2` through `step8` keys to `step3` through `step9` (aligns with spec "User creates a profile during onboarding before the first account book", ensures ProfileStep and all subsequent steps render correct copy). Verification: ProfileStep displays correct English copy; LedgerStep and tutorial steps show no broken keys.

- [x] 7.2 Apply the same structural update to `apps/web/src/i18n/messages/zh-TW.json`: add Traditional Chinese copy for the new `step2` profile keys and shift the remaining step keys by one (aligns with spec "User creates a profile during onboarding before the first account book"). Verification: switching the app language to zh-TW shows correct Chinese copy in ProfileStep.
