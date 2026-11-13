import { 
  Official, 
  NewsItem, 
  GalleryPhoto, 
  GalleryVideo, 
  TransparencyRecord, 
  DonationReceipt, 
  ConstructionProgress, 
  SevaProject,
  VolunteerServiceEvent,
  VolunteerTaskItem
} from '../types';

export const TRUST_INFO = {
  name: "प्रभु रामजी ट्रस्ट",
  englishName: "Prabhu Ramji Trust",
  motto: "सेवा ही धर्म है, परोपकार ही सच्ची पूजा है",
  village: "ग्राम गलगाँव",
  tehsil: "तहसील सनावद",
  district: "जिला खरगोन",
  state: "मध्य प्रदेश",
  pinCode: "451111",
  fullAddress: "प्रभु रामजी ट्रस्ट, ग्राम गलगाँव, तहसील सनावद, जिला खरगोन (म.प्र.) - 451111",
  landmark: "माँ नर्मदा पावन अंचल, सनावद-गलगाँव मार्ग",
  plusCode: "5X5W+4JR Galgaon, Madhya Pradesh",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=5X5W%2B4JR+Galgaon,+Madhya+Pradesh&data=!3m1!1e3",
  googleMapsSatelliteUrl: "https://www.google.com/maps/search/?api=1&query=5X5W%2B4JR+Galgaon,+Madhya+Pradesh&data=!3m1!1e3",
  websiteUrl: "https://prabhuramjitrustram.ai.studio/",
  
  // Real Assets provided by user
  logoUrl: "/logo.png",
  phonePeQrUrl: "/assets/aistudio/IMG-20261103-WA0008_8bfff24a.jpg",

  // Core Daily & Weekly Routines
  dailyRoutine: {
    chaiSeva: "प्रतिदिन प्रातः 06:00 बजे से नित्य निःशुल्क चाय सेवा (नर्मदा परिक्रमावासियों, संतों व आगंतुकों के लिए)",
    bhandaraTime: "प्रत्येक शनिवार शाम को भव्य महाभंडारा व महाप्रसाद वितरण",
    gauSeva: "नित्य प्रातः एवं सायं गोमाता को ताजा हरा चारा, दलिया, गुड़ व चिकित्सा",
    ashramWork: "प्रभु रामजी आश्रम, मंदिर एवं परिक्रमा विश्राम भवन का निर्माण कार्य प्रगति पर"
  },

  // Official Banking Details
  accountNumber: "1285104000034520",
  ifscCode: "IBKL0001285",
  bankName: "IDBI Bank (आईडीबीआई बैंक)",
  branchName: "सनावद (Sanawad)",
  accountHolder: "GULABCHAND S/O HIRALAL",
  upiId: "dineshbirla312@ybl",

  // Social & Official Communication Channels
  email: "dineshbirla312@gmail.com",
  phone: "+91 95753 01233",
  secondaryPhone: "+91 97538 46104",
  whatsappNumber: "+91 95753 01233",
  whatsappContactUrl: `https://api.whatsapp.com/send?phone=919575301233&text=${encodeURIComponent("जय श्री राम! मैं प्रभु रामजी ट्रस्ट से बात करना चाहता हूँ। मुझे गौसेवा, शनिवार भंडारा, नर्मदा परिक्रमा सेवा अथवा आश्रम निर्माण के संबंध में जानकारी व मार्गदर्शन चाहिए।")}`,
  whatsappChannel: "https://whatsapp.com/channel/0029Vb93t1aEQIauurkfRX2a",
  youtube: "https://youtube.com/@ramjitrust?si=4jFyZIqtamM7oxE4",
  facebook: "https://www.facebook.com/share/1FJX1492GR/",
  instagram: "https://www.instagram.com/prabhushriramtrust?srtk=MTIxZng4dnBwa21kag==",
  
  taxExemptionStatus: "पंजीकरण 12AB एवं 80G आयकर विभाग में प्रक्रियाधीन है। ट्रस्ट पूर्ण वित्तीय शुचिता और नैतिक नियमों का पालन करता है।"
};

export const ASHRAM_NIRMAN_INFO = {
  title: "प्रभु रामजी आश्रम एवं मंदिर निर्माण महायज्ञ",
  subTitle: "ग्राम गलगाँव (सनावद, खरगोन) में परिक्रमावासियों एवं संतों हेतु दिव्य आश्रम व विश्राम परिसर",
  description: "माँ नर्मदा परिक्रमा मार्ग पर ग्राम गलगाँव में संतों, पदयात्रियों के विश्राम, नित्य अन्नक्षेत्र, गौशाला शेड एवं श्रीराम-हनुमान मंदिर के पक्के निर्माण का कार्य तीव्र गति से चल रहा है। इस पावन निर्माण में आपके द्वारा दी गई एक-एक ईंट, सीमेंट की बोरी एवं स्तंभ सहयोग से यह आश्रम साकार हो रहा है।",
  currentPhase: "नींव एवं पिलर (स्तंभ) निर्माण प्रगति पर",
  targetCompletion: "वर्ष 2026-27",
  packages: [
    { name: "1 बोरी सीमेंट सहयोग", amount: 380, icon: "package", desc: "नींव व पिलर निर्माण हेतु" },
    { name: "100 ईंटें समर्पण", amount: 750, icon: "brick", desc: "आश्रम की पावन दीवार निर्माण" },
    { name: "1 क्विंटल सरिया", amount: 6200, icon: "hammer", desc: "मजबूत स्तंभ व छत ढलाई" },
    { name: "1 स्तंभ (पिलर) निर्माण", amount: 11000, icon: "columns", desc: "आश्रम भवन का मुख्य आधार" },
    { name: "परिक्रमा कक्ष / शेड सहयोग", amount: 25000, icon: "home", desc: "साधु-संतों हेतु विश्राम कक्ष" },
    { name: "इच्छानुसार निर्माण अंशदान", amount: 0, icon: "heart", desc: "श्रद्धानुसार कोई भी सहयोग" }
  ],
  gallery: [
    {
      url: "/assets/aistudio/ashram-mandir-nirman-1_7dccf72b.jpg",
      title: "नींव एवं आधार स्तंभ निर्माण कार्य",
      desc: "आश्रम स्थल पर पिलर एवं गहरी नींव की ढलाई का कार्य प्रगति पर"
    },
    {
      url: "/assets/aistudio/ashram-mandir-nirman-2_e977cf9f.jpg",
      title: "आश्रम परिसर व कार्य स्थल दर्शन",
      desc: "ग्राम गलगाँव स्थित प्रभु रामजी आश्रम व परिक्रमा सेवा केंद्र"
    },
    {
      url: "/assets/aistudio/IMG-20261102-WA0005_12d23c89.jpg",
      title: "आश्रम में प्रतिष्ठित श्री हनुमानजी विग्रह",
      desc: "आश्रम व मंदिर परिसर में विराजे सिंदूरी संकटमोचन श्री हनुमानजी"
    }
  ]
};

