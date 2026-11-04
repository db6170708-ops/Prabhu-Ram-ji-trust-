import React from 'react';
import { TRUST_INFO } from '../data/defaultData';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Mail, 
  Youtube, 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Coffee,
  Building,
  UtensilsCrossed,
  Globe
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdmin: () => void;
  onOpenReceiptSearch: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin,
  onOpenReceiptSearch
}) => {
  return (
    <footer className="bg-[#08241b] text-stone-300 pt-16 pb-8 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Col 1: Official Logo, Trust Identity & Motto */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-[#08241b] shrink-0">
                <img
                  src={TRUST_INFO.logoUrl}
                  alt="प्रभु रामजी ट्रस्ट लोगो"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-amber-100">
                  {TRUST_INFO.name}
                </h3>
                <p className="text-xs text-amber-300/80">
                  {TRUST_INFO.village}, {TRUST_INFO.tehsil} (म.प्र.)
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              सेवा, संस्कार और समाज कल्याण को समर्पित न्यास। प्रतिदिन प्रातः 6 बजे से नित्य निःशुल्क चाय सेवा, हर शनिवार शाम भव्य महाभंडारा, निराश्रित गौसेवा एवं प्रभु रामजी आश्रम व मंदिर निर्माण।
            </p>

            <div className="text-xs font-heading text-amber-300 italic pt-1">
              “{TRUST_INFO.motto}”
            </div>

            {/* Social Channels */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href={TRUST_INFO.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 flex items-center justify-center transition-colors"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href={TRUST_INFO.whatsappContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 flex items-center justify-center transition-colors"
                title="WhatsApp पर संपर्क जोड़ें / चैट करें"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={TRUST_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 flex items-center justify-center transition-colors"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={TRUST_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-500/30 flex items-center justify-center transition-colors"
                title="Instagram Page"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              त्वरित लिंक
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-200 transition-colors">
                  मुख्य पृष्ठ (होम)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ashram-nirman')} className="text-amber-300 font-bold hover:underline">
                  ★ आश्रम निर्माण सहयोग
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-200 transition-colors">
                  ट्रस्ट परिचय व इतिहास
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-200 transition-colors">
                  सेवा प्रकल्प विवरण
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('officials')} className="hover:text-amber-200 transition-colors">
                  अधिकृत पदाधिकारी
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('transparency')} className="hover:text-amber-200 transition-colors">
                  वित्तीय पारदर्शिता
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Receipts */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              सेवाएँ एवं सहयोग
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('ashram-nirman')} className="hover:text-amber-200 transition-colors flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>आश्रम व मंदिर निर्माण</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-200 transition-colors flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>हर शनिवार शाम भंडारा</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-200 transition-colors flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>प्रतिदिन निःशुल्क चाय सेवा</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('donate')} className="text-amber-300 font-bold hover:underline">
                  • PhonePe QR / बैंक विवरण
                </button>
              </li>
              <li>
                <button onClick={onOpenReceiptSearch} className="text-emerald-300 font-semibold hover:underline">
                  • डिजिटल दान रसीद खोजें
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] text-stone-400 block">
                अधिकृत UPI ID: <strong className="font-mono text-amber-200">{TRUST_INFO.upiId}</strong>
              </span>
            </div>
          </div>

          {/* Col 4: Address & Trust Office */}
          <div className="lg:col-span-3 space-y-3 text-xs sm:text-sm">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              ट्रस्ट संपर्क व कार्यालय
            </h4>
            <p className="flex items-start gap-2 text-stone-300 leading-relaxed">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{TRUST_INFO.fullAddress}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{TRUST_INFO.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-mono text-xs">{TRUST_INFO.email}</span>
            </p>
            <p className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <a 
                href="https://prabhuramjitrustram.ai.studio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-xs text-amber-300 hover:underline"
              >
                prabhuramjitrustram.ai.studio
              </a>
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
              >
                प्रशासनिक लॉगिन (Admin Area)
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © 2026 {TRUST_INFO.name} | सर्वाधिकार सुरक्षित | ग्राम गलगाँव (सनावद, खरगोन)
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-amber-200 transition-colors"
            >
              गोपनीयता नीति (Privacy Policy)
            </button>
            <span>·</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-amber-200 transition-colors"
            >
              नियम व शर्तें (Terms & Conditions)
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
