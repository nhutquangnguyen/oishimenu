'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.howItWorks': 'How it works',
    'nav.pricing': 'Pricing',
    'nav.testimonials': 'Testimonials',
    'nav.logIn': 'Log in',
    'nav.getAccess': 'Get Access Now',
    
    // Hero Section
    'hero.title': 'FREE Digital Menu That Boosts Sales',
    'hero.subtitle': 'Create your smart QR menu in 5 minutes. Start free, stay free. No setup fees, no credit card required.',
    'hero.placeholder': 'Enter your restaurant name...',
    'hero.button': 'Start Free Now',
    'hero.guarantee': '✓ FREE forever • ✓ 5-minute setup • ✓ Increase sales instantly',
    'hero.salesBoost': '+20%',
    'hero.salesBoostLabel': 'Sales boost',
    'hero.setupTime': '5 min',
    'hero.setupTimeLabel': 'Setup time',
    
    // Social Proof Section
    'socialProof.badge': 'Success Stories',
    'socialProof.testimonial': '"We set it up in 10 minutes. Our drink sales went up 20% in the first week!"',
    'socialProof.author': 'Café Owner, Early User',
    'socialProof.trustedByBadge': 'FREE for cafés, bars & restaurants worldwide',
    'socialProof.trustedBy': 'Trusted by cafés, bars & restaurants worldwide',
    
    // Value Props Section
    'valueProps.badge': '✨ Value Proposition',
    'valueProps.title': 'Why Choose Our Smart QR Menu?',
    'valueProps.subtitle': 'Everything you need to turn your menu into a powerful sales tool',
    'valueProps.feature1': '💡 Increase Revenue Instantly',
    'valueProps.feature1Desc': 'Recommend sides, drinks, and combos right inside your menu.',
    'valueProps.feature2': '⚡ 5-Minute Setup',
    'valueProps.feature2Desc': 'Build your menu, print your QR, and start selling — no training needed.',
    'valueProps.feature3': '💰 Low Cost, High Return',
    'valueProps.feature3Desc': 'One small subscription can add hundreds in extra monthly sales.',
    'valueProps.feature4': '🎨 Your Brand, Your Menu',
    'valueProps.feature4Desc': 'Upload your logo, pick your colors, and look professional.',
    'valueProps.feature5': '📊 Simple Insights',
    'valueProps.feature5Desc': 'See what customers click on most and update instantly.',
    
    // Features Section
    'features.title': 'Smart Upselling Features That Generate More Revenue',
    'features.subtitle': 'Transform your digital menu into a money-making machine with our intelligent upselling system.',
    'features.smartRecommendations': 'AI-Powered Smart Recommendations',
    'features.smartRecommendationsDesc': 'Machine learning algorithms analyze customer behavior to suggest dishes that increase order value by 35%',
    'features.promotionalDishes': 'Dynamic Promotional Dishes',
    'features.promotionalDishesDesc': 'Automatically highlight bestsellers and high-margin items to maximize revenue per customer',
    'features.upsellingEngine': 'Intelligent Upselling Engine',
    'features.upsellingEngineDesc': 'Smart prompts that suggest add-ons, drinks, and desserts at the perfect moment',
    'features.bundleDeals': 'Irresistible Bundle Deals',
    'features.bundleDealsDesc': 'Create combo offers that customers can\'t resist, increasing average order size by 40%',
    'features.noWebsiteTitle': 'No Money-Making Website? No Problem!',
    'features.noWebsiteDesc': 'We\'ll generate a fully functional restaurant website with online ordering that turns visitors into paying customers.',
    'features.website': 'Professional restaurant website',
    'features.ordering': 'Online ordering system',
    'features.mobile': 'Mobile-optimized design',
    'features.growth': '162% sales growth guaranteed',
    'features.preview': 'Live Preview: Your customers can browse your menu, place orders, and pay online - all from your professional website.',
    'features.yourWebsite': 'Your Restaurant Website',
    'features.completeOrdering': 'Complete with online ordering',
    'features.livePreview': 'Live Preview',
    
    // Benefits Section
    'benefits.title': 'Why 2,500+ Restaurants Choose OishiMenu',
    'benefits.subtitle': 'The easiest way to increase your restaurant\'s revenue with zero risk',
    'benefits.setup': '5-Minute Setup',
    'benefits.setupDesc': 'From signup to live menu in under 5 minutes. No technical skills required.',
    'benefits.setupHighlight': 'Fastest setup in the industry',
    'benefits.zeroCommissions': 'Zero Commissions',
    'benefits.zeroCommissionsDesc': 'Keep 100% of your revenue. No hidden fees, no monthly charges, no commissions.',
    'benefits.zeroCommissionsHighlight': 'Free forever',
    'benefits.revenueIncrease': '35% Revenue Increase',
    'benefits.revenueIncreaseDesc': 'Average restaurant sees 35% more revenue within 30 days of implementation.',
    'benefits.revenueIncreaseHighlight': 'Guaranteed results',
    'benefits.happyRestaurants': '2,500+ Happy Restaurants',
    'benefits.happyRestaurantsDesc': 'Join thousands of restaurants already using our system to increase their revenue.',
    'benefits.happyRestaurantsHighlight': 'Proven success',
    'benefits.aiUpselling': 'AI-Powered Upselling',
    'benefits.aiUpsellingDesc': 'Smart recommendations that automatically increase average order value by 40%.',
    'benefits.aiUpsellingHighlight': 'Works 24/7',
    'benefits.noRisk': 'No Risk, All Reward',
    'benefits.noRiskDesc': 'Free to use forever. No contracts, no commitments. Just results.',
    'benefits.noRiskHighlight': 'Risk-free',
    'benefits.readyTitle': 'Ready to Join the Success Stories?',
    'benefits.readyDesc': 'Start your 5-minute setup now and see your revenue increase within 30 days.',
    'benefits.averageRevenue': '35%',
    'benefits.averageRevenueDesc': 'Average revenue increase',
    
    // How It Works Section
    'howItWorks.badge': 'How It Works',
    'howItWorks.title': 'How to Boost Your Sales',
    'howItWorks.subtitle': 'Transform your menu into a powerful sales tool that increases revenue automatically.',
    'howItWorks.step1': 'Push Smart Options',
    'howItWorks.step1Desc': 'Automatically suggest add-ons, drinks, and upsells that customers actually want.',
    'howItWorks.step2': 'AI Recommendations',
    'howItWorks.step2Desc': 'Machine learning suggests the perfect items to boost every order value.',
    'howItWorks.step3': 'Easier Table Management',
    'howItWorks.step3Desc': 'Track orders, manage tables, and serve customers faster than ever before.',
    'howItWorks.ctaButton': 'Try It Free Now',
    'howItWorks.readyTitle': 'Ready to Start Making More Money?',
    'howItWorks.readyDesc': 'Join thousands of restaurants already using our system to increase their revenue.',
    'howItWorks.freeForever': 'Free forever',
    'howItWorks.fiveMinuteSetup': '5-minute setup',
    'howItWorks.noCoding': 'No coding required',
    
    // Testimonials Section
    'testimonials.title': 'Social Proof / Trust Builder',
    'testimonials.subtitle': 'Real results from real restaurants using our revenue-boosting system.',
    'testimonials.maria': '"We set it up in 10 minutes. Our drink sales went up 20% in the first week!" – Café Owner, Early User',
    'testimonials.james': '',
    'testimonials.sarah': '',
    
    // Pricing Section
    'pricing.badge': 'OishiMenu Pricing',
    'pricing.title': '14-Day Free Trial',
    'pricing.subtitle': 'Experience the Growth package with full features. After trial, account automatically switches to Starter (you can upgrade anytime).',
    'pricing.monthly': 'Monthly',
    'pricing.annually': 'Annually',
    'pricing.save2months': 'Save 2 months',
    'pricing.starterTitle': 'Starter',
    'pricing.starterPrice': 'Free',
    'pricing.starterPriceAnnual': 'Free',
    'pricing.starterPeriod': 'forever',
    'pricing.starterPeriodAnnual': 'forever',
    'pricing.starterButton': 'Get Starter',
    'pricing.starterDesc': 'Perfect for small cafes and restaurants looking to digitize their menu quickly and efficiently.',
    'pricing.starterFeature1': 'Free up to 1,500 orders/month (≈ 50 orders/day)',
    'pricing.starterFeature1Upgrade': '+$15/month to upgrade to 3,000 orders/month (≈ 100 orders/day)',
    'pricing.starterFeature2': 'Basic logo & color customization',
    'pricing.starterFeature3': 'Single QR code for menu',
    'pricing.starterFeature4': 'Create options & cross-sale suggestions',
    'pricing.starterFeature5': 'Basic dashboard (orders, scans)',
    'pricing.starterFeature6': 'Shows "Powered by OishiMenu" (+$15/month to remove)',
    'pricing.standardTitle': 'Standard',
    'pricing.standardPrice': '$59',
    'pricing.standardPriceAnnual': '$590',
    'pricing.standardPeriod': 'per month',
    'pricing.standardPeriodAnnual': 'per year',
    'pricing.standardButton': 'Get Standard',
    'pricing.standardDesc': 'Perfect for mid-sized restaurants wanting to optimize revenue and strengthen their brand.',
    'pricing.standardFeature1': 'Up to 6,000 orders/month (≈ 200 orders/day)',
    'pricing.standardFeature2': 'All Starter features',
    'pricing.standardFeature3': 'QR code for each table',
    'pricing.standardFeature4': 'Remove "Powered by OishiMenu" free',
    'pricing.standardFeature5': 'Advanced dashboard (bestsellers, cross-sale rates)',
    'pricing.standardFeature6': 'Priority email support',
    'pricing.growthTitle': 'Growth',
    'pricing.growthPrice': '$89',
    'pricing.growthPriceAnnual': '$890',
    'pricing.growthPeriod': 'per month',
    'pricing.growthPeriodAnnual': 'per year',
    'pricing.growthButton': 'Get Growth',
    'pricing.growthDesc': 'Perfect for restaurant chains and large establishments managing multiple locations.',
    'pricing.growthFeature1': 'Up to 30,000 orders/month (≈ 1,000 orders/day)',
    'pricing.growthFeature2': 'All Standard features',
    'pricing.growthFeature3': 'Manage multiple branches in one account',
    'pricing.growthFeature4': 'Consolidated branch reporting',
    'pricing.ctaText': 'Start 14-day free trial — no credit card required.',
    'pricing.placeholder': 'Enter your restaurant name...',
    'pricing.ctaButton': 'Start Free Trial',
    'pricing.guarantee': 'Cancel anytime • No contracts • Full features during trial',
    
    // CTA Section
    'cta.trustSignal': '🔒 Trusted by restaurants worldwide • 🚀 Start selling more today',
    'cta.title': 'Your menu can make more money starting tonight.',
    'cta.subtitle': 'Join 2,500+ restaurants already boosting their sales',
    'cta.placeholder': 'Enter your restaurant name...',
    'cta.button': '👉 Build My Free Menu',
    'cta.guarantee': 'Cancel anytime. Keep your menu forever, even on the free plan.',
    'cta.urgency': 'Limited time: Get premium features free for 30 days',
    'cta.stats1': '2,500+',
    'cta.stats1Label': 'Happy restaurants',
    'cta.stats2': '35%',
    'cta.stats2Label': 'Average revenue boost',
    'cta.stats3': '5 min',
    'cta.stats3Label': 'Setup time',
    'cta.benefit1': '⚡ Setup in 5 minutes',
    'cta.benefit2': '💰 Average 35% revenue increase',
    'cta.benefit3': '🔄 Cancel anytime, keep forever',
    'cta.benefit4': '🎯 No contracts, no commitments',
    
    // Footer
    'footer.copyright': '© 2024 OishiMenu. All rights reserved.'
  },
  vi: {
    // Navigation
    'nav.features': 'Tính năng',
    'nav.howItWorks': 'Cách hoạt động',
    'nav.pricing': 'Giá cả',
    'nav.testimonials': 'Đánh giá',
    'nav.logIn': 'Đăng nhập',
    'nav.getAccess': 'Truy cập ngay',
    
    // Hero Section
    'hero.title': 'Thực Đơn Số MIỄN PHÍ Tăng Doanh Số',
    'hero.subtitle': 'Tạo thực đơn QR thông minh trong 5 phút. Bắt đầu miễn phí, sử dụng miễn phí mãi mãi. Không phí thiết lập, không cần thẻ tín dụng.',
    'hero.placeholder': 'Nhập tên nhà hàng của bạn...',
    'hero.button': 'Bắt Đầu Miễn Phí',
    'hero.guarantee': '✓ MIỄN PHÍ mãi mãi • ✓ Thiết lập 5 phút • ✓ Tăng doanh số ngay lập tức',
    'hero.salesBoost': '+20%',
    'hero.salesBoostLabel': 'Tăng doanh số',
    'hero.setupTime': '5 phút',
    'hero.setupTimeLabel': 'Thời gian thiết lập',

    // Value Props Section
    'valueProps.badge': '✨ Đề Xuất Giá Trị',
    'valueProps.title': 'Tại Sao Chọn Thực Đơn QR Thông Minh Của Chúng Tôi?',
    'valueProps.subtitle': 'Mọi thứ bạn cần để biến thực đơn thành công cụ bán hàng mạnh mẽ',
    'valueProps.feature1': '💡 Tăng Doanh Thu Tức Thì',
    'valueProps.feature1Desc': 'Gợi ý món phụ, đồ uống và combo ngay trong thực đơn.',
    'valueProps.feature2': '⚡ Thiết Lập 5 Phút',
    'valueProps.feature2Desc': 'Tạo thực đơn, in QR và bắt đầu bán hàng — không cần đào tạo.',
    'valueProps.feature3': '💰 Chi Phí Thấp, Lợi Nhuận Cao',
    'valueProps.feature3Desc': 'Một gói đăng ký nhỏ có thể tăng thêm hàng trăm đô la doanh thu mỗi tháng.',
    'valueProps.feature4': '🎨 Thương Hiệu Của Bạn, Thực Đơn Của Bạn',
    'valueProps.feature4Desc': 'Tải lên logo, chọn màu sắc và trông chuyên nghiệp.',
    'valueProps.feature5': '📊 Thông Tin Chi Tiết Đơn Giản',
    'valueProps.feature5Desc': 'Xem khách hàng nhấp vào gì nhiều nhất và cập nhật ngay lập tức.',

    // Features Section
    'features.title': 'Tính Năng Bán Chéo Thông Minh Tạo Thêm Doanh Thu',
    'features.subtitle': 'Biến thực đơn kỹ thuật số thành cỗ máy kiếm tiền với hệ thống bán chéo thông minh.',
    'features.smartRecommendations': 'Gợi Ý Thông Minh AI',
    'features.smartRecommendationsDesc': 'Thuật toán học máy phân tích hành vi khách hàng để gợi ý món ăn tăng giá trị đơn hàng lên 35%',
    'features.promotionalDishes': 'Món Khuyến Mãi Động',
    'features.promotionalDishesDesc': 'Tự động làm nổi bật món bán chạy và món có lợi nhuận cao để tối đa hóa doanh thu mỗi khách hàng',
    'features.upsellingEngine': 'Công Cụ Bán Chéo Thông Minh',
    'features.upsellingEngineDesc': 'Gợi ý thông minh về món thêm, đồ uống và tráng miệng vào thời điểm hoàn hảo',
    'features.bundleDeals': 'Combo Không Thể Cưỡng Lại',
    'features.bundleDealsDesc': 'Tạo combo hấp dẫn mà khách hàng không thể từ chối, tăng kích thước đơn hàng trung bình lên 40%',
    'features.noWebsiteTitle': 'Không Có Website Kiếm Tiền? Không Vấn Đề!',
    'features.noWebsiteDesc': 'Chúng tôi sẽ tạo website nhà hàng chuyên nghiệp với đặt hàng trực tuyến biến khách truy cập thành khách hàng trả tiền.',
    'features.website': 'Website nhà hàng chuyên nghiệp',
    'features.ordering': 'Hệ thống đặt hàng trực tuyến',
    'features.mobile': 'Thiết kế tối ưu di động',
    'features.growth': 'Đảm bảo tăng trưởng 162%',
    'features.preview': 'Xem trước trực tiếp: Khách hàng có thể duyệt thực đơn, đặt hàng và thanh toán trực tuyến - tất cả từ website chuyên nghiệp của bạn.',
    'features.yourWebsite': 'Website Nhà Hàng Của Bạn',
    'features.completeOrdering': 'Hoàn chỉnh với đặt hàng trực tuyến',
    'features.livePreview': 'Xem Trước Trực Tiếp',

    // Benefits Section
    'benefits.title': 'Tại Sao 2,500+ Nhà Hàng Chọn OishiMenu',
    'benefits.subtitle': 'Cách dễ nhất để tăng doanh thu nhà hàng với rủi ro bằng không',
    'benefits.setup': 'Thiết Lập 5 Phút',
    'benefits.setupDesc': 'Từ đăng ký đến thực đơn hoạt động trong vòng 5 phút. Không cần kỹ năng kỹ thuật.',
    'benefits.setupHighlight': 'Thiết lập nhanh nhất ngành',
    'benefits.zeroCommissions': 'Không Hoa Hồng',
    'benefits.zeroCommissionsDesc': 'Giữ 100% doanh thu. Không phí ẩn, không phí hàng tháng, không hoa hồng.',
    'benefits.zeroCommissionsHighlight': 'Miễn phí mãi mãi',
    'benefits.revenueIncrease': 'Tăng 35% Doanh Thu',
    'benefits.revenueIncreaseDesc': 'Nhà hàng trung bình thấy tăng 35% doanh thu trong 30 ngày triển khai.',
    'benefits.revenueIncreaseHighlight': 'Kết quả đảm bảo',
    'benefits.happyRestaurants': '2,500+ Nhà Hàng Hài Lòng',
    'benefits.happyRestaurantsDesc': 'Tham gia hàng nghìn nhà hàng đã sử dụng hệ thống của chúng tôi để tăng doanh thu.',
    'benefits.happyRestaurantsHighlight': 'Thành công đã chứng minh',
    'benefits.aiUpselling': 'Bán Chéo AI',
    'benefits.aiUpsellingDesc': 'Gợi ý thông minh tự động tăng giá trị đơn hàng trung bình lên 40%.',
    'benefits.aiUpsellingHighlight': 'Hoạt động 24/7',
    'benefits.noRisk': 'Không Rủi Ro, Chỉ Thưởng',
    'benefits.noRiskDesc': 'Sử dụng miễn phí mãi mãi. Không hợp đồng, không cam kết. Chỉ kết quả.',
    'benefits.noRiskHighlight': 'Không rủi ro',
    'benefits.readyTitle': 'Sẵn Sàng Tham Gia Câu Chuyện Thành Công?',
    'benefits.readyDesc': 'Bắt đầu thiết lập 5 phút ngay bây giờ và thấy doanh thu tăng trong 30 ngày.',
    'benefits.averageRevenue': '35%',
    'benefits.averageRevenueDesc': 'Tăng doanh thu trung bình',
    
    // Social Proof Section
    'socialProof.badge': 'Câu Chuyện Thành Công',
    'socialProof.testimonial': '"Chúng tôi thiết lập trong 10 phút. Doanh số đồ uống tăng 20% trong tuần đầu tiên!"',
    'socialProof.author': 'Chủ Quán Cà Phê, Người Dùng Sớm',
    'socialProof.trustedBy': 'Được tin tưởng bởi các quán cà phê, quán bar & nhà hàng trên toàn thế giới',
    'socialProof.trustedByBadge': 'MIỄN PHÍ cho quán cà phê, quán bar & nhà hàng trên toàn thế giới',

    // How It Works Section
    'howItWorks.badge': 'Cách Hoạt Động',
    'howItWorks.title': 'Cách Tăng Doanh Số Của Bạn',
    'howItWorks.subtitle': 'Biến thực đơn thành công cụ bán hàng mạnh mẽ tự động tăng doanh thu.',
    'howItWorks.step1': 'Đẩy Tùy Chọn Thông Minh',
    'howItWorks.step1Desc': 'Tự động gợi ý món thêm, đồ uống và nâng cấp mà khách hàng thực sự muốn.',
    'howItWorks.step2': 'Gợi Ý AI',
    'howItWorks.step2Desc': 'Học máy gợi ý những món hoàn hảo để tăng giá trị mỗi đơn hàng.',
    'howItWorks.step3': 'Quản Lý Bàn Dễ Dàng Hơn',
    'howItWorks.step3Desc': 'Theo dõi đơn hàng, quản lý bàn và phục vụ khách hàng nhanh hơn bao giờ hết.',
    'howItWorks.ctaButton': 'Dùng Thử Miễn Phí Ngay',
    'howItWorks.readyTitle': 'Sẵn Sàng Bắt Đầu Kiếm Thêm Tiền?',
    'howItWorks.readyDesc': 'Tham gia hàng nghìn nhà hàng đã sử dụng hệ thống của chúng tôi để tăng doanh thu.',
    'howItWorks.freeForever': 'Miễn phí mãi mãi',
    'howItWorks.fiveMinuteSetup': 'Thiết lập 5 phút',
    'howItWorks.noCoding': 'Không cần lập trình',
    
    // Testimonials Section
    'testimonials.title': 'Chủ Nhà Hàng Nói Gì',
    'testimonials.subtitle': 'Kết quả thực từ các nhà hàng thực sử dụng hệ thống tăng doanh thu của chúng tôi.',
    'testimonials.maria': 'OishiMenu tăng đơn hàng trực tuyến của chúng tôi 162% chỉ trong 3 tháng. Chúng tôi từ $3,000 lên $7,800 doanh thu hàng tháng. Bán chéo AI như có chuyên gia bán hàng ở mỗi bàn!',
    'testimonials.james': 'Chúng tôi từ $2,000 lên $5,200 doanh thu hàng tháng. Gợi ý thông minh tăng đơn hàng trung bình lên 40%. Thiết lập chỉ mất 5 phút!',
    'testimonials.sarah': 'Khách hàng yêu thích trải nghiệm thực đơn kỹ thuật số. Đơn hàng tăng 35% và chúng tôi kiếm nhiều tiền hơn bao giờ hết! Tính năng combo đơn thuần tăng doanh thu $1,200/tháng.',
    
    // Pricing Section
    'pricing.badge': 'Bảng Giá OishiMenu',
    'pricing.title': 'Dùng thử miễn phí 14 ngày',
    'pricing.subtitle': 'Trải nghiệm Growth với đầy đủ tính năng. Sau thời gian dùng thử, tài khoản sẽ tự động chuyển về Starter (bạn có thể nâng cấp bất kỳ lúc nào).',
    'pricing.monthly': 'Hàng tháng',
    'pricing.annually': 'Hàng năm',
    'pricing.save2months': 'Tiết kiệm 2 tháng',
    'pricing.starterTitle': 'Starter',
    'pricing.starterPrice': 'Miễn phí',
    'pricing.starterPriceAnnual': 'Miễn phí',
    'pricing.starterPeriod': 'mãi mãi',
    'pricing.starterPeriodAnnual': 'mãi mãi',
    'pricing.starterButton': 'Chọn Starter',
    'pricing.starterDesc': 'Hoàn hảo cho quán cà phê và nhà hàng nhỏ muốn số hóa thực đơn nhanh chóng và hiệu quả.',
    'pricing.starterFeature1': 'Miễn phí tới 1.500 đơn/tháng (≈ 50 đơn/ngày)',
    'pricing.starterFeature1Upgrade': '+49.000 VND/tháng để nâng cấp tới 3.000 đơn/tháng (≈ 100 đơn/ngày)',
    'pricing.starterFeature2': 'Tùy chỉnh logo & màu sắc cơ bản',
    'pricing.starterFeature3': 'QR code đơn cho thực đơn',
    'pricing.starterFeature4': 'Tạo tùy chọn món và gợi ý bán kèm',
    'pricing.starterFeature5': 'Dashboard cơ bản (đơn hàng, lượt quét)',
    'pricing.starterFeature6': 'Hiển thị "Powered by OishiMenu" (+49.000 VND/tháng để xóa)',
    'pricing.standardTitle': 'Standard',
    'pricing.standardPrice': '199.000 VND',
    'pricing.standardPriceAnnual': '1.990.000 VND',
    'pricing.standardPeriod': 'mỗi tháng',
    'pricing.standardPeriodAnnual': 'mỗi năm',
    'pricing.standardButton': 'Chọn Standard',
    'pricing.standardDesc': 'Hoàn hảo cho nhà hàng cỡ vừa muốn tối ưu doanh thu và tăng cường thương hiệu.',
    'pricing.standardFeature1': 'Tối đa 6.000 đơn/tháng (≈ 200 đơn/ngày)',
    'pricing.standardFeature2': 'Tất cả tính năng của Starter',
    'pricing.standardFeature3': 'QR code riêng cho từng bàn',
    'pricing.standardFeature4': 'Xóa "Powered by OishiMenu" miễn phí',
    'pricing.standardFeature5': 'Dashboard nâng cao (món bán chạy, tỉ lệ click)',
    'pricing.standardFeature6': 'Hỗ trợ ưu tiên qua email',
    'pricing.growthTitle': 'Growth',
    'pricing.growthPrice': '299.000 VND',
    'pricing.growthPriceAnnual': '2.990.000 VND',
    'pricing.growthPeriod': 'mỗi tháng',
    'pricing.growthPeriodAnnual': 'mỗi năm',
    'pricing.growthButton': 'Chọn Growth',
    'pricing.growthDesc': 'Hoàn hảo cho chuỗi nhà hàng và cơ sở lớn quản lý nhiều địa điểm khác nhau.',
    'pricing.growthFeature1': 'Tối đa 30.000 đơn/tháng (≈ 1.000 đơn/ngày)',
    'pricing.growthFeature2': 'Tất cả tính năng của Standard',
    'pricing.growthFeature3': 'Quản lý nhiều chi nhánh trong cùng tài khoản',
    'pricing.growthFeature4': 'Báo cáo chi nhánh tổng hợp',
    'pricing.ctaText': 'Dùng thử miễn phí 14 ngày — không cần thẻ tín dụng.',
    'pricing.placeholder': 'Nhập tên nhà hàng của bạn...',
    'pricing.ctaButton': 'Bắt Đầu Dùng Thử',
    'pricing.guarantee': 'Hủy bất cứ lúc nào • Không hợp đồng • Đầy đủ tính năng khi dùng thử',

    // CTA Section
    'cta.trustSignal': '🔒 Được tin tưởng bởi nhà hàng trên toàn thế giới • 🚀 Bắt đầu bán nhiều hơn hôm nay',
    'cta.title': 'Thực đơn của bạn có thể kiếm được nhiều tiền hơn từ tối nay.',
    'cta.subtitle': 'Tham gia 2,500+ nhà hàng đã tăng doanh số',
    'cta.placeholder': 'Nhập tên nhà hàng của bạn...',
    'cta.button': '👉 Tạo Thực Đơn Miễn Phí',
    'cta.guarantee': 'Hủy bất cứ lúc nào. Giữ thực đơn mãi mãi, ngay cả với gói miễn phí.',
    'cta.urgency': 'Có thời hạn: Nhận tính năng premium miễn phí 30 ngày',
    'cta.stats1': '2,500+',
    'cta.stats1Label': 'Nhà hàng hài lòng',
    'cta.stats2': '35%',
    'cta.stats2Label': 'Tăng doanh thu trung bình',
    'cta.stats3': '5 phút',
    'cta.stats3Label': 'Thời gian thiết lập',
    'cta.benefit1': '⚡ Thiết lập trong 5 phút',
    'cta.benefit2': '💰 Trung bình tăng 35% doanh thu',
    'cta.benefit3': '🔄 Hủy bất cứ lúc nào, giữ mãi mãi',
    'cta.benefit4': '🎯 Không hợp đồng, không cam kết',
    
    // Footer
    'footer.copyright': '© 2024 OishiMenu. Tất cả quyền được bảo lưu.'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