export const DEFAULT_OFFICIALS: Official[] = [
  {
    id: "1",
    name: "श्री गुलाबचंद जी",
    designation: "अध्यक्ष (President)",
    roleDescription: "सुपुत्र श्री हीरालाल जी। संस्थापक अध्यक्ष, जिनके मार्गदर्शन में ग्राम गलगाँव में गौसेवा, प्रतिदिन चाय सेवा, शनिवार शाम भंडारा एवं आश्रम निर्माण की सेवा अविरल जारी है।",
    phone: "+91 95753 01233"
  },
  {
    id: "2",
    name: "श्री दिनेश जी",
    designation: "सचिव (Secretary)",
    roleDescription: "ट्रस्ट के सेवा प्रबंधन, शनिवार शाम भंडारा आयोजन, प्रतिदिन चाय सेवा संचालन, आश्रम निर्माण निगरानी व डिजिटल संचार का दायित्व संभाल रहे हैं।",
    phone: "+91 95753 01233"
  },
  {
    id: "3",
    name: "श्रीमती चम्पा बाई",
    designation: "कोषाध्यक्ष (Treasurer)",
    roleDescription: "वित्तीय पारदर्शिता, अन्नक्षेत्र व्यय नियंत्रण, गौसेवा बहीखाता एवं आश्रम निर्माण निधि का पारदर्शी लेखा-जोखा।",
    phone: "+91 95753 01233"
  }
];

export const ABOUT_DECLARATION = {
  mainHeader: "सनातन संस्कृति के जीवन मूल्यों, मर्यादा पुरुषोत्तम प्रभु श्रीराम के आदर्शों तथा माँ नर्मदा की पुण्य धरा पर नर सेवा को नारायण सेवा मानकर स्थापित सामाजिक व धार्मिक न्यास।",
  pledge: "प्रभु रामजी ट्रस्ट की संकल्पना ग्राम गलगाँव (सनावद, खरगोन) के पावन ग्रामीण परिवेश में सेवा, संस्कार और सामाजिक समरसता को सशक्त करने के उद्देश्य से की गई है। निमाड़ अंचल माँ नर्मदा के पावन प्रवाह और आध्यात्मिक ऊर्जा का केंद्र है, जहाँ प्रतिवर्ष लाखों परिक्रमावासी श्रद्धालु पदयात्रा करते हैं।",
  belief: "ट्रस्ट का दृढ़ विश्वास है कि गौमाता का संरक्षण, बेसहारा जीवों का भरण-पोषण, परिक्रमावासियों की निष्काम सेवा, बच्चों को नैतिक शिक्षा एवं वंचित परिवारों को तात्कालिक सहायता पहुंचाना ही सच्ची आराधना है।",
  values: [
    { label: "सेवा", desc: "नर सेवा ही नारायण सेवा" },
    { label: "संस्कार", desc: "सनातन भारतीय मूल्य" },
    { label: "समर्पण", desc: "पूर्ण निष्ठा एवं सेवा" },
    { label: "शुचिता", desc: "100% सत्य व शुचिता" }
  ],
  pillars: [
    { title: "निष्काम सेवा भाव", desc: "बिना किसी स्वार्थ के केवल पीड़ित व जरूरतमंद की सहायता।" },
    { title: "पारदर्शी प्रबंधन", desc: "स्थानीय समाज एवं न्यासियों के प्रत्यक्ष देखरेख में कार्य।" },
    { title: "हमारा मिशन (Mission)", desc: "ग्रामीण स्तर पर गौशाला संचालन, नर्मदा परिक्रमा में निरंतर अन्न-जल सेवा, कमजोर परिवारों के बच्चों की शिक्षा में संबल तथा समाज में आध्यात्मिक संस्कारों का विस्तार करना।" },
    { title: "हमारा विज़न (Vision)", desc: "एक ऐसे आत्मनिर्भर, संस्कारित और संवेदनशील समाज की रचना, जहाँ कोई भी गौवंश निराश्रित न भटके, कोई परिक्रमावासी भूखा-प्यासा न रहे और हर जरूरतमंद को समय पर सहारा मिले।" }
  ],
  legalDeclaration: "ट्रस्ट की कानूनी स्थिति, पंजीकरण संख्या और पंजीकरण तिथि आधिकारिक प्रक्रिया के पूर्ण होने तथा संबंधित सक्षम प्राधिकारी से आधिकारिक दस्तावेज़ जारी होने पर सार्वजनिक रूप से प्रकाशित की जाएगी। ट्रस्ट पूर्णतः पारदर्शी और सत्यनिष्ठ सेवा के संकल्प पर कार्य कर रहा है।"
};

