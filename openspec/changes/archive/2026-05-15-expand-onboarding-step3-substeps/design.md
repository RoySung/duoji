## Context

Onboarding step 3 目前由 `apps/web/src/components/onboarding/TransactionTutorial.tsx` 包裝一個 `OnboardingTutorial`，內部以 `@reactour/tour` 渲染**單一** `StepType`，selector 為 `[data-onboarding-anchor="create-transaction"]`，使用者按下「下一步」即跳到 step 4（settlement 頁）。

交易建立流程實際上是「點建立按鈕 → 開啟 modal/表單 → 輸入金額 → 選分類 → 設付款人 → 設分攤 → 送出」一連串操作。新使用者按下建立按鈕後 coachmark 就消失，缺乏對 modal 內欄位的引導。需要把 step 3 的單一 coachmark 擴展為 6 個子步驟引導，但**不**改變 onboarding 全域 5 步的進度顯示與路由切換。

主要技術挑戰：
- 子步驟 2–6 的錨點位於 modal/表單內，DOM 在 modal 開啟前不存在，reactour 嘗試定位會找不到元素。
- 子步驟之間應由使用者實際操作驅動推進（按下建立 → 進入「輸入金額」子步驟），而不是 coachmark 自帶的「下一步」按鈕。
- `OnboardingTutorial` 目前的 `steps` 是 `useMemo` 單一陣列，每個 `step: 3 | 4 | 5` 對應**一個** `StepType`；需要重構為允許 step 3 攜帶多個 `StepType`。

## Goals / Non-Goals

**Goals:**

- 在 step 3 內部串接 6 個子步驟引導，使用 `@reactour/tour` 原生的 step index 推進機制。
- 每個子步驟皆能略過；略過任一子步驟即離開整個 step 3，前進到 step 4。
- 子步驟錨點 DOM 在進入該子步驟時若尚未存在，引導器須能等待元素出現後再渲染 coachmark；逾時則優雅結束 step 3。
- 子步驟主要透過使用者實際操作（點擊、表單欄位變更）推進；coachmark 上的「下一步」按鈕僅在無明確完成事件時作為後備推進手段。
- 保持 onboarding 全域 5 步進度顯示、路由切換規則、completion 條件不變。

**Non-Goals:**

- 不為 step 4、step 5 拆子步驟。
- 不引入「子步驟層級的略過」概念（跳過 = 跳整個 step 3）。
- 不支援子步驟「上一步」回退。
- 不變更交易建立 modal/表單的欄位與行為，只新增 DOM 錨點。
- 不修改 onboarding 完成時的 `Settings.onboardingCompleted` 寫入邏輯。

## Decisions

### Use reactour native multi-step within a single OnboardingTutorial instance

把 step 3 的 `steps: StepType[]` 從長度 1 擴展為長度 6，沿用 reactour 的 `currentStep` / `setCurrentStep`。子步驟切換完全在 reactour 內部進行，不觸發 route 切換、不更動 `?onboarding=` query。

**Alternatives considered:**
- *拆成 6 個 `OnboardingTutorial` 元件、用 step `3.1`–`3.6` 編號*：被 onboarding 全域進度 (`progress { current, total: 5 }`) 與 `step: 3 | 4 | 5` 型別綁死，需要重構 `nextHrefAfterStep`、進度顯示、completion 條件，影響面遠大於本變更需求。
- *只把建立 modal 內做成 standalone 教學*：違反「onboarding 由全域 onboardingCompleted 控制」的既有規格，且難以與 step 4 流程串接。

### Substep advancement is operation-driven; reactour Next button is fallback

子步驟推進規則：

| 子步驟 | 推進事件 | Coachmark Next 按鈕 |
|---|---|---|
| 1. 點擊建立 | 偵測到「建立」按鈕被按下（modal 開啟） | 隱藏 |
| 2. 輸入金額 | 偵測到金額欄位有非零輸入 | 隱藏 |
| 3. 選擇分類 | 偵測到分類被選定 | 顯示為後備 |
| 4. 設定誰付款 | 偵測到付款人被選定 | 顯示為後備 |
| 5. 設定分攤 | 偵測到分攤被設定 | 顯示為後備 |
| 6. 建立紀錄 | 偵測到送出按鈕被按下 / 交易建立成功 | 隱藏 |

