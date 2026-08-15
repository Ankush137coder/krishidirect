// lib/i18n.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Language } from "@/types/marketplace";

// Every user-facing string in the app lives here, keyed by a dotted id.
// {{placeholders}} get substituted via t(key, { placeholder: value }).
const en = {
    "nav.farmer": "Farmer",
    "nav.vendor": "Vendor",

    "impact.savedLabel": "Produce Saved from Waste",
    "impact.savedSub": "+{{percent}}% vs last week",
    "impact.earningsLabel": "Direct Farmer Earnings Boost",
    "impact.earningsSub": "vs. mandi middleman price",
    "impact.dealsLabel": "Active Local Vendor Deals",
    "impact.dealsSub": "closing within 15 km radius",

    "dashboard.freshNearYou": "Fresh near you",
    "dashboard.heroTitle": "Your harvest, straight to buyers",
    "dashboard.heroDescription":
        "List what you've harvested in under a minute. Nearby vendors see it instantly — no middleman, no waiting.",
    "dashboard.postNewHarvest": "Post New Harvest",

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
    "feed.noResults": "No listings match these filters yet. Try widening the distance radius.",
    "feed.call": "Call",
    "feed.whatsapp": "WhatsApp",
    "feed.bookBulk": "Book Bulk Stock",
    "feed.by": "by",
    "feed.organicBadge": "Organic",

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
    "modal.nearbyBuyers": "Nearby buyers within ~12 km will see this instantly",

    "category.tomato": "Tomato",
    "category.potato": "Potato",
    "category.onion": "Onion",
    "category.leafy-greens": "Leafy Greens",
    "category.fruits": "Fruits",
    "category.grains": "Grains",

    "voice.title": "Voice Listing",
    "voice.notSupported":
        "Voice input isn't supported on this browser. Please try typing your crop details instead.",
    "voice.placeholder": "Your words appear here",
    "voice.useThis": "Use this listing",
    "voice.prompt": "Tap and say your crop, quantity, and price",
} as const;

export type TranslationKey = keyof typeof en;

const hi: Record<TranslationKey, string> = {
    "nav.farmer": "किसान",
    "nav.vendor": "विक्रेता",

    "impact.savedLabel": "बर्बादी से बचाई गई उपज",
    "impact.savedSub": "पिछले सप्ताह की तुलना में +{{percent}}%",
    "impact.earningsLabel": "किसानों की सीधी आय में वृद्धि",
    "impact.earningsSub": "मंडी बिचौलिए की कीमत की तुलना में",
    "impact.dealsLabel": "सक्रिय स्थानीय विक्रेता सौदे",
    "impact.dealsSub": "15 किमी के दायरे में पूरे हो रहे",

    "dashboard.freshNearYou": "आपके पास ताज़ा",
    "dashboard.heroTitle": "आपकी फसल, सीधे खरीदारों तक",
    "dashboard.heroDescription":
        "एक मिनट से भी कम समय में अपनी फसल सूचीबद्ध करें। आस-पास के विक्रेता इसे तुरंत देखेंगे — कोई बिचौलिया नहीं, कोई इंतज़ार नहीं।",
    "dashboard.postNewHarvest": "नई फसल पोस्ट करें",

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
    "feed.noResults": "फ़िलहाल इन फ़िल्टर से कोई सूची मेल नहीं खाती। दूरी का दायरा बढ़ाकर देखें।",
    "feed.call": "कॉल करें",
    "feed.whatsapp": "व्हाट्सएप",
    "feed.bookBulk": "थोक स्टॉक बुक करें",
    "feed.by": "द्वारा",
    "feed.organicBadge": "जैविक",

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
    "modal.nearbyBuyers": "12 किमी के आस-पास के खरीदार इसे तुरंत देखेंगे",

    "category.tomato": "टमाटर",
    "category.potato": "आलू",
    "category.onion": "प्याज़",
    "category.leafy-greens": "पत्तेदार सब्ज़ी",
    "category.fruits": "फल",
    "category.grains": "अनाज",

    "voice.title": "आवाज़ से सूची",
    "voice.notSupported":
        "इस ब्राउज़र में आवाज़ इनपुट समर्थित नहीं है। कृपया अपनी फसल का विवरण टाइप करें।",
    "voice.placeholder": "आपके शब्द यहाँ दिखेंगे",
    "voice.useThis": "यह सूची उपयोग करें",
    "voice.prompt": "टैप करें और अपनी फसल, मात्रा और कीमत बोलें",
};