export const TRUST_OBJECTIVES = [
  {
    number: "01",
    type: "proposed" as const,
    statusLabel: "प्रस्तावित प्रकल्प",
    title: "गौसेवा एवं गौशाला का निर्माण और संचालन",
    desc: "ग्राम गलगाँव एवं आसपास के क्षेत्र में निराश्रित एवं अशक्त गौवंश के सुरक्षित आश्रय हेतु आधुनिक एवं प्राकृतिक सुविधाओं से युक्त आदर्श गौशाला का निर्माण व संचालन करना।",
    badge: "आदर्श गौशाला निर्माण योजनाधीन",
    location: "गलगाँव, खरगोन"
  },
  {
    number: "02",
    type: "active" as const,
    statusLabel: "सक्रिय सेवा कार्य",
    title: "गौवंश का संरक्षण, चारा-पानी और देखभाल",
    desc: "बेसहारा और चोटिल गायों के लिए नियमित हरे चारे, शुद्ध पेयजल, पोषणयुक्त आहार एवं प्राथमिक पशु चिकित्सा सेवा की निरंतर व्यवस्था।",
    badge: "दैनिक चारा-पानी सेवा संचालित",
    location: "गलगाँव, खरगोन"
  },
  {
    number: "03",
    type: "active" as const,
    statusLabel: "सक्रिय सेवा कार्य",
    title: "नर्मदा परिक्रमा यात्रियों की सेवा एवं दैनिक चाय सेवा",
    desc: "माँ नर्मदा की पावन परिक्रमा कर रहे पदयात्रियों के लिए हनुमान मंदिर में प्रतिदिन निशुल्क ताज़ी चाय सेवा, स्वच्छ पेयजल, विश्राम तथा शनिवार को भोजन-प्रसादी सहायता।",
    badge: "प्रतिदिन चाय सेवा व परिक्रमा सहायता",
    location: "गलगाँव, खरगोन"
  },
  {
    number: "04",
    type: "active" as const,
    statusLabel: "सक्रिय सेवा कार्य",
    title: "गरीब और जरूरतमंद लोगों की सहायता",
    desc: "समाज के उपेक्षित, असहाय और वंचित बंधुओं की पहचान कर उनके जीवन स्तर में सुधार लाने एवं तात्कालिक संकट में संबल प्रदान करना।",
    badge: "सीधी मानवीय सहायता",
    location: "गलगाँव, खरगोन"
  },
  {
    number: "05",
    type: "active" as const,
    statusLabel: "सक्रिय सेवा कार्य",
    title: "बच्चों की शिक्षा, शैक्षणिक सामग्री और संस्कार",
    desc: "ग्रामीण बालिकाओं एवं बालकों को स्कूल बैग, पाठ्य सामग्री, कॉपियाँ उपलब्ध कराना एवं बाल संस्कार केंद्रों के माध्यम से नैतिक व आध्यात्मिक मूल्यों की नींव मजबूत करना।",
    badge: "विद्यार्थी सहयोग एवं संस्कार शिक्षा",
    location: "गलगाँव, खरगोन"
  },
  {
    number: "06",
    type: "proposed" as const,
    statusLabel: "प्रस्तावित प्रकल्प",
    title: "निःशुल्क स्वास्थ्य शिविर और प्राथमिक चिकित्सा सहायता",
    desc: "ग्रामीण अंचल में विशेषज्ञ चिकित्सकों के सहयोग से निशुल्क स्वास्थ्य परीक्षण, नेत्र जांच, रक्तदान शिविर तथा प्राथमिक औषधियां उपलब्ध कराने की योजना।",
    badge: "समय-समय पर स्वास्थ्य शिविर योजना",
    location: "गलगाँव, खरगोन"
  },
  {
    number: "07",
    type: "active" as const,
    statusLabel: "सक्रिय सेवा कार्य",
    title: "धार्मिक, आध्यात्मिक एवं सांस्कृतिक कार्यक्रम",
    desc: "श्री रामकथा, सुंदरकांड पाठ, भजन संध्या, सत्संग तथा भारतीय पारंपरिक पर्वों का सामूहिक एवं गरिमामयी आयोजन कर समाज में धर्म व सद्भाव का संचार करना।",
    badge: "सामूहिक सत्संग व सांस्कृतिक उत्सव",
    location: "गलगाँव, खरगोन"
  },
  {
    number: "08",
    type: "active" as const,
    statusLabel: "सक्रिय सेवा कार्य",
    title: "हनुमान मंदिर अन्नदान महादान एवं जनहित कार्य",
    desc: "श्री हनुमान मंदिर में प्रत्येक शनिवार को साप्ताहिक विशाल अन्नदान महादान, मंदिर परिसर की स्वच्छता, श्रद्धालुओं के लिए बैठक व्यवस्था व जनहितकारी सेवा।",
    badge: "प्रत्येक शनिवार अन्नदान महादान",
    location: "गलगाँव, खरगोन"
  },
  {
    number: "09",
    type: "active" as const,
    statusLabel: "सक्रिय सेवा कार्य",
    title: "वृक्षारोपण, स्वच्छता, जल संरक्षण और पर्यावरण सुरक्षा",
    desc: "गलगाँव क्षेत्र में सघन पौधरोपण, जल स्रोतों की स्वच्छता, सिंगल-यूज प्लास्टिक मुक्ति अभियान तथा माँ नर्मदा तट स्वच्छता अभियान का क्रियान्वयन।",
    badge: "हरित गलगाँव एवं नर्मदा शुद्धि संकल्प",
    location: "गलगाँव, खरगोन"
  },
  {
    number: "10",
    type: "active" as const,
    statusLabel: "सक्रिय सेवा कार्य",
    title: "जरूरतमंद परिवारों को भोजन, वस्त्र और आवश्यक सहायता",
    desc: "शीत ऋतु में गर्म कंबलों का वितरण, त्यौहारों पर राशन किट एवं प्राकृतिक आपदा या आकस्मिक संकट के समय परिवारों को तात्कालिक राशन व वस्त्र सहायता।",
    badge: "वस्त्र व राशन वितरण सेवा",
    location: "गलगाँव, खरगोन"
  }
];


