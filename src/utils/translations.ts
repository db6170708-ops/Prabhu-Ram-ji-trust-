// 17 Supported Languages for Google Translate Integration
export interface SupportedLanguage {
  code: string;
  name: string;        // English Name
  nativeName: string;  // Native Script Name
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export type LanguageOption = SupportedLanguage;

export const SUPPORTED_LANGUAGES_17: SupportedLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', dir: 'rtl' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🕉️' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇮🇳', dir: 'rtl' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', flag: '🇮🇳' },
];

export type Language = string;

// Standard 100% Pure Hindi Base Texts (No mixed words, pristine Devanagari)
export const HINDI_TEXT = {
  trustName: "प्रभु रामजी ट्रस्ट",
  officialBadge: "आधिकारिक सेवा मंच",
  tagline: "सेवा ही संकल्प • सहयोग ही शक्ति",
  pinCode: "451111",
  motto: "सेवा ही धर्म है, परोपकार ही सच्ची पूजा है",
  dailyTeaNotice: "प्रातः 6 बजे से नित्य निःशुल्क चाय सेवा",
  searchReceiptBtn: "रसीद खोजें",
  donateBtn: "दान करें",
  adminLogin: "व्यवस्थापक प्रवेश",
  languageSelectBtn: "17 भाषाएँ (Languages)",
  switchLangBtn: "भाषा बदलें",
  
  // Navigation
  navHome: "मुख्य पृष्ठ",
  navAshram: "आश्रम निर्माण",
  navAshramNirman: "आश्रम निर्माण",
  navAbout: "हमारा परिचय",
  navObjectives: "ट्रस्ट के उद्देश्य",
  navServices: "सेवा प्रकल्प",
  navOfficials: "न्यासी मंडल",
  navGallery: "सेवा दर्शन",
  navTransparency: "वित्तीय शुचिता",
  navNews: "समाचार व सूचनाएं",
  navContact: "संपर्क व मार्ग दर्शन",
  navVolunteer: "स्वयंसेवक",
  navCertificate: "सेवा सम्मान",
  navComplaint: "सुझाव व सहायता",
  navConstructionProgress: "निर्माण प्रगति",

  // Floating & Global Controls
  scrollTop: "शीर्ष पर जाएँ",
  floatingWhatsApp: "WhatsApp संपर्क",

  // Header and Mobile Drawer
  downloadAppTitle: "प्रभु रामजी ट्रस्ट ऐप डाउनलोड करें",
  downloadAppSub: "बिना किसी रुकावट के सेवा, दान व रसीद की सुविधा मोबाइल पर",
  connectSocialTitle: "आधिकारिक सोशल मीडिया माध्यम",
  whatsappChannelName: "WhatsApp चैनल",
  
  // Hero
  heroSalutation: "॥ कोदण्डधारी प्रभु श्री राम ॥",
  heroSubtitle: "ग्राम गलगाँव (सनावद, खरगोन) • माँ नर्मदा के पावन प्रवाह व प्रभु रामजी के आदर्शों पर निष्काम जनसेवा",
  heroDesc: "प्रभु रामजी ट्रस्ट के पावन प्रांगण में नित्य प्रातः निःशुल्क चाय सेवा, प्रति शनिवार शाम भव्य महाभंडारा, निराश्रित गौमाता का संरक्षण तथा परिक्रमा पथिकों हेतु दिव्य आश्रम का निर्माण कार्य अनवरत जारी है।",
  heroBtnAshram: "आश्रम निर्माण सहयोग",
  heroBtnDonate: "ऑनलाइन दान करें",
  heroBtnWhatsApp: "WhatsApp चैनल",
  heroRoutineTea: "नित्य प्रातः 6 बजे से निःशुल्क चाय सेवा",
  heroRoutineBhandara: "प्रत्येक शनिवार शाम महाभंडारा व प्रसादी",
  heroRoutineAshram: "आश्रम व मंदिर निर्माण कार्य प्रगति पर",
  heroRoutineGau: "दैनिक गौसेवा, चारा व चिकित्सा",
  heroSearchReceiptNote: "दान रसीद खोजने हेतु",
  heroActiveWorkBadge: "सक्रिय सेवा प्रकल्प",
  heroSupportNow: "सहयोग समर्पित करें",
  heroPrevWork: "पिछला",
  heroNextWork: "अगला",
  kodandaTitle: "कोदण्डधारी प्रभु श्री राम जी",
  kodandaDesc: "ग्राम गलगाँव (सनावद, खरगोन) स्थित पावन सेवा न्यास",

  // Home Folder
  homeFolderBadge: "निर्माण सहयोग फोल्डर",
  homeFolderAvailable: "6 घटक उपलब्ध",
  homeFolderTitle: "आश्रम निर्माण सहयोग घटक फोल्डर",
  homeFolderDesc: "ईंट, सीमेंट, सरिया, पिलर व विश्राम कक्ष प्रायोजन सूची को इस अलग फोल्डर में सहेजा गया है।",
  homeFolderOpenBtn: "सहयोग फोल्डर खोलें (पॉपअप)",
  homeFolderExpandBtn: "यहाँ विस्तार देखें",
  homeFolderCollapseBtn: "फोल्डर समेटें",

  // Objectives
  objectivesTag: "पावन संकल्प एवं अधिदेश",
  objectivesTitle: "ट्रस्ट के 10 सेवा संकल्प एवं उद्देश्य",
  objectivesSub: "सनातन भारतीय संस्कृति, गौसेवा, तीर्थयात्री सत्कार एवं जनहित में प्रभु रामजी ट्रस्ट के नैतिक सेवा लक्ष्य।",

  // Key Services
  servicesTag: "समग्र सेवा पोर्टफोलियो",
  servicesTitle: "ट्रस्ट के सभी 10 सेवा प्रकल्प",
  servicesSub: "किसी भी प्रकल्प का विस्तार देखने व उसमें सीधा सहयोग समर्पित करने हेतु क्लिक करें।",
  sponsorBtn: "सहयोग करें",
  detailsBtn: "विस्तार देखें",

  // Officials
  officialsTag: "सत्यनिष्ठ संचालन",
  officialsTitle: "अधिकृत न्यासी एवं संचालक मंडल",
  officialsSub: "संस्थापक सदस्यों के सतत मार्गदर्शन व स्थानीय समाज की सहभागिता में संचालित न्यास।",

  // Payment
  donateTag: "पवित्र सहयोग समर्पण",
  donateTitle: "ऑनलाइन सेवा समर्पण एवं सहयोग",
  donateDesc: "आपका छोटा सा सहयोग गौसेवा, शनिवार महाभंडारा, नित्य चाय सेवा एवं आश्रम निर्माण में बड़ा बदलाव ला सकता है।",
  taxNoticeTitle: "वित्तीय शुचिता एवं कर स्थिति सूचना",
  taxNoticeText: "पंजीकरण 12AB एवं 80G आयकर विभाग में प्रक्रियाधीन है। ट्रस्ट पूर्ण वित्तीय शुचिता और नैतिक नियमों का पालन करता है।",
  paymentSectionTag: "पवित्र सहयोग समर्पण",
  paymentTitle: "ऑनलाइन सेवा समर्पण एवं सहयोग",
  paymentSubtitle: "आपका छोटा सा सहयोग किसी जरूरतमंद के जीवन में बड़ा बदलाव ला सकता है।",
  paymentCardTitle: "प्रभु रामजी ट्रस्ट",
  paymentMotto: "सेवा ही संकल्प • सहयोग ही शक्ति",
  chooseDonationAmount: "दान राशि चुनें",
  enterCustomAmount: "अपनी इच्छानुसार राशि भरें",
  customAmountPlaceholder: "जैसे ₹2100",
  payViaPhonePeBtn: "PhonePe से दान करें",
  securePaymentNote: "सुरक्षित भुगतान • भुगतान की पुष्टि के बाद आधिकारिक रसीद",
  directAppsTitle: "सीधे मोबाइल UPI ऐप से भुगतान करें:",
  scanPhonePeQrTitle: "PhonePe QR कोड स्कैन करें",
  copyUpiBtn: "UPI ID कॉपी करें",
  downloadQrBtn: "QR डाउनलोड करें",
  viewLargeQrBtn: "बड़ा QR देखें",
  bankDetailsTitle: "सीधे बैंक खाते में सहयोग (NEFT / IMPS / RTGS)",
  claimReceiptTitle: "भुगतान के बाद आधिकारिक डिजिटल रसीद प्राप्त करें",
  claimReceiptSub: "UPI / PhonePe या बैंक ट्रांसफर करने के बाद अपनी जानकारी और UTR नंबर भरें ताकि तुरंत मुहरयुक्त डिजिटल रसीद प्राप्त हो सके।",
  donorNameLabel: "दानदाता का पूरा नाम *",
  donorMobileLabel: "मोबाइल नंबर (10 अंक) *",
  donorEmailLabel: "ईमेल पता (रसीद हेतु, वैकल्पिक)",
  utrLabel: "UPI UTR / लेन-देन संदर्भ संख्या *",
  utrPlaceholder: "उदा. 4312XXXXXXXX (12 अंक)",
  hasPaidConfirmLabel: "मैं पुष्टि करता/करती हूँ कि मैंने प्रभु रामजी ट्रस्ट के उपरोक्त अधिकृत खाते / UPI ID (dineshbirla312@ybl) में यह सहयोग राशि सफलतापूर्वक जमा कर दी है।",
  submitDonationBtn: "सत्यापित करें एवं डिजिटल रसीद प्राप्त करें",

  // Transparency
  transparencyTag: "वित्तीय शुचिता एवं जवाबदेही",
  transparencyTitle: "सार्वजनिक वित्तीय पारदर्शिता एवं बहीखाता",
  transparencySub: "प्रभु रामजी ट्रस्ट में दानदाताओं द्वारा दी गई एक-एक पाई का हिसाब पूरी शुचिता और ईमानदारी के साथ दर्ज किया जाता है।",

  // Gallery
  galleryTag: "प्रत्यक्ष सेवा दर्शन",
  galleryTitle: "सेवा, भंडारा एवं गौसेवा छायाचित्र",
  gallerySub: "ग्राम गलगाँव में चल रहे सेवा कार्यों, शनिवार भंडारे, गौशाला व आश्रम निर्माण की वास्तविक झलकियाँ।",
  galleryPhotosTab: "सेवा छायाचित्र",
  galleryVideosTab: "सेवा वीडियो",

  // News
  newsTag: "ताजा सूचनाएँ व बुलेटिन",
  newsTitle: "समाचार एवं आगामी कार्यक्रम",
  newsSub: "शनिवार महाभंडारा, गौसेवा व आश्रम निर्माण के संबंध में ट्रस्ट कार्यालय द्वारा जारी आधिकारिक सूचनाएं।",

  // Contact
  contactTag: "हमसे संपर्क करें",
  contactTitle: "कार्यालय पता, मार्ग दर्शन एवं संपर्क सूत्र",
  contactSub: "गौसेवा, शनिवार भंडारा, नर्मदा परिक्रमा सेवा अथवा आश्रम दर्शन हेतु कभी भी पधारें।",
  contactCallBtn: "कॉल करें",
  contactChatBtn: "WhatsApp चैट",
  contactAddMeBtn: "WhatsApp पर सहायता व जानकारी पाएँ",
  contactChannelBtn: "आधिकारिक WhatsApp चैनल से जुड़ें",

  // Ashram Section
  ashramTag: "विशेष सहयोग प्रकल्प • ग्राम गलगाँव (म.प्र.)",
  ashramTitle: "प्रभु रामजी आश्रम एवं मंदिर निर्माण महायज्ञ",
  ashramStatusPrefix: "वर्तमान स्थिति:",
  ashramTargetPrefix: "लक्ष्य पूर्णता:",
  ashramReportBtn: "प्रगति व बजट रिपोर्ट",
  ashramSponsorBtn: "सहयोग समर्पित करें",
  ashramPhotoBadge: "प्रत्यक्ष निर्माण छायाचित्र",

  // Footer
  footerQuickLinks: "त्वरित लिंक",
  footerServices: "प्रमुख सेवा प्रकल्प",
  footerContact: "ट्रस्ट कार्यालय एवं संपर्क",
  footerRights: "सर्वाधिकार सुरक्षित"
};

// Default export is always the clean Hindi dictionary
export const TRANSLATIONS: Record<string, typeof HINDI_TEXT> = new Proxy(
  { hi: HINDI_TEXT },
  {
    get: () => HINDI_TEXT
  }
);
