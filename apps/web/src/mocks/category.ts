import { Category } from '@/entities/transaction'

// 支出分類 (Expense Categories)
export const expenseCategoryList: Category[] = [
  {
    id: '1',
    name: '餐飲',
    description: '餐飲相關支出',
    type: 'expense',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:utensils.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '1-1',
        name: '早餐',
        description: '',
        type: 'expense',
        parentId: '1',
        imageUrl:
          'https://api.iconify.design/lucide:coffee.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-2',
        name: '午餐',
        description: '',
        type: 'expense',
        parentId: '1',
        imageUrl:
          'https://api.iconify.design/lucide:sandwich.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-3',
        name: '晚餐',
        description: '',
        type: 'expense',
        parentId: '1',
        imageUrl:
          'https://api.iconify.design/lucide:chef-hat.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-4',
        name: '零食飲料',
        description: '',
        type: 'expense',
        parentId: '1',
        imageUrl:
          'https://api.iconify.design/lucide:cookie.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-5',
        name: '聚餐',
        description: '',
        type: 'expense',
        parentId: '1',
        imageUrl:
          'https://api.iconify.design/lucide:users.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '2',
    name: '交通',
    description: '交通運輸相關支出',
    type: 'expense',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '2-1',
        name: '大眾運輸',
        description: '捷運、公車、火車等',
        type: 'expense',
        parentId: '2',
        imageUrl:
          'https://api.iconify.design/lucide:bus.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-2',
        name: '計程車',
        description: '計程車、Uber、Lyft等',
        type: 'expense',
        parentId: '2',
        imageUrl:
          'https://api.iconify.design/lucide:car-taxi.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-3',
        name: '汽油',
        description: '',
        type: 'expense',
        parentId: '2',
        imageUrl:
          'https://api.iconify.design/lucide:fuel.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-4',
        name: '停車費',
        description: '',
        type: 'expense',
        parentId: '2',
        imageUrl:
          'https://api.iconify.design/lucide:parking-circle.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '3',
    name: '購物',
    description: '購物相關支出',
    type: 'expense',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:shopping-bag.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '3-1',
        name: '服裝',
        description: '',
        type: 'expense',
        parentId: '3',
        imageUrl:
          'https://api.iconify.design/lucide:shirt.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '3-2',
        name: '書籍',
        description: '',
        type: 'expense',
        parentId: '3',
        imageUrl:
          'https://api.iconify.design/lucide:book-open.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '3-3',
        name: '生活用品',
        description: '',
        type: 'expense',
        parentId: '3',
        imageUrl:
          'https://api.iconify.design/lucide:home.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '3-4',
        name: '電子產品',
        description: '',
        type: 'expense',
        parentId: '3',
        imageUrl:
          'https://api.iconify.design/lucide:smartphone.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '3-5',
        name: '美妝保養',
        description: '',
        type: 'expense',
        parentId: '3',
        imageUrl:
          'https://api.iconify.design/lucide:sparkles.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '4',
    name: '娛樂',
    description: '娛樂休閒相關支出',
    type: 'expense',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:play.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '4-1',
        name: '電影',
        description: '',
        type: 'expense',
        parentId: '4',
        imageUrl:
          'https://api.iconify.design/lucide:film.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '4-2',
        name: '遊戲',
        description: '',
        type: 'expense',
        parentId: '4',
        imageUrl:
          'https://api.iconify.design/lucide:gamepad-2.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '4-3',
        name: '音樂會',
        description: '',
        type: 'expense',
        parentId: '4',
        imageUrl:
          'https://api.iconify.design/lucide:music.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '4-4',
        name: '旅遊',
        description: '',
        type: 'expense',
        parentId: '4',
        imageUrl:
          'https://api.iconify.design/lucide:plane.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '5',
    name: '醫療保健',
    description: '醫療和健康相關支出',
    type: 'expense',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:heart-pulse.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '5-1',
        name: '看醫生',
        description: '',
        type: 'expense',
        parentId: '5',
        imageUrl:
          'https://api.iconify.design/lucide:stethoscope.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '5-2',
        name: '牙科',
        description: '',
        type: 'expense',
        parentId: '5',
        imageUrl:
          'https://api.iconify.design/lucide:smile.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '5-3',
        name: '藥品',
        description: '',
        type: 'expense',
        parentId: '5',
        imageUrl:
          'https://api.iconify.design/lucide:pill.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '6',
    name: '居住',
    description: '房租和居住相關支出',
    type: 'expense',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:home.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '6-1',
        name: '房租',
        description: '',
        type: 'expense',
        parentId: '6',
        imageUrl:
          'https://api.iconify.design/lucide:key.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '6-2',
        name: '水電費',
        description: '',
        type: 'expense',
        parentId: '6',
        imageUrl:
          'https://api.iconify.design/lucide:zap.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '6-3',
        name: '網路費',
        description: '',
        type: 'expense',
        parentId: '6',
        imageUrl:
          'https://api.iconify.design/lucide:wifi.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '6-4',
        name: '家具',
        description: '',
        type: 'expense',
        parentId: '6',
        imageUrl:
          'https://api.iconify.design/lucide:armchair.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '7',
    name: '教育學習',
    description: '學習和教育相關支出',
    type: 'expense',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:graduation-cap.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '7-1',
        name: '學費',
        description: '',
        type: 'expense',
        parentId: '7',
        imageUrl:
          'https://api.iconify.design/lucide:school.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '7-2',
        name: '線上課程',
        description: '',
        type: 'expense',
        parentId: '7',
        imageUrl:
          'https://api.iconify.design/lucide:monitor.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '7-3',
        name: '補習費',
        description: '',
        type: 'expense',
        parentId: '7',
        imageUrl:
          'https://api.iconify.design/lucide:users.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '8',
    name: '運動健身',
    description: '健身和運動相關支出',
    type: 'expense',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:dumbbell.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '8-1',
        name: '健身房',
        description: '',
        type: 'expense',
        parentId: '8',
        imageUrl:
          'https://api.iconify.design/lucide:activity.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '8-2',
        name: '運動用品',
        description: '',
        type: 'expense',
        parentId: '8',
        imageUrl:
          'https://api.iconify.design/lucide:trophy.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '9',
    name: '其他支出',
    description: '其他類型支出',
    type: 'expense',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:more-horizontal.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '9-1',
        name: '禮物',
        description: '',
        type: 'expense',
        parentId: '9',
        imageUrl:
          'https://api.iconify.design/lucide:gift.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '9-2',
        name: '捐款',
        description: '',
        type: 'expense',
        parentId: '9',
        imageUrl:
          'https://api.iconify.design/lucide:heart.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
]

// 收入分類 (Income Categories)  
export const incomeCategoryList: Category[] = [
  {
    id: 'inc-1',
    name: '薪資收入',
    description: '工作薪資相關收入',
    type: 'income',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:wallet.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: 'inc-1-1',
        name: '基本薪資',
        description: '',
        type: 'income',
        parentId: 'inc-1',
        imageUrl:
          'https://api.iconify.design/lucide:banknote.svg?color=%23666666&width=100&height=100',
      },
      {
        id: 'inc-1-2',
        name: '獎金',
        description: '',
        type: 'income',
        parentId: 'inc-1',
        imageUrl:
          'https://api.iconify.design/lucide:award.svg?color=%23666666&width=100&height=100',
      },
      {
        id: 'inc-1-3',
        name: '加班費',
        description: '',
        type: 'income',
        parentId: 'inc-1',
        imageUrl:
          'https://api.iconify.design/lucide:clock.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: 'inc-2',
    name: '投資理財',
    description: '投資和理財相關收入',
    type: 'income',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:trending-up.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: 'inc-2-1',
        name: '股票',
        description: '',
        type: 'income',
        parentId: 'inc-2',
        imageUrl:
          'https://api.iconify.design/lucide:line-chart.svg?color=%23666666&width=100&height=100',
      },
      {
        id: 'inc-2-2',
        name: '基金',
        description: '',
        type: 'income',
        parentId: 'inc-2',
        imageUrl:
          'https://api.iconify.design/lucide:pie-chart.svg?color=%23666666&width=100&height=100',
      },
      {
        id: 'inc-2-3',
        name: '定存利息',
        description: '',
        type: 'income',
        parentId: 'inc-2',
        imageUrl:
          'https://api.iconify.design/lucide:piggy-bank.svg?color=%23666666&width=100&height=100',
      },
      {
        id: 'inc-2-4',
        name: '配息',
        description: '',
        type: 'income',
        parentId: 'inc-2',
        imageUrl:
          'https://api.iconify.design/lucide:coins.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: 'inc-3',
    name: '副業收入',
    description: '兼職和副業相關收入',
    type: 'income',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:briefcase.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: 'inc-3-1',
        name: '接案',
        description: '',
        type: 'income',
        parentId: 'inc-3',
        imageUrl:
          'https://api.iconify.design/lucide:code.svg?color=%23666666&width=100&height=100',
      },
      {
        id: 'inc-3-2',
        name: '兼職',
        description: '',
        type: 'income',
        parentId: 'inc-3',
        imageUrl:
          'https://api.iconify.design/lucide:coffee.svg?color=%23666666&width=100&height=100',
      },
      {
        id: 'inc-3-3',
        name: '網路販售',
        description: '',
        type: 'income',
        parentId: 'inc-3',
        imageUrl:
          'https://api.iconify.design/lucide:shopping-cart.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: 'inc-4',
    name: '租金收入',
    description: '房屋出租相關收入',
    type: 'income',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:home.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: 'inc-4-1',
        name: '房租',
        description: '',
        type: 'income',
        parentId: 'inc-4',
        imageUrl:
          'https://api.iconify.design/lucide:key.svg?color=%23666666&width=100&height=100',
      },
      {
        id: 'inc-4-2',
        name: '車位租金',
        description: '',
        type: 'income',
        parentId: 'inc-4',
        imageUrl:
          'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: 'inc-5',
    name: '其他收入',
    description: '其他類型收入',
    type: 'income',
    parentId: null,
    imageUrl:
      'https://api.iconify.design/lucide:more-horizontal.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: 'inc-5-1',
        name: '禮金',
        description: '',
        type: 'income',
        parentId: 'inc-5',
        imageUrl:
          'https://api.iconify.design/lucide:gift.svg?color=%23666666&width=100&height=100',
      },
      {
        id: 'inc-5-2',
        name: '退稅',
        description: '',
        type: 'income',
        parentId: 'inc-5',
        imageUrl:
          'https://api.iconify.design/lucide:receipt.svg?color=%23666666&width=100&height=100',
      },
      {
        id: 'inc-5-3',
        name: '中獎',
        description: '',
        type: 'income',
        parentId: 'inc-5',
        imageUrl:
          'https://api.iconify.design/lucide:trophy.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
]

// 合併所有分類
export const categoryList: Category[] = [...expenseCategoryList, ...incomeCategoryList]
