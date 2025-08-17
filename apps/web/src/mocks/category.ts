import { Category } from '@/entities/transaction'

export const categoryList: Category[] = [
  // ========== 收入分類 ==========
  {
    id: 'income-1',
    name: '薪資收入',
    description: '來自工作的固定薪資收入',
    imageUrl:
      'https://api.iconify.design/lucide:briefcase.svg?color=%23059669&width=100&height=100',
    children: [
      {
        id: 'income-1-1',
        name: '本薪',
        description: '基本薪資',
        imageUrl:
          'https://api.iconify.design/lucide:banknote.svg?color=%23059669&width=100&height=100',
      },
      {
        id: 'income-1-2',
        name: '獎金',
        description: '績效獎金、年終獎金',
        imageUrl:
          'https://api.iconify.design/lucide:gift.svg?color=%23059669&width=100&height=100',
      },
      {
        id: 'income-1-3',
        name: '加班費',
        description: '超時工作報酬',
        imageUrl:
          'https://api.iconify.design/lucide:clock.svg?color=%23059669&width=100&height=100',
      },
    ],
  },
  {
    id: 'income-2',
    name: '投資收入',
    description: '來自投資理財的收益',
    imageUrl:
      'https://api.iconify.design/lucide:trending-up.svg?color=%23059669&width=100&height=100',
    children: [
      {
        id: 'income-2-1',
        name: '股票股息',
        description: '股票分紅',
        imageUrl:
          'https://api.iconify.design/lucide:line-chart.svg?color=%23059669&width=100&height=100',
      },
      {
        id: 'income-2-2',
        name: '基金配息',
        description: '基金分配收益',
        imageUrl:
          'https://api.iconify.design/lucide:pie-chart.svg?color=%23059669&width=100&height=100',
      },
      {
        id: 'income-2-3',
        name: '銀行利息',
        description: '存款利息收入',
        imageUrl:
          'https://api.iconify.design/lucide:piggy-bank.svg?color=%23059669&width=100&height=100',
      },
    ],
  },
  {
    id: 'income-3',
    name: '副業收入',
    description: '額外的工作收入',
    imageUrl:
      'https://api.iconify.design/lucide:laptop.svg?color=%23059669&width=100&height=100',
    children: [
      {
        id: 'income-3-1',
        name: '接案收入',
        description: '自由工作者收入',
        imageUrl:
          'https://api.iconify.design/lucide:user-check.svg?color=%23059669&width=100&height=100',
      },
      {
        id: 'income-3-2',
        name: '網拍收入',
        description: '線上銷售收入',
        imageUrl:
          'https://api.iconify.design/lucide:shopping-cart.svg?color=%23059669&width=100&height=100',
      },
    ],
  },
  {
    id: 'income-4',
    name: '其他收入',
    description: '其他雜項收入',
    imageUrl:
      'https://api.iconify.design/lucide:plus-circle.svg?color=%23059669&width=100&height=100',
    children: [
      {
        id: 'income-4-1',
        name: '退稅',
        description: '政府退稅款項',
        imageUrl:
          'https://api.iconify.design/lucide:receipt.svg?color=%23059669&width=100&height=100',
      },
      {
        id: 'income-4-2',
        name: '保險理賠',
        description: '保險公司理賠金',
        imageUrl:
          'https://api.iconify.design/lucide:shield-check.svg?color=%23059669&width=100&height=100',
      },
      {
        id: 'income-4-3',
        name: '借款償還',
        description: '他人還款',
        imageUrl:
          'https://api.iconify.design/lucide:hand-coins.svg?color=%23059669&width=100&height=100',
      },
    ],
  },

  // ========== 支出分類 ==========
  {
    id: '1',
    name: '餐飲美食',
    description: '食物和用餐相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:utensils.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '1-1',
        name: '早餐',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:coffee.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '1-2',
        name: '午餐',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:sandwich.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '1-3',
        name: '晚餐',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:chef-hat.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '1-4',
        name: '零食飲料',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:cookie.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '1-5',
        name: '外送餐點',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:bike.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '2',
    name: '購物消費',
    description: '各類購物支出',
    imageUrl:
      'https://api.iconify.design/lucide:shopping-bag.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '2-1',
        name: '服飾配件',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:shirt.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '2-2',
        name: '書籍文具',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:book-open.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '2-3',
        name: '生活用品',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:home.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '2-4',
        name: '3C電子',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:smartphone.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '2-5',
        name: '美妝保養',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:sparkles.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '3',
    name: '交通運輸',
    description: '交通和運輸相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:car.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '3-1',
        name: '大眾運輸',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:bus.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '3-2',
        name: '計程車/共乘',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:car-taxi.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '3-3',
        name: '汽油費',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:fuel.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '3-4',
        name: '停車費',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:parking-circle.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '4',
    name: '娛樂休閒',
    description: '娛樂和休閒活動',
    imageUrl:
      'https://api.iconify.design/lucide:gamepad.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '4-1',
        name: '電影院',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:film.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '4-2',
        name: '遊戲娛樂',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:joystick.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '4-3',
        name: '演唱會/表演',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:music.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '4-4',
        name: 'KTV',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:mic.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '5',
    name: '醫療保健',
    description: '醫療和健康相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:heart-pulse.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '5-1',
        name: '看診費用',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:stethoscope.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '5-2',
        name: '牙科治療',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:smile.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '5-3',
        name: '藥品費用',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:pill.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '5-4',
        name: '健康檢查',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:activity.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '6',
    name: '教育學習',
    description: '學習和教育相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:graduation-cap.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '6-1',
        name: '學費',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:school.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '6-2',
        name: '書籍教材',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:book.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '6-3',
        name: '線上課程',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:monitor.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '6-4',
        name: '補習班',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:users.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '7',
    name: '水電瓦斯',
    description: '家庭水電瓦斯費用',
    imageUrl:
      'https://api.iconify.design/lucide:zap.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '7-1',
        name: '電費',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:lightbulb.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '7-2',
        name: '水費',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:droplets.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '7-3',
        name: '網路費',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:wifi.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '7-4',
        name: '瓦斯費',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:flame.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '8',
    name: '居住費用',
    description: '房租和居住相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:home.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '8-1',
        name: '房租',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:key.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '8-2',
        name: '房貸',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:building.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '8-3',
        name: '修繕維護',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:wrench.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '8-4',
        name: '家具設備',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:armchair.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '9',
    name: '旅遊度假',
    description: '旅行和度假支出',
    imageUrl:
      'https://api.iconify.design/lucide:plane.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '9-1',
        name: '機票',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:plane-takeoff.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '9-2',
        name: '住宿',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:bed.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '9-3',
        name: '旅遊活動',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:camera.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '9-4',
        name: '簽證護照',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:passport.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '10',
    name: '保險繳費',
    description: '各種保險費用',
    imageUrl:
      'https://api.iconify.design/lucide:shield.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '10-1',
        name: '健保',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:heart.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '10-2',
        name: '車險',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:car.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '10-3',
        name: '意外險',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:shield-check.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '10-4',
        name: '壽險',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:user.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '11',
    name: '運動健身',
    description: '運動和健身相關支出',
    imageUrl:
      'https://api.iconify.design/lucide:dumbbell.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '11-1',
        name: '健身房費用',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:dumbbell.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '11-2',
        name: '運動器材',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:trophy.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '11-3',
        name: '運動課程',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:users.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
  {
    id: '12',
    name: '個人護理',
    description: '個人美容護理',
    imageUrl:
      'https://api.iconify.design/lucide:scissors.svg?color=%23dc2626&width=100&height=100',
    children: [
      {
        id: '12-1',
        name: '理髮',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:scissors.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '12-2',
        name: '美容 SPA',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:sparkles.svg?color=%23dc2626&width=100&height=100',
      },
      {
        id: '12-3',
        name: '化妝品',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:palette.svg?color=%23dc2626&width=100&height=100',
      },
    ],
  },
