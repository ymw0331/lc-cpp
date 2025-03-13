'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Building, Loader2, CheckCircle, XCircle, Phone } from "lucide-react";
import { resellerApi } from "@/api/reseller/reseller.api";
import { useAuth, EnhancedAuthUser } from "@/contexts/AuthContext";
import { storage } from "@/lib/storage";
import RegistrationSuccessDialog from "@/components/Dialogs/RegistrationSuccessDialog";
import LanguageSwitcher from "@/components/Header/LanguageSwitcher";
import Loader from "@/components/common/Loader";
import TermsAgreementDialog from "@/components/Dialogs/TermsAgreenmentDialog";


type TranslationLanguage = 'zh' | 'zh-hk';

interface CountryTranslation {
    zh: string;
    "zh-hk": string;
}

interface CountriesData {
    [country: string]: CountryTranslation;
}

interface CarouselImage {
    src: string;
    alt: string;
}

interface UserInfo {
    userId?: number;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    country_code?: number;
}

interface FormData {
    referralId: string;
    fullName: string;
    email: string;
    contactNo: string;
    coreMarket: string;
    agreeToTerms: boolean;
}


const getCarouselImages = (language: string) => {
    switch (language) {
        case 'zh':
            return [
                {
                    src: "/images/login/zh-simplified/slider-01.jpg",
                    alt: "每次推荐最高可赚取80美元",
                },
                {
                    src: "/images/login/zh-simplified/slider-02.jpg",
                    alt: "轻松赚取奖励",
                },
                {
                    src: "/images/login/zh-simplified/slider-03.jpg",
                    alt: "无需护照",
                },
                {
                    src: "/images/login/zh-simplified/slider-04.jpg",
                    alt: "独家限时优惠",
                },
                {
                    src: "/images/login/zh-simplified/slider-05.jpg",
                    alt: "独家限时优惠",
                },
            ];
        case 'zh-hk':
            return [
                {
                    src: "/images/login/zh-traditional/slider-01.jpg",
                    alt: "每次推薦最高可賺取80美元",
                },
                {
                    src: "/images/login/zh-traditional/slider-02.jpg",
                    alt: "輕鬆賺取獎勵",
                },
                {
                    src: "/images/login/zh-traditional/slider-03.jpg",
                    alt: "無需護照",
                },
                {
                    src: "/images/login/zh-traditional/slider-04.jpg",
                    alt: "獨家限時優惠",
                },
                {
                    src: "/images/login/zh-traditional/slider-05.jpg",
                    alt: "獨家限時優惠",
                },
            ];
        default: // 'en'
            return [
                {
                    src: "/images/login/en/slider-01.jpg",
                    alt: "Earn Up to $80 Per Referral",
                },
                {
                    src: "/images/login/en/slider-02.jpg",
                    alt: "Earn Rewards Effortlessly",
                },
                {
                    src: "/images/login/en/slider-03.jpg",
                    alt: "No Passport Fret Not",
                },
                {
                    src: "/images/login/en/slider-04.jpg",
                    alt: "Exclusive Limited Offer",
                },
                {
                    src: "/images/login/en/slider-05.jpg",
                    alt: "Exclusive Limited Offer",
                },
            ];
    }
};

