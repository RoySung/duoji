## Why

專案目前缺乏明確的架構分層規範，導致職責邊界模糊（例如頁面直接呼叫 repo）。建立 clean architecture 規範，確保 entity、usecase（hooks/store）、repo 各層職責清晰、不越界。

## What Changes

- 新增 `architecture-layers` 規格，定義三層架構的職責與依賴規則
- 明確規範：
  - `entity`：純資料結構與領域邏輯，不得依賴 repo 或 UI 框架
  - `usecase`（hooks、store）：業務邏輯協調層，透過 repo 取資料，不得直接操作 storage
  - `repo`：資料存取抽象層，不得被 UI components 直接呼叫，需透過 usecase 層

## Non-Goals (optional)

- 不規範具體的資料夾結構（超出架構分層範疇）
- 不強制引入 DI 框架或 interface 抽象
- 不修改現有程式碼（屬於 apply 階段的 refactor 工作）

## Capabilities

### New Capabilities

- `architecture-layers`: 定義 entity、usecase、repo 三層的職責、依賴方向與禁止的跨層呼叫規則

### Modified Capabilities

(none)

## Impact

- Affected specs: 新增 `openspec/specs/architecture-layers/spec.md`
- Affected code: 規格文件，不直接影響程式碼；後續 apply 階段可能 refactor 違規呼叫（如本次 settlement page 的修正即為典型案例）
