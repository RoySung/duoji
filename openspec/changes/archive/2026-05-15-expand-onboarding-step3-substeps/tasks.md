## 1. Pre-work

- [x] 1.1 確認 `add-i18n-and-onboarding` 變更已 archive（其建立的 `openspec/specs/onboarding/spec.md` 必須先存在），否則 archive 順序為先 `add-i18n-and-onboarding` 再本變更。
- [x] 1.2 盤點交易建立 modal/表單的 DOM 結構（金額輸入、分類選擇器、付款人、分攤、送出按鈕），列出將新增 `data-onboarding-anchor` 的具體元素位置。

## 2. DOM anchors

- [x] 2.1 為交易建立按鈕之外的 5 個錨點新增 `data-onboarding-anchor` 屬性（`transaction-form-amount`、`transaction-form-category`、`transaction-form-payer`、`transaction-form-split`、`transaction-form-submit`），落實設計決策 Add DOM anchors instead of refactoring form components。
- [x] 2.2 確認既有 `transaction-form-amount` 等錨點命名與 `create-transaction` 同層級慣例一致；如有衝突，更新 selector 文件註解。

## 3. Tutorial 基礎重構

- [x] 3.1 修改 `apps/web/src/components/onboarding/OnboardingTutorial.tsx`，讓單一 `step: 3 | 4 | 5` 可攜帶多個 `StepType`，落實設計決策 Use reactour native multi-step within a single OnboardingTutorial instance。
- [x] 3.2 維持「Step 3 does not expand the global onboarding progress display」需求：sub-step 切換時不變更 onboarding 進度指示與路由 query。
- [x] 3.3 沿用既有的 `advance()` 行為：跳過或最終子步驟完成後路由切到 step 4，確保 Tutorial steps overlay coachmarks on real pages 的既有導航不被破壞。

## 4. 六個子步驟定義

- [x] 4.1 在 `apps/web/src/components/onboarding/TransactionTutorial.tsx` 定義 6 個子步驟陣列，selector 對應步驟 1–6 的錨點，實作需求 Step 3 walks the user through six transaction-creation sub-steps。
- [x] 4.2 為每個子步驟提供標題與描述 i18n key（`onboarding.step3.sub1.title` … `onboarding.step3.sub6.title` 與對應 description）。
- [x] 4.3 在 `apps/web/src/i18n/messages/en-US.json` 與 `apps/web/src/i18n/messages/zh-TW.json` 新增 12 個 i18n 訊息字串（6 個 title、6 個 description）。

## 5. 子步驟推進邏輯

- [x] 5.1 新增 `useOnboardingStepAdvance` 自訂 hook 於 `apps/web/src/components/onboarding/`，集中管理 DOM event listener 註冊與 reactour `setCurrentStep` 呼叫，落實設計決策 Substep advancement is operation-driven; reactour Next button is fallback 與 Operation-driven advancement implemented via DOM-event listeners。（實作為 `TransactionTutorialAdvancer` 元件，與 hook 等價）
- [x] 5.2 子步驟 1 → 2：監聽建立按鈕 click 事件後推進。
- [x] 5.3 子步驟 2 → 3：監聽金額輸入欄位 `input`/`change`，非零、非空時推進。
- [x] 5.4 子步驟 3、4、5 顯示 reactour Next 按鈕作為後備推進手段，實作需求 Step 3 sub-steps advance via user operation, with a fallback "next" button when no completion event exists。
- [x] 5.5 子步驟 6：監聽送出按鈕 click / 交易建立成功事件，完成後呼叫 `advance()` 進到 step 4。（採 SelectorWaiter 1500ms 逾時推進；送出成功 modal 關閉後 selector 消失即自動進 step 4）

## 6. 子步驟錨點等待

- [x] 6.1 在 `SelectorWaiter` 內實作 selector 等待：先 `querySelector`，找不到則啟動 `MutationObserver` 觀測 DOM，落實設計決策 Wait for substep anchor with timeout, fail open。
- [x] 6.2 設定 1500ms 上限；逾時則呼叫 `advance()` 結束整個 step 3，實作需求 Step 3 sub-step coachmarks wait for their anchor to appear, with a timeout fail-open。
- [x] 6.3 找到錨點後通知 reactour 重新定位 coachmark（reactour 在 `setCurrentStep(idx)` 後會自行重新查詢 selector，無需額外通知）。

## 7. 略過行為

- [x] 7.1 在每個子步驟 coachmark 內顯示「跳過」按鈕，按下時呼叫既有 `advance()`（離開整個 step 3、前進 step 4），實作需求 Each onboarding step can be skipped 並落實設計決策 Skip leaves entire step 3, not just the substep。
- [x] 7.2 確保跳過時不關閉交易建立 modal、不清空表單，使用者可繼續完成交易。（skip 僅呼叫 `router.replace`，與 modal state 完全解耦）
- [x] 7.3 確保 reactour `onClickClose` 與 mask 點擊行為與既有規格 Tutorial steps overlay coachmarks on real pages 一致（mask 不自動推進）。

## 8. 驗證與測試

- [x] 8.1 撰寫整合測試：模擬使用者依序操作 6 個子步驟，斷言每步 coachmark 出現、操作後自動推進到下一步。
- [x] 8.2 撰寫整合測試：在子步驟 3（分類）按下「跳過」按鈕後，斷言流程直接進入 step 4 而非子步驟 4。
- [x] 8.3 撰寫單元測試：selector 等待邏輯在 1500ms 內找到錨點 vs 逾時的兩條路徑。
- [x] 8.4 手動測試：onboarding 進度顯示在 6 個子步驟間維持「3 / 5」。

## 9. Archive 與文件

- [x] 9.1 跑 `spectra validate expand-onboarding-step3-substeps` 確認無錯誤。
- [x] 9.2 實作完成後跑 `/spectra:archive expand-onboarding-step3-substeps`，將 delta 套用回 `openspec/specs/onboarding/spec.md`。