// Countries data with translations
const countries: CountriesData = {
    "Afghanistan": { zh: "阿富汗", "zh-hk": "阿富汗" },
    "Albania": { zh: "阿尔巴尼亚", "zh-hk": "阿爾巴尼亞" },
    "Algeria": { zh: "阿尔及利亚", "zh-hk": "阿爾及利亞" },
    "Andorra": { zh: "安道尔", "zh-hk": "安道爾" },
    "Angola": { zh: "安哥拉", "zh-hk": "安哥拉" },
    "Antigua and Barbuda": { zh: "安提瓜和巴布达", "zh-hk": "安提瓜和巴布達" },
    "Argentina": { zh: "阿根廷", "zh-hk": "阿根廷" },
    "Armenia": { zh: "亚美尼亚", "zh-hk": "亞美尼亞" },
    "Australia": { zh: "澳大利亚", "zh-hk": "澳大利亞" },
    "Austria": { zh: "奥地利", "zh-hk": "奧地利" },
    "Azerbaijan": { zh: "阿塞拜疆", "zh-hk": "阿塞拜疆" },
    "Bahamas": { zh: "巴哈马", "zh-hk": "巴哈馬" },
    "Bahrain": { zh: "巴林", "zh-hk": "巴林" },
    "Bangladesh": { zh: "孟加拉国", "zh-hk": "孟加拉國" },
    "Barbados": { zh: "巴巴多斯", "zh-hk": "巴巴多斯" },
    "Belarus": { zh: "白俄罗斯", "zh-hk": "白俄羅斯" },
    "Belgium": { zh: "比利时", "zh-hk": "比利時" },
    "Belize": { zh: "伯利兹", "zh-hk": "伯利茲" },
    "Benin": { zh: "贝宁", "zh-hk": "貝寧" },
    "Bhutan": { zh: "不丹", "zh-hk": "不丹" },
    "Bolivia": { zh: "玻利维亚", "zh-hk": "玻利維亞" },
    "Bosnia and Herzegovina": { zh: "波斯尼亚和黑塞哥维那", "zh-hk": "波斯尼亞和黑塞哥維那" },
    "Botswana": { zh: "博茨瓦纳", "zh-hk": "博茨瓦納" },
    "Brazil": { zh: "巴西", "zh-hk": "巴西" },
    "Brunei": { zh: "文莱", "zh-hk": "文萊" },
    "Bulgaria": { zh: "保加利亚", "zh-hk": "保加利亞" },
    "Burkina Faso": { zh: "布基纳法索", "zh-hk": "布基納法索" },
    "Burundi": { zh: "布隆迪", "zh-hk": "布隆迪" },
    "Cabo Verde": { zh: "佛得角", "zh-hk": "佛得角" },
    "Cambodia": { zh: "柬埔寨", "zh-hk": "柬埔寨" },
    "Cameroon": { zh: "喀麦隆", "zh-hk": "喀麥隆" },
    "Canada": { zh: "加拿大", "zh-hk": "加拿大" },
    "Central African Republic": { zh: "中非共和国", "zh-hk": "中非共和國" },
    "Chad": { zh: "乍得", "zh-hk": "乍得" },
    "Chile": { zh: "智利", "zh-hk": "智利" },
    "China": { zh: "中国", "zh-hk": "中國" },
    "Colombia": { zh: "哥伦比亚", "zh-hk": "哥倫比亞" },
    "Comoros": { zh: "科摩罗", "zh-hk": "科摩羅" },
    "Congo (Congo-Brazzaville)": { zh: "刚果（布拉柴维尔）", "zh-hk": "剛果（布拉柴維爾）" },
    "Congo (Democratic Republic of the)": { zh: "刚果民主共和国", "zh-hk": "剛果民主共和國" },
    "Costa Rica": { zh: "哥斯达黎加", "zh-hk": "哥斯達黎加" },
    "Croatia": { zh: "克罗地亚", "zh-hk": "克羅地亞" },
    "Cuba": { zh: "古巴", "zh-hk": "古巴" },
    "Cyprus": { zh: "塞浦路斯", "zh-hk": "塞浦路斯" },
    "Czechia (Czech Republic)": { zh: "捷克", "zh-hk": "捷克" },
    "Denmark": { zh: "丹麦", "zh-hk": "丹麥" },
    "Djibouti": { zh: "吉布提", "zh-hk": "吉布提" },
    "Dominica": { zh: "多米尼克", "zh-hk": "多米尼克" },
    "Dominican Republic": { zh: "多米尼加共和国", "zh-hk": "多米尼加共和國" },
    "Ecuador": { zh: "厄瓜多尔", "zh-hk": "厄瓜多爾" },
    "Egypt": { zh: "埃及", "zh-hk": "埃及" },
    "El Salvador": { zh: "萨尔瓦多", "zh-hk": "薩爾瓦多" },
    "Equatorial Guinea": { zh: "赤道几内亚", "zh-hk": "赤道幾內亞" },
    "Eritrea": { zh: "厄立特里亚", "zh-hk": "厄立特里亞" },
    "Estonia": { zh: "爱沙尼亚", "zh-hk": "愛沙尼亞" },
    "Eswatini (Swaziland)": { zh: "斯威士兰", "zh-hk": "斯威士蘭" },
    "Ethiopia": { zh: "埃塞俄比亚", "zh-hk": "埃塞俄比亞" },
    "Fiji": { zh: "斐济", "zh-hk": "斐濟" },
    "Finland": { zh: "芬兰", "zh-hk": "芬蘭" },
    "France": { zh: "法国", "zh-hk": "法國" },
    "Gabon": { zh: "加蓬", "zh-hk": "加蓬" },
    "Gambia": { zh: "冈比亚", "zh-hk": "岡比亞" },
    "Georgia": { zh: "格鲁吉亚", "zh-hk": "格魯吉亞" },
    "Germany": { zh: "德国", "zh-hk": "德國" },
    "Ghana": { zh: "加纳", "zh-hk": "加納" },
    "Greece": { zh: "希腊", "zh-hk": "希臘" },
    "Grenada": { zh: "格林纳达", "zh-hk": "格林納達" },
    "Guatemala": { zh: "危地马拉", "zh-hk": "危地馬拉" },
    "Guinea": { zh: "几内亚", "zh-hk": "幾內亞" },
    "Guinea-Bissau": { zh: "几内亚比绍", "zh-hk": "幾內亞比紹" },
    "Guyana": { zh: "圭亚那", "zh-hk": "圭亞那" },
    "Haiti": { zh: "海地", "zh-hk": "海地" },
    "Honduras": { zh: "洪都拉斯", "zh-hk": "洪都拉斯" },
    "Hong Kong": { zh: "香港", "zh-hk": "香港" },
    "Hungary": { zh: "匈牙利", "zh-hk": "匈牙利" },
    "Iceland": { zh: "冰岛", "zh-hk": "冰島" },
    "India": { zh: "印度", "zh-hk": "印度" },
    "Indonesia": { zh: "印度尼西亚", "zh-hk": "印度尼西亞" },
    "Iran": { zh: "伊朗", "zh-hk": "伊朗" },
    "Iraq": { zh: "伊拉克", "zh-hk": "伊拉克" },
    "Ireland": { zh: "爱尔兰", "zh-hk": "愛爾蘭" },
    "Israel": { zh: "以色列", "zh-hk": "以色列" },
    "Italy": { zh: "意大利", "zh-hk": "意大利" },
    "Jamaica": { zh: "牙买加", "zh-hk": "牙買加" },
    "Japan": { zh: "日本", "zh-hk": "日本" },
    "Jordan": { zh: "约旦", "zh-hk": "約旦" },
    "Kazakhstan": { zh: "哈萨克斯坦", "zh-hk": "哈薩克斯坦" },
    "Kenya": { zh: "肯尼亚", "zh-hk": "肯尼亞" },
    "Kiribati": { zh: "基里巴斯", "zh-hk": "基里巴斯" },
    "Korea (North)": { zh: "朝鲜", "zh-hk": "朝鮮" },
    "Korea (South)": { zh: "韩国", "zh-hk": "韓國" },
    "Kuwait": { zh: "科威特", "zh-hk": "科威特" },
    "Kyrgyzstan": { zh: "吉尔吉斯斯坦", "zh-hk": "吉爾吉斯斯坦" },
    "Laos": { zh: "老挝", "zh-hk": "老撾" },
    "Latvia": { zh: "拉脱维亚", "zh-hk": "拉脫維亞" },
    "Lebanon": { zh: "黎巴嫩", "zh-hk": "黎巴嫩" },
    "Lesotho": { zh: "莱索托", "zh-hk": "萊索托" },
    "Liberia": { zh: "利比里亚", "zh-hk": "利比里亞" },
    "Libya": { zh: "利比亚", "zh-hk": "利比亞" },
    "Liechtenstein": { zh: "列支敦士登", "zh-hk": "列支敦士登" },
    "Lithuania": { zh: "立陶宛", "zh-hk": "立陶宛" },
    "Luxembourg": { zh: "卢森堡", "zh-hk": "盧森堡" },
    "Madagascar": { zh: "马达加斯加", "zh-hk": "馬達加斯加" },
    "Malawi": { zh: "马拉维", "zh-hk": "馬拉維" },
    "Malaysia": { zh: "马来西亚", "zh-hk": "馬來西亞" },
    "Maldives": { zh: "马尔代夫", "zh-hk": "馬爾代夫" },
    "Mali": { zh: "马里", "zh-hk": "馬里" },
    "Malta": { zh: "马耳他", "zh-hk": "馬耳他" },
    "Marshall Islands": { zh: "马绍尔群岛", "zh-hk": "馬紹爾群島" },
    "Mauritania": { zh: "毛里塔尼亚", "zh-hk": "毛里塔尼亞" },
    "Mauritius": { zh: "毛里求斯", "zh-hk": "毛里求斯" },
    "Mexico": { zh: "墨西哥", "zh-hk": "墨西哥" },
    "Micronesia": { zh: "密克罗尼西亚", "zh-hk": "密克羅尼西亞" },
    "Moldova": { zh: "摩尔多瓦", "zh-hk": "摩爾多瓦" },
    "Monaco": { zh: "摩纳哥", "zh-hk": "摩納哥" },
    "Mongolia": { zh: "蒙古", "zh-hk": "蒙古" },
    "Montenegro": { zh: "黑山", "zh-hk": "黑山" },
    "Morocco": { zh: "摩洛哥", "zh-hk": "摩洛哥" },
    "Mozambique": { zh: "莫桑比克", "zh-hk": "莫桑比克" },
    "Myanmar (Burma)": { zh: "缅甸", "zh-hk": "緬甸" },
    "Namibia": { zh: "纳米比亚", "zh-hk": "納米比亞" },
    "Nauru": { zh: "瑙鲁", "zh-hk": "瑙魯" },
    "Nepal": { zh: "尼泊尔", "zh-hk": "尼泊爾" },
    "Netherlands": { zh: "荷兰", "zh-hk": "荷蘭" },
    "New Zealand": { zh: "新西兰", "zh-hk": "新西蘭" },
    "Nicaragua": { zh: "尼加拉瓜", "zh-hk": "尼加拉瓜" },
    "Niger": { zh: "尼日尔", "zh-hk": "尼日爾" },
    "Nigeria": { zh: "尼日利亚", "zh-hk": "尼日利亞" },
    "North Macedonia (Macedonia)": { zh: "北马其顿", "zh-hk": "北馬其頓" },
    "Norway": { zh: "挪威", "zh-hk": "挪威" },
    "Oman": { zh: "阿曼", "zh-hk": "阿曼" },
    "Pakistan": { zh: "巴基斯坦", "zh-hk": "巴基斯坦" },
    "Palau": { zh: "帕劳", "zh-hk": "帕勞" },
    "Palestine State": { zh: "巴勒斯坦", "zh-hk": "巴勒斯坦" },
    "Panama": { zh: "巴拿马", "zh-hk": "巴拿馬" },
    "Papua New Guinea": { zh: "巴布亚新几内亚", "zh-hk": "巴布亞新幾內亞" },
    "Paraguay": { zh: "巴拉圭", "zh-hk": "巴拉圭" },
    "Peru": { zh: "秘鲁", "zh-hk": "秘魯" },
    "Philippines": { zh: "菲律宾", "zh-hk": "菲律賓" },
    "Poland": { zh: "波兰", "zh-hk": "波蘭" },
    "Portugal": { zh: "葡萄牙", "zh-hk": "葡萄牙" },
    "Qatar": { zh: "卡塔尔", "zh-hk": "卡塔爾" },
    "Romania": { zh: "罗马尼亚", "zh-hk": "羅馬尼亞" },
    "Russia": { zh: "俄罗斯", "zh-hk": "俄羅斯" },
    "Rwanda": { zh: "卢旺达", "zh-hk": "盧旺達" },
    "Saint Kitts and Nevis": { zh: "圣基茨和尼维斯", "zh-hk": "聖基茨和尼維斯" },
    "Saint Lucia": { zh: "圣卢西亚", "zh-hk": "聖盧西亞" },
    "Saint Vincent and the Grenadines": { zh: "圣文森特和格林纳丁斯", "zh-hk": "聖文森特和格林納丁斯" },
    "Samoa": { zh: "萨摩亚", "zh-hk": "薩摩亞" },
    "San Marino": { zh: "圣马力诺", "zh-hk": "聖馬力諾" },
    "Sao Tome and Principe": { zh: "圣多美和普林西比", "zh-hk": "聖多美和普林西比" },
    "Saudi Arabia": { zh: "沙特阿拉伯", "zh-hk": "沙特阿拉伯" },
    "Senegal": { zh: "塞内加尔", "zh-hk": "塞內加爾" },
    "Serbia": { zh: "塞尔维亚", "zh-hk": "塞爾維亞" },
    "Seychelles": { zh: "塞舌尔", "zh-hk": "塞舌爾" },
    "Sierra Leone": { zh: "塞拉利昂", "zh-hk": "塞拉利昂" },
    "Singapore": { zh: "新加坡", "zh-hk": "新加坡" },
    "Slovakia": { zh: "斯洛伐克", "zh-hk": "斯洛伐克" },
    "Slovenia": { zh: "斯洛文尼亚", "zh-hk": "斯洛文尼亞" },
    "Solomon Islands": { zh: "所罗门群岛", "zh-hk": "所羅門群島" },
    "Somalia": { zh: "索马里", "zh-hk": "索馬里" },
    "South Africa": { zh: "南非", "zh-hk": "南非" },
    "South Sudan": { zh: "南苏丹", "zh-hk": "南蘇丹" },
    "Spain": { zh: "西班牙", "zh-hk": "西班牙" },
    "Sri Lanka": { zh: "斯里兰卡", "zh-hk": "斯里蘭卡" },
    "Sudan": { zh: "苏丹", "zh-hk": "蘇丹" },
    "Suriname": { zh: "苏里南", "zh-hk": "蘇里南" },
    "Sweden": { zh: "瑞典", "zh-hk": "瑞典" },
    "Switzerland": { zh: "瑞士", "zh-hk": "瑞士" },
    "Syria": { zh: "叙利亚", "zh-hk": "敘利亞" },
    "Tajikistan": { zh: "塔吉克斯坦", "zh-hk": "塔吉克斯坦" },
    "Taiwan": { zh: "台湾", "zh-hk": "台灣" },
    "Tanzania": { zh: "坦桑尼亚", "zh-hk": "坦桑尼亞" },
    "Thailand": { zh: "泰国", "zh-hk": "泰國" },
    "Timor-Leste": { zh: "东帝汶", "zh-hk": "東帝汶" },
    "Togo": { zh: "多哥", "zh-hk": "多哥" },
    "Tonga": { zh: "汤加", "zh-hk": "湯加" },
    "Trinidad and Tobago": { zh: "特立尼达和多巴哥", "zh-hk": "特立尼達和多巴哥" },
    "Tunisia": { zh: "突尼斯", "zh-hk": "突尼斯" },
    "Turkey": { zh: "土耳其", "zh-hk": "土耳其" },
    "Turkmenistan": { zh: "土库曼斯坦", "zh-hk": "土庫曼斯坦" },
    "Tuvalu": { zh: "图瓦卢", "zh-hk": "圖瓦盧" },
    "Uganda": { zh: "乌干达", "zh-hk": "烏干達" },
    "Ukraine": { zh: "乌克兰", "zh-hk": "烏克蘭" },
    "United Arab Emirates": { zh: "阿拉伯联合酋长国", "zh-hk": "阿拉伯聯合酋長國" },
    "United Kingdom": { zh: "英国", "zh-hk": "英國" },
    "United States of America": { zh: "美国", "zh-hk": "美國" },
    "Uruguay": { zh: "乌拉圭", "zh-hk": "烏拉圭" },
    "Uzbekistan": { zh: "乌兹别克斯坦", "zh-hk": "烏茲別克斯坦" },
    "Vanuatu": { zh: "瓦努阿图", "zh-hk": "瓦努阿圖" },
    "Vatican City (Holy See)": { zh: "梵蒂冈", "zh-hk": "梵蒂岡" },
    "Venezuela": { zh: "委内瑞拉", "zh-hk": "委內瑞拉" },
    "Vietnam": { zh: "越南", "zh-hk": "越南" },
    "Yemen": { zh: "也门", "zh-hk": "也門" },
    "Zambia": { zh: "赞比亚", "zh-hk": "贊比亞" },
    "Zimbabwe": { zh: "津巴布韦", "zh-hk": "津巴布韋" }
};


