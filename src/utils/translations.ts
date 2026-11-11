export type Language = 
  | 'hi' 
  | 'en' 
  | 'mr' 
  | 'gu' 
  | 'sa' 
  | 'bn' 
  | 'pa' 
  | 'ta' 
  | 'te' 
  | 'kn' 
  | 'ml' 
  | 'or' 
  | 'ne' 
  | 'ur' 
  | 'fr' 
  | 'de' 
  | 'es';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🕉️' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', dir: 'rtl' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export interface TranslationSchema {
  trustName: string;
  officialBadge: string;
  tagline: string;
  pinCode: string;
  motto: string;
  dailyTeaNotice: string;
  searchReceiptBtn: string;
  donateBtn: string;
  adminLogin: string;
  languageSelectBtn: string;
  switchLangBtn: string;
  
  // Navigation
  navHome: string;
  navAshram: string;
  navAbout: string;
  navObjectives: string;
  navServices: string;
  navOfficials: string;
  navGallery: string;
  navTransparency: string;
  navNews: string;
  navContact: string;
  navVolunteer: string;
  navCertificate: string;
  navComplaint: string;
  navConstructionProgress: string;

  // Header and Mobile Drawer
  downloadAppTitle: string;
  downloadAppSub: string;
  connectSocialTitle: string;
  whatsappChannelName: string;
  
  // Hero
  heroSalutation: string;
  heroSubtitle: string;
  heroDesc: string;
  heroBtnAshram: string;
  heroBtnDonate: string;
  heroBtnWhatsApp: string;
  heroRoutineTea: string;
  heroRoutineBhandara: string;
  heroRoutineAshram: string;
  heroRoutineGau: string;
  heroSearchReceiptNote: string;
  heroActiveWorkBadge: string;
  heroSupportNow: string;
  heroPrevWork: string;
  heroNextWork: string;
  kodandaTitle: string;
  kodandaDesc: string;

  // Home Featured Folder
  homeFolderBadge: string;
  homeFolderAvailable: string;
  homeFolderTitle: string;
  homeFolderDesc: string;
  homeFolderOpenBtn: string;
  homeFolderExpandBtn: string;
  homeFolderCollapseBtn: string;

  // Ashram Nirman Section
  ashramTag: string;
  ashramTitle: string;
  ashramStatusPrefix: string;
  ashramTargetPrefix: string;
  ashramPackagesTitle: string;
  ashramPackagesDesc: string;
  ashramSponsorBtn: string;
  ashramReportBtn: string;
  ashramPhotoBadge: string;

  // Key Services
  servicesTag: string;
  servicesTitle: string;
  servicesDesc: string;
  bhandaraTag: string;
  bhandaraTitle: string;
  bhandaraDesc: string;
  bhandaraPhotoBadge: string;
  chaiTag: string;
  chaiTitle: string;
  chaiDesc: string;
  chaiPhotoBadge: string;
  gauTag: string;
  gauTitle: string;
  gauDesc: string;
  gauPhotoBadge: string;
  sponsorBhandaraBtn: string;
  sponsorChaiBtn: string;
  sponsorGauBtn: string;
  allProjectsTitle: string;
  viewDetailsBtn: string;

  // About Section
  aboutTag: string;
  aboutTitle: string;
  aboutMissionTitle: string;
  aboutVisionTitle: string;
  aboutPledgeTitle: string;

  // Objectives
  objectivesTag: string;
  objectivesTitle: string;
  objectivesSub: string;
  filterAll: string;
  filterActive: string;
  filterProposed: string;

  // Officials
  officialsTag: string;
  officialsTitle: string;
  officialsSub: string;

  // Payment / Donation Section (IMG_20261110_023724 design)
  donateTag: string;
  donateTitle: string;
  donateDesc: string;
  paymentCardTitle: string;
  paymentMotto: string;
  paymentSubtitle: string;
  chooseDonationAmount: string;
  enterCustomAmount: string;
  customAmountPlaceholder: string;
  selectedAmountLabel: string;
  payViaPhonePeBtn: string;
  securePaymentNote: string;
  scanPhonePeQrTitle: string;
  scanPhonePeSub: string;
  copyUpiBtn: string;
  upiCopiedMsg: string;
  downloadQrBtn: string;
  viewLargeQrBtn: string;
  directAppsTitle: string;
  bankDetailsTitle: string;
  claimReceiptTitle: string;
  claimReceiptSub: string;
  taxNoticeTitle: string;
  taxNoticeText: string;

  // Receipt Form Fields
  donorNameLabel: string;
  donorMobileLabel: string;
  donorEmailLabel: string;
  donorPanLabel: string;
  paymentModeLabel: string;
  utrLabel: string;
  utrPlaceholder: string;
  hasPaidConfirmLabel: string;
  submitDonationBtn: string;

  // Transparency, Gallery, News, Contact
  transparencyTag: string;
  transparencyTitle: string;
  galleryTag: string;
  galleryTitle: string;
  galleryPhotosTab: string;
  galleryVideosTab: string;
  newsTag: string;
  newsTitle: string;
  contactTag: string;
  contactTitle: string;
  contactFullAddressLabel: string;
  contactHelplineLabel: string;
  contactEmailLabel: string;
  contactVisitingLabel: string;
  contactCallBtn: string;
  contactChatBtn: string;
  contactAddMeBtn: string;
  contactChannelBtn: string;

  // Footer
  footerQuickLinks: string;
  footerServices: string;
  footerContact: string;
  footerSelectLang: string;
  footerRights: string;
  scrollTop: string;
  floatingWhatsApp: string;
}

