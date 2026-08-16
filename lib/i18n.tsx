// lib/i18n.tsx
"use client";

import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type { Language } from "@/types/marketplace";

// ============================================================
// ENGLISH
// ============================================================

const en = {
    // ---------------- NAVBAR ----------------
    "nav.farmer": "Farmer",
    "nav.vendor": "Vendor",

    // ---------------- IMPACT ----------------
    "impact.savedLabel": "Produce Saved from Waste",
    "impact.savedSub": "+{{percent}}% vs last week",
    "impact.earningsLabel": "Direct Farmer Earnings Boost",
    "impact.earningsSub": "vs. mandi middleman price",
    "impact.dealsLabel": "Active Local Vendor Deals",
    "impact.dealsSub": "closing within 15 km radius",

    // ---------------- DASHBOARD ----------------
    "dashboard.freshNearYou": "Fresh near you",
    "dashboard.heroTitle": "Your harvest, straight to buyers",
    "dashboard.heroDescription":
        "List what you've harvested in under a minute. Nearby vendors see it instantly — no middleman, no waiting.",
    "dashboard.postNewHarvest": "Post New Harvest",

    // ---------------- FEED ----------------
    "feed.searchPlaceholder": "Search crop, e.g. tomato",
    "feed.filters": "Filters",
    "feed.distance": "Distance",
    "feed.distanceWithin": "within {{km}} km",
    "feed.sortFreshness": "freshness",
    "feed.sortPriceAsc": "price low to high",
    "feed.sortPriceDesc": "price high to low",
    "feed.sortNearest": "nearest",
    "feed.qualityAll": "all",
    "feed.qualityOrganic": "organic",
    "feed.qualityStandard": "standard",
    "feed.noResults":
        "No listings match these filters yet. Try widening the distance radius.",
    "feed.call": "Call",
    "feed.whatsapp": "WhatsApp",
    "feed.bookBulk": "Book Bulk Stock",
    "feed.by": "by",
    "feed.organicBadge": "Organic",

    // ---------------- MODAL ----------------
    "modal.title": "Post New Harvest",
    "modal.stepOf": "Step {{step}} of {{total}}",
    "modal.speakInstead": "Speak your listing instead",
    "modal.whatDidYouHarvest": "What did you harvest?",
    "modal.addPhoto": "Add a photo",
    "modal.photoAttached": "Photo attached ✓",
    "modal.tapToPhoto": "Tap to take a photo",
    "modal.quantity": "Quantity",
    "modal.pricePerUnit": "Expected price per {{unit}}",
    "modal.back": "Back",
    "modal.continue": "Continue",
    "modal.publish": "Publish Listing",
    "modal.preview": "Listing preview",
    "modal.totalValue": "Total value ≈",
    "modal.nearbyBuyers":
        "Nearby buyers within ~12 km will see this instantly",

    // ---------------- CATEGORIES ----------------
    "category.tomato": "Tomato",
    "category.potato": "Potato",
    "category.onion": "Onion",
    "category.leafy-greens": "Leafy Greens",
    "category.fruits": "Fruits",
    "category.grains": "Grains",

    // ---------------- VOICE ----------------
    "voice.title": "Voice Listing",
    "voice.notSupported":
        "Voice input isn't supported on this browser. Please try typing your crop details instead.",
    "voice.placeholder": "Your words appear here",
    "voice.useThis": "Use this listing",
    "voice.prompt":
        "Tap and say your crop, quantity, and price",

    // ========================================================
    // DECISION ENGINE
    // ========================================================

    "decision.confidence": "Decision Confidence",

    "decision.title": "Smart Crop Decision Engine",

    "decision.subtitle":
        "Get a practical recommendation based on crop condition, weather risk, market prices, storage availability and transportation.",

    // Crop
    "decision.cropCondition": "Crop Details",
    "decision.crop": "Select Crop",
    "decision.quantity": "Quantity",
    "decision.quintal": "quintal",

    "decision.tomato": "Tomato",
    "decision.onion": "Onion",
    "decision.potato": "Potato",
    "decision.mango": "Mango",
    "decision.wheat": "Wheat",

    // Weather
    "decision.weatherRisk": "Weather Conditions",
    "decision.temperature": "Temperature",
    "decision.rainChance": "Rain Chance",
    "decision.risk": "Weather Risk",

    // Risk
    "decision.low": "Low",
    "decision.moderate": "Moderate",
    "decision.high": "High",

    // Market
    "decision.marketPrice": "Market Price",
    "decision.currentPrice": "Current Market Price",
    "decision.estimatedValue": "Estimated Crop Value",

    // Spoilage
    "decision.spoilageRisk": "Spoilage Risk",
    "decision.spoilageDescription":
        "Higher spoilage risk means the crop should generally be sold sooner to reduce potential losses.",

    // Storage
    "decision.storage": "Storage Availability",
    "decision.available": "Available",
    "decision.notAvailable": "Not Available",

    // Destination
    "decision.destination": "Destination",
    "decision.nearestMarket": "Nearest Market",
    "decision.fromFarm": "from farm",

    // Transportation
    "decision.transport": "Transportation",
    "decision.transportDescription":
        "Choose the most suitable transportation option based on cost, capacity and delivery time.",

    "decision.miniTruck": "Mini Truck",
    "decision.tempo": "Tempo",
    "decision.tractor": "Tractor",

    "decision.distance": "Distance",
    "decision.cost": "Cost",
    "decision.capacity": "Capacity",
    "decision.delivery": "Delivery Time",

    "decision.selectedTransport": "Selected Transportation",
    "decision.transportCost": "Transportation Cost",
    "decision.netValue": "Estimated Net Value",

    // Recommendation
    "decision.recommendation": "Recommended Action",

    "decision.sellImmediately": "Sell Immediately",

    "decision.sellImmediatelyDescription":
        "The current spoilage and weather risks are relatively high. Selling the crop soon can reduce the possibility of loss.",

    "decision.storeLater": "Store and Sell Later",

    "decision.storeLaterDescription":
        "Storage is available and the current market price is relatively low. Consider storing the crop and selling when market conditions improve.",

    "decision.sellNearby": "Sell to Nearby Market",

    "decision.sellNearbyDescription":
        "The current conditions are suitable for selling through a nearby market while keeping transportation costs under control.",

    // Prototype
    "decision.prototypeNote":
        "Prototype decision support only. Weather, market and transportation data will be connected through APIs.",

} as const;