實作上由 `TransactionTutorial`（或新建的 `TransactionTutorialController`）監聽相應事件（DOM event listener 或 store/hook subscription），呼叫 reactour 的 `setCurrentStep(n + 1)` 推進。

**Alternatives considered:**
- *純靠 coachmark Next 按鈕推進*：使用者通常先操作 UI 再回看 coachmark，會出現「coachmark 還停在『輸入金額』但金額已填好」的不一致感。
- *用 MutationObserver 推斷狀態*：太脆弱、selector 變動易壞。優先用 store/hook subscription，DOM event 為次。

### Wait for substep anchor with timeout, fail open

子步驟 2–6 的錨點 DOM 在 modal 未開啟前不存在。進入子步驟時：

1. 嘗試 `document.querySelector(selector)`。
2. 若不存在，啟動最多 1500ms 的 `MutationObserver` 觀測 DOM 變化。
3. 找到後通知 reactour 重新定位 coachmark。
4. 1500ms 內仍找不到 → 視為使用者跳過 modal 或欄位未渲染，靜默結束整個 step 3，呼叫 `advance()` 前進 step 4。

**Alternatives considered:**
- *直接顯示 coachmark 於頁面預設位置*：reactour 找不到 selector 會 throw 或停在錯誤位置，UX 不可接受。
- *無限等待*：使用者可能已經放棄或退出 modal，會卡住 onboarding。

### Skip leaves entire step 3, not just the substep

每個子步驟 coachmark 都顯示「跳過」按鈕，按下後呼叫既有 `advance()`（route 切到 step 4），與目前 step 3 的跳過行為一致。**不**提供「只跳過這個子步驟」的選項，避免子步驟略過產生的中間狀態與文案爆炸。

**Alternatives considered:**
- *子步驟層級略過*：6 個子步驟 × 略過後跳到哪裡，組合複雜；且使用者語意上的「跳過」通常意指離開教學，而非繼續看下一個提示。

### Add DOM anchors instead of refactoring form components

在交易建立 modal/表單的金額、分類、付款人、分攤、送出按鈕新增 `data-onboarding-anchor="…"` 屬性，selector 沿用既有 `[data-onboarding-anchor="…"]` 慣例（見現行 `create-transaction` 錨點）。不重構表單元件結構。

### Operation-driven advancement implemented via DOM-event listeners

優先用 DOM event（`click`、`change`、`input`）而非額外引入 store hook 訂閱；交易表單的內部 state 多半本來就在 React 元件內部、未抬升到 store。新增一個 `useOnboardingStepAdvance` 自訂 hook，集中管理 listener 註冊與 reactour 推進。

**Alternatives considered:**
- *把交易表單 state 抬升到 store*：超出本變更範圍，與架構分層原則衝突（usecase ⇄ entity）。
- *Imperative `ref` 介面*：對既有元件侵入大。

## Risks / Trade-offs

- [子步驟錨點 DOM 標記散落在交易建立表單多處] → 統一以 `data-onboarding-anchor="transaction-form-{field}"` 命名規範集中於同一處 PR；同時在 spec 中要求測試斷言錨點存在。
- [Modal 開啟過程動畫導致 selector 短暫不可見] → `MutationObserver` 等待 + 1500ms 容忍即可吸收動畫時間；若仍偶發失敗，將動畫時間納入容忍上限調整。
- [使用者跳過子步驟 N 後仍想完成交易] → 跳過離開的是 onboarding 教學覆蓋層，**不**關閉 modal、**不**清空表單；使用者可繼續操作，但 step 3 視為完成。
- [現有 `OnboardingTutorial.steps` `useMemo` 依賴陣列只含 `[selector, step, titleKey, descriptionKey, accountBookId]`] → 重構需擴展讓 step 3 支援多個子步驟描述，注意 useMemo 依賴正確涵蓋子步驟陣列。
- [`add-i18n-and-onboarding` 尚未 archive，onboarding spec 仍在 change 目錄] → 本變更撰寫 delta（MODIFIED Requirements），analyzer 可能因 `openspec/specs/onboarding/` 不存在而提出警告；archive 順序須先 archive 父變更、再 archive 本變更。在 tasks 中明示。
- [Coachmark 在 modal 之上的 z-index 衝突] → 沿用既有 `zIndex: 100001` / mask 99999，必要時於子步驟對應 modal 提升 popover z-index。
