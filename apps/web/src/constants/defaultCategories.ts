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
    description: 'Food and beverage related expenses',
    icon: 'utensils',
    children: [
      { name: 'Breakfast', description: 'Breakfast expenses', icon: 'coffee' },
      { name: 'Lunch', description: 'Lunch expenses', icon: 'sandwich' },
      { name: 'Dinner', description: 'Dinner expenses', icon: 'chef-hat' },
      { name: 'Drinks', description: 'Beverages, coffee, and tea expenses', icon: 'coffee' },
      { name: 'Snacks', description: 'Snacks and dessert expenses', icon: 'cookie' },
      { name: 'Groceries', description: 'Grocery shopping and ingredients', icon: 'shopping-bag' },
    ],
  },
  {
    name: 'Everyday Shopping',
    description: 'Daily essentials and shopping expenses',
    icon: 'shopping-bag',
    children: [
      { name: 'Daily Essentials', description: 'Household supplies and consumables', icon: 'shopping-bag' },
      { name: 'Clothing', description: 'Clothes and accessories', icon: 'shirt' },
      { name: 'Electronics & Appliances', description: 'Electronics and home appliances', icon: 'smartphone' },
    ],
  },
  {
    name: 'Transportation',
    description: 'Daily transportation expenses',
    icon: 'car',
    children: [
      { name: 'Public Transit', description: 'Bus, subway, and other public transportation', icon: 'bus' },
      { name: 'Taxi', description: 'Taxi and ride-hailing fares', icon: 'taxi' },
      { name: 'Fuel', description: 'Fuel and gas expenses', icon: 'fuel' },
      { name: 'Parking', description: 'Parking fees and expenses', icon: 'parking' },
    ],
  },
  {
    name: 'Travel',
    description: 'Travel and outing expenses',
    icon: 'building',
    children: [
      { name: 'Accommodation', description: 'Hotels and lodging expenses', icon: 'building' },
      { name: 'Tickets / Flights', description: 'Travel tickets and airfare', icon: 'file-text' },
      { name: 'Attractions & Activities', description: 'Sightseeing tickets and activity fees', icon: 'film' },
    ],
  },
  {
    name: 'Household Bills',
    description: 'Recurring household bills and living expenses',
    icon: 'building',
    children: [
      { name: 'Rent', description: 'Rent and housing space costs', icon: 'building' },
      { name: 'Water Bill', description: 'Water utility expenses', icon: 'credit-card' },
      { name: 'Electricity Bill', description: 'Electricity and power expenses', icon: 'credit-card' },
      { name: 'Gas Bill', description: 'Gas and natural gas expenses', icon: 'credit-card' },
      { name: 'Internet Bill', description: 'Internet and broadband charges', icon: 'smartphone' },
      { name: 'Phone Bill', description: 'Telecom and phone service charges', icon: 'smartphone' },
    ],
  },
  {
    name: 'Entertainment & Socializing',
    description: 'Entertainment and social activity expenses',
    icon: 'music',
    children: [
      { name: 'Movies & Entertainment', description: 'Movies and general entertainment expenses', icon: 'film' },
      { name: 'Gatherings & Dining', description: 'Social gatherings and shared meals', icon: 'users' },
      { name: 'Gifts', description: 'Gift-giving and social courtesy expenses', icon: 'gift' },
    ],
  },
  {
    name: 'Healthcare',
    description: 'Medical and wellness expenses',
    icon: 'heart-pulse',
    children: [
      { name: 'Doctor Visits', description: 'Medical consultations', icon: 'stethoscope' },
      { name: 'Medications', description: 'Prescription and over-the-counter medicine', icon: 'pill' },
      { name: 'Health Supplies', description: 'Health and personal care supplies', icon: 'heart-pulse' },
    ],
  },
  {
    name: 'Other',
    description: 'Other uncategorized daily expenses',
    icon: 'plus-circle',
    children: [
      { name: 'Learning', description: 'Courses, study, and educational materials', icon: 'school' },
      { name: 'Work', description: 'Work-related supplies and expenses', icon: 'briefcase' },
      { name: 'Pets', description: 'Pet care and pet supply expenses', icon: 'heart-pulse' },
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
      { name: '飲料', description: '飲料、手搖飲與咖啡支出', icon: 'coffee' },
      { name: '點心', description: '點心、零食與甜點支出', icon: 'cookie' },
      { name: '食材費', description: '買菜與食材採買', icon: 'shopping-bag' },
    ],
  },
  {
    name: '日常購物',
    description: '日常用品與購物支出',
    icon: 'shopping-bag',
    children: [
      { name: '日用品', description: '生活用品與消耗品', icon: 'shopping-bag' },
      { name: '服飾', description: '衣物與配件', icon: 'shirt' },
      { name: '3C家電', description: '電子裝置與家電用品', icon: 'smartphone' },
    ],
  },
  {
    name: '交通',
    description: '日常交通支出',
    icon: 'car',
    children: [
      { name: '大眾運輸', description: '公車、捷運等大眾運輸', icon: 'bus' },
      { name: '計程車', description: '計程車搭乘支出', icon: 'taxi' },
      { name: '加油', description: '加油與燃料費用', icon: 'fuel' },
      { name: '停車', description: '停車與車位相關支出', icon: 'parking' },
    ],
  },
  {
    name: '旅遊',
    description: '旅遊與外出行程支出',
    icon: 'building',
    children: [
      { name: '住宿', description: '飯店與住宿支出', icon: 'building' },
      { name: '車票/機票', description: '旅途票券與交通票支出', icon: 'file-text' },
      { name: '景點活動', description: '景點門票與活動費用', icon: 'film' },
    ],
  },
  {
    name: '居家帳單',
    description: '居家固定帳單與生活費用',
    icon: 'building',
    children: [
      { name: '房租', description: '房租與居住空間費用', icon: 'building' },
      { name: '水費', description: '自來水與用水支出', icon: 'credit-card' },
      { name: '電費', description: '用電與電力相關支出', icon: 'credit-card' },
      { name: '瓦斯費', description: '瓦斯與天然氣費用', icon: 'credit-card' },
      { name: '網路費', description: '網路與寬頻費用', icon: 'smartphone' },
      { name: '電話費', description: '電信與通話費用', icon: 'smartphone' },
    ],
  },
  {
    name: '娛樂社交',
    description: '娛樂與社交活動支出',
    icon: 'music',
    children: [
      { name: '電影娛樂', description: '電影與一般娛樂支出', icon: 'film' },
      { name: '聚會聚餐', description: '朋友聚會與社交聚餐支出', icon: 'users' },
      { name: '送禮', description: '送禮與人情往來支出', icon: 'gift' },
    ],
  },
  {
    name: '醫療保健',
    description: '醫療與保健支出',
    icon: 'heart-pulse',
    children: [
      { name: '看診', description: '醫療諮詢', icon: 'stethoscope' },
      { name: '藥品', description: '處方與非處方藥物', icon: 'pill' },
      { name: '保健用品', description: '保健與照護用品支出', icon: 'heart-pulse' },
    ],
  },
  {
    name: '其他',
    description: '其他未歸類的日常支出',
    icon: 'plus-circle',
    children: [
      { name: '學習', description: '學習、課程與教材支出', icon: 'school' },
      { name: '工作', description: '工作所需用品與費用', icon: 'briefcase' },
      { name: '寵物', description: '寵物相關照護與用品支出', icon: 'heart-pulse' },
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
      { name: 'Overtime Pay', description: 'Overtime compensation', icon: 'clock' },
      { name: 'Bonus', description: 'Performance bonuses', icon: 'gift' },
    ],
  },
  {
    name: 'Side Hustle',
    description: 'Side jobs and freelance income',
    icon: 'briefcase',
    children: [
      { name: 'Freelance', description: 'Freelance project income', icon: 'laptop' },
      { name: 'Part-time Work', description: 'Part-time and temporary job income', icon: 'briefcase' },
      { name: 'Consulting', description: 'Consulting service income', icon: 'users' },
    ],
  },
  {
    name: 'Investment',
    description: 'Investment returns and gains',
    icon: 'trending-up',
    children: [
      { name: 'Stocks', description: 'Stock dividends and gains', icon: 'line-chart' },
      { name: 'Interest', description: 'Deposit and investment interest income', icon: 'file-text' },
      { name: 'Real Estate', description: 'Property rental income', icon: 'building' },
    ],
  },
  {
    name: 'Other Income',
    description: 'Miscellaneous income sources',
    icon: 'plus-circle',
    children: [
      { name: 'Refunds', description: 'Product returns and refunds', icon: 'undo' },
      { name: 'Cashback', description: 'Cashback and reward income', icon: 'credit-card' },
      { name: 'Gifts / Allowances', description: 'Gifts, allowances, and temporary income', icon: 'gift' },
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
    name: '副業',
    description: '副業與接案收入',
    icon: 'briefcase',
    children: [
      { name: '接案', description: '接案專案收入', icon: 'laptop' },
      { name: '兼職', description: '兼職與臨時工作收入', icon: 'briefcase' },
      { name: '顧問', description: '顧問服務', icon: 'users' },
    ],
  },
  {
    name: '投資',
    description: '投資報酬與收益',
    icon: 'trending-up',
    children: [
      { name: '股票', description: '股利與股票收益', icon: 'line-chart' },
      { name: '利息', description: '存款與投資利息收入', icon: 'file-text' },
      { name: '不動產', description: '不動產租金收入', icon: 'building' },
    ],
  },
  {
    name: '其他收入',
    description: '其他雜項收入',
    icon: 'plus-circle',
    children: [
      { name: '退款', description: '退貨與退款', icon: 'undo' },
      { name: '現金回饋', description: '現金回饋與獎勵', icon: 'credit-card' },
      { name: '禮金/補助', description: '禮金、補助與臨時收入', icon: 'gift' },
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