export const DEFAULT_PHOTOS: GalleryPhoto[] = [
  {
    id: "p_logo",
    title: "प्रभु रामजी ट्रस्ट अधिकृत प्रतीक चिन्ह (Logo)",
    category: "all",
    imageUrl: "/assets/aistudio/apple-touch-icon_8ef90e9a.png",
    date: "2026-11-01",
    description: "ग्राम गलगाँव, सनावद, खरगोन (म.प्र.) स्थित प्रभु रामजी ट्रस्ट का आधिकारिक पावन लोगो।"
  },
  {
    id: "p_bhandara_real",
    title: "शनिवार शाम का महाभंडारा पंगत दृश्य",
    category: "annadan",
    imageUrl: "/assets/aistudio/IMG-20261030-WA0000_4e2396e1_4e2396e1_4e2396e1.jpg",
    date: "2026-10-30",
    description: "शनिवार शाम को संतों, श्रद्धालुओं एवं ग्रामीण भक्तों को प्रेमपूर्वक पंगत में प्रसादी वितरण।"
  },
  {
    id: "p_gaushala_real",
    title: "ग्राम गलगाँव गौशाला में संरक्षित गोवंश",
    category: "gauseva",
    imageUrl: "/assets/aistudio/img_real_gaushala_31c848c1.jpg",
    date: "2026-10-25",
    description: "ट्रस्ट परिसर में संरक्षित गायें, बछड़े एवं उनकी नियमित चारा-पानी व्यवस्था।"
  },
  {
    id: "p_ashram_work1",
    title: "आश्रम एवं मंदिर निर्माण - नींव व पिलर कार्य",
    category: "ashram",
    imageUrl: "/assets/aistudio/ashram-mandir-nirman-1_7dccf72b.jpg",
    date: "2026-11-02",
    description: "परिक्रमा विश्राम भवन एवं मंदिर निर्माण हेतु चल रहा नींव व पिलर का पक्का कार्य।"
  },
  {
    id: "p_ashram_work2",
    title: "आश्रम परिसर व निर्माण स्थल",
    category: "ashram",
    imageUrl: "/assets/aistudio/ashram-mandir-nirman-2_e977cf9f.jpg",
    date: "2026-11-02",
    description: "ग्राम गलगाँव में निर्मित हो रहे प्रभु रामजी आश्रम व सेवा परिसर का विहंगम दृश्य।"
  },
  {
    id: "p_hanuman_moorti",
    title: "आश्रम में विराजे संकटमोचन श्री हनुमानजी",
    category: "ashram",
    imageUrl: "/assets/aistudio/IMG-20261102-WA0005_12d23c89.jpg",
    date: "2026-11-02",
    description: "आश्रम स्थल पर प्रतिष्ठित श्री हनुमानजी की पावन सिंदूरी प्रतिमा।"
  },
  {
    id: "p_narmada_chai",
    title: "नर्मदा परिक्रमावासियों हेतु प्रतिदिन चाय व जल सेवा",
    category: "chaiseva",
    imageUrl: "/assets/aistudio/1793586446047_5029f454.jpg",
    date: "2026-10-28",
    description: "नित्य प्रातः एवं दिनभर परिक्रमा पथिकों के लिए गर्म चाय, जलपान व प्रसादी सेवा।"
  },
  {
    id: "p_ram_darbar",
    title: "कोदण्डधारी प्रभु श्री रामजी",
    category: "all",
    imageUrl: "/shri_ram_kodanda.jpg",
    date: "2026-10-15",
    description: "मर्यादा पुरुषोत्तम प्रभु श्री रामजी का पावन विग्रह जिनकी कृपा से समस्त सेवा प्रकल्प संचालित हैं।"
  }
];

