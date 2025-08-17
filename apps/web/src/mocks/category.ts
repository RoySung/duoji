import { Category } from '@/entities/transaction'

// 支出分類 (Expense Categories)
export const expenseCategoryList: Category[] = [
  {
    id: '1',
    name: '餐飲',
    description: '食物和用餐相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:utensils.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '1-1',
        name: '早餐',
        description: '早餐費用',
        imageUrl:
          'https://api.iconify.design/lucide:coffee.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-2',
        name: '午餐',
        description: '午餐費用',
        imageUrl:
          'https://api.iconify.design/lucide:sandwich.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-3',
        name: '晚餐',
        description: '晚餐費用',
        imageUrl:
          'https://api.iconify.design/lucide:chef-hat.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-4',
        name: '零食',
        description: '零食和小點心',
        imageUrl:
          'https://api.iconify.design/lucide:cookie.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '2',
    name: '購物',
    description: '各類商品購買支出',
    imageUrl:
      'https://api.iconify.design/lucide:shopping-bag.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '2-1',
        name: '服飾',
        description: '衣服和配件',
        imageUrl:
          'https://api.iconify.design/lucide:shirt.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-2',
        name: '書籍',
        description: '書籍和學習資料',
        imageUrl:
          'https://api.iconify.design/lucide:book-open.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-3',
        name: '家用品',
        description: '家庭用品和器具',
        imageUrl:
          'https://api.iconify.design/lucide:home.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-4',
        name: '電子產品',
        description: '電子設備和配件',
        imageUrl:
          'https://api.iconify.design/lucide:smartphone.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-5',
        name: '玩具',
        description: '玩具和遊戲',
        imageUrl:
          'https://api.iconify.design/lucide:gamepad.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-6',
        name: '運動健身',
        description: '運動用品和健身器材',
        imageUrl:
          'https://api.iconify.design/lucide:dumbbell.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-7',
        name: '美容保養',
        description: '美容和個人護理用品',
        imageUrl:
          'https://api.iconify.design/lucide:sparkles.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-8',
        name: '汽車用品',
        description: '汽車相關用品',
        imageUrl:
          'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-9',
        name: '園藝戶外',
        description: '園藝和戶外用品',
        imageUrl:
          'https://api.iconify.design/lucide:flower.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-10',
        name: '音響音樂',
        description: '音響設備和音樂相關',
        imageUrl:
          'https://api.iconify.design/lucide:headphones.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-11',
        name: '辦公用品',
        description: '辦公室用品和文具',
        imageUrl:
          'https://api.iconify.design/lucide:briefcase.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-12',
        name: '寵物用品',
        description: '寵物食品和用品',
        imageUrl:
          'https://api.iconify.design/lucide:heart.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-13',
        name: '珠寶配件',
        description: '珠寶和飾品',
        imageUrl:
          'https://api.iconify.design/lucide:gem.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-14',
        name: '藝術手工',
        description: '藝術和手工用品',
        imageUrl:
          'https://api.iconify.design/lucide:palette.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-15',
        name: '藥品保健',
        description: '藥品和保健用品',
        imageUrl:
          'https://api.iconify.design/lucide:pill.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '3',
    name: '交通',
    description: '交通和運輸相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '3-1',
        name: '大眾運輸',
        description: '公車、捷運、火車等',
        imageUrl:
          'https://api.iconify.design/lucide:bus.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '3-2',
        name: '計程車',
        description: '計程車和共乘服務',
        imageUrl:
          'https://api.iconify.design/lucide:car-taxi.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '3-3',
        name: '油費',
        description: '汽機車燃料費',
        imageUrl:
          'https://api.iconify.design/lucide:fuel.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '4',
    name: '娛樂',
    description: '娛樂和休閒活動支出',
    imageUrl:
      'https://api.iconify.design/lucide:play.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '4-1',
        name: '電影',
        description: '電影票和影音娛樂',
        imageUrl:
          'https://api.iconify.design/lucide:film.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '4-2',
        name: '遊戲',
        description: '電玩和遊戲相關',
        imageUrl:
          'https://api.iconify.design/lucide:joystick.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '4-3',
        name: '演唱會',
        description: '音樂會和表演',
        imageUrl:
          'https://api.iconify.design/lucide:music.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '5',
    name: '醫療',
    description: '醫療和健康相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:heart-pulse.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '5-1',
        name: '看診',
        description: '醫生診療費用',
        imageUrl:
          'https://api.iconify.design/lucide:stethoscope.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '5-2',
        name: '牙科',
        description: '牙醫和口腔保健',
        imageUrl:
          'https://api.iconify.design/lucide:smile.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '5-3',
        name: '藥局',
        description: '藥品和醫療用品',
        imageUrl:
          'https://api.iconify.design/lucide:pill.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '6',
    name: '教育',
    description: '學習和教育相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:graduation-cap.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '6-1',
        name: '學費',
        description: '學校學費',
        imageUrl:
          'https://api.iconify.design/lucide:school.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '6-2',
        name: '教材用品',
        description: '課本和學習用品',
        imageUrl:
          'https://api.iconify.design/lucide:book.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '6-3',
        name: '線上課程',
        description: '網路課程和數位學習',
        imageUrl:
          'https://api.iconify.design/lucide:monitor.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '7',
    name: '水電費',
    description: '家庭水電和公用事業費用',
    imageUrl:
      'https://api.iconify.design/lucide:zap.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '7-1',
        name: '電費',
        description: '電力費用',
        imageUrl:
          'https://api.iconify.design/lucide:lightbulb.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '7-2',
        name: '水費',
        description: '自來水費用',
        imageUrl:
          'https://api.iconify.design/lucide:droplets.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '7-3',
        name: '網路費',
        description: '網路和電信費用',
        imageUrl:
          'https://api.iconify.design/lucide:wifi.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '8',
    name: '居住',
    description: '房租和居住相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:home.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '8-1',
        name: '房租',
        description: '租金支出',
        imageUrl:
          'https://api.iconify.design/lucide:key.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '8-2',
        name: '維修保養',
        description: '房屋維修和保養',
        imageUrl:
          'https://api.iconify.design/lucide:wrench.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '8-3',
        name: '傢俱',
        description: '傢俱和家電',
        imageUrl:
          'https://api.iconify.design/lucide:armchair.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '9',
    name: '旅遊',
    description: '旅行和度假支出',
    imageUrl:
      'https://api.iconify.design/lucide:plane.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '9-1',
        name: '機票',
        description: '航空交通費用',
        imageUrl:
          'https://api.iconify.design/lucide:plane-takeoff.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '9-2',
        name: '住宿',
        description: '飯店和住宿費用',
        imageUrl:
          'https://api.iconify.design/lucide:bed.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '9-3',
        name: '活動',
        description: '旅遊活動和景點',
        imageUrl:
          'https://api.iconify.design/lucide:camera.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '10',
    name: '保險',
    description: '保險費用和保障',
    imageUrl:
      'https://api.iconify.design/lucide:shield.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '10-1',
        name: '健康保險',
        description: '醫療保險費用',
        imageUrl:
          'https://api.iconify.design/lucide:heart.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '10-2',
        name: '汽車保險',
        description: '車輛保險費用',
        imageUrl:
          'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '10-3',
        name: '人壽保險',
        description: '人壽保險費用',
        imageUrl:
          'https://api.iconify.design/lucide:user.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '11',
    name: '健身運動',
    description: '健身和運動相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:activity.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '11-1',
        name: '健身房會員',
        description: '健身房月費或年費',
        imageUrl:
          'https://api.iconify.design/lucide:dumbbell.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '11-2',
        name: '運動器材',
        description: '運動用品和器材',
        imageUrl:
          'https://api.iconify.design/lucide:trophy.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '11-3',
        name: '運動課程',
        description: '運動課程和私人教練',
        imageUrl:
          'https://api.iconify.design/lucide:users.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '12',
    name: '個人護理',
    description: '個人美容和護理',
    imageUrl:
      'https://api.iconify.design/lucide:scissors.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '12-1',
        name: '理髮',
        description: '剪髮和造型',
        imageUrl:
          'https://api.iconify.design/lucide:scissors.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '12-2',
        name: '美容SPA',
        description: 'SPA和美容服務',
        imageUrl:
          'https://api.iconify.design/lucide:sparkles.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '12-3',
        name: '化妝品',
        description: '化妝品和保養品',
        imageUrl:
          'https://api.iconify.design/lucide:palette.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
];

// 收入分類 (Income Categories)  
export const incomeCategoryList: Category[] = [
  {
    id: '100',
    name: '薪資',
    description: '工作薪資和獎金',
    imageUrl:
      'https://api.iconify.design/lucide:banknote.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '100-1',
        name: '本薪',
        description: '基本薪資',
        imageUrl:
          'https://api.iconify.design/lucide:wallet.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '100-2',
        name: '加班費',
        description: '超時工作費用',
        imageUrl:
          'https://api.iconify.design/lucide:clock.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '100-3',
        name: '獎金',
        description: '績效獎金和紅利',
        imageUrl:
          'https://api.iconify.design/lucide:award.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '100-4',
        name: '年終獎金',
        description: '年終績效獎金',
        imageUrl:
          'https://api.iconify.design/lucide:gift.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '101',
    name: '投資',
    description: '投資收益和理財',
    imageUrl:
      'https://api.iconify.design/lucide:trending-up.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '101-1',
        name: '股票',
        description: '股票投資收益',
        imageUrl:
          'https://api.iconify.design/lucide:bar-chart-3.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '101-2',
        name: '基金',
        description: '基金投資收益',
        imageUrl:
          'https://api.iconify.design/lucide:pie-chart.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '101-3',
        name: '債券',
        description: '債券利息收入',
        imageUrl:
          'https://api.iconify.design/lucide:receipt.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '101-4',
        name: '定存',
        description: '銀行定期存款利息',
        imageUrl:
          'https://api.iconify.design/lucide:landmark.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '102',
    name: '副業',
    description: '兼職和副業收入',
    imageUrl:
      'https://api.iconify.design/lucide:briefcase.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '102-1',
        name: '兼職',
        description: '兼職工作收入',
        imageUrl:
          'https://api.iconify.design/lucide:user-check.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '102-2',
        name: '自由接案',
        description: '自由職業案件收入',
        imageUrl:
          'https://api.iconify.design/lucide:laptop.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '102-3',
        name: '網拍',
        description: '網路販售收入',
        imageUrl:
          'https://api.iconify.design/lucide:shopping-cart.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '103',
    name: '禮品',
    description: '收到的禮品和紅包',
    imageUrl:
      'https://api.iconify.design/lucide:gift.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '103-1',
        name: '生日紅包',
        description: '生日收到的禮金',
        imageUrl:
          'https://api.iconify.design/lucide:cake.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '103-2',
        name: '節日紅包',
        description: '節慶收到的紅包',
        imageUrl:
          'https://api.iconify.design/lucide:sparkler.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '103-3',
        name: '禮品變現',
        description: '禮品轉賣收入',
        imageUrl:
          'https://api.iconify.design/lucide:package.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '104',
    name: '其他',
    description: '其他收入來源',
    imageUrl:
      'https://api.iconify.design/lucide:plus-circle.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '104-1',
        name: '退款',
        description: '購物退款和退稅',
        imageUrl:
          'https://api.iconify.design/lucide:undo-2.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '104-2',
        name: '借款歸還',
        description: '他人歸還的借款',
        imageUrl:
          'https://api.iconify.design/lucide:hand-coins.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '104-3',
        name: '租金收入',
        description: '出租房產收入',
        imageUrl:
          'https://api.iconify.design/lucide:home.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
];

// 合併所有分類 (Combined Categories)
export const categoryList: Category[] = [
  ...expenseCategoryList,
  ...incomeCategoryList,
];
