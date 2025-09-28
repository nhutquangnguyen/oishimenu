'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Restaurant } from '@/types/restaurant';
import { useLanguage } from '@/contexts/LanguageContext';

interface RestaurantDeleteDialogProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (restaurantId: string) => Promise<void>;
}

export function RestaurantDeleteDialog({
  restaurant,
  isOpen,
  onClose,
  onConfirm
}: RestaurantDeleteDialogProps) {
  const { t } = useLanguage();
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmationText !== restaurant.name) return;

    try {
      setIsDeleting(true);
      await onConfirm(restaurant.id);
      onClose();
      setConfirmationText('');
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
      setConfirmationText('');
    }
  };

  const isConfirmationValid = confirmationText === restaurant.name;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <DialogTitle className="text-red-900">{t('restaurant.delete.title')}</DialogTitle>
          </div>
          <DialogDescription className="space-y-2">
            <div>
              {t('restaurant.delete.confirmDescription', { restaurantName: restaurant.name })}
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              <strong>{t('restaurant.delete.warningTitle')}</strong> {t('restaurant.delete.warningDescription')}
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{t('restaurant.delete.warningList').split('\n')[0].replace('• ', '')}</li>
                <li>{t('restaurant.delete.warningList').split('\n')[1].replace('• ', '')}</li>
                <li>{t('restaurant.delete.warningList').split('\n')[2].replace('• ', '')}</li>
                <li>{t('restaurant.delete.warningList').split('\n')[3].replace('• ', '')}</li>
                <li>{t('restaurant.delete.warningList').split('\n')[4].replace('• ', '')}</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="confirmation">
              {t('restaurant.delete.confirmTitle')}:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={restaurant.name}
              className="mt-1"
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            {t('restaurant.delete.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmationValid || isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('restaurant.delete.deleting')}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {t('restaurant.delete.button')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}