export const DEFAULT_VIDEOS: GalleryVideo[] = [
  {
    id: "v1",
    title: "प्रभु रामजी ट्रस्ट गलगाँव - गौसेवा एवं आश्रम दर्शन",
    youtubeId: "dQw4w9WgXcQ",
    category: "gauseva",
    date: "2026-10-10",
    description: "ग्राम गलगाँव में गौशाला का दृश्य और भक्तों द्वारा गौमाता को चारा खिलाने की सेवा।"
  },
  {
    id: "v2",
    title: "शनिवार शाम भंडारा एवं प्रतिदिन चाय सेवा का दृश्य",
    youtubeId: "dQw4w9WgXcQ",
    category: "annadan",
    date: "2026-10-18",
    description: "शनिवार शाम को होने वाले भव्य भंडारे एवं प्रतिदिन चाय सेवा का वीडियो।"
  },
  {
    id: "v3",
    title: "आश्रम एवं मंदिर निर्माण कार्य प्रगति",
    youtubeId: "dQw4w9WgXcQ",
    category: "ashram",
    date: "2026-10-24",
    description: "ग्राम गलगाँव में चल रहे आश्रम, शेड व मंदिर निर्माण कार्य का वीडियो।"
  }
];

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "इस शनिवार शाम को विशेष महाभंडारा व संकीर्तन",
    date: "2026-11-08",
    category: "bhandara",
    content: "ग्राम गलगाँव स्थित प्रभु रामजी ट्रस्ट परिसर में इस शनिवार को सायं 05:30 बजे से रात्रि 09:30 बजे तक विशेष महाभंडारे का आयोजन होगा। दाल-रोटी, खिचड़ी, हलवा प्रसादी का वितरण किया जाएगा। समस्त भक्तजन सपरिवार पधारें।",
    isImportant: true
  },
  {
    id: "n2",
    title: "आश्रम निर्माण महायज्ञ: पिलर व छत ढलाई हेतु सहयोग आमंत्रित",
    date: "2026-11-03",
    category: "suchna",
    content: "परिक्रमा पथिक विश्राम गृह एवं आश्रम परिसर के पिलर व टीन शेड निर्माण कार्य हेतु सीमेंट, ईंट एवं सरिया सहयोग आमंत्रित है। दानदाता सीधे ऑनलाइन या कार्यालय में संपर्क कर सकते हैं।",
    isImportant: true
  },
  {
    id: "n3",
    title: "प्रतिदिन प्रातः 6 बजे से नित्य निःशुल्क चाय सेवा जारी",
    date: "2026-10-28",
    category: "suchna",
    content: "सनावद से गुजरने वाले माँ नर्मदा परिक्रमा पदयात्रियों एवं साधु-संतों के लिए प्रतिदिन नित्य ताजी गर्म चाय एवं बिस्कुट सेवा अनवरत जारी है।",
    isImportant: false
  }
];

export const DEFAULT_TRANSPARENCY_RECORDS: TransparencyRecord[] = [
  {
    id: "t1",
    monthYear: "अक्टूबर 2026",
    totalDonation: 74200,
    totalExpense: 68500,
    gauSevaExpense: 28000,
    bhandaraExpense: 24000,
    narmadaSevaExpense: 11500,
    otherExpense: 5000,
    remarks: "प्रतिदिन चाय सेवा, 4 शनिवार शाम भंडारे एवं आश्रम पिलर कार्य में व्यय।"
  },
  {
    id: "t2",
    monthYear: "सितंबर 2026",
    totalDonation: 59300,
    totalExpense: 55400,
    gauSevaExpense: 24000,
    bhandaraExpense: 19500,
    narmadaSevaExpense: 8900,
    otherExpense: 3000,
    remarks: "गौमाता के हरे चारे की व्यवस्था व शनिवार भंडारा।"
  }
];

export const INITIAL_RECEIPTS: DonationReceipt[] = [
  {
    receiptNo: "PRT-2026-1091",
    donorName: "अशोक जी शर्मा",
    mobile: "9425011111",
    amount: 5100,
    cause: "आश्रम एवं मंदिर निर्माण सहयोग",
    date: "2026-11-02",
    paymentMode: "PhonePe QR",
    transactionRef: "UPI/6312481920/IDBI",
    status: "verified",
    verifiedDate: "2026-11-02",
    verifiedBy: "ट्रस्ट कार्यालय"
  },
  {
    receiptNo: "PRT-2026-1092",
    donorName: "रमेश पाटीदार",
    mobile: "9826022222",
    amount: 2100,
    cause: "शनिवार शाम भंडारा प्रसादी",
    date: "2026-11-03",
    paymentMode: "UPI (PhonePe)",
    transactionRef: "UPI/8941203912/AXIS",
    status: "verified",
    verifiedDate: "2026-11-03",
    verifiedBy: "ट्रस्ट कार्यालय"
  }
];

export const DEFAULT_CONSTRUCTION_PROGRESS: ConstructionProgress = {
  projectTitle: "प्रभु रामजी आश्रम एवं परिक्रमा विश्राम भवन",
  location: "ग्राम गलगाँव, सनावद, खरगोन (म.प्र.)",
  totalBudget: 3500000,
  receivedDonations: 1450000,
  totalSpent: 1280000,
  status: "नींव व आरसीसी स्तंभ (Pillars) निर्माण कार्य प्रगति पर",
  targetCompletion: "वर्ष 2026-27",
  description: "माँ नर्मदा परिक्रमा पथिकों, साधु-संतों एवं भक्तों के सुरक्षित रात्रि विश्राम, भोजन प्रसादी और श्री राम-हनुमान मंदिर के पक्के निर्माण का महायज्ञ।",
  milestones: [
    { name: "पावन भूमि पूजन एवं समतलीकरण", percent: 100, done: true },
    { name: "गहरी आरसीसी नींव ढलाई", percent: 100, done: true },
    { name: "मुख्य आधार स्तंभ (Pillars) निर्माण", percent: 75, done: false },
    { name: "विश्राम भवन छत एवं शेड ढलाई", percent: 20, done: false },
    { name: "संत कक्ष, शौचालय एवं जल व्यवस्था", percent: 10, done: false }
  ],
  photos: [
    "/assets/aistudio/ashram-mandir-nirman-1_7dccf72b.jpg",
    "/assets/aistudio/ashram-mandir-nirman-2_e977cf9f.jpg",
    "/assets/aistudio/IMG-20261102-WA0005_12d23c89.jpg"
  ]
};

