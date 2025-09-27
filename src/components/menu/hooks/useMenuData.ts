'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MenuCategory, MenuData, MenuOptionGroup } from '../types';
import { themes } from '../constants';

export function useMenuData(restaurantId?: string) {
  const { user } = useAuth();
  const { currentRestaurant } = useRestaurant();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [optionGroups, setOptionGroups] = useState<MenuOptionGroup[]>([]);
  const [isMenuPublic, setIsMenuPublic] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('blue');
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);

  // Load theme from localStorage after hydration
  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('menu-theme');
    if (savedTheme && themes[savedTheme as keyof typeof themes]) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  // Load menu data from Firestore
  useEffect(() => {
    const loadMenuData = async () => {
      if (!user?.uid) {
        console.log('No user authenticated, skipping menu load');
        // Clear state when no user
        setCategories([]);
        setCurrentRestaurantId(null);
        return;
      }

      // Determine which restaurant to load - prioritize restaurantId param, then currentRestaurant
      const targetRestaurantId = restaurantId || currentRestaurant?.id;
      console.log('🍽️ useMenuData - Loading menu for restaurant:', targetRestaurantId);
      console.log('📋 useMenuData - restaurantId param:', restaurantId);
      console.log('🏪 useMenuData - currentRestaurant?.id:', currentRestaurant?.id);

      if (!targetRestaurantId) {
        console.log('No restaurant ID available, cannot load menu - clearing data');
        // Clear menu data when no restaurant is available
        setCategories([]);
        setCurrentRestaurantId(null);
        return;
      }

      // Clear existing data when restaurant changes
      if (currentRestaurantId && currentRestaurantId !== targetRestaurantId) {
        console.log('🔄 useMenuData - Restaurant changed from', currentRestaurantId, 'to', targetRestaurantId, '- clearing previous menu data');
        setCategories([]);
        setIsMenuPublic(true);
        setSelectedTheme('blue');
      }

      setCurrentRestaurantId(targetRestaurantId);
      
      try {
        // Load from restaurant ID only - enforce proper hierarchy
        const menuDoc = await getDoc(doc(db, 'menus', targetRestaurantId));
        console.log('Loading menu data from Firestore for restaurant:', targetRestaurantId);
        
        if (menuDoc.exists()) {
          const menuData = menuDoc.data();
          console.log('Found menu data:', menuData);
          console.log('Menu data categories count:', menuData.categories?.length || 0);
          
          // Validate that the menu data belongs to the correct restaurant
          if (menuData.restaurantId && menuData.restaurantId !== targetRestaurantId) {
            console.warn('Menu data restaurant ID mismatch! Expected:', targetRestaurantId, 'Found:', menuData.restaurantId);
          }
          
          if (menuData.categories) {
            setCategories(menuData.categories);
            console.log('Loaded categories:', menuData.categories);
          }
          if (menuData.optionGroups) {
            setOptionGroups(menuData.optionGroups);
            console.log('Loaded option groups:', menuData.optionGroups);
          }
          if (menuData.isPublic !== undefined) {
            setIsMenuPublic(menuData.isPublic);
          }
          if (menuData.theme) {
            setSelectedTheme(menuData.theme);
          }
          if (menuData.restaurant && menuData.restaurant.logo && menuData.restaurant.logo !== "🏪") {
            setLogo(menuData.restaurant.logo);
          }
          if (menuData.showPoweredBy !== undefined) {
            setShowPoweredBy(menuData.showPoweredBy);
          }
        } else {
          console.log('No menu data found in Firestore for restaurant:', targetRestaurantId);
        }
      } catch (error) {
        console.error('Error loading menu data:', error);
      }
    };
    
    loadMenuData();
  }, [user?.uid, restaurantId, currentRestaurant?.id]);

  // Auto-save functionality
  const saveChanges = useCallback(async () => {
    if (!user?.uid || !currentRestaurantId) {
      console.error('User not authenticated or no restaurant selected');
      return;
    }
    
    // Validate that we're saving to the correct restaurant
    const expectedRestaurantId = restaurantId || currentRestaurant?.id || user?.uid;
    if (currentRestaurantId !== expectedRestaurantId) {
      console.error('Restaurant ID mismatch! Expected:', expectedRestaurantId, 'Got:', currentRestaurantId);
      return;
    }
    
    try {
      // Save menu data to Firestore with proper typing
      const menuData: MenuData = {
        categories: categories.map(category => ({
          ...category,
          restaurantId: currentRestaurantId, // Ensure all categories have restaurant ID
          items: category.items.map(item => ({
            ...item,
            restaurantId: currentRestaurantId // Ensure all items have restaurant ID
          }))
        })),
        optionGroups: optionGroups.map(group => ({
          ...group,
          restaurantId: currentRestaurantId // Ensure all option groups have restaurant ID
        })),
        isPublic: isMenuPublic,
        theme: selectedTheme,
        showPoweredBy: showPoweredBy,
        restaurantId: currentRestaurantId, // Required restaurant ID
        restaurant: currentRestaurant ? {
          name: currentRestaurant.name,
          logo: logo || currentRestaurant.logo || "🏪",
          description: currentRestaurant.description || "",
          address: currentRestaurant.address || "",
          phone: currentRestaurant.phone || "",
          email: currentRestaurant.email || "",
          hours: "Mon-Sun: 11:00 AM - 10:00 PM" // Default hours, can be made configurable
        } : {
          name: "Restaurant",
          logo: logo || "🏪",
          description: "",
          address: "",
          phone: "",
          email: "",
          hours: "Mon-Sun: 11:00 AM - 10:00 PM"
        },
        lastUpdated: new Date()
      };
      
      await setDoc(doc(db, 'menus', currentRestaurantId), menuData);
      console.log('Menu saved successfully to Firestore with restaurant ID:', currentRestaurantId);
      console.log('Menu data saved:', menuData);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving menu:', error);
    }
  }, [categories, optionGroups, user?.uid, isMenuPublic, selectedTheme, logo, showPoweredBy, currentRestaurantId, currentRestaurant]);

  // Save theme to localStorage
  const saveThemeToStorage = useCallback((theme: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('menu-theme', theme);
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (isAutoSaveEnabled && hasUnsavedChanges) {
      const timer = setTimeout(() => {
        saveChanges();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, isAutoSaveEnabled, saveChanges]);

  // Save theme when it changes
  useEffect(() => {
    saveThemeToStorage(selectedTheme);
    // Mark as changed when theme changes
    setHasUnsavedChanges(true);
  }, [selectedTheme, saveThemeToStorage]);

  // Mark changes as unsaved
  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  return {
    categories,
    setCategories,
    optionGroups,
    setOptionGroups,
    isMenuPublic,
    setIsMenuPublic,
    selectedTheme,
    setSelectedTheme,
    logo,
    setLogo,
    showPoweredBy,
    setShowPoweredBy,
    hasUnsavedChanges,
    isAutoSaveEnabled,
    setIsAutoSaveEnabled,
    lastSaved,
    isClient,
    saveChanges,
    markAsChanged
  };
}
