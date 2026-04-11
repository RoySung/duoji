## Context

目前 `settlementStore` 是一個 Zustand vanilla store，透過 React Context 提供給子元件，掛載於 `_app.tsx` 全域層級。

實際使用情況：
- 只有兩個頁面使用：`settlement/index.tsx` 和 `settlement/[recordId].tsx`
- 兩個頁面都在自己的 `useEffect` 中各自呼叫 `initialize`，沒有利用到跨頁面的狀態共享
- store 的使用點都在頁面頂層，沒有深層子元件需要透過 context 存取

架構規範（`architecture-layers`）定義：hooks = local state，stores = global/shared state。Settlement 屬於頁面範疇狀態，應用 hook 更符合規範。

## Goals / Non-Goals

**Goals:**

- 建立 `useSettlement` hook，封裝所有 settlement 狀態管理邏輯
- 移除 `settlementStore` 相關的 store、provider、context 基礎設施
- 維持兩個 settlement 頁面的功能行為不變

**Non-Goals:**

- 不修改 repo 層（`SettlementLocalRepo`）
- 不修改 settlement 計算邏輯（`settlementUtils`）
- 不引入跨頁面快取機制

## Decisions

### useSettlement hook 的介面設計

Hook 接收 `accountBookId` 和可選的 `transactions`，回傳所有原本 store 提供的狀態與 action。

```ts
function useSettlement(
  accountBookId: string | null,
  transactions?: Transaction[]
): {
  records: SettlementRecord[]
  memberStatuses: SettlementMemberStatus[]
  transferSuggestions: SettlementTransfer[]
  isLoading: boolean
  error: string | null
  createSettlementRecord: (transactions: Transaction[]) => Promise<void>
  completeTransfer: (recordId: string, transferId: string, actualAmount: number, note: string) => Promise<void>
}
```

**理由**：`index.tsx` 需要 `transactions` 來計算 memberStatuses；`[recordId].tsx` 不需要（傳入空陣列或省略），只需要 `records` 和 `completeTransfer`。統一介面讓兩個頁面都能使用同一個 hook。

**替代方案考慮**：拆成兩個 hook（`useSettlementSummary` 和 `useSettlementRecord`）—— 過度設計，目前沒有必要。

### 內部狀態管理方式

使用 `useState` + `useEffect` 管理本地狀態，不引入 Zustand。

**理由**：hook 的狀態只活在頁面元件的生命週期內，不需要 Zustand 的跨元件訂閱機制。`useState` 就足夠，且更簡單。

### 初始化觸發方式

在 hook 內部透過 `useEffect` 監聽 `accountBookId` 和 `transactions` 的變化來自動觸發 fetch，不再暴露 `initialize` action。

**理由**：消除頁面手動呼叫 `initialize` 的需要，讓 hook 本身負責資料的初始化與同步。

## Risks / Trade-offs

- **重複 fetch**：`[recordId].tsx` 目前傳入空陣列給 `initialize`，改用 hook 後同樣行為。如果未來需要跨頁快取（例如從 detail 返回 index 時不重新 fetch），需要重新評估。目前接受這個 trade-off。
- **React re-render 差異**：Zustand 有 selector-based 細粒度訂閱；`useState` 是整個 hook 狀態一起更新。由於目前頁面複雜度低，這不是問題。
