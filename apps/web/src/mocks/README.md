# Mock Data

這個資料夾包含專案中使用的所有假資料（mock data）。

## 檔案說明

- **user.ts** - 使用者假資料
- **category.ts** - 交易分類假資料
- **accountBook.ts** - 帳本假資料
- **index.ts** - 統一匯出所有假資料

## 使用方式

```typescript
import { userList, categoryList, accountBookOptions } from '@/mocks'
```

## 注意事項

這些假資料目前用於開發和測試目的。未來當實作真實的 API 連接時，這些資料將被替換為實際的 API 呼叫。
