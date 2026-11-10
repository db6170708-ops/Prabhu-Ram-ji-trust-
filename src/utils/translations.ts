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
  ashramTag: string;
  ashramTitle: string;
  ashramStatusPrefix: string;
  ashramTargetPrefix: string;
  ashramPackagesTitle: string;
  ashramPackagesDesc: string;
  ashramSponsorBtn: string;
  servicesTag: string;
  servicesTitle: string;
  servicesDesc: string;
  bhandaraTitle: string;
  chaiTitle: string;
  gauTitle: string;
  sponsorBhandaraBtn: string;
  sponsorChaiBtn: string;
  sponsorGauBtn: string;
  aboutTag: string;
  aboutTitle: string;
  objectivesTag: string;
  objectivesTitle: string;
  officialsTag: string;
  officialsTitle: string;
  donateTag: string;
  donateTitle: string;
  donateDesc: string;
  taxNoticeTitle: string;
  taxNoticeText: string;
  phonePeQrTitle: string;
  scanNote: string;
  openPhonePeBtn: string;
  bankTransferTitle: string;
  accNoLabel: string;
  ifscLabel: string;
  holderLabel: string;
  bankBranchLabel: string;
  formTitle: string;
  formSub: string;
  selectCauseLabel: string;
  selectAmountLabel: string;
  donorNameLabel: string;
  donorMobileLabel: string;
  donorEmailLabel: string;
  donorPanLabel: string;
  paymentModeLabel: string;
  submitDonationBtn: string;
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
  navComplaint: "सुझाव व शिकायत",
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
  ashramTag: "विशेष सहयोग प्रकल्प · ग्राम गलगाँव (म.प्र.)",
  ashramTitle: "प्रभु रामजी आश्रम एवं मंदिर निर्माण महायज्ञ",
  ashramStatusPrefix: "वर्तमान स्थिति:",
  ashramTargetPrefix: "लक्ष्य पूर्णता:",
  ashramPackagesTitle: "आश्रम निर्माण में अपनी ईंट, सीमेंट या स्तंभ जोड़ें",
  ashramPackagesDesc: "अपनी श्रद्धानुसार नीचे दिए गए किसी भी घटक का प्रायोजन करें। दान के तुरंत बाद आधिकारिक रसीद प्रदान की जाएगी।",
  ashramSponsorBtn: "यह सहयोग समर्पित करें",
  servicesTag: "ट्रस्ट में क्या-क्या सेवा चलती है",
  servicesTitle: "हमारे प्रमुख नित्य व साप्ताहिक सेवा प्रकल्प",
  servicesDesc: "ग्राम गलगाँव (सनावद) में गोमाता, नर्मदा परिक्रमा साधु-संत एवं श्रद्धालुओं हेतु संचालित पवित्र गतिविधियाँ।",
  bhandaraTitle: "हर शनिवार शाम को महाभंडारा व प्रसादी",
  chaiTitle: "प्रतिदिन नित्य निःशुल्क चाय व जल सेवा",
  gauTitle: "निराश्रित गोवंश सेवा एवं गौशाला संचालन",
  sponsorBhandaraBtn: "शनिवार भंडारे का प्रायोजन करें",
  sponsorChaiBtn: "चाय सेवा हेतु दूध व सामग्री सहयोग",
  sponsorGauBtn: "गौसेवा हेतु चारा दान करें",
  aboutTag: "हमारा परिचय एवं इतिहास",
  aboutTitle: "प्रभु रामजी ट्रस्ट की स्थापना एवं पावन संकल्प",
  objectivesTag: "पावन ध्येय एवं संकल्प",
  objectivesTitle: "प्रभु रामजी ट्रस्ट के 10 मुख्य उद्देश्य",
  officialsTag: "कार्यकारिणी एवं न्यासी मंडल",
  officialsTitle: "ट्रस्ट के अधिकृत पदाधिकारी",
  donateTag: "पुण्य सहयोग महायज्ञ",
  donateTitle: "दान एवं सहयोग व्यवस्था",
  donateDesc: "आश्रम निर्माण, हर शनिवार शाम भंडारा, प्रतिदिन चाय सेवा एवं गौसेवा में अपना पावन अंशदान समर्पित करें।",
  taxNoticeTitle: "पारदर्शिता एवं कर-छूट स्थिति:",
  taxNoticeText: "पंजीकरण 12AB एवं 80G आयकर विभाग में प्रक्रियाधीन है। दान करने के उपरांत ट्रस्ट की मुहर युक्त आधिकारिक डिजिटल रसीद तुरंत प्रदान की जाएगी।",
  phonePeQrTitle: "आधिकारिक PhonePe QR कोड",
  scanNote: "(PhonePe, Google Pay, Paytm या किसी भी UPI ऐप से स्कैन करें)",
  openPhonePeBtn: "PhonePe / GPay ऐप में खोलें",
  bankTransferTitle: "सीधे बैंक ट्रांसफर (NEFT / IMPS)",
  accNoLabel: "खाता संख्या (A/C No.)",
  ifscLabel: "IFSC कोड",
  holderLabel: "खाता धारक का नाम",
  bankBranchLabel: "बैंक व शाखा",
  formTitle: "दान दर्ज करें एवं डिजिटल पावती प्राप्त करें",
  formSub: "दान के पश्चात आधिकारिक रसीद प्रिंट अथवा PDF में तुरंत सहेजें",
  selectCauseLabel: "सहयोग प्रकल्प चुनें",
  selectAmountLabel: "सहयोग राशि चुनें",
  donorNameLabel: "दानदाता का पूरा नाम *",
  donorMobileLabel: "मोबाइल नंबर * (10 अंक)",
  donorEmailLabel: "ईमेल आईडी (वैकल्पिक)",
  donorPanLabel: "पैन नंबर (वैकल्पिक)",
  paymentModeLabel: "भुगतान का माध्यम",
  submitDonationBtn: "सहयोग दर्ज करें व रसीद प्राप्त करें",
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
  contactChannelBtn: "प्रभु रामजी ट्रस्ट WhatsApp चैनल से जुड़ें →"
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
  navVolunteer: "Join as Volunteer",
  navCertificate: "Seva Certificate",
  navComplaint: "Feedback & Grievance",
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
  ashramTag: "Special Construction Initiative · Gram Galgaon (M.P.)",
  ashramTitle: "Prabhu Ramji Ashram & Mandir Construction Yajna",
  ashramStatusPrefix: "Current Status:",
  ashramTargetPrefix: "Target Completion:",
  ashramPackagesTitle: "Contribute Cement, Bricks, Steel or Pillars",
  ashramPackagesDesc: "Sponsor any construction component as per your devotion. An official stamped digital receipt will be issued immediately.",
  ashramSponsorBtn: "Dedicate This Contribution",
  servicesTag: "Daily & Weekly Routine at the Trust",
  servicesTitle: "Our Core Spiritual & Social Seva Projects",
  servicesDesc: "Active ongoing humanitarian and devotional services at Gram Galgaon (Sanawad) for cows, pilgrims, and rural families.",
  bhandaraTitle: "Every Saturday Evening Grand Bhandara",
  chaiTitle: "Daily Free Tea & Water Service for Pilgrims",
  gauTitle: "Destitute Cow Protection & Gaushala Management",
  sponsorBhandaraBtn: "Sponsor Saturday Bhandara",
  sponsorChaiBtn: "Sponsor Milk & Tea Ingredients",
  sponsorGauBtn: "Donate Fodder for Cows",
  aboutTag: "Our History & Mission",
  aboutTitle: "Establishment & Sacred Oath of Prabhu Ramji Trust",
  objectivesTag: "Sacred Vision & Pillars",
  objectivesTitle: "The 10 Core Objectives of Prabhu Ramji Trust",
  officialsTag: "Governing Board of Trustees",
  officialsTitle: "Authorized Trustees & Executive Board",
  donateTag: "Sacred Contribution",
  donateTitle: "Online Donation & Direct Banking",
  donateDesc: "Support Ashram Nirman, Saturday Bhandara, Daily Tea Seva, and Cow Welfare with your generous voluntary contributions.",
  taxNoticeTitle: "Transparency & Tax Exemption Status:",
  taxNoticeText: "Registration under Section 12AB and 80G is currently in processing with the Income Tax Department. Official stamped digital receipts are provided immediately.",
  phonePeQrTitle: "Official PhonePe QR Code",
  scanNote: "(Scan with PhonePe, Google Pay, Paytm or any UPI App)",
  openPhonePeBtn: "Open in PhonePe / GPay App",
  bankTransferTitle: "Direct Bank Transfer (NEFT / IMPS)",
  accNoLabel: "Account Number",
  ifscLabel: "IFSC Code",
  holderLabel: "Account Holder Name",
  bankBranchLabel: "Bank & Branch",
  formTitle: "Record Contribution & Generate Digital Receipt",
  formSub: "Download or print your official stamped receipt instantly",
  selectCauseLabel: "Select Seva Cause",
  selectAmountLabel: "Select Contribution Amount",
  donorNameLabel: "Donor Full Name *",
  donorMobileLabel: "Mobile Number * (10 Digits)",
  donorEmailLabel: "Email Address (Optional)",
  donorPanLabel: "PAN Number (Optional)",
  paymentModeLabel: "Payment Method",
  submitDonationBtn: "Record Donation & Get Receipt",
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
  contactChannelBtn: "Follow Prabhu Ramji Trust on WhatsApp →"
};