const BASE_HI: TranslationSchema = {
  trustName: "प्रभु रामजी ट्रस्ट",
  officialBadge: "आधिकारिक",
  tagline: "ग्राम गलगाँव, सनावद (खरगोन, म.प्र.)",
  pinCode: "पिन कोड: 451111",
  motto: "सेवा ही धर्म है, परोपकार ही सच्ची पूजा है",
  dailyTeaNotice: "प्रतिदिन चाय सेवा · हर शनिवार शाम महाभंडारा",
  searchReceiptBtn: "रसीद खोजें",
  donateBtn: "दान / सहयोग करें",
  adminLogin: "एडमिन लॉगिन",
  languageSelectBtn: "17 भाषाएं",
  switchLangBtn: "English",

  // Navigation
  navHome: "होम",
  navAshram: "आश्रम निर्माण",
  navAbout: "परिचय",
  navObjectives: "उद्देश्य",
  navServices: "सेवा कार्य",
  navOfficials: "पदाधिकारी",
  navGallery: "गैलरी",
  navTransparency: "पारदर्शिता",
  navNews: "समाचार",
  navContact: "संपर्क",
  navVolunteer: "स्वयंसेवक बनें",
  navCertificate: "सेवा प्रमाणपत्र",
  navComplaint: "सुझाव व सहायता",
  navConstructionProgress: "निर्माण प्रगति रिपोर्ट",

  // Header & Drawer
  downloadAppTitle: "मोबाइल ऐप डाउनलोड करें",
  downloadAppSub: "HD लोगो व ऑफलाइन सपोर्ट के साथ",
  connectSocialTitle: "आधिकारिक सोशल चैनल से जुड़ें:",
  whatsappChannelName: "WhatsApp चैनल",

  // Hero
  heroSalutation: "जय श्री राम | सेवा, संस्कार और परोपकार",
  heroSubtitle: "ग्राम गलगाँव, तहसील सनावद, जिला खरगोन (मध्य प्रदेश)",
  heroDesc: "माँ नर्मदा के पावन अंचल में निराश्रित गोवंश की रक्षा, परिक्रमा पथिकों के लिए भोजन-विश्राम, प्रत्येक शनिवार भव्य भंडारा एवं ग्रामीण समाज के निर्बल वर्गों की सहायता हेतु समर्पित पंजीकृत संस्था।",
  heroBtnAshram: "आश्रम निर्माण में सहयोग करें",
  heroBtnDonate: "दान / PhonePe QR",
  heroBtnWhatsApp: "WhatsApp चैनल",
  heroRoutineTea: "प्रतिदिन चाय सेवा: नित्य प्रातः से परिक्रमा संतों व भक्तों हेतु",
  heroRoutineBhandara: "हर शनिवार शाम भंडारा: भव्य सार्वजनिक महाप्रसाद पंगत",
  heroRoutineAshram: "आश्रम निर्माण: परिक्रमा विश्राम भवन कार्य प्रगति पर",
  heroRoutineGau: "नित्य गौसेवा: निराश्रित गोवंश हेतु चारा व चिकित्सा",
  heroSearchReceiptNote: "अपनी दान रसीद खोजें व डाउनलोड करें",
  heroActiveWorkBadge: "आश्रम में सक्रिय कार्य",
  heroSupportNow: "सहयोग करें",
  heroPrevWork: "पिछला कार्य",
  heroNextWork: "अगला कार्य",
  kodandaTitle: "॥ कोदण्डधारी प्रभु श्री राम ॥",
  kodandaDesc: "ग्राम गलगाँव (सनावद, खरगोन) · माँ नर्मदा के पावन प्रवाह व प्रभु रामजी के आदर्शों पर निष्काम जनसेवा",

  // Home Featured Folder
  homeFolderBadge: "निर्माण सहयोग फोल्डर",
  homeFolderAvailable: "6 घटक उपलब्ध",
  homeFolderTitle: "आश्रम निर्माण सहयोग घटक फोल्डर",
  homeFolderDesc: "ईंट, सीमेंट, सरिया, पिलर व विश्राम कक्ष प्रायोजन सूची को इस अलग फोल्डर में सहेजा गया है।",
  homeFolderOpenBtn: "सहयोग फोल्डर खोलें (पॉपअप)",
  homeFolderExpandBtn: "यहाँ विस्तार देखें",
  homeFolderCollapseBtn: "विवरण संकुचित करें",

  // Ashram Nirman Section
  ashramTag: "विशेष सहयोग प्रकल्प · ग्राम गलगाँव (म.प्र.)",
  ashramTitle: "प्रभु रामजी आश्रम एवं मंदिर निर्माण महायज्ञ",
  ashramStatusPrefix: "वर्तमान स्थिति:",
  ashramTargetPrefix: "लक्ष्य पूर्णता:",
  ashramPackagesTitle: "आश्रम निर्माण में अपनी ईंट, सीमेंट या स्तंभ जोड़ें",
  ashramPackagesDesc: "अपनी श्रद्धानुसार नीचे दिए गए किसी भी घटक का प्रायोजन करें। दान के तुरंत बाद आधिकारिक रसीद प्रदान की जाएगी।",
  ashramSponsorBtn: "यह सहयोग समर्पित करें",
  ashramReportBtn: "प्रगति व बजट रिपोर्ट",
  ashramPhotoBadge: "प्रत्यक्ष निर्माण छायाचित्र",

  // Key Services
  servicesTag: "ट्रस्ट में क्या-क्या सेवा चलती है",
  servicesTitle: "हमारे प्रमुख नित्य व साप्ताहिक सेवा प्रकल्प",
  servicesDesc: "ग्राम गलगाँव (सनावद) में गोमाता, नर्मदा परिक्रमा साधु-संत एवं श्रद्धालुओं हेतु संचालित पवित्र गतिविधियाँ।",
  bhandaraTag: "साप्ताहिक महायज्ञ · हर शनिवार शाम",
  bhandaraTitle: "हर शनिवार शाम को महाभंडारा व प्रसादी",
  bhandaraDesc: "ग्राम गलगाँव में माँ नर्मदा परिक्रमावासियों, स्थानीय संतों एवं सैकड़ों ग्रामीण श्रद्धालुओं के लिए प्रति शनिवार शाम शुद्ध, पौष्टिक महाप्रसाद पंगत का भव्य आयोजन।",
  bhandaraPhotoBadge: "प्रत्यक्ष भंडारा पंगत छायाचित्र",
  chaiTag: "नित्य प्रातः 6:00 बजे से निरंतर",
  chaiTitle: "प्रतिदिन नित्य निःशुल्क चाय व शीतल जल सेवा",
  chaiDesc: "हनुमान मंदिर व आश्रम परिसर में प्रतिदिन प्रातः से सभी परिक्रमा साधु-संतों, पदयात्रियों एवं आगंतुकों के लिए ताज़ी गर्म चाय, काढ़ा व स्वच्छ शीतल जल सेवा।",
  chaiPhotoBadge: "प्रतिदिन चाय सेवा दर्शन",
  gauTag: "दैनिक निरंतर सेवा · बेसहारा गोमाता रक्षा",
  gauTitle: "निराश्रित गोवंश सेवा एवं गौशाला संचालन",
  gauDesc: "सड़क पर निराश्रित, वृद्ध अथवा अशक्त गोमाता के लिए प्रतिदिन ताजा हरा चारा, सूखा चारा, दलिया, गुड़ व नियमित प्राथमिक पशु चिकित्सा की व्यवस्था।",
  gauPhotoBadge: "प्रत्यक्ष गौसेवा छायाचित्र",
  sponsorBhandaraBtn: "शनिवार भंडारे का प्रायोजन करें",
  sponsorChaiBtn: "चाय सेवा हेतु सामग्री सहयोग",
  sponsorGauBtn: "गौसेवा हेतु चारा दान करें",
  allProjectsTitle: "ट्रस्ट के सभी 10 सेवा प्रकल्प",
  viewDetailsBtn: "विस्तार से देखें",

  // About Section
  aboutTag: "हमारा परिचय एवं इतिहास",
  aboutTitle: "प्रभु रामजी ट्रस्ट की स्थापना एवं पावन संकल्प",
  aboutMissionTitle: "हमारा मिशन",
  aboutVisionTitle: "हमारा विज़न",
  aboutPledgeTitle: "धार्मिक एवं सामाजिक सेवा का संकल्प",

  // Objectives
  objectivesTag: "सेवा एवं जनकल्याण के 10 मुख्य संकल्प",
  objectivesTitle: "ट्रस्ट के 10 मुख्य पावन उद्देश्य",
  objectivesSub: "प्रभु रामजी ट्रस्ट के स्वीकृत उद्देश्यों को पूर्ण शुचिता एवं सत्यनिष्ठा के साथ प्रस्तुत किया गया है।",
  filterAll: "सभी 10 उद्देश्य",
  filterActive: "सक्रिय सेवा कार्य (8)",
  filterProposed: "प्रस्तावित प्रकल्प (2)",

  // Officials
  officialsTag: "कार्यकारिणी एवं न्यासी मंडल",
  officialsTitle: "ट्रस्ट के अधिकृत पदाधिकारी",
  officialsSub: "जिनके समर्पण, शुचिता और पारदर्शी मार्गदर्शन से प्रभु रामजी ट्रस्ट के सेवा कार्य संचालित हो रहे हैं।",

  // Payment / Donation Section (IMG_20261110_023724 design)
  donateTag: "पुण्य सहयोग महायज्ञ",
  donateTitle: "दान एवं सहयोग व्यवस्था",
  donateDesc: "आश्रम निर्माण, हर शनिवार शाम भंडारा, प्रतिदिन चाय सेवा एवं गौसेवा में अपना पावन अंशदान समर्पित करें।",
  paymentCardTitle: "प्रभु रामजी ट्रस्ट",
  paymentMotto: "सेवा ही संकल्प • सहयोग ही शक्ति",
  paymentSubtitle: "आपका छोटा सा सहयोग किसी जरूरतमंद के जीवन में बड़ा बदलाव ला सकता है।",
  chooseDonationAmount: "दान राशि चुनें",
  enterCustomAmount: "अपनी इच्छानुसार राशि भरें",
  customAmountPlaceholder: "जैसे ₹2100",
  selectedAmountLabel: "वर्तमान चयनित राशि:",
  payViaPhonePeBtn: "PhonePe से दान करें (Gateway / UPI)",
  securePaymentNote: "सुरक्षित भुगतान • भुगतान की पुष्टि के बाद रसीद",
  scanPhonePeQrTitle: "अधिकृत PhonePe QR कोड",
  scanPhonePeSub: "PhonePe, Google Pay, Paytm या किसी भी UPI ऐप से स्कैन करें",
  copyUpiBtn: "UPI ID कॉपी करें",
  upiCopiedMsg: "UPI ID क्लिपबोर्ड पर कॉपी हो गई!",
  downloadQrBtn: "QR डाउनलोड करें",
  viewLargeQrBtn: "बड़ा देखें",
  directAppsTitle: "सीधे UPI ऐप से भुगतान करें:",
  bankDetailsTitle: "सीधे बैंक ट्रांसफर (NEFT / IMPS)",
  claimReceiptTitle: "दान दर्ज करें एवं डिजिटल पावती प्राप्त करें",
  claimReceiptSub: "दान के पश्चात आधिकारिक रसीद प्रिंट अथवा PDF में तुरंत सहेजें",
  taxNoticeTitle: "पारदर्शिता एवं कर-छूट स्थिति:",
  taxNoticeText: "पंजीकरण 12AB एवं 80G आयकर विभाग में प्रक्रियाधीन है। दान करने के उपरांत ट्रस्ट की मुहर युक्त आधिकारिक डिजिटल रसीद तुरंत प्रदान की जाएगी।",

  // Receipt Form Fields
  donorNameLabel: "दानदाता का पूरा नाम *",
  donorMobileLabel: "मोबाइल नंबर * (10 अंक)",
  donorEmailLabel: "ईमेल पता (वैकल्पिक)",
  donorPanLabel: "पैन नंबर (वैकल्पिक)",
  paymentModeLabel: "भुगतान का माध्यम",
  utrLabel: "12 अंकों का UPI UTR / Transaction No *",
  utrPlaceholder: "PhonePe या GPay से 12 अंकों का UTR",
  hasPaidConfirmLabel: "मैंने प्रभु रामजी ट्रस्ट (dineshbirla312@ybl) को भुगतान सफलता पूर्वक कर दिया है।",
  submitDonationBtn: "सत्यापित करें व डिजिटल रसीद प्राप्त करें",

  // Transparency, Gallery, News, Contact
  transparencyTag: "सत्य एवं शुचिता",
  transparencyTitle: "वित्तीय पारदर्शिता एवं आय-व्यय विवरण",
  galleryTag: "प्रत्यक्ष दर्शन",
  galleryTitle: "फोटो एवं वीडियो गैलरी",
  galleryPhotosTab: "छायाचित्र (फोटो)",
  galleryVideosTab: "चलचित्र (वीडियो)",
  newsTag: "ताजा अपडेट्स व सूचनाएँ",
  newsTitle: "समाचार एवं आगामी कार्यक्रम",
  contactTag: "हमसे संपर्क करें",
  contactTitle: "पता, दिशा-निर्देश एवं संवाद सूत्र",
  contactFullAddressLabel: "पूरा आधिकारिक पता",
  contactHelplineLabel: "अधिकृत संपर्क नंबर",
  contactEmailLabel: "ईमेल संपर्क",
  contactVisitingLabel: "दर्शन एवं सेवा समय",
  contactCallBtn: "कॉल करें",
  contactChatBtn: "WhatsApp चैट",
  contactAddMeBtn: "WhatsApp पर संपर्क जोड़ें",
  contactChannelBtn: "प्रभु रामजी ट्रस्ट WhatsApp चैनल से जुड़ें →",

  // Footer
  footerQuickLinks: "त्वरित लिंक",
  footerServices: "सेवाएँ एवं सहयोग",
  footerContact: "ट्रस्ट संपर्क व कार्यालय",
  footerSelectLang: "17 भाषाएं चुनें",
  footerRights: "सर्वाधिकार सुरक्षित",
  scrollTop: "ऊपर जाएं",
  floatingWhatsApp: "WhatsApp चैट"
};

