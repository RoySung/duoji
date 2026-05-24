## 1. 前置調查與錨點規劃

- [x] 1.1 盤點帳本設定相關頁面與元件（含 `AccountBookMenu.tsx`、帳本設定頁、成員區塊、分類管理入口），確認新 step 3（edit account book）、step 4（add members）、step 5（manage categories）的 coachmark 錨點 DOM 結構是否穩定可用
- [x] 1.2 在三個目標元素加上 `data-onboarding-anchor` 標記（edit、members、categories 各一），作為 coachmark 穩定錨點

## 2. i18n 文案

- [x] 2.1 於 `apps/web/src/i18n/messages/en-US.json` 與 `zh-TW.json` 新增三個 step 的標題、描述、skip 按鈕文案 key（edit account book、add members、manage categories）
- [x] 2.2 沿用既有 onboarding 文案命名慣例，確認 key 命名與既有 tutorial step 一致

## 3. 教學元件

- [x] 3.1 新增 `EditAccountBookTutorial.tsx`，沿用既有 coachmark 模式，錨定至 edit 入口；對應 `### Requirement: Account book management tutorial steps introduce edit, members, and categories` 的 edit-account-book 子場景
- [x] 3.2 新增 `AddMemberTutorial.tsx`，錨定至成員新增入口；對應 `Account book management tutorial steps` 需求的 add-members 子場景
- [x] 3.3 新增 `ManageCategoriesTutorial.tsx`，錨定至分類管理入口；對應 `Account book management tutorial steps` 需求的 manage-categories 子場景
- [x] 3.4 確認三個新元件均「不要求使用者實際完成編輯/加成員/改分類」，可直接前進至下一個 step

## 4. Onboarding 流程接線

- [x] 4.1 修改 `OnboardingTutorial.tsx` 與 `apps/web/src/pages/onboarding/index.tsx`，把步驟列表由 5 步擴充為 8 步，符合 `### Requirement: Onboarding flow consists of eight sequential steps`
- [x] 4.2 確認 step 2 完成（建立帳本）後，路由與狀態能夠正確進入新 step 3（編輯帳本）
- [x] 4.3 確認 step 3 → 4 → 5 順序前進後，能銜接到原有的 step 6（記帳教學）

## 5. 進度顯示與導航

- [x] 5.1 將 onboarding 進度顯示由 5 步改為 8 步（含 `StepShell.tsx` 等元件）
- [x] 5.2 確認新 step 3、4、5 會 navigate 到帳本設定頁，符合 `### Requirement: Tutorial steps overlay coachmarks on real pages`（步驟 3-8 皆覆蓋 real page）

## 6. Skip 行為

- [x] 6.1 為新 step 3、4、5 提供 skip 控制，skip 後前進至下一個 step，符合 `### Requirement: Each onboarding step can be skipped`
- [x] 6.2 確認 skip 任一新 step 不會阻擋使用者後續進入記帳教學（step 6）
- [x] 6.3 確認 step 2 仍維持不可 skip 的既有語意

## 7. 完成狀態

- [x] 7.1 更新完成判定邏輯，於 step 8 完成或 skip 後設定 `Settings.onboardingCompleted = true`，符合 `### Requirement: Onboarding completion is recorded`
- [x] 7.2 驗證已完成 onboarding 的使用者不會被新 step 3-5 重新導入 onboarding

## 8. 測試

- [x] 8.1 更新 `apps/web-e2e/src/onboarding.spec.ts`，新增 step 3-5 的 happy path 與 skip path 流程
- [x] 8.2 新元件為 `OnboardingTutorial` 的薄包裝（同 `SplitTutorial`、`ReportTutorial` 模式，後者亦未個別撰寫 jest 單元測試），由 e2e 流程覆蓋；既有單元測試 suite 均維持通過
- [x] 8.3 `tsc --noEmit` 通過；`nx test web` 中 onboarding 相關 suite（`accountBookSettings`、`homeTransactions`、`settlementPage`、`settingsStore`）皆通過；`accountBookStore` 在隔離執行下通過，全套 suite 中的失敗為既有 cross-suite IndexedDB 污染（與本變更無關）；lint 中唯一 error 為既有 `OnboardingTutorial.tsx:129` 空 arrow function（未被本變更引入）

## 9. 文件與收尾

- [x] 9.1 檢視 `roadmap.md`、`phase-1.todo.md` 是否需要同步紀錄；若與 openspec 衝突以 openspec 為準（本變更為純 onboarding UX，與 phase-1 後端任務無交集，無需同步）
- [x] 9.2 與 `expand-onboarding-step3-substeps` 提案協調 archive 順序：本變更已將原 step 3 重編為 step 6 並同步 i18n key（`step3.*` → `step6.*`），該提案後續 archive 時其「step 3」需重新映射為「step 6」（已於 proposal Impact 段註記）