// ============================================================
// TRANSLATION KEY TYPE
// ============================================================

export type TranslationKey = keyof typeof en;


// ============================================================
// HINDI
// ============================================================

const hi: Record<TranslationKey, string> = {

    // NAVBAR
    "nav.farmer": "किसान",
    "nav.vendor": "विक्रेता",

    // IMPACT
    "impact.savedLabel": "बर्बादी से बचाई गई उपज",
    "impact.savedSub": "पिछले सप्ताह की तुलना में +{{percent}}%",
    "impact.earningsLabel": "किसानों की सीधी आय में वृद्धि",
    "impact.earningsSub": "मंडी बिचौलिए की कीमत की तुलना में",
    "impact.dealsLabel": "सक्रिय स्थानीय विक्रेता सौदे",
    "impact.dealsSub": "15 किमी के दायरे में पूरे हो रहे",

    // DASHBOARD
    "dashboard.freshNearYou": "आपके पास ताज़ा",
    "dashboard.heroTitle": "आपकी फसल, सीधे खरीदारों तक",
    "dashboard.heroDescription":
        "एक मिनट से भी कम समय में अपनी फसल सूचीबद्ध करें। आस-पास के विक्रेता इसे तुरंत देखेंगे — कोई बिचौलिया नहीं, कोई इंतज़ार नहीं।",
    "dashboard.postNewHarvest": "नई फसल पोस्ट करें",

    // FEED
    "feed.searchPlaceholder": "फसल खोजें, जैसे टमाटर",
    "feed.filters": "फ़िल्टर",
    "feed.distance": "दूरी",
    "feed.distanceWithin": "{{km}} किमी के भीतर",
    "feed.sortFreshness": "ताज़गी",
    "feed.sortPriceAsc": "कम से ज़्यादा कीमत",
    "feed.sortPriceDesc": "ज़्यादा से कम कीमत",
    "feed.sortNearest": "सबसे नज़दीक",
    "feed.qualityAll": "सभी",
    "feed.qualityOrganic": "जैविक",
    "feed.qualityStandard": "मानक",
    "feed.noResults":
        "फ़िलहाल इन फ़िल्टर से कोई सूची मेल नहीं खाती। दूरी का दायरा बढ़ाकर देखें।",
    "feed.call": "कॉल करें",
    "feed.whatsapp": "व्हाट्सएप",
    "feed.bookBulk": "थोक स्टॉक बुक करें",
    "feed.by": "द्वारा",
    "feed.organicBadge": "जैविक",

    // MODAL
    "modal.title": "नई फसल पोस्ट करें",
    "modal.stepOf": "चरण {{step}} / {{total}}",
    "modal.speakInstead": "इसके बजाय बोलकर बताएं",
    "modal.whatDidYouHarvest": "आपने क्या उपजाया?",
    "modal.addPhoto": "फ़ोटो जोड़ें",
    "modal.photoAttached": "फ़ोटो जोड़ा गया ✓",
    "modal.tapToPhoto": "फ़ोटो लेने के लिए टैप करें",
    "modal.quantity": "मात्रा",
    "modal.pricePerUnit": "{{unit}} की अपेक्षित कीमत",
    "modal.back": "वापस",
    "modal.continue": "आगे बढ़ें",
    "modal.publish": "सूची प्रकाशित करें",
    "modal.preview": "सूची पूर्वावलोकन",
    "modal.totalValue": "कुल मूल्य ≈",
    "modal.nearbyBuyers":
        "12 किमी के आस-पास के खरीदार इसे तुरंत देखेंगे",

    // CATEGORIES
    "category.tomato": "टमाटर",
    "category.potato": "आलू",
    "category.onion": "प्याज़",
    "category.leafy-greens": "पत्तेदार सब्ज़ी",
    "category.fruits": "फल",
    "category.grains": "अनाज",

    // VOICE
    "voice.title": "आवाज़ से सूची",
    "voice.notSupported":
        "इस ब्राउज़र में आवाज़ इनपुट समर्थित नहीं है। कृपया अपनी फसल का विवरण टाइप करें।",
    "voice.placeholder": "आपके शब्द यहाँ दिखेंगे",
    "voice.useThis": "यह सूची उपयोग करें",
    "voice.prompt":
        "टैप करें और अपनी फसल, मात्रा और कीमत बोलें",

    // DECISION ENGINE

    "decision.confidence": "निर्णय विश्वसनीयता",

    "decision.title": "स्मार्ट फसल निर्णय प्रणाली",

    "decision.subtitle":
        "फसल की स्थिति, मौसम का जोखिम, बाजार मूल्य, भंडारण और परिवहन के आधार पर व्यावहारिक सुझाव प्राप्त करें।",

    "decision.cropCondition": "फसल विवरण",
    "decision.crop": "फसल चुनें",
    "decision.quantity": "मात्रा",
    "decision.quintal": "क्विंटल",

    "decision.tomato": "टमाटर",
    "decision.onion": "प्याज़",
    "decision.potato": "आलू",
    "decision.mango": "आम",
    "decision.wheat": "गेहूँ",

    "decision.weatherRisk": "मौसम की स्थिति",
    "decision.temperature": "तापमान",
    "decision.rainChance": "बारिश की संभावना",
    "decision.risk": "मौसम जोखिम",

    "decision.low": "कम",
    "decision.moderate": "मध्यम",
    "decision.high": "अधिक",

    "decision.marketPrice": "बाजार मूल्य",
    "decision.currentPrice": "वर्तमान बाजार मूल्य",
    "decision.estimatedValue": "अनुमानित फसल मूल्य",

    "decision.spoilageRisk": "खराब होने का जोखिम",
    "decision.spoilageDescription":
        "अधिक खराब होने का जोखिम होने पर नुकसान कम करने के लिए फसल को जल्द बेचने पर विचार करना चाहिए।",

    "decision.storage": "भंडारण उपलब्धता",
    "decision.available": "उपलब्ध",
    "decision.notAvailable": "उपलब्ध नहीं",

    "decision.destination": "गंतव्य",
    "decision.nearestMarket": "निकटतम बाजार",
    "decision.fromFarm": "खेत से",

    "decision.transport": "परिवहन",
    "decision.transportDescription":
        "लागत, क्षमता और डिलीवरी समय के आधार पर सबसे उपयुक्त परिवहन विकल्प चुनें।",

    "decision.miniTruck": "मिनी ट्रक",
    "decision.tempo": "टेम्पो",
    "decision.tractor": "ट्रैक्टर",

    "decision.distance": "दूरी",
    "decision.cost": "लागत",
    "decision.capacity": "क्षमता",
    "decision.delivery": "डिलीवरी समय",

    "decision.selectedTransport": "चयनित परिवहन",
    "decision.transportCost": "परिवहन लागत",
    "decision.netValue": "अनुमानित शुद्ध मूल्य",

    "decision.recommendation": "अनुशंसित कार्रवाई",

    "decision.sellImmediately": "तुरंत बेचें",

    "decision.sellImmediatelyDescription":
        "वर्तमान खराब होने और मौसम के जोखिम अपेक्षाकृत अधिक हैं। नुकसान की संभावना कम करने के लिए फसल जल्द बेचने की सलाह दी जाती है।",

    "decision.storeLater": "भंडारण करके बाद में बेचें",

    "decision.storeLaterDescription":
        "भंडारण उपलब्ध है और वर्तमान बाजार मूल्य अपेक्षाकृत कम है। बाजार की स्थिति बेहतर होने तक फसल को स्टोर करने पर विचार करें।",

    "decision.sellNearby": "निकटतम बाजार में बेचें",

    "decision.sellNearbyDescription":
        "वर्तमान परिस्थितियां पास के बाजार में बिक्री के लिए उपयुक्त हैं और परिवहन लागत को नियंत्रित रखा जा सकता है।",

    "decision.prototypeNote":
        "यह केवल प्रोटोटाइप निर्णय सहायता है। मौसम, बाजार और परिवहन का डेटा API के माध्यम से जोड़ा जाएगा।",
};


