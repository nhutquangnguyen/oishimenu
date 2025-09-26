// Environment variables helper
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  
  // Server-side: use environment variable or fallback
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const getMenuUrl = (restaurantId?: string, tableNumber?: string) => {
  const baseUrl = getBaseUrl();
  if (restaurantId && restaurantId !== 'default') {
    return tableNumber 
      ? `${baseUrl}/menu/${restaurantId}?table=${tableNumber}` 
      : `${baseUrl}/menu/${restaurantId}`;
  }
  return tableNumber ? `${baseUrl}/menu?table=${tableNumber}` : `${baseUrl}/menu`;
};

export const getQRCodeUrl = (data: string, size: number = 200) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
};