export const DEFAULT_SEVA_PROJECTS: SevaProject[] = [
  {
    id: "gauseva",
    number: "01",
    title: "गौसेवा एवं निराश्रित गोवंश संरक्षण",
    englishTitle: "Cow Protection & Gaushala Seva",
    subtitle: "निराश्रित एवं अशक्त गोवंश को चारा, सुरक्षित आश्रय व चिकित्सा",
    description: "ग्राम गलगाँव में बेसहारा गोवंश को प्रतिदिन प्रातः एवं सायं ताजा हरा चारा, कुट्टी, दलिया, गुड़ एवं पशु चिकित्सक द्वारा निःशुल्क दवाइयां उपलब्ध कराई जाती हैं।",
    iconName: "Heart",
    imageUrl: "/assets/aistudio/img_real_gaushala_31c848c1.jpg",
    dailyRoutine: "प्रतिदिन प्रातः 6:30 बजे से नित्य गोमाता की सेवा व चारा वितरण",
    keyStats: "नित्य 50+ गोवंश की देखरेख",
    status: "active" as const,
    donationTargetCause: "गौसेवा एवं गौशाला संचालन"
  },
  {
    id: "narmada",
    number: "02",
    title: "नर्मदा परिक्रमा साधु-संत व पदयात्री सेवा",
    englishTitle: "Narmada Parikrama Pilgrim Support",
    subtitle: "परिक्रमा पथिकों हेतु जल, फलाहार, विश्राम एवं प्राथमिक उपचार",
    description: "पावन माँ नर्मदा परिक्रमा मार्ग पर स्थित गलगाँव आश्रम में आने वाले सभी पदयात्री संतों एवं श्रद्धालुओं को शीतल जल, चाय, फलाहार और विश्राम की निःशुल्क व्यवस्था दी जाती है।",
    iconName: "Waves",
    imageUrl: "/assets/aistudio/1793586446047_5029f454.jpg",
    dailyRoutine: "24 घंटे परिक्रमा यात्रियों हेतु द्वार खुले हैं",
    keyStats: "प्रतिवर्ष हजारों परिक्रमावासियों की सेवा",
    status: "active" as const,
    donationTargetCause: "नर्मदा परिक्रमा सेवा"
  },
  {
    id: "bhandara",
    number: "03",
    title: "हर शनिवार शाम भव्य महाभंडारा व प्रसादी",
    englishTitle: "Saturday Grand Community Feast (Bhandara)",
    subtitle: "प्रत्येक शनिवार शाम सैकड़ों भक्तों व ग्रामीणों हेतु पावन पंगत",
    description: "प्रत्येक शनिवार शाम को शुद्ध देशी सामग्री से निर्मित स्वादिष्ट महाप्रसाद पंगत का आयोजन होता है, जिसमें बिना किसी भेदभाव के सभी श्रद्धालु बैठकर भोजन ग्रहण करते हैं।",
    iconName: "UtensilsCrossed",
    imageUrl: "/assets/aistudio/IMG-20261030-WA0000_4e2396e1_4e2396e1_4e2396e1.jpg",
    dailyRoutine: "हर शनिवार शाम 6:00 बजे से निरंतर महाप्रसाद वितरण",
    keyStats: "हर शनिवार 300+ श्रद्धालु महाप्रसाद पाते हैं",
    status: "active" as const,
    donationTargetCause: "शनिवार शाम भंडारा प्रसादी"
  },
  {
    id: "chaiseva",
    number: "04",
    title: "प्रतिदिन नित्य निःशुल्क चाय व जल सेवा",
    englishTitle: "Daily Free Morning Tea & Water Seva",
    subtitle: "प्रातः 6 बजे से नित्य परिक्रमा पथिकों एवं श्रमजीवियों हेतु सेवा",
    description: "ग्राम गलगाँव मार्ग पर प्रतिदिन प्रातःकाल से ही ताजा दूध की गर्मागर्म चाय एवं शुद्ध जल की अविरल सेवा प्रदान की जाती है।",
    iconName: "Coffee",
    imageUrl: "/assets/aistudio/1793586446047_5029f454.jpg",
    dailyRoutine: "प्रतिदिन प्रातः 06:00 बजे से प्रातः 10:00 बजे तक",
    keyStats: "प्रतिदिन 200+ कप निःशुल्क चाय सेवा",
    status: "active" as const,
    donationTargetCause: "प्रतिदिन चाय सेवा"
  },
  {
    id: "ashram",
    number: "05",
    title: "प्रभु रामजी आश्रम एवं मंदिर निर्माण",
    englishTitle: "Ashram & Mandir Construction",
    subtitle: "परिक्रमा विश्राम भवन, मंदिर व अन्नक्षेत्र का पक्का निर्माण",
    description: "परिक्रमा पथिकों के सुरक्षित रात्रि विश्राम, संतों के सत्संग भवन और संकटमोचन श्री हनुमानजी मंदिर के विशाल परिसर का निर्माण कार्य प्रगति पर है।",
    iconName: "Building",
    imageUrl: "/assets/aistudio/ashram-mandir-nirman-1_7dccf72b.jpg",
    dailyRoutine: "नींव व स्तंभ निर्माण कार्य निरंतर चालू है",
    keyStats: "3500 वर्गफीट का विशाल सेवा परिसर",
    status: "active" as const,
    donationTargetCause: "आश्रम एवं मंदिर निर्माण सहयोग"
  },
  {
    id: "poorhelp",
    number: "06",
    title: "निर्धन एवं असहाय परिवार सहायता",
    englishTitle: "Aid for Poor & Needy Families",
    subtitle: "राशन, वस्त्र, आकस्मिक सहायता एवं ठंड में कंबल वितरण",
    description: "ग्रामीण क्षेत्र के अत्यंत कमजोर व निराश्रित परिवारों को खाद्यान्न किट, शीतकाल में गर्म कंबल और आवश्यकता पड़ने पर सामाजिक संबल प्रदान किया जाता है।",
    iconName: "Users",
    imageUrl: "/assets/aistudio/IMG-20261030-WA0000_4e2396e1_4e2396e1_4e2396e1.jpg",
    dailyRoutine: "आवश्यकतानुसार समय-समय पर अभियान",
    keyStats: "100+ परिवारों को समय पर सहायता",
    status: "active" as const,
    donationTargetCause: "गरीब एवं जरूरतमंद सहायता"
  },
  {
    id: "childedu",
    number: "07",
    title: "बाल संस्कार एवं निर्धन बाल शिक्षा सहयोग",
    englishTitle: "Child Values & Education Support",
    subtitle: "पाठ्य सामग्री, नैतिक संस्कार एवं प्राथमिक शिक्षा प्रोत्साहन",
    description: "गाँव के निर्धन बच्चों को स्कूल बैग, कापियाँ, पुस्तकें और सनातन नैतिक संस्कारों की प्रेरणा देकर शिक्षा से जोड़े रखने का प्रयास किया जाता है।",
    iconName: "GraduationCap",
    imageUrl: "/assets/aistudio/1793586446047_5029f454.jpg",
    dailyRoutine: "शैक्षणिक सत्रारंभ पर पुस्तक व सामग्री वितरण",
    keyStats: "बच्चों में नैतिक शिक्षा एवं संस्कार",
    status: "active" as const,
    donationTargetCause: "अनाथ व निर्धन बाल शिक्षा"
  },
  {
    id: "health",
    number: "08",
    title: "निःशुल्क स्वास्थ्य एवं प्राथमिक चिकित्सा शिविर",
    englishTitle: "Free Health Checkups & First Aid",
    subtitle: "परिक्रमा पदयात्रियों के पैरों की मरहम-पट्टी व ग्रामीण स्वास्थ्य",
    description: "पैदल चलने वाले परिक्रमावासियों के छालों का प्राथमिक उपचार, मरहम-पट्टी, ओआरएस एवं समय-समय पर निःशुल्क स्वास्थ्य परीक्षण शिविर आयोजित किए जाते हैं।",
    iconName: "Activity",
    imageUrl: "/assets/aistudio/1793586446047_5029f454.jpg",
    dailyRoutine: "प्राथमिक चिकित्सा किट आश्रम में सदैव उपलब्ध",
    keyStats: "परिक्रमावासियों को निःशुल्क प्राथमिक चिकित्सा",
    status: "active" as const,
    donationTargetCause: "स्वास्थ्य एवं चिकित्सा सेवा"
  },
  {
    id: "environment",
    number: "09",
    title: "वृक्षारोपण एवं पावन नर्मदा पर्यावरण संरक्षण",
    englishTitle: "Tree Plantation & Environment Protection",
    subtitle: "नर्मदा तट एवं आश्रम परिसर में छायादार व औषधीय पौधे",
    description: "बरगद, पीपल, नीम, बेलपत्र एवं तुलसी के पौधों का रोपण व संरक्षण कर पर्यावरण को स्वच्छ और हरा-भरा रखने का संकल्प।",
    iconName: "Trees",
    imageUrl: "/assets/aistudio/ashram-mandir-nirman-2_e977cf9f.jpg",
    dailyRoutine: "प्रतिवर्ष वर्षाऋतु में सघन वृक्षारोपण",
    keyStats: "500+ पौधों का रोपण व संरक्षण",
    status: "active" as const,
    donationTargetCause: "वृक्षारोपण एवं पर्यावरण"
  },
  {
    id: "cultural",
    number: "10",
    title: "धार्मिक, सांस्कृतिक एवं आध्यात्मिक उत्सव",
    englishTitle: "Spiritual, Cultural & Festive Programs",
    subtitle: "रामनवमी, हनुमान जयंती, शिवरात्रि व सुंदरकांड पाठ",
    description: "ग्रामीण समाज में भक्ति, सद्भावना और सनातन संस्कृति के प्रसार हेतु अखंड रामायण, सामूहिक सुंदरकांड पाठ एवं धार्मिक पर्वों का भव्य आयोजन।",
    iconName: "Flame",
    imageUrl: "/assets/aistudio/IMG-20261102-WA0005_12d23c89.jpg",
    dailyRoutine: "नित्य सांध्य आरती एवं प्रत्येक मंगलवार-शनिवार सुंदरकांड",
    keyStats: "वर्षभर पावन आध्यात्मिक उत्सव",
    status: "active" as const,
    donationTargetCause: "धार्मिक व सांस्कृतिक कार्यक्रम"
  }
];

