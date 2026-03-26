import { Category } from '@/entities/category'
import { CATEGORY_ICONS } from '@/constants/categoryIcons'
import { genUuid } from '@/utils/genUuid'

const I = CATEGORY_ICONS

export function getDefaultExpenseCategories(
  accountBookId: string,
  startSortOrder = 0
): Category[] {
  const foodId = genUuid()
  const shoppingId = genUuid()
  const transportId = genUuid()
  const entertainmentId = genUuid()
  const healthcareId = genUuid()
  const educationId = genUuid()
  const categories: Array<Omit<Category, 'sortOrder'>> = [
    {
      id: foodId,
      name: 'Food & Dining',
      description: 'Food and dining related expenses',
      type: 'expense',
      imageUrl: I['utensils'],
      parentId: null,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Breakfast',
      description: 'Breakfast expenses',
      type: 'expense',
      imageUrl: I['coffee'],
      parentId: foodId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Lunch',
      description: 'Lunch expenses',
      type: 'expense',
      imageUrl: I['sandwich'],
      parentId: foodId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Dinner',
      description: 'Dinner expenses',
      type: 'expense',
      imageUrl: I['chef-hat'],
      parentId: foodId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Snacks',
      description: 'Snacks and treats',
      type: 'expense',
      imageUrl: I['cookie'],
      parentId: foodId,
      accountBookId,
    },

    {
      id: shoppingId,
      name: 'Shopping',
      description: 'Various product purchases',
      type: 'expense',
      imageUrl: I['shopping-bag'],
      parentId: null,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Clothing',
      description: 'Clothes and accessories',
      type: 'expense',
      imageUrl: I['shirt'],
      parentId: shoppingId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Books',
      description: 'Books and learning materials',
      type: 'expense',
      imageUrl: I['book-open'],
      parentId: shoppingId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      type: 'expense',
      imageUrl: I['smartphone'],
      parentId: shoppingId,
      accountBookId,
    },

    {
      id: transportId,
      name: 'Transportation',
      description: 'Transportation and travel expenses',
      type: 'expense',
      imageUrl: I['car'],
      parentId: null,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Public Transit',
      description: 'Bus, subway, and other public transportation',
      type: 'expense',
      imageUrl: I['bus'],
      parentId: transportId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Taxi/Ride-share',
      description: 'Taxi and ride-sharing services',
      type: 'expense',
      imageUrl: I['taxi'],
      parentId: transportId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Gas',
      description: 'Fuel and gas expenses',
      type: 'expense',
      imageUrl: I['fuel'],
      parentId: transportId,
      accountBookId,
    },

    {
      id: entertainmentId,
      name: 'Entertainment',
      description: 'Entertainment and leisure activities',
      type: 'expense',
      imageUrl: I['music'],
      parentId: null,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Movies',
      description: 'Cinema and movie expenses',
      type: 'expense',
      imageUrl: I['film'],
      parentId: entertainmentId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Music',
      description: 'Music and concert expenses',
      type: 'expense',
      imageUrl: I['music'],
      parentId: entertainmentId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Games',
      description: 'Video games and gaming',
      type: 'expense',
      imageUrl: I['gamepad-2'],
      parentId: entertainmentId,
      accountBookId,
    },

    {
      id: healthcareId,
      name: 'Healthcare',
      description: 'Medical and health expenses',
      type: 'expense',
      imageUrl: I['heart-pulse'],
      parentId: null,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Doctor Visits',
      description: 'Medical consultations',
      type: 'expense',
      imageUrl: I['stethoscope'],
      parentId: healthcareId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Medications',
      description: 'Prescription and over-the-counter drugs',
      type: 'expense',
      imageUrl: I['pill'],
      parentId: healthcareId,
      accountBookId,
    },

    {
      id: educationId,
      name: 'Education',
      description: 'Education and learning expenses',
      type: 'expense',
      imageUrl: I['graduation-cap'],
      parentId: null,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Tuition',
      description: 'School and course fees',
      type: 'expense',
      imageUrl: I['school'],
      parentId: educationId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Books & Materials',
      description: 'Educational books and materials',
      type: 'expense',
      imageUrl: I['book'],
      parentId: educationId,
      accountBookId,
    },
  ]

  return categories.map((category, index) => ({
    ...category,
    sortOrder: startSortOrder + index,
  }))
}

export function getDefaultIncomeCategories(
  accountBookId: string,
  startSortOrder = 0
): Category[] {
  const salaryId = genUuid()
  const investmentId = genUuid()
  const sideBusinessId = genUuid()
  const otherIncomeId = genUuid()
  const categories: Array<Omit<Category, 'sortOrder'>> = [
    {
      id: salaryId,
      name: 'Salary',
      description: 'Regular salary and wages',
      type: 'income',
      imageUrl: I['banknote'],
      parentId: null,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Base Salary',
      description: 'Monthly base salary',
      type: 'income',
      imageUrl: I['wallet'],
      parentId: salaryId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Overtime',
      description: 'Overtime pay',
      type: 'income',
      imageUrl: I['clock'],
      parentId: salaryId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Bonus',
      description: 'Performance bonuses',
      type: 'income',
      imageUrl: I['gift'],
      parentId: salaryId,
      accountBookId,
    },

    {
      id: investmentId,
      name: 'Investment',
      description: 'Investment returns and gains',
      type: 'income',
      imageUrl: I['trending-up'],
      parentId: null,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Stocks',
      description: 'Stock dividends and gains',
      type: 'income',
      imageUrl: I['line-chart'],
      parentId: investmentId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Bonds',
      description: 'Bond interest and returns',
      type: 'income',
      imageUrl: I['file-text'],
      parentId: investmentId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Real Estate',
      description: 'Property rental income',
      type: 'income',
      imageUrl: I['building'],
      parentId: investmentId,
      accountBookId,
    },

    {
      id: sideBusinessId,
      name: 'Side Business',
      description: 'Side business and freelance income',
      type: 'income',
      imageUrl: I['briefcase'],
      parentId: null,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Freelance',
      description: 'Freelance project income',
      type: 'income',
      imageUrl: I['laptop'],
      parentId: sideBusinessId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Consulting',
      description: 'Consulting services',
      type: 'income',
      imageUrl: I['users'],
      parentId: sideBusinessId,
      accountBookId,
    },

    {
      id: otherIncomeId,
      name: 'Other Income',
      description: 'Miscellaneous income sources',
      type: 'income',
      imageUrl: I['plus-circle'],
      parentId: null,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Cashback',
      description: 'Cashback and rewards',
      type: 'income',
      imageUrl: I['credit-card'],
      parentId: otherIncomeId,
      accountBookId,
    },
    {
      id: genUuid(),
      name: 'Refunds',
      description: 'Product returns and refunds',
      type: 'income',
      imageUrl: I['undo'],
      parentId: otherIncomeId,
      accountBookId,
    },
  ]

  return categories.map((category, index) => ({
    ...category,
    sortOrder: startSortOrder + index,
  }))
}