export default function RegisterPage() {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { user, refreshUserData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [carouselImages, setCarouselImages] = useState(getCarouselImages(i18n.language));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(true);
    const [isLoadingUserData, setIsLoadingUserData] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | EnhancedAuthUser | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showTermsDialog, setShowTermsDialog] = useState(false);

    // DEFAULT REFERRAL VALUES - Used when no parameters are provided
    const DEFAULT_UPSTREAM_ID = "f73fbbc5-b17d-43ec-b67e-141f05394a7f";


    // Track which fields were prefilled from login data
    const [prefilledFields, setPrefilledFields] = useState({
        email: true, // Email is always prefilled and readonly
        fullName: false,
        contactNo: false,
        referralId: false
    });

    // Update the form state initialization to use N/A for null values
    const [formData, setFormData] = useState({
        referralId: "N/A", // Default to N/A
        fullName: "N/A",
        email: "N/A",
        contactNo: "N/A",
        coreMarket: "",
        agreeToTerms: false
    });

    // Then update the getLocalizedCountryName function
    const getLocalizedCountryName = (countryKey: string): string => {
        if (!countryKey) return "";

        const currentLang = i18n.language;
        if (currentLang === 'zh' || currentLang === 'zh-hk') {
            // Use the more specific type for translation lookup
            const lang = currentLang as TranslationLanguage;
            return countries[countryKey]?.[lang] || countryKey;
        }
        return countryKey;
    };

    // Update carousel images when language changes
    useEffect(() => {
        setCarouselImages(getCarouselImages(i18n.language));
    }, [i18n.language]);

    // Enhanced URL parameter handling to prioritize upstreamId
    useEffect(() => {
        const referralCode = searchParams.get('referralCode');
        const upstreamId = searchParams.get('upstreamId');

        console.log('[Register] Processing URL parameters:', {
            referralCode,
            upstreamId
        });

        // If we have an upstreamId, update the form immediately
        if (upstreamId) {
            // Mark referralId as prefilled
            setPrefilledFields(prev => ({
                ...prev,
                referralId: true
            }));

            setFormData(prev => ({
                ...prev,
                referralId: upstreamId
            }));
            console.log('[Register] Setting referral ID from URL:', upstreamId);
        } else {
            // Use default if no upstreamId in URL
            setFormData(prev => ({
                ...prev,
                referralId: DEFAULT_UPSTREAM_ID
            }));
            console.log('[Register] Setting default referral ID:', DEFAULT_UPSTREAM_ID);
        }

    }, [searchParams]);

    // Modified function to set user data in the form with "N/A" fallbacks
    const setUserDataInForm = (userData: any) => {
        if (!userData) return;

        const upstreamIdFromURL = searchParams.get('upstreamId');

        const referralId = upstreamIdFromURL || DEFAULT_UPSTREAM_ID;

        console.log('[Register] Setting user data with upstreamId:', referralId);

        // Mark fields as prefilled
        setPrefilledFields({
            email: true,
            fullName: true,
            contactNo: true,
            referralId: true
        });

        setFormData(prev => ({
            ...prev,
            email: userData.email || "N/A",
            fullName: userData.fullName || "N/A",
            contactNo: userData.phoneNumber || "N/A",
            referralId: referralId
        }));
    };

    // Function to extract user info directly from localStorage auth_token
    const getUserInfoFromToken = () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) return null;

            // JWT tokens are split into 3 parts by dots
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            // The middle part contains the payload, which is base64 encoded
            const payload = parts[1];

            // Decode the base64 payload (need to fix padding)
            const paddedPayload = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
            const decodedPayload = atob(paddedPayload);

            // Parse the JSON payload
            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('[Register] Error extracting info from token:', error);
            return null;
        }
    };

    // Function to get user info from response data format (direct API response)
    const extractUserDataFromLoginResponse = (responseData: any) => {
        if (!responseData) return null;
        return {
            userId: responseData.userId,
            email: responseData.email,
            fullName: responseData.fullName,
            phoneNumber: responseData.phoneNumber,
            country_code: responseData.country_code
        };
    };

    const fetchUserFromToken = async () => {
        try {
            setIsLoadingUserData(true);
            console.log('[Register] Checking for auth token...');
            const token = storage.getToken();

            if (!token) {
                console.log('[Register] No auth token found, redirecting to login');
                // Get referral details before redirecting
                const referralCode = searchParams.get('referralCode');
                const upstreamId = searchParams.get('upstreamId');

                const queryParams = new URLSearchParams();
                if (referralCode) {
                    queryParams.set('referralCode', referralCode);
                }
                if (upstreamId) {
                    queryParams.set('upstreamId', upstreamId);
                }


                router.push(`/auth/login?${queryParams.toString()}`);
                return false;
            }

            // Attempt to get user data from storage
            const storedUser = storage.getUser();
            console.log('[Register] Stored user:', storedUser);

            // Attempt to extract info from token directly
            const tokenInfo = getUserInfoFromToken();
            console.log('[Register] Token info:', tokenInfo);

            // Set userInfo from the best available source
            let bestUserInfo = null;
            if (storedUser) {
                bestUserInfo = storedUser;
                console.log('[Register] Using stored user data');
            } else if (tokenInfo) {
                bestUserInfo = {
                    email: tokenInfo.email,
                    fullName: tokenInfo.name || tokenInfo.full_name || 'N/A',
                    phoneNumber: tokenInfo.phone_number || 'N/A'
                };
                console.log('[Register] Using token info data');
            }

            setUserInfo(bestUserInfo);

            if (bestUserInfo) {
                console.log('[Register] Setting form data from user info:', bestUserInfo);
                setUserDataInForm(bestUserInfo);
                return true;
            }

            // Last resort - use only email from token if we couldn't get full user info
            if (tokenInfo && tokenInfo.email) {
                console.log('[Register] Using only email from token:', tokenInfo.email);

                // Mark email as prefilled
                setPrefilledFields(prev => ({
                    ...prev,
                    email: true
                }));

                setFormData(prev => ({
                    ...prev,
                    email: tokenInfo.email,
                    fullName: "N/A",
                    contactNo: "N/A"
                }));
                return true;
            }

            console.log('[Register] Could not get user data, redirecting to login');
            router.push('/auth/login');
            return false;

        } catch (error) {
            console.error('[Register] Error fetching user data:', error);
            // Handle error and redirect
            // const referralDetails = storage.getReferralDetails();
            const referralCode = searchParams.get('referralCode');
            const upstreamId = searchParams.get('upstreamId');

            const queryParams = new URLSearchParams();
            if (referralCode) {
                queryParams.set('referralCode', referralCode);
            }
            if (upstreamId) {
                queryParams.set('upstreamId', upstreamId);
            }
            router.push(`/auth/login?${queryParams.toString()}`);
            return false;
        } finally {
            setIsLoadingUserData(false);
        }
    };

    useEffect(() => {
        console.log('[Register] Checking for user info...');

        if (user) {
            console.log('[Register] User data available from context:', user);
            setUserInfo(user as EnhancedAuthUser);

            // Mark fields as prefilled
            setPrefilledFields({
                email: true,
                fullName: true,
                contactNo: true,
                referralId: true
            });

            setFormData(prev => ({
                ...prev,
                email: user.email || "N/A",
                fullName: user.fullName || "N/A",
                contactNo: user.phoneNumber || "N/A"
            }));
            setIsLoadingUserData(false);
        } else {
            console.log('[Register] No user data in context, trying to extract from other sources');
            fetchUserFromToken();
        }
        // Include in dependency array so it runs once
    }, [user, router]);

    // Carousel Auto-rotation
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === carouselImages.length - 1 ? 0 : prev + 1
            );
        }, 10000);

        return () => clearInterval(timer);
    }, [carouselImages]);

    // Form input handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(`[Register] Field '${name}' changed:`, { value });
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle select change
    const handleSelectChange = (name: string, value: string) => {
        console.log(`[Register] Field '${name}' changed:`, { value });
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSuccessDone = () => {
        console.log('[Register] Success dialog done clicked');
        // router.push('/');
        setShowSuccessDialog(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        console.log('[Register] Starting registration process:', {
            formData
        });

        // Get upstreamId directly from URL, fallback to form data
        const urlUpstreamId = searchParams.get('upstreamId');
        const finalUpstreamId = urlUpstreamId || formData.referralId || DEFAULT_UPSTREAM_ID;

        try {
            // Check if we have auth token
            const token = storage.getToken();
            if (!token) {
                console.error('[Register] No auth token found');
                throw new Error('Please login first as a Lookcard user');
            }

            // Validate required fields
            if (!formData.coreMarket) {
                throw new Error('Please select your key market');
            }

            if (!formData.agreeToTerms) {
                throw new Error('Please agree to the terms and conditions');
            }

            // Prepare the request payload with only the required fields
            const requestData = {
                upstreamId: finalUpstreamId,
                keyMarket: formData.coreMarket
            };

            console.log('[Register] Sending registration request with data:', requestData);

            // Call the updated registerReseller method with the request data
            const response = await resellerApi.registerReseller(requestData);
            console.log('[Register] Registration response:', response);

            // Check if response has status true
            if (response && response.status === true) {
                console.log('[Register] Registration successful with status:', response.status);

                // Refresh user data to get updated reseller status
                console.log('[Register] Refreshing user data');
                await refreshUserData();

                // Set persistent success message
                setSuccessMessage(t("registerPage.successfullyRegistered") ||
                    "You have successfully registered as a reseller. Your account is now pending approval. This process typically takes up to 3 days. We'll notify you once your account is approved.");

                console.log('[Register] Showing success toast');
                toast({
                    title: t("registerPage.success") || "Success",
                    description: t("registerPage.successfullyRegistered") || "You have successfully registered as a reseller",
                    duration: 3000,
                });


                // Show success dialog
                setShowSuccessDialog(true);

            } else {
                // Status not true means registration failed
                console.error('[Register] Registration failed: Response status not true', response);
                throw new Error('Registration failed. Please try again.');
            }

        } catch (err: any) {
            console.error('[Register] Registration failed:', err);

            // Safely extract error message with fallbacks
            let errorMessage = "Registration failed. Please try again.";

            if (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
            }

            // Set the error message state
            setError(errorMessage);

            // Show error toast
            console.log('[Register] Showing error toast with message:', errorMessage);
            toast({
                variant: "destructive",
                title: t("registerPage.error") || "Error",
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
            console.log('[Register] Form submission complete');
        }
    };

    // Show loading state while fetching user data
    if (isLoadingUserData) {
        return (
            <div className="h-screen flex items-center justify-center bg-white dark:bg-boxdark">
                <div className="text-center">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white dark:bg-boxdark">
            {/* Language Switcher - Absolute positioned in top right */}
            <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>

            {/* Left Side - Carousel */}
            <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={carouselImages[currentImageIndex].src}
                            alt={carouselImages[currentImageIndex].alt}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                    {carouselImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-[45%] px-8 lg:px-16 flex flex-col justify-center bg-white dark:bg-boxdark">
                <div className="max-w-md w-full mx-auto">
                    {/* Logo */}
                    <div className="mb-8">
                        <Image
                            src="/images/logo/lookcard-logo.png"
                            alt="Lookcard Logo"
                            width={150}
                            height={30}
                            className="mb-8"
                        />
                    </div>

                    <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
                        {t("registerPage.signUpNow") || "SIGN UP NOW"}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Address */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.emailAddress") || "EMAIL ADDRESS:"}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    className="mt-1 bg-gray-100 text-gray-800 border-gray-300 cursor-not-allowed"
                                    placeholder={t("registerPage.enterEmail") || "Please enter your registered email address in lookcard.io platform account"}
                                    readOnly={true} // Always readonly
                                />
                                <Mail className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Member Verification */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.memberVerification") || "MEMBER VERIFICATION:"}
                            </label>
                            <div className="flex mt-1 space-x-4">
                                <div className={`flex-1 border rounded-md px-4 py-2 flex items-center justify-center space-x-2 ${isEmailVerified ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                                    <span className="text-sm">{t("registerPage.emailVerified") || "Email Verified"}</span>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div className={`flex-1 border rounded-md px-4 py-2 flex items-center justify-center space-x-2 ${!isEmailVerified ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-300'}`}>
                                    <span className="text-sm">{t("registerPage.emailMismatch") || "Email Mismatch"}</span>
                                    <XCircle className={`h-5 w-5 ${!isEmailVerified ? 'text-red-500' : 'text-gray-300'}`} />
                                </div>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.fullName") || "FULL NAME:"}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`mt-1 ${prefilledFields.fullName ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} text-gray-800 border-gray-300`}
                                    placeholder={t("registerPage.enterFullName") || "Upon verification, auto filled and not editable"}
                                    readOnly={prefilledFields.fullName} // Readonly if prefilled
                                />
                                <User className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Contact No */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.contactNo") || "CONTACT NO:"}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="contactNo"
                                    value={formData.contactNo}
                                    onChange={handleInputChange}
                                    className={`mt-1 ${prefilledFields.contactNo ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} text-gray-800 border-gray-300`}
                                    placeholder={t("registerPage.enterPhoneNumber") || "Please enter your phone number"}
                                    readOnly={prefilledFields.contactNo} // Readonly if prefilled
                                />
                                <Phone className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Core Market - Dropdown */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.proposedKeyMarket") || "PROPOSED KEY MARKET:"}
                            </label>
                            <div className="relative mt-1">
                                <Select
                                    value={formData.coreMarket}
                                    onValueChange={(value) => handleSelectChange("coreMarket", value)}
                                    required
                                >
                                    <SelectTrigger className="w-full bg-white text-gray-800 border-gray-300 h-10 bg-opacity-100 !fill-none !bg-clip-border">
                                        <SelectValue placeholder={t("registerPage.selectMarket") || "Select Your Preferred Market"} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80 bg-white">
                                        {Object.keys(countries).map((country) => (
                                            <SelectItem key={country} value={country} className="bg-white hover:bg-gray-100">
                                                {getLocalizedCountryName(country)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Referral ID */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.referralId") || "REFERRAL ID:"}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="referralId"
                                    value={formData.referralId}
                                    className="mt-1 bg-gray-100 text-gray-800 border-gray-300 cursor-not-allowed"
                                    readOnly={true} // Always readonly
                                />
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="pt-4">
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="terms"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={(checked: boolean) =>
                                        setFormData(prev => ({ ...prev, agreeToTerms: checked }))
                                    }
                                    required
                                    className="mt-1"
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                >
                                    {(() => {
                                        // Get the full agreement text
                                        const fullText = t("registerPage.termsAgreementFull") ||
                                            "I agree to all the terms and conditions, including program terms, privacy policy, and consent to receive communication regarding this program.";

                                        // Find the position of the term to highlight
                                        const termToHighlight = t("termsDialog.title") ?
                                            (i18n.language === 'en' ? "terms and conditions" :
                                                i18n.language === 'zh' ? "条款和条件" :
                                                    i18n.language === 'zh-hk' ? "條款和條件" : "terms and conditions") :
                                            "terms and conditions";

                                        const termPosition = fullText.indexOf(termToHighlight);

                                        // If term not found, render the text as-is
                                        if (termPosition === -1) {
                                            return fullText;
                                        }

                                        // Split the text into three parts: before term, term, after term
                                        const beforeTerm = fullText.substring(0, termPosition);
                                        const afterTerm = fullText.substring(termPosition + termToHighlight.length);

                                        // Return the text with the term as a clickable button
                                        return (
                                            <>
                                                {beforeTerm}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTermsDialog(true)}
                                                    className="text-primary hover:underline font-medium"
                                                >
                                                    {termToHighlight}
                                                </button>
                                                {afterTerm}
                                            </>
                                        );
                                    })()}
                                </label>
                            </div>
                        </div>

                        {/* Terms Agreement Dialog */}
                        <TermsAgreementDialog
                            open={showTermsDialog}
                            onOpenChange={setShowTermsDialog}
                        />
                        {/* Error Display */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Success Message Display */}
                        {successMessage && (
                            <Alert variant="default" className="bg-green-50 border-green-300 text-green-800">
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}

                        <RegistrationSuccessDialog
                            open={showSuccessDialog}
                            onOpenChange={setShowSuccessDialog}
                            onDone={handleSuccessDone}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            disabled={isLoading || !formData.agreeToTerms}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("registerPage.processing")}
                                </>
                            ) : (
                                t("registerPage.signUp") || "Sign Up"
                            )}
                        </Button>

                        {/* Sign In Link */}
                        <div className="mt-4 text-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t("registerPage.alreadyReseller") || "Already a reseller?"}{" "}
                                <a
                                    href="/auth/login"
                                    className="text-primary hover:text-primary/80 underline font-medium"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Get referral details before redirecting
                                        const referralCode = searchParams.get('referralCode');
                                        const upstreamId = searchParams.get('upstreamId');

                                        const queryParams = new URLSearchParams();
                                        if (referralCode) {
                                            queryParams.set('referralCode', referralCode);
                                        }
                                        if (upstreamId) {
                                            queryParams.set('upstreamId', upstreamId);
                                        }
                                        router.push(`/auth/login${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
                                    }}
                                >
                                    {t("registerPage.signInHere") || "Sign in here"}
                                </a>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}