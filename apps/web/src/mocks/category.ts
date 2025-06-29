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
    ],
  },
]
