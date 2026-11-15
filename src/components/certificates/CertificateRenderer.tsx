import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { TRUST_INFO } from '../../data/defaultData';
import { CertificateTemplate } from '../../types/certificates';
import { getCertificateVerifyUrl } from '../../utils/certificateApi';

export interface CertificateRenderData {
  certificateNumber: string;
  recipientName: string;
  guardianName?: string;
  category: string;
  reason: string;
  amount?: number | null;
  issueDate: string;
  language: 'hi' | 'en';
  signatoryName: string;
  signatoryDesignation: string;
  photoUrl?: string;
  status?: 'valid' | 'revoked';
  sealText?: string;
}

interface CertificateCanvasProps {
  data: CertificateRenderData;
  template?: CertificateTemplate | null;
  id?: string;
  className?: string;
}

function formatDisplayDate(isoDate: string, lang: 'hi' | 'en'): string {
  if (!isoDate) return '';
  try {
    const dt = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(dt.getTime())) return isoDate;
    return dt.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

function interpolateTemplate(
  templateText: string,
  data: CertificateRenderData,
  fallbackText: string
): string {
  const base = (templateText || fallbackText).trim();
  return base
    .replace(/\{name\}/gi, data.recipientName || 'श्री श्रद्धालु जी')
    .replace(/\{guardian\}/gi, data.guardianName || '')
    .replace(/\{category\}/gi, data.category || 'सेवा सम्मान')
    .replace(/\{reason\}/gi, data.reason || 'निष्काम सेवा सहयोग')
    .replace(
      /\{amount\}/gi,
      data.amount && data.amount > 0 ? `₹${Number(data.amount).toLocaleString('en-IN')}` : ''
    );
}

const CornerMandalaSvg: React.FC<{ color: string; gold: string; className?: string }> = ({
  color,
  gold,
  className = '',
}) => (
  <svg
    viewBox="0 0 96 96"
    className={`w-20 h-20 pointer-events-none select-none ${className}`}
    fill="none"
  >
    <path d="M6 6 H58 C40 6 24 22 24 40 V58 H6 Z" fill={gold} fillOpacity="0.1" />
    <path d="M8 8 H68 M8 8 V68" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M16 16 H52 M16 16 V52" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="24" cy="24" r="6" fill={gold} fillOpacity="0.85" />
    <circle cx="24" cy="24" r="11" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
    <path
      d="M24 9 C28 16 32 16 39 24 C32 32 28 32 24 39 C20 32 16 32 9 24 C16 16 20 16 24 9 Z"
      stroke={gold}
      strokeWidth="1.2"
      fill="none"
    />
  </svg>
);

/**
 * Exact A4 Landscape 1122x794px (297mm x 210mm @ 96dpi) Print & PDF Canvas
 */
export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  data,
  template,
  id,
  className = '',
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const certNo = data.certificateNumber || 'PRRT-2026-PREVIEW';
  const verifyUrl = getCertificateVerifyUrl(certNo);
  const isHindi = data.language !== 'en';

  const primaryColor = template?.themePrimary || '#0f4d3a';
  const goldColor = template?.themeGold || '#d97706';
  const isArchStyle = template?.borderStyle === 'cultural_arch';

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(verifyUrl, {
      width: 220,
      margin: 1,
      color: { dark: '#0f4d3a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [verifyUrl]);

  const headerInvocation = isHindi
    ? template?.headerTextHi || '॥ श्री गणेशाय नमः ॥ श्री जानकीनाथ सहाय ॥'
    : template?.headerTextEn || 'With Divine Blessings of Prabhu Shri Ramji';

  const certHeading = isHindi
    ? template?.titleHi || 'सेवा सम्मान प्रमाण पत्र'
    : template?.titleEn || 'CERTIFICATE OF HONOUR & SEVA';

  const bodyText = interpolateTemplate(
    isHindi ? template?.bodyTemplateHi || '' : template?.bodyTemplateEn || '',
    data,
    isHindi
      ? 'यह पावन प्रमाण-पत्र {category} श्रेणी के अंतर्गत {reason} में आपके समर्पित एवं अमूल्य योगदान के लिए आदरपूर्वक प्रदान किया जाता है।'
      : 'This prestigious certificate is proudly presented in recognition of dedicated contribution under the {category} category for {reason}.'
  );

  const footerAddress = isHindi
    ? template?.footerNoteHi ||
      'प्रभु रामजी ट्रस्ट, ग्राम गलगाँव, तहसील सनावद, जिला खरगोन (म.प्र.) - 451111'
    : template?.footerNoteEn ||
      'Prabhu Ramji Trust, Village Galgaon, Tehsil Sanawad, Dist. Khargone (M.P.) - 451111';

  const sealText = data.sealText || 'प्रभु रामजी ट्रस्ट · ग्राम गलगाँव';
  const formattedDate = formatDisplayDate(data.issueDate, data.language);

  return (
    <div
      id={id}
      style={{
        width: '1122px',
        height: '794px',
        backgroundColor: '#FFFDF9',
        fontFamily: isHindi
          ? "'Noto Sans Devanagari', 'Martel', sans-serif"
          : "'Outfit', 'Martel', sans-serif",
      }}
      className={`relative overflow-hidden select-none text-stone-900 shrink-0 ${className}`}
    >
      {/* Subtle Sacred Parchment Radial Background & Cultural Border Pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(254, 249, 231, 0.95) 0%, rgba(255, 253, 249, 1) 62%, rgba(245, 238, 220, 0.72) 100%)',
        }}
      />

      {/* Top & Bottom Sacred Cultural Band */}
      <div
        className="absolute top-0 left-0 right-0 h-3.5"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-3.5"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Outer Royal Frame */}
      <div
        className="absolute inset-6 border-[3px]"
        style={{
          borderColor: primaryColor,
          borderRadius: isArchStyle ? '28px' : '8px',
        }}
      />

      {/* Inner Gold ornamental Border */}
      <div
        className="absolute inset-8 border-[1.5px]"
        style={{
          borderColor: goldColor,
          borderRadius: isArchStyle ? '22px' : '4px',
        }}
      />
      <div
        className="absolute inset-[38px] border border-dashed"
        style={{
          borderColor: `${goldColor}99`,
          borderRadius: isArchStyle ? '18px' : '2px',
        }}
      />

      {/* 4 Sacred Corner Mandalas */}
      <CornerMandalaSvg color={primaryColor} gold={goldColor} className="absolute top-8 left-8" />
      <CornerMandalaSvg
        color={primaryColor}
        gold={goldColor}
        className="absolute top-8 right-8 rotate-90"
      />
      <CornerMandalaSvg
        color={primaryColor}
        gold={goldColor}
        className="absolute bottom-8 left-8 -rotate-90"
      />
      <CornerMandalaSvg
        color={primaryColor}
        gold={goldColor}
        className="absolute bottom-8 right-8 rotate-180"
      />

      {/* Revoked Stamp Watermark (only if revoked) */}
      {data.status === 'revoked' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="border-8 border-red-700/75 text-red-700/80 px-12 py-4 rounded-2xl -rotate-12 bg-white/70 text-5xl font-extrabold tracking-widest uppercase">
            रद्द / REVOKED
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="relative z-10 h-full px-16 py-12 flex flex-col justify-between">
        {/* TOP HEADER ROW: Logo Left, Trust Title Center, Optional Photo Right */}
        <div className="flex items-start justify-between gap-6">
          {/* Left: Official Original Trust Logo (preserved untouched) */}
          <div className="w-36 flex flex-col items-center justify-start pt-1">
            <div
              className="w-24 h-24 rounded-full p-1 shadow-md flex items-center justify-center bg-[#08241b]"
              style={{ border: `2.5px solid ${goldColor}` }}
            >
              <img
                src={TRUST_INFO.logoUrl}
                alt="Prabhu Ramji Trust Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span
              className="mt-1.5 text-[10px] font-bold tracking-wider uppercase"
              style={{ color: primaryColor }}
            >
              स्थापना · गलगाँव
            </span>
          </div>

          {/* Center: Trust Header & Certificate Banner */}
          <div className="flex-1 text-center">
            <div
              className="text-xs font-bold tracking-[0.18em] mb-1"
              style={{ color: goldColor }}
            >
              {headerInvocation}
            </div>
            <h1
              className="text-4xl font-extrabold tracking-tight leading-tight"
              style={{
                color: primaryColor,
                fontFamily: "'Rozha One', 'Martel', 'Noto Sans Devanagari', serif",
              }}
            >
              {isHindi ? 'प्रभु रामजी ट्रस्ट' : 'PRABHU RAMJI TRUST'}
            </h1>
            <p className="text-xs font-semibold text-stone-600 mt-1">
              {isHindi
                ? 'ग्राम गलगाँव, तहसील सनावद, जिला खरगोन (मध्य प्रदेश) - 451111'
                : 'Village Galgaon, Tehsil Sanawad, Dist. Khargone (Madhya Pradesh) - 451111'}
            </p>

            {/* Ornamental Gold Divider */}
            <div className="flex items-center justify-center gap-3 my-2.5">
              <div className="h-[1.5px] w-24" style={{ backgroundColor: goldColor }} />
              <span style={{ color: goldColor }} className="text-sm font-bold">
                ❖
              </span>
              <div className="h-[1.5px] w-24" style={{ backgroundColor: goldColor }} />
            </div>

            {/* Title Ribbon */}
            <div
              className="inline-block px-8 py-1.5 rounded-md text-white font-bold text-lg tracking-wider shadow-xs"
              style={{
                background: `linear-gradient(90deg, ${primaryColor} 0%, #15664e 50%, ${primaryColor} 100%)`,
                border: `1.5px solid ${goldColor}`,
              }}
            >
              {certHeading}
            </div>
          </div>

          {/* Right: Optional Recipient Photo or Sacred Emblem Balance */}
          <div className="w-36 flex flex-col items-center justify-start pt-1">
            {data.photoUrl ? (
              <div className="flex flex-col items-center">
                <div
                  className="w-24 h-28 rounded-xl overflow-hidden bg-stone-100 shadow-sm"
                  style={{ border: `2px solid ${goldColor}` }}
                >
                  <img
                    src={data.photoUrl}
                    alt={data.recipientName || 'Recipient'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mt-1 text-[10px] font-semibold text-stone-500">
                  {isHindi ? 'सम्मानित चित्र' : 'Honouree Portrait'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end w-full text-right pt-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                  {isHindi ? 'प्रमाण-पत्र क्रमांक' : 'Certificate No.'}
                </div>
                <div
                  className="text-sm font-mono font-bold mt-0.5 tabular-nums"
                  style={{ color: primaryColor }}
                >
                  {certNo}
                </div>
                <div className="text-[10px] text-stone-500 mt-2">
                  {isHindi ? 'जारी दिनांक' : 'Issue Date'}
                </div>
                <div className="text-xs font-bold text-stone-800">{formattedDate}</div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER BODY: Recipient Highlight & Recognition Prose */}
        <div className="text-center max-w-4xl mx-auto px-4 space-y-3">
          <div className="text-sm font-semibold tracking-wide text-stone-600">
            {isHindi
              ? 'यह सम्मान प्रमाण-पत्र आदर एवं कृतज्ञता सहित प्रदान किया जाता है:'
              : 'This Certificate of Honour is respectfully conferred upon:'}
          </div>

          <div>
            <div
              className="text-[38px] font-extrabold leading-tight tracking-tight px-6 pb-1.5 inline-block border-b-2"
              style={{
                color: primaryColor,
                borderColor: goldColor,
                fontFamily: "'Martel', 'Rozha One', 'Noto Sans Devanagari', serif",
              }}
            >
              {data.recipientName || (isHindi ? 'श्री श्रद्धालु का नाम' : 'Recipient Full Name')}
            </div>

            {data.guardianName && (
              <div className="text-sm font-semibold text-stone-700 mt-1.5">
                {isHindi ? `सुपुत्र / पत्नी / सुपुत्री: ${data.guardianName}` : `S/o, W/o, D/o: ${data.guardianName}`}
              </div>
            )}
          </div>

          {/* Category Highlight */}
          <div className="pt-0.5">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: goldColor }}
            >
              {isHindi ? `सेवा श्रेणी: ${data.category}` : `Honour Category: ${data.category}`}
            </span>
          </div>

          {/* Citation / Body Text */}
          <p className="text-[15.5px] leading-relaxed text-stone-800 max-w-3xl mx-auto font-medium">
            {bodyText}
          </p>

          {/* Optional Support / Donation Amount (Shown cleanly if specified) */}
          {data.amount !== undefined && data.amount !== null && Number(data.amount) > 0 && (
            <div
              className="inline-block px-5 py-1 rounded-md border text-sm font-bold tabular-nums"
              style={{
                backgroundColor: '#fef9e7',
                borderColor: `${goldColor}88`,
                color: primaryColor,
              }}
            >
              {isHindi
                ? `समर्पित पुण्य सहयोग राशि: ₹${Number(data.amount).toLocaleString('en-IN')} /-`
                : `Sacred Contribution Amount: ₹${Number(data.amount).toLocaleString('en-IN')} /-`}
            </div>
          )}
        </div>

        {/* BOTTOM FOOTER ROW: Certificate Metadata + QR Left | Official Seal Center | Signature Right */}
        <div
          className="pt-4 border-t grid grid-cols-3 items-end gap-6"
          style={{ borderColor: `${goldColor}66` }}
        >
          {/* Left: QR Code & Unique Verification Number */}
          <div className="flex items-end gap-3.5 text-left">
            <div
              className="w-24 h-24 p-1 bg-white rounded-lg shrink-0 flex items-center justify-center shadow-xs"
              style={{ border: `1.5px solid ${primaryColor}` }}
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Verify QR ${certNo}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-[10px] font-mono text-stone-400">QR</span>
              )}
            </div>
            <div className="space-y-0.5 pb-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                {isHindi ? 'प्रमाण-पत्र क्रमांक (Unique ID)' : 'Certificate Number'}
              </div>
              <div
                className="text-sm font-mono font-extrabold tabular-nums"
                style={{ color: primaryColor }}
              >
                {certNo}
              </div>
              <div className="text-[11px] font-semibold text-stone-700">
                {isHindi ? `दिनांक: ${formattedDate}` : `Date: ${formattedDate}`}
              </div>
              <div className="text-[9.5px] font-mono text-stone-500">
                {isHindi ? 'QR स्कैन कर ऑनलाइन सत्यापन करें' : 'Scan QR to verify online'}
              </div>
            </div>
          </div>

          {/* Center: Official Circular Seal & Footer Address */}
          <div className="flex flex-col items-center justify-end text-center">
            <div
              className="w-20 h-20 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-1.5 text-center mb-1.5 shadow-inner"
              style={{
                borderColor: primaryColor,
                backgroundColor: '#f2faf6',
                color: primaryColor,
              }}
            >
              <span className="text-[8.5px] font-extrabold leading-tight">{sealText}</span>
              <span
                className="mt-1 text-[7.5px] font-bold px-1.5 py-0.5 rounded-sm text-white"
                style={{ backgroundColor: goldColor }}
              >
                VERIFIED
              </span>
            </div>
            <div className="text-[9.5px] text-stone-500 leading-tight max-w-xs">{footerAddress}</div>
          </div>

          {/* Right: Authorized Signatory */}
          <div className="flex flex-col items-end justify-end text-right pb-0.5">
            <div
              className="text-lg font-bold italic px-4 pb-1 border-b min-w-[210px] text-center"
              style={{
                color: primaryColor,
                borderColor: primaryColor,
                fontFamily: "'Martel', Georgia, serif",
              }}
            >
              {data.signatoryName || 'श्री गुलाबचंद जी'}
            </div>
            <div className="text-xs font-extrabold text-stone-900 mt-1">
              {data.signatoryDesignation || 'अध्यक्ष (President)'}
            </div>
            <div className="text-[10.5px] font-semibold text-stone-600">
              {isHindi
                ? 'अधिकृत हस्ताक्षरकर्ता · प्रभु रामजी ट्रस्ट'
                : 'Authorized Signatory · Prabhu Ramji Trust'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Responsive scaled wrapper around the exact 1122x794 A4 Landscape certificate
 */
export const ResponsiveCertificatePreview: React.FC<{
  data: CertificateRenderData;
  template?: CertificateTemplate | null;
}> = ({ data, template }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const w = el.clientWidth;
      if (w > 0) {
        setScale(Math.min(1, w / 1122));
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden flex justify-center">
      <div
        style={{
          width: `${1122 * scale}px`,
          height: `${794 * scale}px`,
        }}
        className="relative shadow-lg border border-stone-300 bg-[#FFFDF9] rounded-md overflow-hidden"
      >
        <div
          style={{
            width: '1122px',
            height: '794px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <CertificateCanvas data={data} template={template} />
        </div>
      </div>
    </div>
  );
};