const mr: Record<TranslationKey, string> = {
    "nav.farmer": "शेतकरी",
    "nav.vendor": "विक्रेता",

    "impact.savedLabel": "कचऱ्यापासून वाचवलेला माल",
    "impact.savedSub": "मागील आठवड्याच्या तुलनेत +{{percent}}%",
    "impact.earningsLabel": "शेतकऱ्यांच्या थेट उत्पन्नात वाढ",
    "impact.earningsSub": "मंडईतील दलालाच्या किमतीच्या तुलनेत",
    "impact.dealsLabel": "सक्रिय स्थानिक विक्रेता व्यवहार",
    "impact.dealsSub": "15 किमी परिसरात पूर्ण होत आहेत",

    "dashboard.freshNearYou": "तुमच्या जवळचा ताजा माल",
    "dashboard.heroTitle": "तुमचे पीक, थेट खरेदीदारांपर्यंत",
    "dashboard.heroDescription":
        "एका मिनिटापेक्षा कमी वेळात तुमचे पीक नोंदवा. जवळचे विक्रेते ते लगेच पाहतील — दलाल नाही, वाट पाहणे नाही.",
    "dashboard.postNewHarvest": "नवीन पीक नोंदवा",

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
    "feed.noResults": "सध्या या फिल्टरशी जुळणारी कोणतीही यादी नाही. अंतराची मर्यादा वाढवून पहा.",
    "feed.call": "कॉल करा",
    "feed.whatsapp": "व्हॉट्सअ‍ॅप",
    "feed.bookBulk": "मोठ्या प्रमाणात साठा बुक करा",
    "feed.by": "द्वारे",
    "feed.organicBadge": "सेंद्रिय",

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
    "modal.nearbyBuyers": "सुमारे 12 किमी परिसरातील खरेदीदारांना हे लगेच दिसेल",

    "category.tomato": "टोमॅटो",
    "category.potato": "बटाटा",
    "category.onion": "कांदा",
    "category.leafy-greens": "पालेभाजी",
    "category.fruits": "फळे",
    "category.grains": "धान्य",

    "voice.title": "आवाजाने नोंद",
    "voice.notSupported":
        "या ब्राउझरमध्ये आवाज इनपुट समर्थित नाही. कृपया तुमच्या पिकाचा तपशील टाइप करा.",
    "voice.placeholder": "तुमचे शब्द इथे दिसतील",
    "voice.useThis": "ही नोंद वापरा",
    "voice.prompt": "टॅप करा आणि तुमचे पीक, प्रमाण आणि किंमत सांगा",
};

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en, hi, mr };

/** Maps a Language to the BCP-47 tag the Web Speech API expects. */
export const SPEECH_LANG_CODE: Record<Language, string> = {
    en: "en-IN",
    hi: "hi-IN",
    mr: "mr-IN",
};

interface LanguageContextValue {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    const t = (key: TranslationKey, vars?: Record<string, string | number>) => {
        let str: string = dictionaries[language][key] ?? dictionaries.en[key] ?? key;
        if (vars) {
            for (const [k, v] of Object.entries(vars)) {
                str = str.replace(`{{${k}}}`, String(v));
            }
        }
        return str;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

/** Pull the active language, the setter, and the t() translator from anywhere in the tree. */
export function useTranslation() {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("useTranslation must be called within a <LanguageProvider>");
    }
    return ctx;
}