const BASE_MR: Partial<TranslationSchema> = {
  trustName: "प्रभू रामजी ट्रस्ट",
  tagline: "मु. पो. गलगाव, सनावद (खरगोन, म.प्र.)",
  motto: "सेवा हाच धर्म आहे, परोपकार हीच खरी पूजा आहे",
  searchReceiptBtn: "पावती शोधा",
  donateBtn: "दान / सहकार्य करा",
  navHome: "मुख्यपृष्ठ",
  navAshram: "आश्रम निर्माण",
  navAbout: "परिचय",
  navObjectives: "उद्दिष्टे",
  navServices: "सेवा कार्य",
  navOfficials: "पदाधिकारी",
  navGallery: "गॅलरी",
  navTransparency: "पारदर्शकता",
  navNews: "बातम्या",
  navContact: "संपर्क",
  navVolunteer: "स्वयंसेवक व्हा",
  heroSalutation: "जय श्री राम | सेवा, संस्कार आणि परोपकार",
  heroBtnAshram: "आश्रम बांधकामात मदत करा",
  heroBtnDonate: "दान / PhonePe QR",
  servicesTitle: "आमचे प्रमुख नित्य व साप्ताहिक सेवा प्रकल्प",
  bhandaraTitle: "प्रत्येक शनिवारी संध्याकाळी महाप्रसाद भंडारा",
  chaiTitle: "दररोज मोफत चहा व पाणी सेवा",
  gauTitle: "निराश्रित गोवंश सेवा व गोशाळा",
  submitDonationBtn: "सहकार्य नोंदवा आणि पावती मिळवा"
};

