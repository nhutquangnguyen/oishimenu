'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getAvailableTemplates, createSampleMenu } from '@/lib/sample-menu-templates';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowRight, Check, Coffee, Pizza, Utensils, Eye, Edit } from 'lucide-react';

export default function TemplateSelectionPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [menuCreated, setMenuCreated] = useState(false);
  const { currentRestaurant } = useRestaurant();
  const router = useRouter();

  const templates = getAvailableTemplates();

  const getTemplateIcon = (key: string) => {
    switch (key) {
      case 'default':
        return <Utensils className="w-8 h-8 text-blue-600" />;
      case 'cafe':
        return <Coffee className="w-8 h-8 text-amber-600" />;
      case 'pizza':
        return <Pizza className="w-8 h-8 text-red-600" />;
      default:
        return <Utensils className="w-8 h-8 text-gray-600" />;
    }
  };

  const getTemplateColor = (key: string) => {
    switch (key) {
      case 'default':
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
      case 'cafe':
        return 'border-amber-200 bg-amber-50 hover:bg-amber-100';
      case 'pizza':
        return 'border-red-200 bg-red-50 hover:bg-red-100';
      default:
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
    }
  };

  const handleTemplateSelect = async () => {
    if (!selectedTemplate || !currentRestaurant?.id || loading) return;

    setLoading(true);

    try {
      // Create menu with selected template
      const templateData = createSampleMenu(currentRestaurant.id, selectedTemplate as any);

      const menuData = {
        categories: templateData.categories,
        optionGroups: templateData.optionGroups,
        isPublic: true,
        theme: 'blue',
        restaurant: {
          name: currentRestaurant.name,
          logo: currentRestaurant.logo || '🏪',
          description: currentRestaurant.description || 'Welcome to our restaurant!',
          address: currentRestaurant.address || '',
          phone: currentRestaurant.phone || '',
          hours: 'Mon-Sun: 11:00 AM - 10:00 PM'
        },
        lastUpdated: new Date()
      };

      await setDoc(doc(db, 'menus', currentRestaurant.id), menuData);

      // Mark onboarding as complete and show success options
      localStorage.setItem('onboardingCompleted', 'true');
      setMenuCreated(true);
    } catch (error) {
      console.error('Error creating menu from template:', error);
      alert('Failed to create menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    router.push('/dashboard');
  };

  const handleViewMenu = () => {
    if (currentRestaurant?.id) {
      window.open(`/menu/${currentRestaurant.id}`, '_blank');
    }
  };

  const handleEditMenu = () => {
    router.push('/dashboard/menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {menuCreated ? (
            /* Success Screen */
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 Your Menu is Ready!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Great! We've created your menu using the {templates.find(t => t.key === selectedTemplate)?.name} template.
                What would you like to do next?
              </p>

              {/* Action Options */}
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-blue-200 bg-blue-50 hover:bg-blue-100">
                  <CardContent className="p-8 text-center" onClick={handleViewMenu}>
                    <Eye className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">View Public Menu</h3>
                    <p className="text-sm text-gray-600">See how your menu looks to customers</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-purple-200 bg-purple-50 hover:bg-purple-100">
                  <CardContent className="p-8 text-center" onClick={handleEditMenu}>
                    <Edit className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Edit Your Menu</h3>
                    <p className="text-sm text-gray-600">Customize items, prices, and categories</p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  You can always access these options later from your dashboard.
                </p>
              </div>
            </div>
          ) : (
            /* Template Selection Screen */
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Choose Your Menu Template
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Get started quickly with a pre-built menu template. You can customize everything later.
                </p>
              </div>

          {/* Template Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {templates.map((template) => (
              <Card
                key={template.key}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.key
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : 'hover:shadow-lg'
                } ${getTemplateColor(template.key)}`}
                onClick={() => setSelectedTemplate(template.key)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    {getTemplateIcon(template.key)}
                  </div>
                  <CardTitle className="text-xl">
                    {template.name}
                    {selectedTemplate === template.key && (
                      <Check className="inline-block w-5 h-5 ml-2 text-blue-600" />
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {template.key === 'default' && (
                      <>
                        <Badge variant="outline" className="text-xs">Appetizers</Badge>
                        <Badge variant="outline" className="text-xs">Main Dishes</Badge>
                        <p className="text-xs text-gray-600 mt-2">
                          Perfect for traditional restaurants with appetizers and main courses
                        </p>
                      </>
                    )}
                    {template.key === 'cafe' && (
                      <>
                        <Badge variant="outline" className="text-xs">Beverages</Badge>
                        <Badge variant="outline" className="text-xs">Pastries</Badge>
                        <p className="text-xs text-gray-600 mt-2">
                          Ideal for coffee shops and casual dining spots
                        </p>
                      </>
                    )}
                    {template.key === 'pizza' && (
                      <>
                        <Badge variant="outline" className="text-xs">Pizzas</Badge>
                        <Badge variant="outline" className="text-xs">Sides</Badge>
                        <p className="text-xs text-gray-600 mt-2">
                          Great for pizza restaurants and casual dining
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={loading}
              className="order-2 sm:order-1"
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleTemplateSelect}
              disabled={!selectedTemplate || loading}
              className="order-1 sm:order-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? 'Creating Menu...' : 'Create Menu'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  Don't worry - you can always change your menu items, add categories, and customize everything later in the Menu Builder.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}