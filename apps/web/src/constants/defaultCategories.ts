import { Category } from '@/entities/category'
import { CATEGORY_ICONS } from '@/constants/categoryIcons'
import { genUuid } from '@/utils/genUuid'
import type { Language } from '@/entities/settings'

const I = CATEGORY_ICONS

type DefaultCategoryRaw = {
  name: string
  description: string
  icon: keyof typeof CATEGORY_ICONS
  children?: DefaultCategoryRaw[]
}

const EN_US_EXPENSE: DefaultCategoryRaw[] = [
  {
    name: 'Food & Dining',
    description: 'Food and dining related expenses',
    icon: 'utensils',
    children: [
      { name: 'Breakfast', description: 'Breakfast expenses', icon: 'coffee' },
      { name: 'Lunch', description: 'Lunch expenses', icon: 'sandwich' },
      { name: 'Dinner', description: 'Dinner expenses', icon: 'chef-hat' },
      { name: 'Snacks', description: 'Snacks and treats', icon: 'cookie' },
    ],
  },
  {
    name: 'Shopping',
    description: 'Various product purchases',
    icon: 'shopping-bag',
    children: [
      { name: 'Clothing', description: 'Clothes and accessories', icon: 'shirt' },
      { name: 'Books', description: 'Books and learning materials', icon: 'book-open' },
      { name: 'Electronics', description: 'Electronic devices and accessories', icon: 'smartphone' },
    ],
  },
  {
    name: 'Transportation',
    description: 'Transportation and travel expenses',
    icon: 'car',
    children: [
      { name: 'Public Transit', description: 'Bus, subway, and other public transportation', icon: 'bus' },
      { name: 'Taxi/Ride-share', description: 'Taxi and ride-sharing services', icon: 'taxi' },
      { name: 'Gas', description: 'Fuel and gas expenses', icon: 'fuel' },
    ],
  },
  {
    name: 'Entertainment',
    description: 'Entertainment and leisure activities',
    icon: 'music',
    children: [
      { name: 'Movies', description: 'Cinema and movie expenses', icon: 'film' },
      { name: 'Music', description: 'Music and concert expenses', icon: 'music' },
      { name: 'Games', description: 'Video games and gaming', icon: 'gamepad-2' },
    ],
  },
  {
    name: 'Healthcare',
    description: 'Medical and health expenses',
    icon: 'heart-pulse',
    children: [
      { name: 'Doctor Visits', description: 'Medical consultations', icon: 'stethoscope' },
      { name: 'Medications', description: 'Prescription and over-the-counter drugs', icon: 'pill' },
    ],
  },
  {
    name: 'Education',
    description: 'Education and learning expenses',
    icon: 'graduation-cap',
    children: [
      { name: 'Tuition', description: 'School and course fees', icon: 'school' },
      { name: 'Books & Materials', description: 'Educational books and materials', icon: 'book' },
    ],
  },
]

const ZH_TW_EXPENSE: DefaultCategoryRaw[] = [
  {
    name: '餐飲',
    description: '餐飲相關支出',
    icon: 'utensils',
    children: [
      { name: '早餐', description: '早餐支出', icon: 'coffee' },
      { name: '午餐', description: '午餐支出', icon: 'sandwich' },
      { name: '晚餐', description: '晚餐支出', icon: 'chef-hat' },
      { name: '便利商店', description: '超商購物與餐點', icon: 'shopping-bag' },
      { name: '夜市攤販', description: '夜市與路邊攤支出', icon: 'utensils' },
      { name: '零食', description: '零食與點心', icon: 'cookie' },
    ],
  },
  {
    name: '購物',
    description: '各類商品購買',
    icon: 'shopping-bag',
    children: [
      { name: '服飾', description: '衣物與配件', icon: 'shirt' },
      { name: '書籍', description: '書籍與學習材料', icon: 'book-open' },
      { name: '電子產品', description: '電子裝置與配件', icon: 'smartphone' },
    ],
  },
  {
    name: '交通',
    description: '交通與旅遊支出',
    icon: 'car',
    children: [
      { name: '大眾運輸', description: '公車、捷運等大眾運輸', icon: 'bus' },
      { name: '計程車/共乘', description: '計程車與共乘服務', icon: 'taxi' },
      { name: '加油', description: '燃料與加油支出', icon: 'fuel' },
    ],
  },
  {
    name: '娛樂',
    description: '娛樂與休閒活動',
    icon: 'music',
    children: [
      { name: '電影', description: '電影院與電影支出', icon: 'film' },
      { name: '音樂', description: '音樂與演唱會支出', icon: 'music' },
      { name: '遊戲', description: '電玩與遊戲', icon: 'gamepad-2' },
    ],
  },
  {
    name: '醫療',
    description: '醫療與保健支出',
    icon: 'heart-pulse',
    children: [
      { name: '看診', description: '醫療諮詢', icon: 'stethoscope' },
      { name: '藥品', description: '處方與非處方藥物', icon: 'pill' },
      { name: '健保自付額', description: '健保部分負擔費用', icon: 'credit-card' },
    ],
  },
  {
    name: '教育',
    description: '教育與學習支出',
    icon: 'graduation-cap',
    children: [
      { name: '學費', description: '學校與課程費用', icon: 'school' },
      { name: '書本與教材', description: '教育用書與教材', icon: 'book' },
    ],
  },
]

