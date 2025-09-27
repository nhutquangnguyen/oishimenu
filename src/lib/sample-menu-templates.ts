import { MenuCategory, MenuItem, MenuOptionGroup } from '@/components/menu/types';

export interface SampleMenuTemplate {
  name: string;
  description: string;
  categories: Omit<MenuCategory, 'restaurantId'>[];
  optionGroups: Omit<MenuOptionGroup, 'restaurantId'>[];
}

export const defaultSampleMenu: SampleMenuTemplate = {
  name: "Sample Restaurant Menu",
  description: "A starter menu to help you get started",
  categories: [
    {
      id: "appetizers",
      name: "Appetizers",
      description: "Start your meal with these delicious appetizers",
      order: 0,
      items: [
        {
          id: "mozzarella-sticks",
          name: "Mozzarella Sticks",
          description: "Golden fried mozzarella cheese sticks served with marinara sauce",
          price: 8.99,
          categoryId: "appetizers",
          isAvailable: true,
          isFeatured: false,
          order: 0
        },
        {
          id: "chicken-wings",
          name: "Buffalo Chicken Wings",
          description: "Crispy wings tossed in spicy buffalo sauce, served with ranch dressing",
          price: 12.99,
          categoryId: "appetizers",
          isAvailable: true,
          isFeatured: true,
          order: 1,
          optionGroups: ["wing-sauce"]
        }
      ]
    },
    {
      id: "main-dishes",
      name: "Main Dishes",
      description: "Our signature main courses",
      order: 1,
      items: [
        {
          id: "classic-burger",
          name: "Classic Cheeseburger",
          description: "Juicy beef patty with cheese, lettuce, tomato, and onion on a brioche bun",
          price: 14.99,
          categoryId: "main-dishes",
          isAvailable: true,
          isFeatured: true,
          order: 0,
          optionGroups: ["burger-size"]
        },
        {
          id: "grilled-chicken",
          name: "Grilled Chicken Breast",
          description: "Seasoned grilled chicken breast served with vegetables and mashed potatoes",
          price: 16.99,
          categoryId: "main-dishes",
          isAvailable: true,
          isFeatured: false,
          order: 1
        }
      ]
    }
  ],
  optionGroups: [
    {
      id: "wing-sauce",
      name: "Wing Sauce",
      description: "Choose your wing sauce",
      type: "single",
      isRequired: true,
      order: 0,
      options: [
        {
          id: "buffalo",
          name: "Buffalo",
          price: 0,
          isDefault: true,
          isAvailable: true,
          order: 0,
          optionGroupId: "wing-sauce"
        },
        {
          id: "bbq",
          name: "BBQ",
          price: 0,
          isAvailable: true,
          order: 1,
          optionGroupId: "wing-sauce"
        }
      ]
    },
    {
      id: "burger-size",
      name: "Burger Size",
      description: "Choose your patty size",
      type: "single",
      isRequired: true,
      order: 0,
      options: [
        {
          id: "single",
          name: "Single Patty",
          price: 0,
          isDefault: true,
          isAvailable: true,
          order: 0,
          optionGroupId: "burger-size"
        },
        {
          id: "double",
          name: "Double Patty",
          price: 4.00,
          isAvailable: true,
          order: 1,
          optionGroupId: "burger-size"
        }
      ]
    }
  ]
};

