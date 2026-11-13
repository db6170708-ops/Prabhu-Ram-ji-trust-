import React, { useState } from 'react';
import { ASHRAM_NIRMAN_INFO } from '../data/defaultData';
import { 
  Building2, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronUp, 
  FolderHeart,
  X,
  Layers,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface AshramNirmanSectionProps {
  language?: Language;
  onDonateForAshram: (causeName: string, amount: number) => void;
  onOpenProgressReport?: () => void;
}

export const AshramNirmanSection: React.FC<AshramNirmanSectionProps> = ({ 
  onDonateForAshram,
  onOpenProgressReport
}) => {
  const t = TRANSLATIONS['hi'];
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'materials' | 'structure'>('all');

  const packages = ASHRAM_NIRMAN_INFO.packages;
  const galleryItems = ASHRAM_NIRMAN_INFO.gallery;

  const filteredPackages = packages.filter((pkg, idx) => {
    if (selectedCategory === 'materials') return idx < 3;
    if (selectedCategory === 'structure') return idx >= 3;
    return true;
  });

  const handleSelectPackage = (name: string, amount: number) => {
    setIsModalOpen(false);
    setIsFolderOpen(false);
    onDonateForAshram(`आश्रम निर्माण - ${name}`, amount || 2100);
  };

  return (
    <section id="ashram-nirman" className="py-16 md:py-24 bg-gradient-to-b from-[#0a3124] via-[#0f4d3a] to-[#0a2f22] text-white relative overflow-hidden border-b-4 border-amber-500 w-full max-w-full">
      
      {/* Background Sacred Geometric Aura */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-full overflow-hidden">
        
        {/* Section Heading with Sacred Banner */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-bold tracking-wide animate-pulse-gold mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.ashramTag}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-50 leading-tight">
            {t.ashramTitle}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 mx-auto mt-4 rounded-full shadow-lg"></div>

          <p className="text-stone-200 mt-4 text-base sm:text-lg leading-relaxed">
            {ASHRAM_NIRMAN_INFO.description}
          </p>

          {/* Current Live Work Status Badge */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 bg-black/40 px-5 py-2.5 rounded-2xl border border-amber-400/40 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t.ashramStatusPrefix} <strong>{ASHRAM_NIRMAN_INFO.currentPhase}</strong></span>
            </div>
            <span className="text-stone-500">|</span>
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t.ashramTargetPrefix} {ASHRAM_NIRMAN_INFO.targetCompletion}</span>
            </div>
            {onOpenProgressReport && (
              <>
                <span className="text-stone-500">|</span>
                <button
                  onClick={onOpenProgressReport}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs rounded-full shadow cursor-pointer transition-transform hover:scale-105"
                >
                  <Building2 className="w-3.5 h-3.5 text-stone-900" />
                  <span>{t.ashramReportBtn}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Construction Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group bg-black/40 rounded-3xl overflow-hidden border-2 border-amber-400/30 hover:border-amber-400 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="aspect-4/3 overflow-hidden bg-stone-900 relative">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#0f4d3a]/90 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-400/40">
                  {t.ashramPhotoBadge}
                </div>
              </div>

              <div className="p-5">
                <h4 className="font-heading text-lg font-bold text-amber-200 mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dedicated "अलग फोल्डर" Component for Contribution Packages */}
        <div className="bg-[#0b3326]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-xl transition-all">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-inner">
                {isFolderOpen ? (
                  <FolderOpen className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300" />
                ) : (
                  <Folder className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300">
                    📂 {t.homeFolderBadge}
                  </span>
                  <span className="text-xs text-stone-400 hidden sm:inline">· {t.homeFolderAvailable}</span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-amber-100">
                  {t.homeFolderTitle}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                  {t.homeFolderDesc}
                </p>
              </div>
            </div>

            {/* Folder Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0a2f22] transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-[#0a2f22]" />
                <span>{t.homeFolderOpenBtn}</span>
              </button>

              <button
                onClick={() => setIsFolderOpen(!isFolderOpen)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 border border-amber-400/40 text-stone-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isFolderOpen ? t.homeFolderCollapseBtn : t.homeFolderExpandBtn}</span>
                {isFolderOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Preview Chips */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-stone-400 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>फोल्डर सामग्री:</span>
            </span>
            {packages.map((pkg, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-black/30 border border-emerald-500/30 text-stone-300 font-mono">
                {pkg.name} {pkg.amount > 0 ? `(₹${pkg.amount})` : ''}
              </span>
            ))}
          </div>

          {/* Expandable Inline Folder View */}
          {isFolderOpen && (
            <div className="mt-6 pt-6 border-t border-amber-400/20 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-amber-200">
                  नीचे दी गई सूची में से अपनी श्रद्धानुसार घटक चुनें। चयन करने पर दान फॉर्म में विवरण स्वतः भर जाएगा।
                </p>
                <button
                  onClick={() => setIsFolderOpen(false)}
                  className="text-xs text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  {t.homeFolderCollapseBtn}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="bg-[#07241a]/95 rounded-2xl p-5 border border-emerald-500/30 hover:border-amber-400/70 transition-all shadow-md flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-400/20">
                          घटक {idx + 1}
                        </span>
                        {pkg.amount > 0 ? (
                          <span className="font-mono text-base font-bold text-amber-300">
                            ₹{pkg.amount.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-300">
                            इच्छानुसार
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading text-base font-bold text-white mb-1">
                        {pkg.name}
                      </h4>

                      <p className="text-xs text-stone-300 mb-4 line-clamp-2">
                        {pkg.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectPackage(pkg.name, pkg.amount)}
                      className="w-full py-2 px-3 text-xs font-bold text-[#0b3326] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 text-[#0b3326]" />
                      <span>{t.ashramSponsorBtn}</span>
                      <ArrowRight className="w-3 h-3 text-[#0b3326]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Trust Assurance */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-stone-300 flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1.5 text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% पारदर्शी निर्माण लेखा</span>
            </span>
            <span className="text-stone-600">·</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>डिजिटल दान पावती रसीद तुरंत उपलब्ध</span>
            </span>
            <span className="text-stone-600">·</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>दानदाता का नाम आश्रम रिकॉर्ड पंजिका में अंकित</span>
            </span>
          </div>

        </div>

      </div>

      {/* Dedicated Folder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0b3326] border-2 border-amber-400/50 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-white">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#07241a] border-b border-amber-400/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <FolderHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-amber-200">
                    📁 {t.homeFolderTitle}
                  </h3>
                  <p className="text-xs text-stone-300">
                    {t.tagline} · आश्रम एवं मंदिर निर्माण अंशदान सूची
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Folder Sub-Category Filter Tabs */}
            <div className="px-6 py-3 bg-[#0a2f22] border-b border-white/10 flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-amber-400 text-[#0b3326] font-bold shadow'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                सभी घटक (6)
              </button>
              <button
                onClick={() => setSelectedCategory('materials')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedCategory === 'materials'
                    ? 'bg-amber-400 text-[#0b3326] font-bold shadow'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                सामग्री (सीमेंट, ईंटें, सरिया)
              </button>
              <button
                onClick={() => setSelectedCategory('structure')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedCategory === 'structure'
                    ? 'bg-amber-400 text-[#0b3326] font-bold shadow'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                संरचना (स्तंभ, कक्ष व ऐच्छिक)
              </button>
            </div>

            {/* Modal Body: The 6 Packages inside the folder */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPackages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="bg-[#07241a] rounded-2xl p-5 border border-emerald-500/40 hover:border-amber-400 transition-all shadow-md flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                          {pkg.amount > 0 ? `घटक #${idx + 1}` : 'विशेष सहयोग'}
                        </span>
                        {pkg.amount > 0 ? (
                          <span className="font-mono text-lg font-bold text-white group-hover:text-amber-300">
                            ₹{pkg.amount.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-300">
                            इच्छानुसार
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading text-base font-bold text-amber-100 mb-1">
                        {pkg.name}
                      </h4>

                      <p className="text-xs text-stone-300 mb-4">
                        {pkg.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectPackage(pkg.name, pkg.amount)}
                      className="w-full py-2.5 px-3 text-xs font-bold text-[#0b3326] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 text-[#0b3326]" />
                      <span>{t.ashramSponsorBtn}</span>
                      <ArrowRight className="w-3 h-3 text-[#0b3326]" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Guarantees */}
              <div className="mt-4 p-4 rounded-xl bg-black/30 border border-white/10 text-xs text-stone-300 flex flex-wrap items-center justify-around gap-2 text-center">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% पारदर्शी निर्माण लेखा
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" /> डिजिटल दान पावती रसीद तुरंत उपलब्ध
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> दानदाता का नाम रिकॉर्ड पंजिका में अंकित
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#07241a] border-t border-amber-400/30 flex items-center justify-between text-xs">
              <span className="text-stone-400">
                चयन करने पर दान पेज पर आधिकारिक रसीद प्रणाली खुलेगी
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 font-semibold transition-colors cursor-pointer"
              >
                बंद करें
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