const EN_US_INCOME: DefaultCategoryRaw[] = [
  {
    name: 'Salary',
    description: 'Regular salary and wages',
    icon: 'banknote',
    children: [
      { name: 'Base Salary', description: 'Monthly base salary', icon: 'wallet' },
      { name: 'Overtime', description: 'Overtime pay', icon: 'clock' },
      { name: 'Bonus', description: 'Performance bonuses', icon: 'gift' },
    ],
  },
  {
    name: 'Investment',
    description: 'Investment returns and gains',
    icon: 'trending-up',
    children: [
      { name: 'Stocks', description: 'Stock dividends and gains', icon: 'line-chart' },
      { name: 'Bonds', description: 'Bond interest and returns', icon: 'file-text' },
      { name: 'Real Estate', description: 'Property rental income', icon: 'building' },
    ],
  },
  {
    name: 'Side Business',
    description: 'Side business and freelance income',
    icon: 'briefcase',
    children: [
      { name: 'Freelance', description: 'Freelance project income', icon: 'laptop' },
      { name: 'Consulting', description: 'Consulting services', icon: 'users' },
    ],
  },
  {
    name: 'Other Income',
    description: 'Miscellaneous income sources',
    icon: 'plus-circle',
    children: [
      { name: 'Cashback', description: 'Cashback and rewards', icon: 'credit-card' },
      { name: 'Refunds', description: 'Product returns and refunds', icon: 'undo' },
    ],
  },
]

const ZH_TW_INCOME: DefaultCategoryRaw[] = [
  {
    name: '薪資',
    description: '固定薪資與工資',
    icon: 'banknote',
    children: [
      { name: '底薪', description: '每月底薪', icon: 'wallet' },
      { name: '加班費', description: '加班報酬', icon: 'clock' },
      { name: '獎金', description: '績效獎金', icon: 'gift' },
    ],
  },
  {
    name: '投資',
    description: '投資報酬與收益',
    icon: 'trending-up',
    children: [
      { name: '股票', description: '股利與股票收益', icon: 'line-chart' },
      { name: '債券', description: '債券利息與報酬', icon: 'file-text' },
      { name: '不動產', description: '不動產租金收入', icon: 'building' },
    ],
  },
  {
    name: '副業',
    description: '副業與接案收入',
    icon: 'briefcase',
    children: [
      { name: '接案', description: '接案專案收入', icon: 'laptop' },
      { name: '顧問', description: '顧問服務', icon: 'users' },
    ],
  },
  {
    name: '其他收入',
    description: '其他雜項收入',
    icon: 'plus-circle',
    children: [
      { name: '現金回饋', description: '現金回饋與獎勵', icon: 'credit-card' },
      { name: '退款', description: '退貨與退款', icon: 'undo' },
    ],
  },
]

const EXPENSE_BY_LOCALE: Record<Language, DefaultCategoryRaw[]> = {
  'en-US': EN_US_EXPENSE,
  'zh-TW': ZH_TW_EXPENSE,
}

const INCOME_BY_LOCALE: Record<Language, DefaultCategoryRaw[]> = {
  'en-US': EN_US_INCOME,
  'zh-TW': ZH_TW_INCOME,
}

function buildCategories(
  tree: DefaultCategoryRaw[],
  accountBookId: string,
  type: 'expense' | 'income',
  startSortOrder: number
): Category[] {
  const out: Category[] = []
  let order = startSortOrder
  for (const node of tree) {
    const parentId = genUuid()
    out.push({
      id: parentId,
      name: node.name,
      description: node.description,
      type,
      imageUrl: I[node.icon],
      parentId: null,
      accountBookId,
      sortOrder: order++,
    })
    for (const child of node.children ?? []) {
      out.push({
        id: genUuid(),
        name: child.name,
        description: child.description,
        type,
        imageUrl: I[child.icon],
        parentId,
        accountBookId,
        sortOrder: order++,
      })
    }
  }
  return out
}

export function getDefaultExpenseCategories(
  accountBookId: string,
  locale: Language = 'en-US',
  startSortOrder = 0
): Category[] {
  const tree = EXPENSE_BY_LOCALE[locale] ?? EXPENSE_BY_LOCALE['en-US']
  return buildCategories(tree, accountBookId, 'expense', startSortOrder)
}

export function getDefaultIncomeCategories(
  accountBookId: string,
  locale: Language = 'en-US',
  startSortOrder = 0
): Category[] {
  const tree = INCOME_BY_LOCALE[locale] ?? INCOME_BY_LOCALE['en-US']
  return buildCategories(tree, accountBookId, 'income', startSortOrder)
}