// ============================================================
// MARATHI
// ============================================================

const mr: Record<TranslationKey, string> = {

    // NAVBAR
    "nav.farmer": "शेतकरी",
    "nav.vendor": "विक्रेता",

    // IMPACT
    "impact.savedLabel": "कचऱ्यापासून वाचवलेला माल",
    "impact.savedSub": "मागील आठवड्याच्या तुलनेत +{{percent}}%",
    "impact.earningsLabel": "शेतकऱ्यांच्या थेट उत्पन्नात वाढ",
    "impact.earningsSub": "मंडईतील दलालाच्या किमतीच्या तुलनेत",
    "impact.dealsLabel": "सक्रिय स्थानिक विक्रेता व्यवहार",
    "impact.dealsSub": "15 किमी परिसरात पूर्ण होत आहेत",

    // DASHBOARD
    "dashboard.freshNearYou": "तुमच्या जवळचा ताजा माल",
    "dashboard.heroTitle": "तुमचे पीक, थेट खरेदीदारांपर्यंत",
    "dashboard.heroDescription":
        "एका मिनिटापेक्षा कमी वेळात तुमचे पीक नोंदवा. जवळचे विक्रेते ते लगेच पाहतील — दलाल नाही, वाट पाहणे नाही.",
    "dashboard.postNewHarvest": "नवीन पीक नोंदवा",

    // FEED
    "feed.searchPlaceholder": "पीक शोधा, उदा. टोमॅटो",
    "feed.filters": "फिल्टर",
    "feed.distance": "अंतर",
    "feed.distanceWithin": "{{km}} किमी च्या आत",
    "feed.sortFreshness": "ताजेपणा",
    "feed.sortPriceAsc": "कमी ते जास्त किंमत",
    "feed.sortPriceDesc": "जास्त ते कमी किंमत",
    "feed.sortNearest": "सर्वात जवळ",
    "feed.qualityAll": "सर्व",
    "feed.qualityOrganic": "सेंद्रिय",
    "feed.qualityStandard": "मानक",
    "feed.noResults":
        "सध्या या फिल्टरशी जुळणारी कोणतीही यादी नाही. अंतराची मर्यादा वाढवून पहा.",
    "feed.call": "कॉल करा",
    "feed.whatsapp": "व्हॉट्सअ‍ॅप",
    "feed.bookBulk": "मोठ्या प्रमाणात साठा बुक करा",
    "feed.by": "द्वारे",
    "feed.organicBadge": "सेंद्रिय",

    // MODAL
    "modal.title": "नवीन पीक नोंदवा",
    "modal.stepOf": "टप्पा {{step}} / {{total}}",
    "modal.speakInstead": "त्याऐवजी बोलून सांगा",
    "modal.whatDidYouHarvest": "तुम्ही काय पिकवले?",
    "modal.addPhoto": "फोटो जोडा",
    "modal.photoAttached": "फोटो जोडला ✓",
    "modal.tapToPhoto": "फोटो काढण्यासाठी टॅप करा",
    "modal.quantity": "प्रमाण",
    "modal.pricePerUnit": "प्रति {{unit}} अपेक्षित किंमत",
    "modal.back": "मागे",
    "modal.continue": "पुढे चला",
    "modal.publish": "यादी प्रकाशित करा",
    "modal.preview": "यादीचे पूर्वावलोकन",
    "modal.totalValue": "एकूण मूल्य ≈",
    "modal.nearbyBuyers":
        "सुमारे 12 किमी परिसरातील खरेदीदारांना हे लगेच दिसेल",

    // CATEGORIES
    "category.tomato": "टोमॅटो",
    "category.potato": "बटाटा",
    "category.onion": "कांदा",
    "category.leafy-greens": "पालेभाजी",
    "category.fruits": "फळे",
    "category.grains": "धान्य",

    // VOICE
    "voice.title": "आवाजाने नोंद",
    "voice.notSupported":
        "या ब्राउझरमध्ये आवाज इनपुट समर्थित नाही. कृपया तुमच्या पिकाचा तपशील टाइप करा.",
    "voice.placeholder": "तुमचे शब्द इथे दिसतील",
    "voice.useThis": "ही नोंद वापरा",
    "voice.prompt":
        "टॅप करा आणि तुमचे पीक, प्रमाण आणि किंमत सांगा",

    // DECISION ENGINE

    "decision.confidence": "निर्णयाचा विश्वास स्तर",

    "decision.title": "स्मार्ट पीक निर्णय प्रणाली",

    "decision.subtitle":
        "पिकाची स्थिती, हवामानाचा धोका, बाजारभाव, साठवणूक आणि वाहतूक यावर आधारित व्यावहारिक सूचना मिळवा.",

    "decision.cropCondition": "पिकाची माहिती",
    "decision.crop": "पीक निवडा",
    "decision.quantity": "प्रमाण",
    "decision.quintal": "क्विंटल",

    "decision.tomato": "टोमॅटो",
    "decision.onion": "कांदा",
    "decision.potato": "बटाटा",
    "decision.mango": "आंबा",
    "decision.wheat": "गहू",

    "decision.weatherRisk": "हवामानाची स्थिती",
    "decision.temperature": "तापमान",
    "decision.rainChance": "पावसाची शक्यता",
    "decision.risk": "हवामानाचा धोका",

    "decision.low": "कमी",
    "decision.moderate": "मध्यम",
    "decision.high": "जास्त",

    "decision.marketPrice": "बाजारभाव",
    "decision.currentPrice": "सध्याचा बाजारभाव",
    "decision.estimatedValue": "अंदाजे पिकाचे मूल्य",

    "decision.spoilageRisk": "खराब होण्याचा धोका",
    "decision.spoilageDescription":
        "खराब होण्याचा धोका जास्त असल्यास नुकसान कमी करण्यासाठी पीक लवकर विकण्याचा विचार करावा.",

    "decision.storage": "साठवणुकीची उपलब्धता",
    "decision.available": "उपलब्ध",
    "decision.notAvailable": "उपलब्ध नाही",

    "decision.destination": "गंतव्य",
    "decision.nearestMarket": "जवळची बाजारपेठ",
    "decision.fromFarm": "शेतापासून",

    "decision.transport": "वाहतूक",
    "decision.transportDescription":
        "खर्च, क्षमता आणि वितरण वेळेनुसार योग्य वाहतूक पर्याय निवडा.",

    "decision.miniTruck": "मिनी ट्रक",
    "decision.tempo": "टेम्पो",
    "decision.tractor": "ट्रॅक्टर",

    "decision.distance": "अंतर",
    "decision.cost": "खर्च",
    "decision.capacity": "क्षमता",
    "decision.delivery": "वितरण वेळ",

    "decision.selectedTransport": "निवडलेली वाहतूक",
    "decision.transportCost": "वाहतूक खर्च",
    "decision.netValue": "अंदाजे निव्वळ मूल्य",

    "decision.recommendation": "शिफारस केलेली कृती",

    "decision.sellImmediately": "ताबडतोब विक्री करा",

    "decision.sellImmediatelyDescription":
        "सध्याचा खराब होण्याचा आणि हवामानाचा धोका तुलनेने जास्त आहे. नुकसानाची शक्यता कमी करण्यासाठी पीक लवकर विकण्याचा सल्ला दिला जातो.",

    "decision.storeLater": "साठवून नंतर विक्री करा",

    "decision.storeLaterDescription":
        "साठवणूक उपलब्ध आहे आणि सध्याचा बाजारभाव तुलनेने कमी आहे. बाजाराची परिस्थिती सुधारण्यापर्यंत पीक साठवण्याचा विचार करा.",

    "decision.sellNearby": "जवळच्या बाजारपेठेत विक्री करा",

    "decision.sellNearbyDescription":
        "सध्याची परिस्थिती जवळच्या बाजारपेठेत विक्री करण्यासाठी योग्य आहे आणि वाहतूक खर्च नियंत्रणात ठेवता येईल.",

    "decision.prototypeNote":
        "ही केवळ प्रोटोटाइप निर्णय सहाय्य प्रणाली आहे. हवामान, बाजारभाव आणि वाहतूक डेटा API द्वारे जोडला जाईल.",
};


