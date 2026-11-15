import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileDown,
  Loader2,
  Search,
  ShieldAlert,
  Ticket,
} from 'lucide-react';
import {
  exportCouponDomToPdf,
  exportCouponDomToPng,
  LuckyDrawApi,
} from '../../utils/luckyDrawApi';
import { PublicVerifiedCoupon } from '../../types/luckyDraw';
import { CouponRenderer } from './CouponRenderer';

interface CouponVerifyPageProps {
  initialCouponNumber: string;
  onGoHome: () => void;
}

export const CouponVerifyPage: React.FC<CouponVerifyPageProps> = ({
  initialCouponNumber,
  onGoHome,
}) => {
  const [query, setQuery] = useState(initialCouponNumber || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    coupon?: PublicVerifiedCoupon;
    message?: string;
  } | null>(null);
  const couponRef = useRef<HTMLDivElement>(null);

  const runVerify = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    try {
      const res = await LuckyDrawApi.verifyCouponPublic(clean);
      setResult(res);
    } catch {
      setResult({ found: false, message: 'कूपन सत्यापन में तकनीकी त्रुटि हुई।' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCouponNumber) {
      setQuery(initialCouponNumber);
      runVerify(initialCouponNumber);
    }
  }, [initialCouponNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runVerify(query);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-[#0f4d3a] hover:bg-stone-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>मुख्य पृष्ठ पर लौटें</span>
          </button>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            प्रभु रामजी ट्रस्ट · आधिकारिक कूपन सत्यापन
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200 space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0f4d3a]">
              <Ticket className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#0f4d3a]">
              लकी ड्रॉ कूपन ऑनलाइन सत्यापन (Verify Coupon)
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              अपना अद्वितीय कूपन क्रमांक दर्ज कर उसकी वैधता और ट्रस्ट रिकॉर्ड की जांच करें।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="कूपन क्रमांक लिखें (जैसे: PRRT-LD-2026-0001)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0f4d3a]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[#0f4d3a] hover:bg-[#125843] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>सत्यापित करें</span>
            </button>
          </form>

          {result && !result.found && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-900 text-sm">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <span>{result.message}</span>
            </div>
          )}

          {result?.found && result.coupon && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-7 h-7 text-emerald-700 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-800 uppercase">
                      सत्यापित वैध ट्रस्ट कूपन ✓
                    </div>
                    <div className="font-mono text-lg font-extrabold text-[#0f4d3a]">
                      {result.coupon.couponNumber}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-stone-700 space-y-0.5 sm:text-right">
                  <div>
                    नाम: <strong>{result.coupon.buyerName}</strong>
                  </div>
                  <div>
                    मोबाइल: <strong className="font-mono">{result.coupon.maskedMobile}</strong> · राशि:{' '}
                    <strong className="font-mono">₹{result.coupon.amount}</strong>
                  </div>
                </div>
              </div>

              {result.coupon.sample && (
                <>
                  <CouponRenderer
                    forwardRef={couponRef}
                    config={result.coupon.sample}
                    couponNumber={result.coupon.couponNumber}
                    buyerName={result.coupon.buyerName}
                    issuedAt={result.coupon.issuedAt}
                  />
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        couponRef.current &&
                        exportCouponDomToPng(
                          couponRef.current,
                          `${result.coupon!.couponNumber}.png`
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PNG डाउनलोड</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        couponRef.current &&
                        exportCouponDomToPdf(
                          couponRef.current,
                          `${result.coupon!.couponNumber}.pdf`,
                          result.coupon!.sample?.widthPx,
                          result.coupon!.sample?.heightPx
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-[#0f4d3a] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>PDF डाउनलोड</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