const BASE_GU: Partial<TranslationSchema> = {
  trustName: "પ્રભુ રામજી ટ્રસ્ટ",
  tagline: "ગામ ગલગાંવ, સનાવદ (ખરગોન, મ.પ્ર.)",
  motto: "સેવા એ જ ધર્મ છે, પરોપકાર એ જ સાચી પૂજા છે",
  searchReceiptBtn: "રસીદ શોધો",
  donateBtn: "દાન / સહયોગ કરો",
  navHome: "હોમ",
  navAshram: "આશ્રમ નિર્માણ",
  navAbout: "પરિચય",
  navObjectives: "ઉદ્દેશ્યો",
  navServices: "સેવા કાર્ય",
  navOfficials: "હોદ્દેદારો",
  navGallery: "ગેલેરી",
  navTransparency: "પારદર્શિતા",
  navNews: "સમાચાર",
  navContact: "સંપર્ક",
  navVolunteer: "સ્વયંસેવક બનો",
  heroSalutation: "જય શ્રી રામ | સેવા, સંસ્કાર અને પરોપકાર",
  heroBtnAshram: "આશ્રમ નિર્માણમાં સહયોગ આપો",
  heroBtnDonate: "દાન / PhonePe QR",
  servicesTitle: "અમારા મુખ્ય નિત્ય અને સાપ્તાહિક સેવા પ્રોજેક્ટ્સ",
  bhandaraTitle: "દર શનિવારે સાંજે મહાભંડારો અને પ્રસાદી",
  chaiTitle: "દરરોજ વિનામૂલ્યે ચા અને જળ સેવા",
  gauTitle: "નિરાધાર ગૌવંશ સેવા અને ગૌશાળા સંચાલન",
  submitDonationBtn: "સહયોગ નોંધો અને રસીદ મેળવો"
};

