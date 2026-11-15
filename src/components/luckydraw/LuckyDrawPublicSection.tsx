import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileDown,
  Loader2,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
  Ticket,
} from 'lucide-react';
import {
  exportCouponDomToPdf,
  exportCouponDomToPng,
  LuckyDrawApi,
} from '../../utils/luckyDrawApi';
import { LuckyDrawCoupon, PublicLuckyDrawStatus } from '../../types/luckyDraw';
import { TRUST_INFO } from '../../data/defaultData';
import { CouponRenderer } from './CouponRenderer';

export const LuckyDrawPublicSection: React.FC = () => {
  const [status, setStatus] = useState<PublicLuckyDrawStatus | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Booking form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerMobile, setBuyerMobile] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Active Order -> Verification step
  const [activeOrder, setActiveOrder] = useState<{
    orderId: string;
    amount: number;
    quantity: number;
    ticketPrice: number;
    gatewayMode: 'test' | 'live';
    provider: string;
    verificationToken: string;
  } | null>(null);
  const [paymentRef, setPaymentRef] = useState('');

  // Issued Result
  const [issuedCoupons, setIssuedCoupons] = useState<LuckyDrawCoupon[]>([]);
  const [verifiedMessage, setVerifiedMessage] = useState('');
  const couponRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchStatus = async () => {
    try {
      const s = await LuckyDrawApi.getPublicStatus();
      setStatus(s);
    } catch {
      setStatus(null);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchStatus();
    const onFocus = () => fetchStatus();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Strict Default OFF rule: completely invisible on homepage unless Super Admin turned BOTH master & homepage visibility ON
  if (!loaded || !status || !status.systemEnabled || !status.homepageVisible) {
    return null;
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!buyerName.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    const cleanMobile = buyerMobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    setSubmitting(true);
    try {
      const res = await LuckyDrawApi.createOrder({
        buyerName: buyerName.trim(),
        buyerMobile: cleanMobile,
        buyerEmail: buyerEmail.trim() || undefined,
        quantity,
      });
      setActiveOrder(res.order);
      setIssuedCoupons([]);
      setVerifiedMessage('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'कूपन ऑर्डर बनाने में त्रुटि हुई।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    setErrorMsg('');
    if (paymentRef.trim().length < 6) {
      setErrorMsg('कृपया भुगतान के बाद प्राप्त कम से कम 6 अंकों की UTR / Transaction ID दर्ज करें।');
      return;
    }

    setSubmitting(true);
    try {
      const res = await LuckyDrawApi.verifyPayment({
        orderId: activeOrder.orderId,
        paymentRef: paymentRef.trim(),
        verificationToken: activeOrder.verificationToken,
      });
      setIssuedCoupons(res.coupons || []);
      setVerifiedMessage(res.message);
      setActiveOrder(null);
      setPaymentRef('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'भुगतान सत्यापन विफल रहा। कृपया पुनः प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = quantity * (status.ticketPrice || 200);

  return (
    <div className="mt-8 bg-white/10 backdrop-blur-md rounded-3xl p-5 sm:p-8 border border-amber-400/50 shadow-2xl text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/60 text-amber-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>पावन सेवा लकी ड्रॉ कूपन</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-amber-100">
            {status.campaignTitle}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90">{status.campaignSubtitle}</p>
        </div>

        <div className="shrink-0 bg-emerald-950/80 border border-amber-400/60 px-4 py-2.5 rounded-2xl text-center">
          <span className="text-[11px] text-amber-200 block">प्रति कूपन सहयोग</span>
          <span className="font-mono text-2xl font-extrabold text-amber-300">
            ₹{status.ticketPrice} /-
          </span>
        </div>
      </div>

      {/* Granular Control Guard: Homepage visible but Booking temporarily disabled */}
      {!status.bookingOpen ? (
        <div className="mt-5 p-4 rounded-2xl bg-amber-950/50 border border-amber-400/40 flex items-center gap-3 text-sm text-amber-100">
          <Lock className="w-5 h-5 text-amber-300 shrink-0" />
          <span>
            वर्तमान में कूपन बुकिंग ट्रस्ट एडमिन द्वारा अस्थायी रूप से रोकी गई है। कृपया शीघ्र पुनः प्रयास करें।
          </span>
        </div>
      ) : issuedCoupons.length > 0 || verifiedMessage ? (
        /* Step 3: Payment Verified & Downloadable Coupons */
        <div className="mt-5 space-y-5">
          <div className="p-4 rounded-2xl bg-emerald-900/70 border border-emerald-400/60 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base text-amber-200">{verifiedMessage}</h4>
              <p className="text-xs text-emerald-100 mt-1">
                कृपया अपने लकी ड्रॉ कूपन की डिजिटल कॉपी (PNG / PDF) नीचे से सुरक्षित डाउनलोड करें।
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {issuedCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-2xl p-4 text-stone-900 space-y-3 shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-stone-500">अद्वितीय कूपन क्रमांक:</span>
                    <div className="font-mono font-extrabold text-lg text-[#0f4d3a]">
                      {coupon.couponNumber}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const el = couponRefs.current[coupon.couponNumber];
                        if (el) exportCouponDomToPng(el, `${coupon.couponNumber}.png`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PNG डाउनलोड</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const el = couponRefs.current[coupon.couponNumber];
                        if (el) {
                          exportCouponDomToPdf(
                            el,
                            `${coupon.couponNumber}.pdf`,
                            coupon.sample?.widthPx,
                            coupon.sample?.heightPx
                          );
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#0f4d3a] hover:bg-[#125843] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>PDF डाउनलोड</span>
                    </button>
                    <a
                      href={`/verify-coupon/${encodeURIComponent(coupon.couponNumber)}`}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 text-xs font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Verify</span>
                    </a>
                  </div>
                </div>

                {coupon.sample && (
                  <CouponRenderer
                    forwardRef={(el) => {
                      couponRefs.current[coupon.couponNumber] = el;
                    }}
                    config={coupon.sample}
                    couponNumber={coupon.couponNumber}
                    buyerName={coupon.buyerName}
                    issuedAt={coupon.issuedAt}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setIssuedCoupons([]);
              setVerifiedMessage('');
              setBuyerName('');
              setBuyerMobile('');
              setBuyerEmail('');
              setQuantity(1);
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs cursor-pointer"
          >
            एक और कूपन बुक करें
          </button>
        </div>
      ) : activeOrder ? (
        /* Step 2: Signed Order Created -> Complete Payment & Verify Signature */
        <form onSubmit={handleConfirmPayment} className="mt-5 space-y-4">
          <div className="p-4 rounded-2xl bg-white/10 border border-amber-300/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-amber-200 font-mono">
                Order ID: {activeOrder.orderId}
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                कुल देय राशि: ₹{activeOrder.amount.toLocaleString('en-IN')} ({activeOrder.quantity} कूपन)
              </div>
              <div className="text-[11px] text-emerald-100 mt-1 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-amber-300" />
                <span>UPI ID: {TRUST_INFO.upiId} पर भुगतान कर UTR / Transaction ID दर्ज करें</span>
              </div>
            </div>
            <div className="text-xs font-mono bg-emerald-950/70 px-3 py-1.5 rounded-xl border border-emerald-400/40 text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-amber-300" />
              Signed Order
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-900/70 border border-red-400 text-xs text-red-100 font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-amber-100 mb-1.5">
              भुगतान UTR / Transaction ID (कम से कम 6 अंक):
            </label>
            <input
              type="text"
              placeholder="उदा. UPI/412589632145"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white text-stone-900 rounded-xl text-sm font-mono focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveOrder(null)}
              className="px-4 py-2.5 rounded-xl border border-white/30 text-xs font-bold text-white cursor-pointer"
            >
              वापस जाएँ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>सत्यापित हो रहा है...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>भुगतान सत्यापित कर कूपन प्राप्त करें</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Step 1: Coupon Booking Input Form */
        <form onSubmit={handleCreateOrder} className="mt-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-900/70 border border-red-400 text-xs text-red-100 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amber-100 mb-1">
                श्रद्धालु का पूरा नाम *
              </label>
              <input
                type="text"
                placeholder="आपका शुभ नाम"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-stone-900 rounded-xl text-xs sm:text-sm focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-100 mb-1">
                मोबाइल नंबर (10 अंक) *
              </label>
              <input
                type="tel"
                placeholder="9575301233"
                value={buyerMobile}
                onChange={(e) => setBuyerMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-stone-900 rounded-xl text-xs sm:text-sm font-mono focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-100 mb-1">
                ईमेल (वैकल्पिक)
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-stone-900 rounded-xl text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-100 mb-1">
                कूपन संख्या (Quantity)
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 bg-white text-stone-900 rounded-xl text-xs sm:text-sm font-bold focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((q) => (
                  <option key={q} value={q}>
                    {q} कूपन (₹{(q * (status.ticketPrice || 200)).toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Ticket className="w-4 h-4" />
            )}
            <span>
              ₹{totalAmount.toLocaleString('en-IN')} सहयोग हेतु आगे बढ़ें (कूपन बुक करें)
            </span>
          </button>
        </form>
      )}
    </div>
  );
};
