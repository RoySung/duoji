## 1. 建立 architecture-layers 規格

- [x] 1.1 將 `specs/architecture-layers/spec.md` 從 change 目錄歸檔至 `openspec/specs/architecture-layers/spec.md`，涵蓋以下四項 Requirement：entity layer is pure and dependency-free、repo layer is accessed only through usecase layer、usecase layer coordinates repo and exposes state to UI、dependency direction flows inward only；並確認 dependency rule（依賴方向採單向內縮（dependency rule））說明完整

## 2. 驗證 usecase 層定義為 hooks 與 store

- [x] 2.1 確認 `openspec/specs/architecture-layers/spec.md` 中明確說明 usecase 層定義為 hooks 與 store，並列舉 hooks（局部狀態）與 store（全域狀態）的適用場景差異

## 3. 更新專案開發指引

- [x] 3.1 在 `CLAUDE.md` 中加入 clean architecture 分層規範的摘要說明，指向 `openspec/specs/architecture-layers/spec.md`
