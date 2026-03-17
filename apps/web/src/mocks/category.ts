import { Category } from '@/entities/transaction'

// Expense Categories - 支出分類
export const expenseCategoryList: Category[] = [
  // 主分類 - 餐飲
  { id: '1', name: 'Food & Dining', description: 'Food and dining related expenses', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:utensils.svg?color=%23666666&width=100&height=100', parentId: null },
  { id: '1-1', name: 'Breakfast', description: 'Breakfast expenses', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:coffee.svg?color=%23666666&width=100&height=100', parentId: '1' },
  { id: '1-2', name: 'Lunch', description: 'Lunch expenses', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:sandwich.svg?color=%23666666&width=100&height=100', parentId: '1' },
  { id: '1-3', name: 'Dinner', description: 'Dinner expenses', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:chef-hat.svg?color=%23666666&width=100&height=100', parentId: '1' },
  { id: '1-4', name: 'Snacks', description: 'Snacks and treats', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:cookie.svg?color=%23666666&width=100&height=100', parentId: '1' },

  // 主分類 - 購物
  { id: '2', name: 'Shopping', description: 'Various product purchases', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:shopping-bag.svg?color=%23666666&width=100&height=100', parentId: null },
  { id: '2-1', name: 'Clothing', description: 'Clothes and accessories', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:shirt.svg?color=%23666666&width=100&height=100', parentId: '2' },
  { id: '2-2', name: 'Books', description: 'Books and learning materials', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:book-open.svg?color=%23666666&width=100&height=100', parentId: '2' },
  { id: '2-3', name: 'Electronics', description: 'Electronic devices and accessories', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:smartphone.svg?color=%23666666&width=100&height=100', parentId: '2' },

  // 主分類 - 交通
  { id: '3', name: 'Transportation', description: 'Transportation and travel expenses', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100', parentId: null },
  { id: '3-1', name: 'Public Transit', description: 'Bus, subway, and other public transportation', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:bus.svg?color=%23666666&width=100&height=100', parentId: '3' },
  { id: '3-2', name: 'Taxi/Ride-share', description: 'Taxi and ride-sharing services', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:taxi.svg?color=%23666666&width=100&height=100', parentId: '3' },
  { id: '3-3', name: 'Gas', description: 'Fuel and gas expenses', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:fuel.svg?color=%23666666&width=100&height=100', parentId: '3' },

  // 主分類 - 娛樂
  { id: '4', name: 'Entertainment', description: 'Entertainment and leisure activities', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:music.svg?color=%23666666&width=100&height=100', parentId: null },
  { id: '4-1', name: 'Movies', description: 'Cinema and movie expenses', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:film.svg?color=%23666666&width=100&height=100', parentId: '4' },
  { id: '4-2', name: 'Music', description: 'Music and concert expenses', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:music.svg?color=%23666666&width=100&height=100', parentId: '4' },
  { id: '4-3', name: 'Games', description: 'Video games and gaming', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:gamepad-2.svg?color=%23666666&width=100&height=100', parentId: '4' },

  // 主分類 - 醫療保健
  { id: '5', name: 'Healthcare', description: 'Medical and health expenses', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:heart-pulse.svg?color=%23666666&width=100&height=100', parentId: null },
  { id: '5-1', name: 'Doctor Visits', description: 'Medical consultations', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:stethoscope.svg?color=%23666666&width=100&height=100', parentId: '5' },
  { id: '5-2', name: 'Medications', description: 'Prescription and over-the-counter drugs', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:pill.svg?color=%23666666&width=100&height=100', parentId: '5' },

  // 主分類 - 教育
  { id: '6', name: 'Education', description: 'Education and learning expenses', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:graduation-cap.svg?color=%23666666&width=100&height=100', parentId: null },
  { id: '6-1', name: 'Tuition', description: 'School and course fees', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:school.svg?color=%23666666&width=100&height=100', parentId: '6' },
  { id: '6-2', name: 'Books & Materials', description: 'Educational books and materials', type: 'expense', imageUrl: 'https://api.iconify.design/lucide:book.svg?color=%23666666&width=100&height=100', parentId: '6' },
]

// Income Categories - 收入分類
export const incomeCategoryList: Category[] = [
  // 主分類 - 薪資
  { id: '101', name: 'Salary', description: 'Regular salary and wages', type: 'income', imageUrl: 'https://api.iconify.design/lucide:banknote.svg?color=%23666666&width=100&height=100', parentId: null },
  { id: '101-1', name: 'Base Salary', description: 'Monthly base salary', type: 'income', imageUrl: 'https://api.iconify.design/lucide:wallet.svg?color=%23666666&width=100&height=100', parentId: '101' },
  { id: '101-2', name: 'Overtime', description: 'Overtime pay', type: 'income', imageUrl: 'https://api.iconify.design/lucide:clock.svg?color=%23666666&width=100&height=100', parentId: '101' },
  { id: '101-3', name: 'Bonus', description: 'Performance bonuses', type: 'income', imageUrl: 'https://api.iconify.design/lucide:gift.svg?color=%23666666&width=100&height=100', parentId: '101' },

  // 主分類 - 投資
  { id: '102', name: 'Investment', description: 'Investment returns and gains', type: 'income', imageUrl: 'https://api.iconify.design/lucide:trending-up.svg?color=%23666666&width=100&height=100', parentId: null },
  { id: '102-1', name: 'Stocks', description: 'Stock dividends and gains', type: 'income', imageUrl: 'https://api.iconify.design/lucide:line-chart.svg?color=%23666666&width=100&height=100', parentId: '102' },
  { id: '102-2', name: 'Bonds', description: 'Bond interest and returns', type: 'income', imageUrl: 'https://api.iconify.design/lucide:file-text.svg?color=%23666666&width=100&height=100', parentId: '102' },
  { id: '102-3', name: 'Real Estate', description: 'Property rental income', type: 'income', imageUrl: 'https://api.iconify.design/lucide:building.svg?color=%23666666&width=100&height=100', parentId: '102' },

  // 主分類 - 副業
  { id: '103', name: 'Side Business', description: 'Side business and freelance income', type: 'income', imageUrl: 'https://api.iconify.design/lucide:briefcase.svg?color=%23666666&width=100&height=100', parentId: null },
  { id: '103-1', name: 'Freelance', description: 'Freelance project income', type: 'income', imageUrl: 'https://api.iconify.design/lucide:laptop.svg?color=%23666666&width=100&height=100', parentId: '103' },
  { id: '103-2', name: 'Consulting', description: 'Consulting services', type: 'income', imageUrl: 'https://api.iconify.design/lucide:users.svg?color=%23666666&width=100&height=100', parentId: '103' },

  // 主分類 - 其他收入
  { id: '104', name: 'Other Income', description: 'Miscellaneous income sources', type: 'income', imageUrl: 'https://api.iconify.design/lucide:plus-circle.svg?color=%23666666&width=100&height=100', parentId: null },
  { id: '104-1', name: 'Cashback', description: 'Cashback and rewards', type: 'income', imageUrl: 'https://api.iconify.design/lucide:credit-card.svg?color=%23666666&width=100&height=100', parentId: '104' },
  { id: '104-2', name: 'Refunds', description: 'Product returns and refunds', type: 'income', imageUrl: 'https://api.iconify.design/lucide:undo.svg?color=%23666666&width=100&height=100', parentId: '104' },
]

// 合併所有分類
export const categoryList: Category[] = [
  ...expenseCategoryList,
  ...incomeCategoryList,
]
