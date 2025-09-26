'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PublicMenuSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export function PublicMenuSearch({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories
}: PublicMenuSearchProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 
                "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : 
                "hover:bg-gray-50"
              }
            >
              {category === 'all' ? 'All' : category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
