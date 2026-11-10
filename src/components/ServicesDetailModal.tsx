import React from 'react';
import { SevaProject } from '../types';
import { DEFAULT_SEVA_PROJECTS } from '../data/defaultData';
import { Language } from '../utils/translations';
import { X, HeartHandshake, CheckCircle2, Clock, Users, MapPin, Sparkles } from 'lucide-react';

interface ServicesDetailModalProps {
  isOpen: boolean;
  project: SevaProject | null;
  onClose: () => void;
  language: Language;
  onDonateForProject: (title: string) => void;
}

export const ServicesDetailModal: React.FC<ServicesDetailModalProps> = ({
  isOpen,
  project,
  onClose,
  language,
  onDonateForProject,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#0f4d3a] to-[#165a44] p-5 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-stone-900 mb-2">
                सेवा प्रकल्प {project.order || project.number || '1'} / 10
              </span>
              <h3 className="text-lg sm:text-xl font-bold">{project.title}</h3>
              <p className="text-xs text-amber-200/90 mt-0.5">{project.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden shadow-inner border border-stone-200">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Key Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {(project.impactStat || project.keyStats) && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
                <span className="text-[11px] text-emerald-800 font-semibold block">सेवा प्रभाव</span>
                <span className="text-sm sm:text-base font-bold text-[#0f4d3a]">
                  {project.impactStat || project.keyStats}
                </span>
              </div>
            )}
            {(project.schedule || project.dailyRoutine) && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center">
                <span className="text-[11px] text-amber-900 font-semibold block">समय / दिन</span>
                <span className="text-xs sm:text-sm font-bold text-amber-950">
                  {project.schedule || project.dailyRoutine}
                </span>
              </div>
            )}
            <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] text-stone-600 font-semibold block">स्थान</span>
              <span className="text-xs sm:text-sm font-bold text-stone-800">
                {project.location || 'ग्राम गलगाँव'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              प्रकल्प का उद्देश्य एवं विस्तृत विवरण
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
              {project.fullDescription || project.description}
            </p>
          </div>

          {/* Key Highlights / Bullets */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                प्रमुख विशेषताएं एवं कार्य
              </h4>
              <div className="space-y-2">
                {project.highlights.map((h: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 font-medium rounded-xl text-stone-700 text-xs sm:text-sm transition-colors"
          >
            बंद करें
          </button>
          <button
            onClick={() => {
              onClose();
              onDonateForProject(project.title);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-[#0f4d3a] to-[#145f49] hover:from-[#135742] hover:to-[#0f4d3a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            <span>इस प्रकल्प में दान दें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
