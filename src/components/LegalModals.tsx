import React from 'react';
import { TRUST_INFO } from '../data/defaultData';
import { X, Shield, Scale } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' ? (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Shield className="w-6 h-6 text-[#0f4d3a]" />
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0f4d3a]">
                गोपनीयता नीति (Privacy Policy)
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              प्रभु रामजी ट्रस्ट, ग्राम गलगाँव (सनावद, खरगोन) - अंतिम अद्यतन: 2026
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 max-h-96 overflow-y-auto pr-2 leading-relaxed">
              <p>
                <strong>1. व्यक्तिगत जानकारी का संग्रह:</strong> प्रभु रामजी ट्रस्ट द्वारा दानदाताओं से केवल दान पावती रसीद जारी करने, लेखा जोखा रखने एवं संवाद हेतु नाम, मोबाइल नंबर, ईमेल और वैकल्पिक पैन नंबर एकत्र किया जाता है।
              </p>
              <p>
                <strong>2. डेटा की सुरक्षा:</strong> आपकी जानकारी पूर्णतः गोपनीय रखी जाती है। हम किसी भी तृतीय पक्ष को दानदाता का विवरण न तो बेचते हैं और न ही विपणन (मार्केटिंग) हेतु साझा करते हैं।
              </p>
              <p>
                <strong>3. भुगतान सुरक्षा:</strong> ऑनलाइन यूपीआई या बैंक ट्रांसफर सीधे बैंकों व अधिकृत यूपीआई नेटवर्क के माध्यम से होता है। ट्रस्ट की वेबसाइट पर आपका कोई भी यूपीआई पिन या बैंक पासवर्ड सहेजा नहीं जाता।
              </p>
              <p>
                <strong>4. कानूनी अनुपालन:</strong> सरकारी नियमों अथवा आयकर विभाग के अधिकृत निर्देश होने पर ही विधिक आवश्यकताओं के अंतर्गत रिकॉर्ड प्रस्तुत किए जा सकते हैं।
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Scale className="w-6 h-6 text-[#0f4d3a]" />
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0f4d3a]">
                नियम एवं शर्तें (Terms & Conditions)
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              प्रभु रामजी ट्रस्ट, ग्राम गलगाँव (सनावद, खरगोन) - अंतिम अद्यतन: 2026
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 max-h-96 overflow-y-auto pr-2 leading-relaxed">
              <p>
                <strong>1. स्वैच्छिक दान:</strong> प्रभु रामजी ट्रस्ट को दिया जाने वाला प्रत्येक दान स्वैच्छिक एवं निष्काम सेवा भावना से दिया गया सहयोग है।
              </p>
              <p>
                <strong>2. उपयोगिता:</strong> समस्त दान राशि का उपयोग नियमानुसार गौसेवा, हरा चारा, नर्मदा परिक्रमा साधु सेवा एवं शनिवार भंडारे में किया जाता है।
              </p>
              <p>
                <strong>3. कर छूट (80G स्थिति):</strong> ट्रस्ट द्वारा 12AB एवं 80G पंजीकरण की औपचारिकताएं आयकर विभाग में प्रक्रियाधीन हैं। दानदाता यह समझकर दान कर रहे हैं कि विधिक स्वीकृति प्राप्त होने पर ही कर-छूट प्रमाण पत्र मान्य होगा।
              </p>
              <p>
                <strong>4. धनवापसी नीति (Refund Policy):</strong> धार्मिक एवं परोपकारी दान सेवा कार्यों में तुरंत व्यय हो जाता है, अतः सामान्य परिस्थितियों में दान राशि की वापसी (Refund) संभव नहीं है। यदि किसी तकनीकी त्रुटि से दोहरा भुगतान हो गया हो तो 7 दिनों के भीतर बैंक प्रमाण के साथ संपर्क करें।
              </p>
              <p>
                <strong>5. क्षेत्राधिकार:</strong> किसी भी विधिक विवाद की स्थिति में न्यायिक क्षेत्राधिकार तहसील सनावद / जिला खरगोन (मध्य प्रदेश) रहेगा।
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0f4d3a] text-white text-xs font-bold rounded-xl"
          >
            स्वीकार करें एवं बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
