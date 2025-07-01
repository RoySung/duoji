import { Category } from '@/entities/transaction'

export const categoryList: Category[] = [
  {
    id: '1',
    name: 'Food',
    description: 'Expenses related to food and dining',
    imageUrl:
      'https://api.iconify.design/lucide:utensils.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '1-1',
        name: 'Breakfast',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:coffee.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-2',
        name: 'Lunch',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:sandwich.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-3',
        name: 'Dinner',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:chef-hat.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '1-4',
        name: 'Snacks',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:cookie.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  {
    id: '2',
    name: 'Shopping',
    description: '',
    imageUrl:
      'https://api.iconify.design/lucide:shopping-bag.svg?color=%23666666&width=100&height=100',
    children: [
      {
        id: '2-1',
        name: 'Clothing',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:shirt.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-2',
        name: 'Books',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:book-open.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-3',
        name: 'Home Goods',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:home.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-4',
        name: 'Electronics',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:smartphone.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-5',
        name: 'Toys',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:gamepad.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-6',
        name: 'Sports & Fitness',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:dumbbell.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-7',
        name: 'Beauty & Personal Care',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:sparkles.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-8',
        name: 'Automotive',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-9',
        name: 'Garden & Outdoor',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:flower.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-10',
        name: 'Music & Audio',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:headphones.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-11',
        name: 'Office Supplies',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:briefcase.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-12',
        name: 'Pet Supplies',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:heart.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-13',
        name: 'Jewelry & Accessories',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:gem.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-14',
        name: 'Art & Crafts',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:palette.svg?color=%23666666&width=100&height=100',
      },
      {
        id: '2-15',
        name: 'Pharmacy & Health',
        description: '',
        imageUrl:
          'https://api.iconify.design/lucide:pill.svg?color=%23666666&width=100&height=100',
      },
    ],
  },
  // more mock data:
  // {
  //   id: '3',
  //   name: 'Transportation',
  //   description: 'Travel and transportation expenses',
  //   imageUrl:
  //     'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
  //   children: [
  //     {
  //       id: '3-1',
  //       name: 'Public Transport',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:bus.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '3-2',
  //       name: 'Taxi & Ride Share',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:car-taxi.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '3-3',
  //       name: 'Fuel',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:fuel.svg?color=%23666666&width=100&height=100',
  //     },
  //   ],
  // },
  // {
  //   id: '4',
  //   name: 'Entertainment',
  //   description: 'Entertainment and leisure activities',
  //   imageUrl:
  //     'https://api.iconify.design/lucide:play.svg?color=%23666666&width=100&height=100',
  //   children: [
  //     {
  //       id: '4-1',
  //       name: 'Movies',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:film.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '4-2',
  //       name: 'Games',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:joystick.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '4-3',
  //       name: 'Concerts',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:music.svg?color=%23666666&width=100&height=100',
  //     },
  //   ],
  // },
  // {
  //   id: '5',
  //   name: 'Healthcare',
  //   description: 'Medical and health-related expenses',
  //   imageUrl:
  //     'https://api.iconify.design/lucide:heart-pulse.svg?color=%23666666&width=100&height=100',
  //   children: [
  //     {
  //       id: '5-1',
  //       name: 'Doctor Visits',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:stethoscope.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '5-2',
  //       name: 'Dental',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:smile.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '5-3',
  //       name: 'Pharmacy',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:pill.svg?color=%23666666&width=100&height=100',
  //     },
  //   ],
  // },
  // {
  //   id: '6',
  //   name: 'Education',
  //   description: 'Learning and educational expenses',
  //   imageUrl:
  //     'https://api.iconify.design/lucide:graduation-cap.svg?color=%23666666&width=100&height=100',
  //   children: [
  //     {
  //       id: '6-1',
  //       name: 'Tuition',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:school.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '6-2',
  //       name: 'Books & Supplies',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:book.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '6-3',
  //       name: 'Online Courses',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:monitor.svg?color=%23666666&width=100&height=100',
  //     },
  //   ],
  // },
  // {
  //   id: '7',
  //   name: 'Utilities',
  //   description: 'Home utilities and bills',
  //   imageUrl:
  //     'https://api.iconify.design/lucide:zap.svg?color=%23666666&width=100&height=100',
  //   children: [
  //     {
  //       id: '7-1',
  //       name: 'Electricity',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:lightbulb.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '7-2',
  //       name: 'Water',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:droplets.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '7-3',
  //       name: 'Internet',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:wifi.svg?color=%23666666&width=100&height=100',
  //     },
  //   ],
  // },
  // {
  //   id: '8',
  //   name: 'Housing',
  //   description: 'Rent and housing-related expenses',
  //   imageUrl:
  //     'https://api.iconify.design/lucide:home.svg?color=%23666666&width=100&height=100',
  //   children: [
  //     {
  //       id: '8-1',
  //       name: 'Rent',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:key.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '8-2',
  //       name: 'Maintenance',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:wrench.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '8-3',
  //       name: 'Furniture',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:armchair.svg?color=%23666666&width=100&height=100',
  //     },
  //   ],
  // },
  // {
  //   id: '9',
  //   name: 'Travel',
  //   description: 'Travel and vacation expenses',
  //   imageUrl:
  //     'https://api.iconify.design/lucide:plane.svg?color=%23666666&width=100&height=100',
  //   children: [
  //     {
  //       id: '9-1',
  //       name: 'Flights',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:plane-takeoff.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '9-2',
  //       name: 'Hotels',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:bed.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '9-3',
  //       name: 'Activities',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:camera.svg?color=%23666666&width=100&height=100',
  //     },
  //   ],
  // },
  // {
  //   id: '10',
  //   name: 'Insurance',
  //   description: 'Insurance premiums and coverage',
  //   imageUrl:
  //     'https://api.iconify.design/lucide:shield.svg?color=%23666666&width=100&height=100',
  //   children: [
  //     {
  //       id: '10-1',
  //       name: 'Health Insurance',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:heart.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '10-2',
  //       name: 'Auto Insurance',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:car.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '10-3',
  //       name: 'Life Insurance',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:user.svg?color=%23666666&width=100&height=100',
  //     },
  //   ],
  // },
  // {
  //   id: '11',
  //   name: 'Fitness & Sports',
  //   description: 'Fitness and sports-related expenses',
  //   imageUrl:
  //     'https://api.iconify.design/lucide:activity.svg?color=%23666666&width=100&height=100',
  //   children: [
  //     {
  //       id: '11-1',
  //       name: 'Gym Membership',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:dumbbell.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '11-2',
  //       name: 'Sports Equipment',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:trophy.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '11-3',
  //       name: 'Classes',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:users.svg?color=%23666666&width=100&height=100',
  //     },
  //   ],
  // },
  // {
  //   id: '12',
  //   name: 'Personal Care',
  //   description: 'Personal grooming and care',
  //   imageUrl:
  //     'https://api.iconify.design/lucide:scissors.svg?color=%23666666&width=100&height=100',
  //   children: [
  //     {
  //       id: '12-1',
  //       name: 'Haircut',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:scissors.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '12-2',
  //       name: 'Spa & Beauty',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:sparkles.svg?color=%23666666&width=100&height=100',
  //     },
  //     {
  //       id: '12-3',
  //       name: 'Cosmetics',
  //       description: '',
  //       imageUrl:
  //         'https://api.iconify.design/lucide:palette.svg?color=%23666666&width=100&height=100',
  //     },
  //   ],
  // },
]