export const DEFAULT_VOLUNTEER_EVENTS: VolunteerServiceEvent[] = [
  {
    id: "evt-bhandara",
    title: "शनिवार शाम भव्य महाभंडारा एवं संकीर्तन सेवा",
    category: "bhandara",
    dateLabel: "प्रत्येक शनिवार (आगामी)",
    timeSlot: "सायं 05:00 – रात्रि 09:30 बजे",
    location: "श्री हनुमान मंदिर एवं आश्रम परिसर, ग्राम गलगाँव",
    coordinator: "श्री दिनेश जी (+91 95753 01233)",
    neededVolunteers: 12,
    rsvpVolunteerIds: ["VOL-2026-1001", "VOL-2026-1002", "VOL-2026-1003", "VOL-2026-1004"],
    priority: "urgent"
  },
  {
    id: "evt-chai",
    title: "दैनिक प्रातः निःशुल्क चाय एवं परिक्रमा पथिक जल सेवा",
    category: "chaiseva",
    dateLabel: "प्रतिदिन प्रातःकाल",
    timeSlot: "प्रातः 06:00 – प्रातः 10:00 बजे",
    location: "सनावद-गलगाँव माँ नर्मदा परिक्रमा मार्ग",
    coordinator: "श्री गुलाबचंद जी",
    neededVolunteers: 4,
    rsvpVolunteerIds: ["VOL-2026-1001", "VOL-2026-1005"],
    priority: "regular"
  },
  {
    id: "evt-gauseva",
    title: "गौशाला हरा चारा वितरण व स्वच्छता सेवा अभियान",
    category: "gauseva",
    dateLabel: "रविवार एवं बुधवार",
    timeSlot: "प्रातः 07:00 – 10:30 बजे",
    location: "प्रभु रामजी ट्रस्ट गौशाला परिसर, गलगाँव",
    coordinator: "श्रीमती चम्पा बाई",
    neededVolunteers: 6,
    rsvpVolunteerIds: ["VOL-2026-1002", "VOL-2026-1006", "VOL-2026-1007"],
    priority: "regular"
  },
  {
    id: "evt-ashram",
    title: "प्रभु रामजी आश्रम निर्माण (स्तंभ, सीमेंट व विश्राम भवन सेवा)",
    category: "ashram",
    dateLabel: "आगामी सप्ताह (निरंतर)",
    timeSlot: "प्रातः 09:00 – सायं 05:00 बजे",
    location: "प्रभु रामजी आश्रम निर्माण स्थल, गलगाँव",
    coordinator: "ट्रस्ट निर्माण समिति",
    neededVolunteers: 8,
    rsvpVolunteerIds: ["VOL-2026-1003", "VOL-2026-1004"],
    priority: "urgent"
  }
];

