'use client';

import React, { useCallback } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MenuOptionGroup, MenuOption } from './types';

interface SingleChoiceOptionsProps {
  group: MenuOptionGroup;
  selected: string[];
  onSelectionChange: (groupId: string, value: string) => void;
}

export function SingleChoiceOptions({ group, selected, onSelectionChange }: SingleChoiceOptionsProps) {
  const handleValueChange = useCallback((value: string) => {
    console.log('SingleChoice value changed:', value, 'for group:', group.id);
    onSelectionChange(group.id, value);
  }, [group.id, onSelectionChange]);

  const availableOptions = group.options.filter(option => option.isAvailable);

  return (
    <RadioGroup
      value={selected[0] || undefined}
      onValueChange={handleValueChange}
    >
      {availableOptions.map(option => (
        <div key={option.id} className="flex items-center space-x-2">
          <RadioGroupItem value={option.id} id={`${group.id}-${option.id}`} />
          <Label htmlFor={`${group.id}-${option.id}`} className="flex-1 cursor-pointer">
            <div className="flex items-center justify-between">
              <span>{option.name}</span>
              {option.price > 0 && (
                <span className="text-sm font-medium text-green-600">
                  +${option.price.toFixed(2)}
                </span>
              )}
              {option.price === 0 && (
                <span className="text-sm text-gray-500">No extra cost</span>
              )}
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
