import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { getCouponVerifyUrl } from '../../utils/luckyDrawApi';

export interface CouponRenderConfig {
  sampleFileType: 'image' | 'pdf';
  sampleDataUrl: string;
  widthPx: number;
  heightPx: number;
  serialXPct: number;
  serialYPct: number;
  serialFontSize: number;
  serialColor: string;
  nameXPct: number;
  nameYPct: number;
  nameFontSize: number;
  nameColor: string;
  showQr: boolean;
  qrXPct: number;
  qrYPct: number;
  qrSizePx: number;
}

interface CouponRendererProps {
  config: CouponRenderConfig;
  couponNumber: string;
  buyerName: string;
  issuedAt?: string;
  onCanvasClick?: (xPct: number, yPct: number) => void;
  interactiveHint?: string;
  forwardRef?: React.Ref<HTMLDivElement>;
}

export const CouponRenderer: React.FC<CouponRendererProps> = ({
  config,
  couponNumber,
  buyerName,
  issuedAt,
  onCanvasClick,
  interactiveHint,
  forwardRef,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!config.showQr || !couponNumber) {
      setQrDataUrl('');
      return;
    }
    let active = true;
    const url = getCouponVerifyUrl(couponNumber);
    QRCode.toDataURL(url, {
      width: 240,
      margin: 1,
      color: { dark: '#0f4d3a', light: '#ffffff' },
    })
      .then((res) => {
        if (active) setQrDataUrl(res);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [config.showQr, couponNumber]);

  const aspectRatio = `${Math.max(config.widthPx || 1000, 100)} / ${Math.max(config.heightPx || 420, 80)}`;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onCanvasClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    onCanvasClick(
      Math.min(Math.max(xPct, 2), 98),
      Math.min(Math.max(yPct, 2), 98)
    );
  };

  return (
    <div className="w-full space-y-1.5">
      <div
        ref={forwardRef}
        onClick={handleClick}
        style={{ aspectRatio }}
        className={`relative w-full overflow-hidden rounded-2xl border-2 border-amber-400/80 bg-white shadow-lg select-none ${
          onCanvasClick ? 'cursor-crosshair ring-2 ring-emerald-500/40' : ''
        }`}
      >
        {/* Base Uploaded Sample Design */}
        {config.sampleFileType === 'image' && config.sampleDataUrl ? (
          <img
            src={config.sampleDataUrl}
            alt="Coupon Sample Base"
            className="w-full h-full object-fill block pointer-events-none"
          />
        ) : (
          /* Clean Official Frame if PDF base is uploaded */
          <div className="w-full h-full bg-gradient-to-br from-[#FFFDF7] via-[#FFF6E0] to-[#FDE8BD] p-5 flex flex-col justify-between border-4 border-[#0f4d3a]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-amber-800">
                  प्रभु रामजी ट्रस्ट · आधिकारिक लकी ड्रॉ कूपन (PDF Template Linked)
                </div>
                <div className="text-lg sm:text-xl font-bold text-[#0f4d3a] mt-0.5">
                  ग्राम गलगाँव, सनावद (म.प्र.)
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#0f4d3a] text-amber-300 font-mono text-xs font-bold">
                ₹200/-
              </span>
            </div>
            <div className="text-[11px] text-stone-600 flex justify-between border-t border-amber-300 pt-2">
              <span>ऑनलाइन सत्यापन: prabhuramjitrustram.ai.studio</span>
              {issuedAt && <span>दिनांक: {new Date(issuedAt).toLocaleDateString('hi-IN')}</span>}
            </div>
          </div>
        )}

        {/* Overlaid Unique Sequential Serial Number */}
        <div
          style={{
            left: `${config.serialXPct}%`,
            top: `${config.serialYPct}%`,
            color: config.serialColor || '#0f4d3a',
            fontSize: `clamp(11px, ${(config.serialFontSize || 24) * 0.1}cqi, ${config.serialFontSize || 24}px)`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute font-mono font-extrabold tracking-wide whitespace-nowrap px-2 py-0.5 rounded bg-white/85 backdrop-blur-xs shadow-xs border border-amber-300/70 pointer-events-none"
        >
          {couponNumber}
        </div>

        {/* Overlaid Customer / Devotee Name */}
        <div
          style={{
            left: `${config.nameXPct}%`,
            top: `${config.nameYPct}%`,
            color: config.nameColor || '#1c1917',
            fontSize: `clamp(11px, ${(config.nameFontSize || 22) * 0.09}cqi, ${config.nameFontSize || 22}px)`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute font-bold whitespace-nowrap px-2 py-0.5 rounded bg-white/80 backdrop-blur-xs pointer-events-none"
        >
          {buyerName}
        </div>

        {/* Optional Verification QR Code */}
        {config.showQr && qrDataUrl && (
          <div
            style={{
              left: `${config.qrXPct}%`,
              top: `${config.qrYPct}%`,
              width: `${Math.max(36, Math.min(120, config.qrSizePx || 72))}px`,
              height: `${Math.max(36, Math.min(120, config.qrSizePx || 72))}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute bg-white p-1 rounded-lg border border-emerald-700/40 shadow-sm pointer-events-none"
          >
            <img src={qrDataUrl} alt="Coupon QR" className="w-full h-full object-contain block" />
          </div>
        )}
      </div>

      {interactiveHint && (
        <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
          {interactiveHint}
        </div>
      )}
    </div>
  );
};
