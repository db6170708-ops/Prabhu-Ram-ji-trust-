import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  XCircle,
  Search,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Award,
  Building2,
  Lock,
  Printer,
} from 'lucide-react';
import { TRUST_INFO } from '../../data/defaultData';
import { PublicVerifiedCertificate } from '../../types/certificates';
import { CertificateApi } from '../../utils/certificateApi';

interface PublicVerifyPageProps {
  initialCertificateNumber: string;
  onGoHome: () => void;
}

export const PublicVerifyPage: React.FC<PublicVerifyPageProps> = ({
  initialCertificateNumber,
  onGoHome,
}) => {
  const [queryInput, setQueryInput] = useState(initialCertificateNumber);
  const [loading, setLoading] = useState(Boolean(initialCertificateNumber));
  const [result, setResult] = useState<{
    found: boolean;
    certificate?: PublicVerifiedCertificate;
    message?: string;
  } | null>(null);

  const performLookup = async (certNo: string) => {
    const trimmed = certNo.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await CertificateApi.publicVerify(trimmed);
      setResult(res);
    } catch {
      setResult({
        found: false,
        message: 'सत्यापन सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCertificateNumber) {
      performLookup(initialCertificateNumber);
    }
  }, [initialCertificateNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    const clean = queryInput.trim().toUpperCase();
    window.history.replaceState(null, '', `/verify/${encodeURIComponent(clean)}`);
    performLookup(clean);
  };

  const cert = result?.certificate;
  const isValid = cert?.status === 'valid';

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-800 flex flex-col">
      {/* Header */}
      <header className="bg-[#0f4d3a] text-white border-b-2 border-amber-500 px-4 sm:px-8 py-4 no-print">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={TRUST_INFO.logoUrl}
              alt="Prabhu Ramji Trust Logo"
              className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 bg-[#08241b] shrink-0"
            />
            <div className="min-w-0">
              <div className="font-heading text-lg sm:text-xl font-bold text-amber-200 truncate">
                प्रभु रामजी ट्रस्ट
              </div>
              <div className="text-[11px] text-emerald-100 truncate">
                आधिकारिक डिजिटल प्रमाण-पत्र सत्यापन पोर्टल
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoHome}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>मुख्य पृष्ठ पर जाएँ</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 space-y-6">
        {/* Search Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs no-print">
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#0f4d3a]">
            ऑनलाइन प्रमाण-पत्र सत्यापन (Certificate Verification)
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            प्रभु रामजी ट्रस्ट द्वारा जारी किसी भी सम्मान प्रमाण-पत्र की प्रामाणिकता की तुरंत जांच करें।
          </p>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="प्रमाण-पत्र क्रमांक दर्ज करें (उदा. PRRT-2026-0001)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0f4d3a]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#0f4d3a] hover:bg-[#145e48] text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'जांच हो रही है...' : 'सत्यापित करें'}</span>
            </button>
          </form>
        </div>

        {/* Result Area */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#0f4d3a] rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-stone-600">
              ट्रस्ट डेटाबेस से प्रमाण-पत्र सत्यापित किया जा रहा है...
            </p>
          </div>
        ) : result ? (
          result.found && cert ? (
            <div
              id="printable-verify-slip"
              className={`bg-white rounded-2xl border-2 p-6 sm:p-8 shadow-sm space-y-6 ${
                isValid ? 'border-emerald-600/60' : 'border-red-600/60'
              }`}
            >
              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isValid
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-red-50 border-red-200 text-red-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isValid ? (
                    <ShieldCheck className="w-8 h-8 text-emerald-700 shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-700 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-base sm:text-lg">
                      {isValid
                        ? 'सत्यापित एवं वैध प्रमाण-पत्र (Verified & Valid)'
                        : 'यह प्रमाण-पत्र रद्द कर दिया गया है (Certificate Revoked)'}
                    </div>
                    <div className="text-xs opacity-80">
                      {isValid
                        ? 'यह प्रमाण-पत्र प्रभु रामजी ट्रस्ट के आधिकारिक रिकॉर्ड में प्रमाणित है।'
                        : `निरस्तीकरण दिनांक: ${cert.revokedAt ? cert.revokedAt.split('T')[0] : 'N/A'}`}
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider self-start sm:self-center ${
                    isValid ? 'bg-emerald-700 text-white' : 'bg-red-700 text-white'
                  }`}
                >
                  {isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{isValid ? 'VALID' : 'REVOKED'}</span>
                </span>
              </div>

              {/* Publicly Allowed 6 Fields Grid ONLY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-stone-500">प्रमाण-पत्र क्रमांक (Certificate Number)</div>
                  <div className="font-mono font-extrabold text-base text-[#0f4d3a] mt-0.5 tabular-nums">
                    {cert.certificateNumber}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-stone-500">प्राप्तकर्ता का नाम (Recipient Name)</div>
                  <div className="font-bold text-base text-stone-900 mt-0.5">{cert.recipientName}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>श्रेणी / प्रकार (Category)</span>
                  </div>
                  <div className="font-semibold text-stone-900 mt-0.5">{cert.category}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>जारी दिनांक (Issue Date)</span>
                  </div>
                  <div className="font-semibold text-stone-900 mt-0.5 tabular-nums">{cert.issueDate}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-stone-500">वर्तमान स्थिति (Status)</div>
                  <div
                    className={`font-bold mt-0.5 ${isValid ? 'text-emerald-700' : 'text-red-700'}`}
                  >
                    {isValid ? 'Valid (वैध / सक्रिय)' : 'Revoked (रद्द / अमान्य)'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>जारीकर्ता संस्था (Issuer)</span>
                  </div>
                  <div className="font-bold text-[#0f4d3a] mt-0.5">{cert.issuer}</div>
                </div>
              </div>

              {/* Privacy & Print Row */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    गोपनीयता सुरक्षा: सार्वजनिक सत्यापन में मोबाइल नंबर, पता या राशि प्रदर्शित नहीं की जाती।
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>सत्यापन पर्ची प्रिंट / सेव करें</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6" />
              </div>
              <h2 className="font-bold text-lg text-stone-900">प्रमाण-पत्र नहीं मिला</h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                {result.message || 'कृपया प्रमाण-पत्र क्रमांक की जांच करें और पुनः प्रयास करें।'}
              </p>
            </div>
          )
        ) : null}
      </main>
    </div>
  );
};
