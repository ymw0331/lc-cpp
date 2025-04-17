export const getCarouselImages = (language: string) => {
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

