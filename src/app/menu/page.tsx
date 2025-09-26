import { PublicMenu } from '@/components/public/PublicMenu';

export default function MenuPage() {
  // This page should redirect to a specific restaurant menu
  // For now, show an error message asking for a restaurant ID
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Menu</h1>
        <p className="text-gray-600 mb-4">
          Please provide a restaurant ID to view the menu.
        </p>
        <p className="text-sm text-gray-500">
          Example: /menu/[restaurant-id]
        </p>
      </div>
    </div>
  );
}