export const menuTemplates: { [key: string]: SampleMenuTemplate } = {
  default: defaultSampleMenu,
  cafe: {
    name: "Cafe Menu",
    description: "Perfect for coffee shops and casual dining",
    categories: [
      {
        id: "beverages",
        name: "Beverages",
        description: "Hot and cold drinks to energize your day",
        order: 0,
        items: [
          {
            id: "espresso",
            name: "Espresso",
            description: "Rich, bold espresso shot",
            price: 3.50,
            categoryId: "beverages",
            isAvailable: true,
            isFeatured: true,
            order: 0,
            optionGroups: ["coffee-size"]
          },
          {
            id: "latte",
            name: "Caffe Latte",
            description: "Smooth espresso with steamed milk",
            price: 4.95,
            categoryId: "beverages",
            isAvailable: true,
            isFeatured: false,
            order: 1,
            optionGroups: ["coffee-size"]
          }
        ]
      },
      {
        id: "pastries",
        name: "Pastries & Snacks",
        description: "Fresh baked goods and light bites",
        order: 1,
        items: [
          {
            id: "croissant",
            name: "Butter Croissant",
            description: "Flaky, buttery croissant baked fresh daily",
            price: 3.25,
            categoryId: "pastries",
            isAvailable: true,
            isFeatured: false,
            order: 0
          },
          {
            id: "muffin",
            name: "Blueberry Muffin",
            description: "Moist muffin packed with fresh blueberries",
            price: 3.75,
            categoryId: "pastries",
            isAvailable: true,
            isFeatured: true,
            order: 1
          }
        ]
      }
    ],
    optionGroups: [
      {
        id: "coffee-size",
        name: "Size",
        description: "Choose your size",
        type: "single",
        isRequired: true,
        order: 0,
        options: [
          {
            id: "small",
            name: "Small (8oz)",
            price: 0,
            isDefault: true,
            isAvailable: true,
            order: 0,
            optionGroupId: "coffee-size"
          },
          {
            id: "large",
            name: "Large (16oz)",
            price: 1.50,
            isAvailable: true,
            order: 1,
            optionGroupId: "coffee-size"
          }
        ]
      }
    ]
  },
  pizza: {
    name: "Pizza Restaurant",
    description: "Classic pizza shop menu",
    categories: [
      {
        id: "pizzas",
        name: "Pizzas",
        description: "Hand-tossed pizzas with fresh ingredients",
        order: 0,
        items: [
          {
            id: "margherita",
            name: "Margherita Pizza",
            description: "Fresh mozzarella, tomato sauce, and basil on hand-tossed dough",
            price: 16.99,
            categoryId: "pizzas",
            isAvailable: true,
            isFeatured: true,
            order: 0,
            optionGroups: ["pizza-size"]
          },
          {
            id: "pepperoni",
            name: "Pepperoni Pizza",
            description: "Classic pepperoni with mozzarella cheese and tomato sauce",
            price: 18.99,
            categoryId: "pizzas",
            isAvailable: true,
            isFeatured: false,
            order: 1,
            optionGroups: ["pizza-size"]
          }
        ]
      },
      {
        id: "sides",
        name: "Sides",
        description: "Perfect additions to your meal",
        order: 1,
        items: [
          {
            id: "garlic-bread",
            name: "Garlic Bread",
            description: "Warm bread with garlic butter and herbs",
            price: 6.99,
            categoryId: "sides",
            isAvailable: true,
            isFeatured: false,
            order: 0
          },
          {
            id: "caesar-salad",
            name: "Caesar Salad",
            description: "Crisp romaine lettuce with parmesan and our house caesar dressing",
            price: 8.99,
            categoryId: "sides",
            isAvailable: true,
            isFeatured: false,
            order: 1
          }
        ]
      }
    ],
    optionGroups: [
      {
        id: "pizza-size",
        name: "Pizza Size",
        description: "Choose your pizza size",
        type: "single",
        isRequired: true,
        order: 0,
        options: [
          {
            id: "small",
            name: "Small (10\")",
            price: 0,
            isDefault: true,
            isAvailable: true,
            order: 0,
            optionGroupId: "pizza-size"
          },
          {
            id: "large",
            name: "Large (14\")",
            price: 8.00,
            isAvailable: true,
            order: 1,
            optionGroupId: "pizza-size"
          }
        ]
      }
    ]
  }
};

export function createSampleMenu(
  restaurantId: string,
  templateKey: keyof typeof menuTemplates = 'default'
): { categories: MenuCategory[], optionGroups: MenuOptionGroup[] } {
  const template = menuTemplates[templateKey];

  return {
    categories: template.categories.map(category => ({
      ...category,
      restaurantId,
      items: category.items.map(item => ({
        ...item,
        restaurantId
      }))
    })),
    optionGroups: template.optionGroups.map(optionGroup => ({
      ...optionGroup,
      restaurantId,
      options: optionGroup.options.map(option => ({
        ...option,
        restaurantId
      }))
    }))
  };
}

export function getSampleMenuTemplate(templateKey: keyof typeof menuTemplates): SampleMenuTemplate {
  return menuTemplates[templateKey];
}

export function getAvailableTemplates(): Array<{ key: string; name: string; description: string }> {
  return Object.entries(menuTemplates).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description
  }));
}