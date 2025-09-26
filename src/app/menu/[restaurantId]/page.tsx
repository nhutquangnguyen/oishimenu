import { PublicMenu } from '@/components/public/PublicMenu';

interface MenuPageProps {
  params: {
    restaurantId: string;
  };
}

export default async function RestaurantMenuPage({ params }: MenuPageProps) {
  const { restaurantId } = await params;
  
  // Validate that restaurantId is provided
  if (!restaurantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Restaurant</h1>
          <p className="text-gray-600">
            Restaurant ID is required to view the menu.
          </p>
        </div>
      </div>
    );
  }

  return <PublicMenu restaurantId={restaurantId} />;
}