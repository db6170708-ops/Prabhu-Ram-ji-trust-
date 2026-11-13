import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../utils/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-600/95 backdrop-blur-md border border-amber-300/60 px-4 py-2 text-xs font-bold text-white shadow-xl"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>ऑफ़लाइन मोड — सहेजी गई जानकारी दिखाई जा रही है</span>
    </div>
  );
};
