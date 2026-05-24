## Why

目前 onboarding 在 step 2 建立第一個帳本後，會直接跳到 step 3「記錄一筆交易」教學，新使用者沒有機會認識帳本本身可以被編輯、可以加入成員、可以管理分類。等他們真的有需求時（例如改幣別、加另一半進來、調整分類）就得自行翻找設定入口；其中「成員」與「分類」更是分帳與報表體驗的關鍵前置設定，越早讓使用者認識，越能在後續記帳、結算、報表步驟產生對應價值。本變更在 step 2 之後新增三個獨立 step，把「帳本是可管理的」這件事帶到使用者面前。

## What Changes

- 在現有 step 2（建立帳本）之後、原 step 3（記帳教學）之前，新增三個獨立的 onboarding step：
  - 新 step 3：**編輯帳本** — 介紹帳本的基本設定（名稱、幣別）可被修改的入口。
  - 新 step 4：**新增成員** — 介紹如何把其他成員加入帳本（為日後的分帳/結算鋪路）。
  - 新 step 5：**管理分類** — 介紹分類管理入口，告知預設分類可被新增、編輯、排序、刪除。
- 因此原本的 step 3/4/5 順延為新 step 6（記帳教學）、step 7（結算教學）、step 8（報表教學）。整體步數由 5 步調整為 8 步，進度顯示同步更新。
- 三個新 step 全部沿用既有的 coachmark 模式（與 `TransactionTutorial.tsx`、`SplitTutorial.tsx`、`ReportTutorial.tsx` 一致）：導航到帳本設定頁，將 coachmark 錨定於對應 UI 元素（編輯入口、成員區塊、分類管理入口）。
- 三個新 step 全部可被 skip：skip 該 step 後直接前進到下一個 step，不要求使用者實際完成編輯/加成員/改分類等動作。建立帳本後不會被新 step 阻擋進入記帳教學。
- 在帳本設定頁的對應 UI 元素新增 `data-onboarding-anchor` 標記，作為 coachmark 的穩定錨點。
- i18n message catalog（`en-US`、`zh-TW`）新增三個 step 的標題、描述與 skip 按鈕文案 key。

## Non-Goals

- 不變更既有 step 2（建立帳本）的行為或欄位。
- 不在新 step 中要求使用者「實際完成」編輯帳本、新增成員或修改分類；coachmark 僅做介紹，不檢查行為完成。
- 不為新 step 加入子步驟（不採用 `expand-onboarding-step3-substeps` 的子步驟模式）；每個新 step 是單一 coachmark。
- 不變更帳本設定頁、成員管理、分類管理本身的功能與版面，只新增錨點標記。
- 不為已完成 onboarding 的使用者重新跑這三個新 step（沿用既有「`Settings.onboardingCompleted` 為 true 後不再自動進入 onboarding」的語意）。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `onboarding`: 調整「onboarding 由 5 個步驟組成」的需求為 8 個步驟，並新增三個對應的 tutorial coachmark 需求（編輯帳本、新增成員、管理分類）；同步調整「每個步驟可 skip」需求中對步驟編號的描述。

## Impact

- Affected specs: `onboarding`（修改既有「五步驟」需求為八步驟、新增三個 tutorial 步驟的 coachmark 需求；step 2 不可 skip 的語意維持不變）。
- Affected code：
  - `apps/web/src/components/onboarding/OnboardingTutorial.tsx`：擴充 step 列表，由 5 個 step 變 8 個 step。
  - `apps/web/src/components/onboarding/`：新增 `EditAccountBookTutorial.tsx`、`AddMemberTutorial.tsx`、`ManageCategoriesTutorial.tsx`（命名以最終決議為準）三個 tutorial 元件。
  - 帳本設定頁與成員、分類管理入口的元件（例如 [`AccountBookMenu.tsx`](apps/web/src/components/accountBook/AccountBookMenu.tsx) 一帶、帳本設定/分類管理頁面）：新增 `data-onboarding-anchor` 標記。
  - `apps/web/src/i18n/messages/en-US.json`、`apps/web/src/i18n/messages/zh-TW.json`：新增三個 step 的文案 key。
  - `apps/web/src/pages/onboarding/index.tsx`：路由與 step 列舉同步更新。
- 依賴：本變更建立在既有 `onboarding` spec（由 `add-i18n-and-onboarding` 寫入）之上，並與 `expand-onboarding-step3-substeps` 並行；該提案針對「原 step 3」做子步驟拆分，本提案僅在其前方插入三個新 step。若兩個變更同時推進，archive 順序應協調：本變更先 archive 時，`expand-onboarding-step3-substeps` 需把「step 3」更新為「step 6」；反之亦然。
