## Context

On startup, `dexie.ts` calls `initializeMockData()`, which unconditionally seeds Roy and Patty into `db.users`. The utility `buildAccountBookPayload()` reads `userList[0]` (Roy) for the `ownerId`, making all newly created account books owned by a fake user. This prevents real users from owning their own data and blocks any future identity-related feature.

The change spans: DB initialization (`dexie.ts`), data access layer (`UserLocalRepo`), state management (`userStore`), UI components (onboarding steps), routing logic (`onboarding/index.tsx`), and i18n dictionaries.

## Goals / Non-Goals

**Goals:**

- Remove all mock user seeding and usage
- Collect a real user's name and email in onboarding step 2, and persist a `RegisteredUser` record
- Set the account book `ownerId` to the real user created in step 2

**Non-Goals:**

- No cloud account system or cross-device sync
- No profile editing UI after onboarding (separate feature)
- The `apps/web/src/mocks/` directory stays as an empty module to avoid import breakage

## Decisions

### Extend UserRepo interface to support writes

**Decision:** Add `create(user: RegisteredUser): Promise<void>` to the `UserRepo` interface in `entities/user.ts`. `UserLocalRepo` implements it. `userStore` calls it through the interface, not by importing `UserLocalRepo` directly.

**Rationale:** The architecture requires stores to access the database only through repo interfaces. Hardcoding a `UserLocalRepo` dependency in the store would break the existing dependency-injection pattern (`createUserStore` already accepts an injectable `UserRepo`) and prevent using a mock repo in tests.

**Alternatives considered:**
- Call `db.users` directly from the onboarding component — violates the UI → Usecase → Repo layer rule; no skipping layers.
- Create a separate `UserWriteRepo` interface — over-engineering; there is only one write operation.

### Pass ownerId via React state from ProfileStep to LedgerStep

**Decision:** Add a `currentUserId` local state to `onboarding/index.tsx`. After `ProfileStep` creates the user it calls `onCreated(userId)`, which updates the state and advances to step 3. `LedgerStep` receives the ID via an `ownerId` prop.

**Rationale:** `ownerId` is only needed during the onboarding initialization flow. Local state is the lightest option, and the ProfileStep → LedgerStep path is strictly linear so state loss is not a concern.

**Alternatives considered:**
- Store in `settingsStore` — over-engineering; settings has no reason to hold a user ID.
- Put in URL query param — exposes the ID in the URL unnecessarily; users might copy the URL and cause issues.

### Onboarding step numbering strategy

**Decision:** Expand `/onboarding?step=N` from 1–8 to 1–9 by inserting Profile as step 2. The separate `?onboarding=N` params used by coachmarks (N=3–8) stay unchanged.

**Rationale:** `?onboarding=3–8` is consumed by `OnboardingTutorial.tsx` and individual tutorial components. Re-numbering them would require updating all step guards across those components for minimal gain. The two numbering schemes operate on different pages and do not interfere.

## Implementation Contract

**Behavior:**

1. Fresh install (empty IndexedDB): onboarding starts at step 1; step 2 shows the Profile form; after the user submits a valid name and email the system creates a `RegisteredUser` in `db.users`; step 3 creates the account book with `ownerId` and `userIds[0]` equal to the step-2 user's ID.
2. Profile step is not skippable: the submit button is disabled (or a toast is shown) when name is empty or email is invalid.
3. `db.users.count()` after onboarding completes is 1, not 2.
4. Existing install (`onboardingCompleted: true`): onboarding is not triggered; user goes directly to the account book page.

**Interface / data shapes:**

- `UserRepo.create(user: RegisteredUser): Promise<void>` — added to `apps/web/src/entities/user.ts`
- `UserLocalRepo.create(user: RegisteredUser): Promise<void>` — calls `db.users.put(user)` (upsert)
- `userStore.createRegisteredUser(name: string, email: string): Promise<RegisteredUser | null>` — generates UUID, assembles `RegisteredUser`, calls `userRepo.create()`, returns the new user; sets `error` state and returns `null` on DB failure
- `buildAccountBookPayload(values: AccountBookFormValues, ownerId: string): AccountBook` — `ownerId` is now a required parameter (no longer read from mock)
- `ProfileStep` props: `{ onCreated: (userId: string) => void }`
- `LedgerStep` props: add required `ownerId: string`

**Failure modes:**

- `createRegisteredUser` DB failure: store sets `error` state; `ProfileStep` shows a toast; user can retry.
- Email validation: performed client-side via regex; no backend dependency.

**Acceptance criteria:**

- Reset IndexedDB, complete full onboarding → `db.users.toArray()` returns an array of length 1 with `name`/`email` matching the input.
- The created account book's `ownerId` equals that user's `id`.
- `onboarding/index.tsx` has `VALID_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9]`.
- Existing install (account book present) skips onboarding with no regression.

**Scope boundaries:**

- In scope: `dexie.ts`, `mocks/user.ts`, `UserLocalRepo`, `UserRepo` interface, `userStore`, `accountBookUtils.ts`, `LedgerStep`, `onboarding/index.tsx`, i18n dictionaries.
- Out of scope: `OnboardingTutorial.tsx` and individual tutorial components (their `?onboarding=3–8` logic is unchanged).

## Risks / Trade-offs

- Existing tests for `userStore.spec.ts` use a mock `UserRepo` that does not include `create` — the mock type definition needs updating after the interface change (test behavior is unaffected).
- If the user refreshes after completing step 2, `currentUserId` state is lost. Mitigation: `fallbackStep` logic checks the DB for an existing account book and redirects accordingly; if there is a user in the DB but no account book, re-submitting step 2 will upsert the same record (`db.users.put` is idempotent by ID).