const BASE_EN: TranslationSchema = {
  trustName: "Prabhu Ramji Trust",
  officialBadge: "Official",
  tagline: "Village Galgaon, Sanawad (Khargone, M.P.)",
  pinCode: "PIN: 451111",
  motto: "Service is Religion, Benevolence is True Worship",
  dailyTeaNotice: "Daily Tea Seva · Every Saturday Evening Bhandara",
  searchReceiptBtn: "Search Receipt",
  donateBtn: "Donate / Support",
  adminLogin: "Admin Login",
  languageSelectBtn: "17 Languages",
  switchLangBtn: "हिन्दी",

  // Navigation
  navHome: "Home",
  navAshram: "Ashram Work",
  navAbout: "About Us",
  navObjectives: "Objectives",
  navServices: "Seva Projects",
  navOfficials: "Officials",
  navGallery: "Gallery",
  navTransparency: "Transparency",
  navNews: "News & Events",
  navContact: "Contact",
  navVolunteer: "Volunteer",
  navCertificate: "Certificate",
  navComplaint: "Help Desk",
  navConstructionProgress: "Construction Progress",

  // Header & Drawer
  downloadAppTitle: "Download Mobile App",
  downloadAppSub: "With HD Logo & Offline Support",
  connectSocialTitle: "Connect on Official Social Channels:",
  whatsappChannelName: "WhatsApp Channel",

  // Hero
  heroSalutation: "Jai Shri Ram | Service, Values & Benevolence",
  heroSubtitle: "Gram Galgaon, Tehsil Sanawad, Dist. Khargone (Madhya Pradesh)",
  heroDesc: "A dedicated registered non-profit trust in the sacred Maa Narmada valley for cow protection, resting and prasad service for Narmada pilgrims, Saturday grand community feast, and rural upliftment.",
  heroBtnAshram: "Support Ashram Nirman",
  heroBtnDonate: "Donate / PhonePe QR",
  heroBtnWhatsApp: "WhatsApp Channel",
  heroRoutineTea: "Daily Tea Seva: Free hot tea from 6 AM for pilgrims & sadhus",
  heroRoutineBhandara: "Every Saturday Evening: Grand Community Feast (Bhandara)",
  heroRoutineAshram: "Ashram Nirman: Pilgrim Rest Complex construction in progress",
  heroRoutineGau: "Daily Cow Welfare: Nutrition, green fodder & medical care",
  heroSearchReceiptNote: "Search & download your official donation receipt",
  heroActiveWorkBadge: "Active Works at Ashram",
  heroSupportNow: "Support Now",
  heroPrevWork: "Previous Work",
  heroNextWork: "Next Work",
  kodandaTitle: "॥ Prabhu Shri Ram with Kodanda Bow ॥",
  kodandaDesc: "Gram Galgaon (Sanawad, Khargone) · Selfless service inspired by Lord Rama on the banks of holy Narmada",

  // Home Featured Folder
  homeFolderBadge: "Construction Folder",
  homeFolderAvailable: "6 Components Available",
  homeFolderTitle: "Ashram Construction Contribution Components Folder",
  homeFolderDesc: "Browse cement bags, bricks, TMT steel, pillars, and pilgrim halls in this dedicated folder.",
  homeFolderOpenBtn: "Open Folder (Popup)",
  homeFolderExpandBtn: "View Details Here",
  homeFolderCollapseBtn: "Collapse Details",

  // Ashram Nirman Section
  ashramTag: "Special Construction Initiative · Gram Galgaon (M.P.)",
  ashramTitle: "Prabhu Ramji Ashram & Mandir Construction Yajna",
  ashramStatusPrefix: "Current Status:",
  ashramTargetPrefix: "Target Completion:",
  ashramPackagesTitle: "Contribute Cement, Bricks, Steel or Pillars",
  ashramPackagesDesc: "Sponsor any construction component as per your devotion. An official stamped digital receipt will be issued immediately.",
  ashramSponsorBtn: "Dedicate This Contribution",
  ashramReportBtn: "Progress & Budget Report",
  ashramPhotoBadge: "Direct Construction Photograph",

  // Key Services
  servicesTag: "Daily & Weekly Routine at the Trust",
  servicesTitle: "Our Core Spiritual & Social Seva Projects",
  servicesDesc: "Active ongoing humanitarian and devotional services at Gram Galgaon (Sanawad) for cows, pilgrims, and rural families.",
  bhandaraTag: "Weekly Sacred Feast · Every Saturday Evening",
  bhandaraTitle: "Every Saturday Evening Grand Bhandara",
  bhandaraDesc: "A grand public community prasad feast organized every Saturday evening for Narmada parikrama pilgrims, sadhus, and hundreds of village devotees.",
  bhandaraPhotoBadge: "Real Bhandara Feast Photograph",
  chaiTag: "Daily from 6:00 AM Onwards",
  chaiTitle: "Daily Free Tea & Pure Drinking Water Service",
  chaiDesc: "Serving hot tea, herbal brew, and clean drinking water every day from early morning to barefoot pilgrims and visitors at the temple.",
  chaiPhotoBadge: "Daily Tea Seva Glimpse",
  gauTag: "Continuous Daily Service · Cow Protection",
  gauTitle: "Destitute Cow Protection & Gaushala Management",
  gauDesc: "Providing fresh green fodder, dry grass, nutritional grain mix, and primary veterinary medical care for abandoned and injured cows.",
  gauPhotoBadge: "Real Gaushala Photograph",
  sponsorBhandaraBtn: "Sponsor Saturday Bhandara",
  sponsorChaiBtn: "Sponsor Tea Ingredients",
  sponsorGauBtn: "Donate Cow Fodder",
  allProjectsTitle: "All 10 Seva Projects of the Trust",
  viewDetailsBtn: "View Project Details",

  // About Section
  aboutTag: "Our History & Mission",
  aboutTitle: "Establishment & Sacred Oath of Prabhu Ramji Trust",
  aboutMissionTitle: "Our Mission",
  aboutVisionTitle: "Our Vision",
  aboutPledgeTitle: "Pledge of Devotional & Humanitarian Service",

  // Objectives
  objectivesTag: "Sacred Vision & Pillars",
  objectivesTitle: "The 10 Core Objectives of Prabhu Ramji Trust",
  objectivesSub: "The authorized charitable and religious objectives of Prabhu Ramji Trust, presented with absolute integrity.",
  filterAll: "All 10 Objectives",
  filterActive: "Active Services (8)",
  filterProposed: "Proposed Projects (2)",

  // Officials
  officialsTag: "Governing Board of Trustees",
  officialsTitle: "Authorized Trustees & Executive Board",
  officialsSub: "Distinguished trustees whose selfless dedication, integrity, and sacred vision guide Prabhu Ramji Trust.",

  // Payment / Donation Section (IMG_20261110_023724 design)
  donateTag: "Sacred Contribution",
  donateTitle: "Online Donation & Direct Banking",
  donateDesc: "Support Ashram Nirman, Saturday Bhandara, Daily Tea Seva, and Cow Welfare with your generous voluntary contributions.",
  paymentCardTitle: "Prabhu Ramji Trust",
  paymentMotto: "Service is Resolution • Support is Strength",
  paymentSubtitle: "Your small contribution can bring a huge positive difference in someone's life.",
  chooseDonationAmount: "Choose Donation Amount",
  enterCustomAmount: "Enter Custom Amount",
  customAmountPlaceholder: "e.g. ₹2100",
  selectedAmountLabel: "Currently Selected Amount:",
  payViaPhonePeBtn: "Donate via PhonePe (Gateway / UPI)",
  securePaymentNote: "Secure Payment • Instant Receipt after Confirmation",
  scanPhonePeQrTitle: "Official PhonePe QR Code",
  scanPhonePeSub: "Scan using PhonePe, Google Pay, Paytm or any UPI App",
  copyUpiBtn: "Copy UPI ID",
  upiCopiedMsg: "UPI ID copied to clipboard!",
  downloadQrBtn: "Download QR",
  viewLargeQrBtn: "View Full Size",
  directAppsTitle: "Pay directly via mobile UPI apps:",
  bankDetailsTitle: "Direct Bank Transfer (NEFT / IMPS)",
  claimReceiptTitle: "Record Contribution & Generate Digital Receipt",
  claimReceiptSub: "Download or print your official stamped receipt instantly",
  taxNoticeTitle: "Transparency & Tax Exemption Status:",
  taxNoticeText: "Registration under Section 12AB and 80G is currently in processing with the Income Tax Department. Official stamped digital receipts are provided immediately.",

  // Receipt Form Fields
  donorNameLabel: "Donor Full Name *",
  donorMobileLabel: "Mobile Number * (10 Digits)",
  donorEmailLabel: "Email Address (Optional)",
  donorPanLabel: "PAN Number (Optional)",
  paymentModeLabel: "Payment Method",
  utrLabel: "12-Digit UPI UTR / Transaction No *",
  utrPlaceholder: "12-digit UTR from PhonePe or GPay",
  hasPaidConfirmLabel: "I confirm that I have completed payment to Prabhu Ramji Trust (dineshbirla312@ybl).",
  submitDonationBtn: "Verify & Get Digital Receipt",

  // Transparency, Gallery, News, Contact
  transparencyTag: "Integrity & Truth",
  transparencyTitle: "Financial Transparency & Monthly Statement",
  galleryTag: "Direct Glimpses",
  galleryTitle: "Photo & Video Gallery",
  galleryPhotosTab: "Photographs",
  galleryVideosTab: "Videos",
  newsTag: "Latest Updates & Bulletins",
  newsTitle: "News & Upcoming Events",
  contactTag: "Reach Us",
  contactTitle: "Address, Directions & Contact Information",
  contactFullAddressLabel: "Complete Official Address",
  contactHelplineLabel: "Authorized Helpline",
  contactEmailLabel: "Email Contact",
  contactVisitingLabel: "Visiting & Seva Hours",
  contactCallBtn: "Call Us",
  contactChatBtn: "WhatsApp Chat",
  contactAddMeBtn: "Add Contact on WhatsApp",
  contactChannelBtn: "Follow Prabhu Ramji Trust on WhatsApp →",

  // Footer
  footerQuickLinks: "Quick Links",
  footerServices: "Services & Support",
  footerContact: "Trust Office & Contact",
  footerSelectLang: "17 Languages",
  footerRights: "All Rights Reserved",
  scrollTop: "Back to top",
  floatingWhatsApp: "WhatsApp Chat"
};

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  hi: BASE_HI,
  en: BASE_EN,
  mr: { ...BASE_HI, ...BASE_EN, ...BASE_HI, languageSelectBtn: "17 भाषा", switchLangBtn: "English", trustName: "प्रभू रामजी ट्रस्ट", motto: "सेवा हाच धर्म आहे, परोपकार हीच खरी पूजा आहे", searchReceiptBtn: "पावती शोधा", donateBtn: "दान / सहकार्य करा", navHome: "मुख्यपृष्ठ", navAshram: "आश्रम निर्माण", navAbout: "परिचय", navObjectives: "उद्दिष्टे", navServices: "सेवा कार्य", navOfficials: "पदाधिकारी", navGallery: "गॅलरी", navTransparency: "पारदर्शकता", navNews: "बातम्या", navContact: "संपर्क", navVolunteer: "स्वयंसेवक व्हा" },
  gu: { ...BASE_HI, ...BASE_EN, ...BASE_HI, languageSelectBtn: "17 ભાષાઓ", switchLangBtn: "English", trustName: "પ્રભુ રામજી ટ્રસ્ટ", motto: "સેવા એ જ ધર્મ છે, પરોપકાર એ જ સાચી પૂજા છે", searchReceiptBtn: "રસીદ શોધો", donateBtn: "દાન / સહયોગ કરો", navHome: "હોમ", navAshram: "આશ્રમ નિર્માણ", navAbout: "પરિચય", navObjectives: "ઉદ્દેશ્યો", navServices: "સેવા કાર્ય", navOfficials: "હોદ્દેદારો", navGallery: "ગેલેરી", navTransparency: "પારદર્શિતા", navNews: "સમાચાર", navContact: "સંપર્ક", navVolunteer: "સ્વયંસેવક બનો" },
  sa: { ...BASE_HI, ...BASE_EN, ...BASE_HI, languageSelectBtn: "17 भाषाः", switchLangBtn: "English", trustName: "प्रभु रामजी न्यासः", motto: "सेवा परमो धर्मः, परोपकाराय पुण्याय", searchReceiptBtn: "प्राप्तिपत्रम् अन्विष्यतु", donateBtn: "दानं / सहयोगं कुर्वन्तु", navHome: "गृहम्", navAshram: "आश्रम निर्माणम्", navAbout: "परिचयः", navObjectives: "उद्देश्यानि", navServices: "सेवा कार्याणि", navOfficials: "पदाधिकारिणः", navGallery: "चित्रशाला", navTransparency: "पारदर्शिता", navNews: "वार्ताः", navContact: "सम्पर्कः", navVolunteer: "स्वयंसेवकः भवतु" },
  bn: { ...BASE_HI, ...BASE_EN, ...BASE_HI, languageSelectBtn: "১৭টি ভাষা", switchLangBtn: "English", trustName: "প্রভু রামজি ট্রাস্ট", motto: "সেবাই ধর্ম, পরোপকারই প্রকৃত উপাসনা", searchReceiptBtn: "রসিদ খুঁজুন", donateBtn: "দান / সহযোগিতা করুন", navHome: "হোম", navAshram: "আশ্রম নির্মাণ", navAbout: "পরিচিতি", navObjectives: "উদ্দেশ্য", navServices: "সেবা প্রকল্প", navOfficials: "কর্মকর্তা", navGallery: "গ্যালারি", navTransparency: "স্বচ্ছতা", navNews: "সংবাদ", navContact: "যোগাযোগ", navVolunteer: "স্বেচ্ছাসেবক হন" },
  pa: { ...BASE_HI, ...BASE_EN, ...BASE_HI, languageSelectBtn: "17 ਭਾਸ਼ਾਵਾਂ", switchLangBtn: "English", trustName: "ਪ੍ਰਭੂ ਰਾਮਜੀ ਟਰੱਸਟ", motto: "ਸੇਵਾ ਹੀ ਧਰਮ ਹੈ, ਪਰਉਪਕਾਰ ਹੀ ਸੱਚੀ ਪੂਜਾ ਹੈ", searchReceiptBtn: "ਰਸੀਦ ਖੋਜੋ", donateBtn: "ਦਾਨ / ਸਹਿਯੋਗ ਕਰੋ", navHome: "ਮੁੱਖ ਪੰਨਾ", navAshram: "ਆਸ਼ਰਮ ਨਿਰਮਾਣ", navAbout: "ਜਾਣ-ਪਛਾਣ", navObjectives: "ਉਦੇਸ਼", navServices: "ਸੇਵਾ ਕਾਰਜ", navOfficials: "ਅਹੁਦੇਦਾਰ", navGallery: "ਗੈਲਰੀ", navTransparency: "ਪਾਰਦਰਸ਼ਤਾ", navNews: "ਖ਼ਬਰਾਂ", navContact: "ਸੰਪਰਕ", navVolunteer: "ਸੇਵਾਦਾਰ ਬਣੋ" },
  ta: { ...BASE_EN, languageSelectBtn: "17 மொழிகள்", switchLangBtn: "English", trustName: "பிரபு ராம்ஜி அறக்கட்டளை", donateBtn: "நன்கொடை அளிக்கவும்", searchReceiptBtn: "ரசீதை தேடுங்கள்", navHome: "முகப்பு", navContact: "தொடர்பு" },
  te: { ...BASE_EN, languageSelectBtn: "17 భాషలు", switchLangBtn: "English", trustName: "ప్రభు రామ్‌జీ ట్రస్ట్", donateBtn: "విరాళం ఇవ్వండి", searchReceiptBtn: "రసీదు శోధించండి", navHome: "హోమ్", navContact: "సంప్రదించండి" },
  kn: { ...BASE_EN, languageSelectBtn: "17 ಭಾಷೆಗಳು", switchLangBtn: "English", trustName: "ಪ್ರಭು ರಾಮ್‌ಜೀ ಟ್ರಸ್ಟ್", donateBtn: "ದಾನ ಮಾಡಿ", searchReceiptBtn: "ರಶೀದಿ ಹುಡುಕಿ", navHome: "ಮುಖಪುಟ" },
  ml: { ...BASE_EN, languageSelectBtn: "17 ഭാഷകൾ", switchLangBtn: "English", trustName: "പ്രഭു രാംജി ട്രസ്റ്റ്", donateBtn: "സംഭാവന ചെയ്യുക", searchReceiptBtn: "രസീത് തിരയുക" },
  or: { ...BASE_HI, languageSelectBtn: "୧୭ଟି ଭାଷା", switchLangBtn: "English", trustName: "ପ୍ରଭୁ ରାମଜୀ ଟ୍ରଷ୍ଟ", donateBtn: "ଦାନ / ସହଯୋଗ କରନ୍ତୁ", searchReceiptBtn: "ରସିଦ ଖୋଜନ୍ତୁ" },
  ne: { ...BASE_HI, languageSelectBtn: "१७ भाषाहरू", switchLangBtn: "English", trustName: "प्रभु रामजी ट्रस्ट", donateBtn: "दान / सहयोग गर्नुहोस्", searchReceiptBtn: "रसिद खोज्नुहोस्", motto: "सेवा नै धर्म हो, परोपकार नै साँचो पूजा हो" },
  ur: { ...BASE_HI, languageSelectBtn: "17 زبانیں", switchLangBtn: "English", trustName: "پربھو رام جی ٹرسٹ", motto: "خدمت ہی مذہب ہے، پرؤپکار ہی سچی عبادت ہے", searchReceiptBtn: "رسید تلاش کریں", donateBtn: "عطیہ / تعاون کریں", navHome: "ہوم", navContact: "رابطہ", navVolunteer: "رضاکار بنیں" },
  fr: { ...BASE_EN, languageSelectBtn: "17 Langues", switchLangBtn: "English", trustName: "Prabhu Ramji Trust", donateBtn: "Faire un don", searchReceiptBtn: "Rechercher un reçu", motto: "Le service est religion, la bienveillance est le vrai culte" },
  de: { ...BASE_EN, languageSelectBtn: "17 Sprachen", switchLangBtn: "English", trustName: "Prabhu Ramji Trust", donateBtn: "Spenden / Helfen", searchReceiptBtn: "Quittung suchen", motto: "Dienst ist Religion, Wohlwollen ist wahre Andacht" },
  es: { ...BASE_EN, languageSelectBtn: "17 Idiomas", switchLangBtn: "English", trustName: "Prabhu Ramji Trust", donateBtn: "Donar / Apoyar", searchReceiptBtn: "Buscar recibo", motto: "El servicio es religión, la benevolencia es la verdadera devoción" }
};

export function getTranslation(lang: Language = 'hi'): TranslationSchema {
  return TRANSLATIONS[lang] || TRANSLATIONS['hi'];
}