// ============================================================
// DICTIONARIES
// ============================================================

const dictionaries: Record<
    Language,
    Record<TranslationKey, string>
> = {
    en,
    hi,
    mr,
};


// ============================================================
// SPEECH LANGUAGE
// ============================================================

export const SPEECH_LANG_CODE: Record<
    Language,
    string
> = {
    en: "en-IN",
    hi: "hi-IN",
    mr: "mr-IN",
};


// ============================================================
// CONTEXT
// ============================================================

interface LanguageContextValue {
    language: Language;

    setLanguage: (lang: Language) => void;

    t: (
        key: TranslationKey,
        vars?: Record<string, string | number>
    ) => string;
}

const LanguageContext =
    createContext<LanguageContextValue | null>(null);


// ============================================================
// PROVIDER
// ============================================================

export function LanguageProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [language, setLanguage] =
        useState<Language>("en");

    const t = (
        key: TranslationKey,
        vars?: Record<string, string | number>
    ) => {
        let str: string =
            dictionaries[language][key] ??
            dictionaries.en[key] ??
            key;

        if (vars) {
            for (const [k, v] of Object.entries(vars)) {
                str = str.replace(
                    `{{${k}}}`,
                    String(v)
                );
            }
        }

        return str;
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                t,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}


// ============================================================
// HOOK
// ============================================================

export function useTranslation() {
    const ctx = useContext(LanguageContext);

    if (!ctx) {
        throw new Error(
            "useTranslation must be called within a <LanguageProvider>"
        );
    }

    return ctx;
}