const BASE_SA: Partial<TranslationSchema> = {
  trustName: "प्रभु रामजी न्यासः",
  tagline: "गलगांव ग्रामः, सनावद (खरगोन, म.प्र.)",
  motto: "सेवा परमो धर्मः, परोपकाराय पुण्याय",
  searchReceiptBtn: "प्राप्तिपत्रम् अन्विष्यतु",
  donateBtn: "दानं / सहयोगं कुर्वन्तु",
  navHome: "गृहम्",
  navAshram: "आश्रम निर्माणम्",
  navAbout: "परिचयः",
  navObjectives: "उद्देश्यानि",
  navServices: "सेवा कार्याणि",
  navOfficials: "पदाधिकारिणः",
  navGallery: "चित्रशाला",
  navTransparency: "पारदर्शिता",
  navNews: "वार्ताः",
  navContact: "सम्पर्कः",
  navVolunteer: "स्वयंसेवकः भवतु",
  heroSalutation: "जय श्री राम | सेवा, संस्कारः परोपकारश्च",
  servicesTitle: "अस्माकं मुख्याः सेवा प्रकल्पाः",
  bhandaraTitle: "प्रति शनिवारं सायङ्काले महाप्रसाद भण्डारः",
  chaiTitle: "प्रतिदिनं निःशुल्क चाय-जल सेवा",
  gauTitle: "निराश्रित गोवंश सेवा गोशाला च",
  submitDonationBtn: "सहयोगं समर्प्य रसीदं प्राप्नुवन्तु"
};

const BASE_BN: Partial<TranslationSchema> = {
  trustName: "প্রভু রামজি ট্রাস্ট",
  tagline: "গ্রাম গলগাঁও, সানাওয়াদ (খারগোন, মধ্যপ্রদেশ)",
  motto: "সেবাই ধর্ম, পরোপকারই প্রকৃত উপাসনা",
  searchReceiptBtn: "রসিদ খুঁজুন",
  donateBtn: "দান / সহযোগিতা করুন",
  navHome: "হোম",
  navAshram: "আশ্রম নির্মাণ",
  navAbout: "পরিচিতি",
  navObjectives: "উদ্দেশ্য",
  navServices: "সেবা প্রকল্প",
  navOfficials: "কর্মকর্তা",
  navGallery: "গ্যালারি",
  navTransparency: "স্বচ্ছতা",
  navNews: "সংবাদ",
  navContact: "যোগাযোগ",
  navVolunteer: "স্বেচ্ছাসেবক হন",
  heroSalutation: "জয় শ্রী রাম | সেবা, সংস্কার ও পরোপকার",
  servicesTitle: "আমাদের প্রধান দৈনিক ও সাপ্তাহিক সেবা প্রকল্প",
  bhandaraTitle: "প্রতি শনিবার সন্ধ্যায় মহাপ্রসাদ ভাণ্ডারা",
  chaiTitle: "প্রতিদিন বিনামূল্যে চা ও জল সেবা",
  gauTitle: "গোবংশ রক্ষা ও গোশালা পরিচালনা"
};

const BASE_PA: Partial<TranslationSchema> = {
  trustName: "ਪ੍ਰਭੂ ਰਾਮਜੀ ਟਰੱਸਟ",
  tagline: "ਪਿੰਡ ਗਲਗਾਓਂ, ਸਨਾਵਦ (ਖਰਗੋਨ, ਮ.ਪ੍ਰ.)",
  motto: "ਸੇਵਾ ਹੀ ਧਰਮ ਹੈ, ਪਰਉਪਕਾਰ ਹੀ ਸੱਚੀ ਪੂਜਾ ਹੈ",
  searchReceiptBtn: "ਰਸੀਦ ਖੋਜੋ",
  donateBtn: "ਦਾਨ / ਸਹਿਯੋਗ ਕਰੋ",
  navHome: "ਮੁੱਖ ਪੰਨਾ",
  navAshram: "ਆਸ਼ਰਮ ਨਿਰਮਾਣ",
  navAbout: "ਜਾਣ-ਪਛਾਣ",
  navObjectives: "ਉਦੇਸ਼",
  navServices: "ਸੇਵਾ ਕਾਰਜ",
  navOfficials: "ਅਹੁਦੇਦਾਰ",
  navGallery: "ਗੈਲਰੀ",
  navTransparency: "ਪਾਰਦਰਸ਼ਤਾ",
  navNews: "ਖ਼ਬਰਾਂ",
  navContact: "ਸੰਪਰਕ",
  navVolunteer: "ਸੇਵਾਦਾਰ ਬਣੋ",
  heroSalutation: "ਜੈ ਸ਼੍ਰੀ ਰਾਮ | ਸੇਵਾ, ਸੰਸਕਾਰ ਅਤੇ ਪਰਉਪਕਾਰ",
  bhandaraTitle: "ਹਰ ਸ਼ਨੀਵਾਰ ਸ਼ਾਮ ਨੂੰ ਮਹਾਂ ਲੰਗਰ ਭੰਡਾਰਾ",
  chaiTitle: "ਰੋਜ਼ਾਨਾ ਮੁਫ਼ਤ ਚਾਹ ਅਤੇ ਜਲ ਸੇਵਾ",
  gauTitle: "ਗਊ ਸੇਵਾ ਅਤੇ ਗਊਸ਼ਾਲਾ ਪ੍ਰਬੰਧਨ"
};

