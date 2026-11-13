import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC<{ 
  variant?: 'header' | 'hero' | 'floating'; 
  className?: string; 
}> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running in standalone / installed PWA mode, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#08241b] text-xs font-extrabold shadow-sm hover:shadow transition-all cursor-pointer border border-amber-300 animate-pulse-gold shrink-0 ${className}`}
          title="अपने फोन में ऐप इंस्टॉल करें"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>ऐप इंस्टॉल करें</span>
        </button>
      )}

      {variant === 'hero' && (
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#08241b] font-bold text-sm shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 border-yellow-200 transform hover:-translate-y-0.5"
        >
          <Smartphone className="w-4 h-4 text-[#08241b]" />
          <span>मोबाइल ऐप इंस्टॉल करें</span>
          <span className="text-[10px] bg-[#08241b] text-amber-300 px-2 py-0.5 rounded-full font-extrabold ml-1">HD</span>
        </button>
      )}

      {/* Installation Guide Modal for Android Chrome & iOS Safari */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border-2 border-amber-400 animate-in zoom-in-95">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-[#041610] p-1 border-2 border-amber-400 shadow-lg overflow-hidden">
              <img
                src="/pwa-192x192.png"
                alt="प्रभु रामजी ट्रस्ट लोगो"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-[#0f4d3a]">
                प्रभु रामजी ट्रस्ट ऐप इंस्टॉल करें
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                सीधे अपने मोबाइल की होम स्क्रीन पर जोड़ें और बिना किसी ब्राउज़र बार के फुल-स्क्रीन उपयोग करें।
              </p>
            </div>

            {isIOS ? (
              <div className="text-left bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-[#08241b] flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                  <span>Safari ब्राउज़र में नीचे (या ऊपर) दिए गए <strong>Share (साझा करें)</strong> आइकन पर टैप करें।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-[#08241b] flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                  <span>नीचे स्क्रॉल करके <strong>"Add to Home Screen"</strong> विकल्प चुनें।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-[#08241b] flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                  <span>दाईं ओर <strong>"Add"</strong> दबाते ही प्रभु रामजी ट्रस्ट का HD ऐप आपके iPhone / iPad में जुड़ जाएगा!</span>
                </div>
              </div>
            ) : (
              <div className="text-left bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-[#08241b] flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                  <span>Chrome ब्राउज़र में ऊपर दाईं ओर <strong>तीन बिंदुओं (⋮)</strong> पर टैप करें।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-[#08241b] flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                  <span>सूची में से <strong>"Install app"</strong> या <strong>"Add to Home screen"</strong> चुनें।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-[#08241b] flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                  <span><strong>"Install"</strong> दबाते ही प्रभु रामजी ट्रस्ट का HD ऐप आपके फोन में जुड़ जाएगा!</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 bg-[#0f4d3a] hover:bg-[#0a392b] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              समझ गया / बंद करें
            </button>
          </div>
        </div>
      )}
    </>
  );
};
