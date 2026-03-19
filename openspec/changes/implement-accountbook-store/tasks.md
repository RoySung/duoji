## 1. Foundation

- [x] 1.1 Add Zustand to the web app and scaffold the AccountBook store or application-layer folder structure for this clean-architecture slice.
- [x] 1.2 Keep AccountBookRepo as the usecase boundary by shaping the AccountBook store factory around the existing domain contract in `apps/web/src/entities/accountBook.ts`.
- [x] 1.3 Inject the default repository through a composition root that wires `AccountBookLocalRepo` into the runtime AccountBook store bootstrap without hiding the dependency inside the store module.

## 2. Account book usecase implementation

- [x] 2.1 Model the AccountBook Store as usecase-level orchestration with state for `accountBooks`, `activeAccountBookId`, `initialized`, `isLoading`, `error`, and derived active account book access.
- [x] 2.2 Implement The application maintains an active account book requirement for startup selection, manual switching, first-account-book activation, and active-account-book deletion fallback.
- [x] 2.3 Bootstrap the active account book after local persistence initializes by ordering app startup so IndexedDB setup completes before the AccountBook store hydrates.
- [x] 2.4 Update one minimal consumer path to read account-book state from the injected AccountBook store instead of relying on hard-coded account-book mock data.

## 3. Verification

- [x] 3.1 Verify the store with injected test repositories first through focused tests for loading, active selection, creation without an active account book, and deletion fallback behavior.
- [x] 3.2 Add a composition-root smoke test that exercises the default Dexie-backed AccountBook repository wiring and bootstrap order.
- [x] 3.3 Run `pnpm nx test web --runInBand` and confirm the AccountBook Store slice does not regress existing web repository coverage.