const BASE_UR: Partial<TranslationSchema> = {
  trustName: "پربھو رام جی ٹرسٹ",
  tagline: "گرام گلگاؤں، سَنَاود (کھرگون، ایم پی)",
  motto: "خدمت ہی مذہب ہے، پرؤپکار ہی سچی عبادت ہے",
  searchReceiptBtn: "رسید تلاش کریں",
  donateBtn: "عطیہ / تعاون کریں",
  navHome: "ہوم",
  navAshram: "آشرم کی تعمیر",
  navAbout: "تعارف",
  navObjectives: "مقاصد",
  navServices: "خدماتی سرگرمیاں",
  navOfficials: "عہدیداران",
  navGallery: "گیلری",
  navTransparency: "شفافیت",
  navNews: "خبریں",
  navContact: "رابطہ",
  navVolunteer: "رضاکار بنیں",
  heroSalutation: "جے شری رام | خدمت، سنسکار اور نیکی",
  bhandaraTitle: "ہر ہفتہ کی شام کو بڑا لنگر اور پرساد",
  chaiTitle: "روزانہ مفت چائے اور پانی کی خدمت",
  gauTitle: "بے سہارا گائے کی خدمت اور دیکھ بھال"
};

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  hi: BASE_HI,
  en: BASE_EN,
  mr: { ...BASE_HI, ...BASE_MR },
  gu: { ...BASE_HI, ...BASE_GU },
  sa: { ...BASE_HI, ...BASE_SA },
  bn: { ...BASE_HI, ...BASE_BN },
  pa: { ...BASE_HI, ...BASE_PA },
  ta: { ...BASE_EN, ...BASE_HI, trustName: "பிரபு ராம்ஜி அறக்கட்டளை", donateBtn: "நன்கொடை அளிக்கவும்", searchReceiptBtn: "ரசீதை தேடுங்கள்" },
  te: { ...BASE_EN, ...BASE_HI, trustName: "ప్రభు రామ్‌జీ ట్రస్ట్", donateBtn: "విరాళం ఇవ్వండి", searchReceiptBtn: "రసీదు శోధించండి" },
  kn: { ...BASE_EN, ...BASE_HI, trustName: "ಪ್ರಭು ರಾಮ್‌ಜೀ ಟ್ರಸ್ಟ್", donateBtn: "ದಾನ ಮಾಡಿ", searchReceiptBtn: "ರಶೀದಿ ಹುಡುಕಿ" },
  ml: { ...BASE_EN, ...BASE_HI, trustName: "പ്രഭു രാംജി ട്രസ്റ്റ്", donateBtn: "സംഭാവന ചെയ്യുക", searchReceiptBtn: "രസീത് തിരയുക" },
  or: { ...BASE_HI, trustName: "ପ୍ରଭୁ ରାମଜୀ ଟ୍ରଷ୍ଟ", donateBtn: "ଦାନ / ସହଯୋଗ କରନ୍ତୁ", searchReceiptBtn: "ରସିଦ ଖୋଜନ୍ତୁ" },
  ne: { ...BASE_HI, trustName: "प्रभु रामजी ट्रस्ट", donateBtn: "दान / सहयोग गर्नुहोस्", searchReceiptBtn: "रसिद खोज्नुहोस्", motto: "सेवा नै धर्म हो, परोपकार नै साँचो पूजा हो" },
  ur: { ...BASE_HI, ...BASE_UR },
  fr: { ...BASE_EN, trustName: "Prabhu Ramji Trust", donateBtn: "Faire un don", searchReceiptBtn: "Rechercher un reçu", motto: "Le service est religion, la bienveillance est le vrai culte" },
  de: { ...BASE_EN, trustName: "Prabhu Ramji Trust", donateBtn: "Spenden / Helfen", searchReceiptBtn: "Quittung suchen", motto: "Dienst ist Religion, Wohlwollen ist wahre Andacht" },
  es: { ...BASE_EN, trustName: "Prabhu Ramji Trust", donateBtn: "Donar / Apoyar", searchReceiptBtn: "Buscar recibo", motto: "El servicio es religión, la benevolencia es la verdadera devoción" }
};

export function getTranslation(lang: Language = 'hi'): TranslationSchema {
  return TRANSLATIONS[lang] || TRANSLATIONS['hi'];
}
