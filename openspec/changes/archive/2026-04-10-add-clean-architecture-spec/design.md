## Context

目前專案已有 entity、repo、hooks/store 等模組，但沒有任何文件規範它們之間的依賴方向。在 settlement 頁面修正過程中發現頁面直接呼叫 `TransactionLocalRepo`，繞過了 usecase 層，這是缺乏架構規範的典型產物。本設計文件定義三層架構的邊界規則，作為後續開發與 code review 的依據。

## Goals / Non-Goals

**Goals:**

- 定義 entity、usecase、repo 三層的職責邊界
- 明確依賴方向（dependency rule）：外層可依賴內層，內層不可依賴外層
- 提供每層的允許與禁止行為清單，方便 code review 參考

**Non-Goals:**

- 不規範資料夾結構或命名慣例（另議）
- 不引入 interface 抽象或 DI 容器
- 不要求立即 refactor 所有違規程式碼（spec 先行，refactor 按優先順序排）

## Decisions

### 依賴方向採單向內縮（Dependency Rule）

UI / Page → Usecase（hooks、store）→ Repo → Entity

- Entity 是最內層，不依賴任何其他層
- Repo 只依賴 Entity（資料結構）
- Usecase（hooks、store）依賴 Repo 取資料，依賴 Entity 做運算
- UI components / pages 只透過 Usecase 層取得資料與觸發操作，不得直接呼叫 Repo

**備選方案**：允許 page 直接呼叫 repo（目前現狀）。拒絕理由：導致業務邏輯散落在 UI 層，難以測試與複用。

### Usecase 層定義為 hooks 與 store

React hooks（`use*`）和 Zustand store 都屬於 usecase 層，負責協調 repo 呼叫與 UI 狀態。兩者的差別：

- **hooks**：與特定 component 生命週期綁定的局部狀態（如 `useAccountBookTransactions`）
- **store**：跨 component 共用的全域狀態（如 `useAccountBookStore`）

## Risks / Trade-offs

- [風險] 既有程式碼有多處違規（page 直接呼叫 repo） → 緩和策略：規格先行，以 code review 逐步修正，不強制一次性全面 refactor
- [取捨] 不引入 interface 讓 repo 可被替換 → 降低初期複雜度，接受 repo 實作與 usecase 耦合的現況
