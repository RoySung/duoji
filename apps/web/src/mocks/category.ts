import { Category } from '@/entities/transaction'

// Expense Categories
export const expenseCategoryList: Category[] = [
  {
    id: '1',
    name: 'Food & Dining',
    description: 'Food and dining related expenses',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:utensils.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '1-1',
        name: 'Breakfast',
        description: 'Breakfast expenses',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:coffee.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-2',
        name: 'Lunch',
        description: 'Lunch expenses',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:sandwich.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-3',
        name: 'Dinner',
        description: 'Dinner expenses',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:chef-hat.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-4',
        name: 'Snacks',
        description: 'Snacks and treats',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:cookie.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '2',
    name: 'Shopping',
    description: 'Various product purchases',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:shopping-bag.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '2-1',
        name: 'Clothing',
        description: 'Clothes and accessories',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:shirt.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-2',
        name: 'Books',
        description: 'Books and learning materials',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:book-open.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-3',
        name: 'Household',
        description: 'Household items and appliances',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:home.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-4',
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:smartphone.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-5',
        name: 'Toys',
        description: 'Toys and games',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:gamepad.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-6',
        name: 'Sports',
        description: 'Sports equipment and fitness gear',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:dumbbell.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-7',
        name: 'Beauty',
        description: 'Beauty and personal care products',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:sparkles.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-8',
        name: 'Auto',
        description: 'Auto supplies and accessories',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '3',
    name: 'Transportation',
    description: 'Transportation and travel expenses',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '3-1',
        name: 'Public Transit',
        description: 'Bus, subway, and other public transportation',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:bus.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '3-2',
        name: 'Taxi/Ride-share',
        description: 'Taxi and ride-sharing services',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:taxi.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '3-3',
        name: 'Gas',
        description: 'Fuel and gas expenses',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:fuel.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '3-4',
        name: 'Parking',
        description: 'Parking fees',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:square-parking.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '3-5',
        name: 'Car Maintenance',
        description: 'Car repairs and maintenance',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:wrench.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '4',
    name: 'Entertainment',
    description: 'Entertainment and leisure activities',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:music.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '4-1',
        name: 'Movies',
        description: 'Cinema and movie expenses',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:film.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '4-2',
        name: 'Music',
        description: 'Music and concert expenses',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:music.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '4-3',
        name: 'Games',
        description: 'Video games and gaming',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:gamepad-2.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '4-4',
        name: 'Sports Events',
        description: 'Sports and recreational activities',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:trophy.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '4-5',
        name: 'Events',
        description: 'Parties and social events',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:party-popper.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '5',
    name: 'Healthcare',
    description: 'Medical and health expenses',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:heart-pulse.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '5-1',
        name: 'Doctor Visits',
        description: 'Medical consultations',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:stethoscope.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '5-2',
        name: 'Medications',
        description: 'Prescription and over-the-counter drugs',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:pill.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '5-3',
        name: 'Dental',
        description: 'Dental care and treatments',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:smile.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '5-4',
        name: 'Health Insurance',
        description: 'Health insurance premiums',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:shield-plus.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '6',
    name: 'Education',
    description: 'Education and learning expenses',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:graduation-cap.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '6-1',
        name: 'Tuition',
        description: 'School and course fees',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:school.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '6-2',
        name: 'Books & Materials',
        description: 'Educational books and materials',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:book.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '6-3',
        name: 'Online Courses',
        description: 'Online learning platforms',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:monitor-play.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '6-4',
        name: 'Certification',
        description: 'Professional certifications',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:award.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '7',
    name: 'Utilities',
    description: 'Utility bills and services',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:zap.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '7-1',
        name: 'Electricity',
        description: 'Electricity bills',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:zap.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '7-2',
        name: 'Water',
        description: 'Water bills',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:droplets.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '7-3',
        name: 'Gas',
        description: 'Gas bills',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:flame.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '7-4',
        name: 'Internet',
        description: 'Internet and cable services',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:wifi.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '7-5',
        name: 'Phone',
        description: 'Phone bills',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:phone.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '8',
    name: 'Housing',
    description: 'Housing and accommodation costs',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:house.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '8-1',
        name: 'Rent',
        description: 'Monthly rent payments',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:key.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '8-2',
        name: 'Mortgage',
        description: 'Home loan payments',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:home.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '8-3',
        name: 'Maintenance',
        description: 'Home repairs and maintenance',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:hammer.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '8-4',
        name: 'Furniture',
        description: 'Furniture and home decor',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:sofa.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '9',
    name: 'Travel',
    description: 'Travel and vacation expenses',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:plane.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '9-1',
        name: 'Flights',
        description: 'Airline tickets',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:plane.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '9-2',
        name: 'Hotels',
        description: 'Accommodation expenses',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:bed.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '9-3',
        name: 'Attractions',
        description: 'Tourist attractions and activities',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:map-pin.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '9-4',
        name: 'Local Transport',
        description: 'Local transportation during travel',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:train.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '10',
    name: 'Insurance',
    description: 'Insurance premiums and related costs',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:shield.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '10-1',
        name: 'Life Insurance',
        description: 'Life insurance premiums',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:heart.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '10-2',
        name: 'Auto Insurance',
        description: 'Vehicle insurance',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '10-3',
        name: 'Property Insurance',
        description: 'Home and property insurance',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:house.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '11',
    name: 'Fitness & Sports',
    description: 'Fitness and sports related expenses',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:dumbbell.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '11-1',
        name: 'Gym Membership',
        description: 'Gym and fitness center fees',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:dumbbell.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '11-2',
        name: 'Sports Equipment',
        description: 'Sports gear and equipment',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:trophy.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '11-3',
        name: 'Sports Classes',
        description: 'Sports lessons and training',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:users.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '12',
    name: 'Personal Care',
    description: 'Personal care and grooming',
    type: 'expense',
    imageUrl:
      'https://api.iconify.design/lucide:scissors.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '12-1',
        name: 'Haircuts',
        description: 'Hair salon and barbershop',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:scissors.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '12-2',
        name: 'Spa & Massage',
        description: 'Spa treatments and massage',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:sparkles.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '12-3',
        name: 'Personal Products',
        description: 'Personal hygiene products',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:shopping-bag.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
]

// Income Categories  
export const incomeCategoryList: Category[] = [
  {
    id: '101',
    name: 'Salary',
    description: 'Regular salary and wages',
    type: 'income',
    imageUrl:
      'https://api.iconify.design/lucide:banknote.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '101-1',
        name: 'Base Salary',
        description: 'Monthly base salary',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:wallet.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '101-2',
        name: 'Overtime',
        description: 'Overtime pay',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:clock.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '101-3',
        name: 'Bonus',
        description: 'Performance bonuses',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:gift.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '101-4',
        name: 'Commission',
        description: 'Sales commissions',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:trending-up.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '102',
    name: 'Investment',
    description: 'Investment returns and gains',
    type: 'income',
    imageUrl:
      'https://api.iconify.design/lucide:trending-up.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '102-1',
        name: 'Stocks',
        description: 'Stock dividends and gains',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:line-chart.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '102-2',
        name: 'Bonds',
        description: 'Bond interest and returns',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:file-text.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '102-3',
        name: 'Real Estate',
        description: 'Property rental income',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:building.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '102-4',
        name: 'Crypto',
        description: 'Cryptocurrency gains',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:coins.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '103',
    name: 'Side Business',
    description: 'Side business and freelance income',
    type: 'income',
    imageUrl:
      'https://api.iconify.design/lucide:briefcase.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '103-1',
        name: 'Freelance',
        description: 'Freelance project income',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:laptop.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '103-2',
        name: 'Consulting',
        description: 'Consulting services',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:users.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '103-3',
        name: 'Online Sales',
        description: 'E-commerce and online sales',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:shopping-cart.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '104',
    name: 'Gifts',
    description: 'Gifts and monetary presents',
    type: 'income',
    imageUrl:
      'https://api.iconify.design/lucide:gift.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '104-1',
        name: 'Birthday',
        description: 'Birthday gifts',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:cake.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '104-2',
        name: 'Holiday',
        description: 'Holiday and seasonal gifts',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:heart.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '104-3',
        name: 'Family Support',
        description: 'Financial support from family',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:users.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '105',
    name: 'Other Income',
    description: 'Miscellaneous income sources',
    type: 'income',
    imageUrl:
      'https://api.iconify.design/lucide:plus-circle.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '105-1',
        name: 'Cashback',
        description: 'Cashback and rewards',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:credit-card.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '105-2',
        name: 'Refunds',
        description: 'Product returns and refunds',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:undo.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '105-3',
        name: 'Interest',
        description: 'Bank account interest',
        type: 'income',
        imageUrl:
          'https://api.iconify.design/lucide:percent.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
]

// 合併所有分類
export const categoryList: Category[] = [
  ...expenseCategoryList,
  ...incomeCategoryList,
]