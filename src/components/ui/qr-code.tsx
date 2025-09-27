'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  onGenerated?: (dataUrl: string) => void;
}

export function QRCodeComponent({ value, size = 200, className = '', onGenerated }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !value) return;

      try {
        setError(null);
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });

        // Get data URL for download functionality
        if (onGenerated) {
          const dataUrl = canvasRef.current.toDataURL('image/png');
          onGenerated(dataUrl);
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      }
    };

    generateQR();
  }, [value, size, onGenerated]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 ${className}`} style={{ width: size, height: size }}>
        <p className="text-sm text-gray-500 text-center">QR code error</p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`border border-gray-200 ${className}`}
      width={size}
      height={size}
    />
  );
}

export function downloadQRCode(dataUrl: string, filename: string = 'menu-qr-code.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}