export const DEFAULT_VOLUNTEER_TASKS: VolunteerTaskItem[] = [
  {
    id: "tsk-1",
    title: "भंडारा महाप्रसाद सामग्री (आटा, दाल, घी, गुड़) की मात्रा और भंडार व्यवस्था जांचना",
    eventRef: "शनिवार शाम भव्य महाभंडारा",
    sevaArea: "शनिवार शाम भंडारा सेवा",
    dueDate: "इस शुक्रवार सायं तक",
    priority: "high",
    status: "pending",
    assignedTo: "श्री दिनेश जी"
  },
  {
    id: "tsk-2",
    title: "पंगत बैठक दरी, स्वच्छ पेयजल टैंकर एवं पत्तल-दोना वितरण काउंटर तैयार करना",
    eventRef: "शनिवार शाम भव्य महाभंडारा",
    sevaArea: "शनिवार शाम भंडारा सेवा",
    dueDate: "शनिवार सायं 04:30 बजे",
    priority: "high",
    status: "in_progress",
    assignedTo: "सेवा दल टोली"
  },
  {
    id: "tsk-3",
    title: "नर्मदा परिक्रमा पदयात्रियों के लिए प्रातः 6 बजे गर्मागर्म चाय व प्राथमिक चिकित्सा किट तैयार रखना",
    eventRef: "दैनिक प्रातः निःशुल्क चाय सेवा",
    sevaArea: "दैनिक निःशुल्क चाय सेवा",
    dueDate: "प्रतिदिन प्रातः 05:45 बजे",
    priority: "medium",
    status: "pending"
  },
  {
    id: "tsk-4",
    title: "गौशाला शेड की स्वच्छता व 50+ गोवंश के लिए हरा चारा व दलिया वितरण",
    eventRef: "गौशाला चारा व स्वच्छता अभियान",
    sevaArea: "गौशाला सेवा व चारा वितरण",
    dueDate: "रविवार प्रातः 07:30 बजे",
    priority: "medium",
    status: "pending"
  },
  {
    id: "tsk-5",
    title: "आश्रम निर्माण स्थल पर सीमेंट बोरियों एवं स्तंभ ढलाई कार्य की प्रगति रिपोर्ट लेना",
    eventRef: "आश्रम व मंदिर निर्माण",
    sevaArea: "आश्रम एवं मंदिर निर्माण",
    dueDate: "पूर्ण (समीक्षित)",
    priority: "normal",
    status: "completed",
    assignedTo: "निर्माण सहयोग दल"
  },
  {
    id: "tsk-6",
    title: "सेवा कार्यक्रमों के फ़ोटो व वीडियो संकलन कर ट्रस्ट वेबसाइट व चैनल हेतु भेजना",
    eventRef: "ट्रस्ट जनसंपर्क सेवा",
    sevaArea: "डिजिटल व सोशल मीडिया प्रचार",
    dueDate: "शनिवार रात्रि",
    priority: "normal",
    status: "pending"
  }
];


