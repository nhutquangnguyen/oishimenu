# Dish Recommendation System

## Overview

The Dish Recommendation System allows restaurant owners to set up intelligent recommendations for menu items. When customers add items to their cart, they'll see personalized suggestions for complementary dishes, helping increase average order value and improve customer experience.

## Features

### 1. Item-Level Recommendations
- When a customer adds an item to their cart, they see recommendations for other items that pair well with it
- Recommendations appear immediately after adding an item
- Visual design with attractive cards showing item details and pricing

### 2. Checkout Recommendations
- In the cart, customers see additional recommendations based on their entire order
- Helps complete the meal with complementary items
- Prevents duplicate recommendations (won't suggest items already in cart)

### 3. Admin Configuration
- Restaurant owners can set recommendations for each menu item through the menu builder
- Easy-to-use interface with checkboxes for selecting recommended items
- Real-time preview of recommendations

## How to Use

### For Restaurant Owners

1. **Access Menu Builder**
   - Go to Dashboard → Menu
   - Select the restaurant you want to configure

2. **Set Up Recommendations**
   - Click "Edit" on any menu item
   - Scroll down to the "Recommended Items" section
   - Check the boxes for items you want to recommend with this dish
   - Click "Save Changes"

3. **Best Practices**
   - Recommend complementary items (e.g., salad with pizza)
   - Suggest higher-margin items
   - Consider seasonal pairings
   - Keep recommendations relevant (3-5 items max)

### For Customers

1. **Adding Items to Cart**
   - Browse the menu and add items normally
   - After adding an item, you'll see recommendations below it
   - Click "Add" on recommended items to add them to your cart

2. **Cart Recommendations**
   - Open your cart to see additional recommendations
   - Recommendations are based on your entire order
   - Add suggested items directly from the cart

## Technical Implementation

### Data Structure

```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  // ... other fields
  recommendations?: string[]; // Array of recommended item IDs
}
```

### Components

- `RecommendationSection.tsx` - Displays recommendations after adding an item
- `CheckoutRecommendations.tsx` - Shows recommendations in the cart
- `MenuItemDialog.tsx` - Admin interface for setting recommendations
- `PublicMenuItem.tsx` - Updated to show recommendations

### Database

- Recommendations are stored as an array of item IDs in each menu item
- Data is automatically saved to Firestore when menu is updated
- No additional database schema changes required

## Demo

Visit `/test-recommendations` to see the recommendation system in action with sample data.

## Benefits

1. **Increased Revenue** - Strategic upselling through recommendations
2. **Better Customer Experience** - Helpful suggestions for meal completion
3. **Easy Management** - Simple admin interface for setting recommendations
4. **Flexible System** - Works with any menu structure
5. **Real-time Updates** - Changes take effect immediately

## Future Enhancements

- AI-powered recommendations based on order history
- Seasonal recommendation templates
- Analytics on recommendation effectiveness
- A/B testing for recommendation strategies
- Integration with inventory management
