'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'vn';

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
    'hero.title': 'Turn Your Restaurant Into a',
    'hero.titleHighlight': 'Money-Making Machine',
    'hero.subtitle': 'Generate 35% more revenue with our AI-powered digital menu system. Smart upselling, instant recommendations, and promotional features that turn every customer into a bigger spender.',
    'hero.benefits': 'Zero commissions • Free forever • 5-minute setup',
    'hero.placeholder': 'Restaurant Name',
    'hero.button': 'Get Access Now',
    'hero.guarantee': 'Unlimited orders. Zero commissions.',
    'hero.revenueIncrease': 'Revenue Increase',
    'hero.extraRevenue': 'Extra Revenue',
    
    // Revenue Section
    'revenue.title': 'Turn people visiting your website into regular food clients',
    'revenue.subtitle': 'Our revenue-boosting menu system will help you transform your website into a money-making machine.',
    'revenue.moreRevenue': '35% More Revenue',
    'revenue.moreRevenueDesc': 'Smart upselling and recommendations increase average order value by 35%',
    'revenue.zeroCommissions': 'Zero Commissions',
    'revenue.zeroCommissionsDesc': 'Keep 100% of your revenue. No hidden fees, no monthly charges, no commissions.',
    'revenue.salesGrowth': '162% Sales Growth',
    'revenue.salesGrowthDesc': 'Restaurants using our system see an average 162% increase in online sales',
    'revenue.seeResults': 'See the Results in Action',
    'revenue.seeResultsDesc': 'Watch how our AI-powered system transforms your digital menu into a revenue-generating machine.',
    'revenue.realtimeUpselling': 'Real-time upselling suggestions',
    'revenue.smartPromotions': 'Smart promotional displays',
    'revenue.automatedBundles': 'Automated bundle recommendations',
    
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
    'benefits.averageRevenue': '$2,400',
    'benefits.averageRevenueDesc': 'Average extra revenue in first month',
    
    // How It Works Section
    'howItWorks.title': 'How It Works',
    'howItWorks.subtitle': 'Get your revenue-boosting menu system up and running in just 3 simple steps.',
    'howItWorks.upload': 'Upload Your Menu (2 minutes)',
    'howItWorks.uploadDesc': 'Simply add your dishes, prices, and descriptions. Our AI will automatically optimize them for maximum sales',
    'howItWorks.qrCode': 'Generate QR Codes (30 seconds)',
    'howItWorks.qrCodeDesc': 'Get instant QR codes for each table. Customers scan and start ordering immediately',
    'howItWorks.goLive': 'Start Making Money (Instant)',
    'howItWorks.goLiveDesc': 'Your revenue-boosting menu goes live instantly. Watch your sales increase from day one',
    'howItWorks.readyTitle': 'Ready to Start Making More Money?',
    'howItWorks.readyDesc': 'Join thousands of restaurants already using our system to increase their revenue.',
    'howItWorks.free': 'Free forever',
    'howItWorks.setup': '5-minute setup',
    'howItWorks.noCoding': 'No coding required',
    
    // Testimonials Section
    'testimonials.title': 'What Restaurant Owners Say',
    'testimonials.subtitle': 'Real results from real restaurants using our revenue-boosting system.',
    'testimonials.maria': 'OishiMenu increased our online orders by 162% in just 3 months. We went from $3,000 to $7,800 monthly revenue. The AI upselling is like having a sales expert at every table!',
    'testimonials.james': 'We went from $2,000 to $5,200 in monthly revenue. The smart recommendations increased our average order by 40%. Setup took literally 5 minutes!',
    'testimonials.sarah': 'Our customers love the digital menu experience. Orders are up 35% and we\'re making more money than ever! The bundle deals feature alone increased our revenue by $1,200/month.',
    
    // CTA Section
    'cta.title': 'Start Making 35% More Revenue in the Next 5 Minutes',
    'cta.subtitle': 'Join 2,500+ restaurants already using our system to increase their revenue.',
    'cta.averageRevenue': 'Average restaurant sees $2,400 extra revenue in their first month.',
    'cta.placeholder': 'Restaurant Name',
    'cta.button': 'Get Access Now',
    'cta.free': 'Free forever',
    'cta.noCommissions': 'No commissions',
    'cta.setup': '5-minute setup',
    
    // Footer
    'footer.copyright': '© 2024 OishiMenu. All rights reserved.'
  },
  vn: {
    // Navigation
    'nav.features': 'Tính năng',
    'nav.howItWorks': 'Cách hoạt động',
    'nav.pricing': 'Giá cả',
    'nav.testimonials': 'Đánh giá',
    'nav.logIn': 'Đăng nhập',
    'nav.getAccess': 'Truy cập ngay',
    
    // Hero Section
    'hero.title': 'Biến Nhà Hàng Của Bạn Thành',
    'hero.titleHighlight': 'Cỗ Máy Kiếm Tiền',
    'hero.subtitle': 'Tăng 35% doanh thu với hệ thống thực đơn kỹ thuật số AI. Bán chéo thông minh, gợi ý tức thì và tính năng khuyến mãi biến mỗi khách hàng thành người chi tiêu nhiều hơn.',
    'hero.benefits': 'Không hoa hồng • Miễn phí mãi mãi • Thiết lập 5 phút',
    'hero.placeholder': 'Tên nhà hàng',
    'hero.button': 'Truy cập ngay',
    'hero.guarantee': 'Đơn hàng không giới hạn. Không hoa hồng.',
    'hero.revenueIncrease': 'Tăng Doanh Thu',
    'hero.extraRevenue': 'Doanh Thu Thêm',

    // Revenue Section
    'revenue.title': 'Biến người truy cập website thành khách hàng thường xuyên',
    'revenue.subtitle': 'Hệ thống thực đơn tăng doanh thu của chúng tôi sẽ giúp bạn biến website thành cỗ máy kiếm tiền.',
    'revenue.moreRevenue': 'Tăng 35% Doanh Thu',
    'revenue.moreRevenueDesc': 'Bán chéo thông minh và gợi ý tăng giá trị đơn hàng trung bình lên 35%',
    'revenue.zeroCommissions': 'Không Hoa Hồng',
    'revenue.zeroCommissionsDesc': 'Giữ 100% doanh thu. Không phí ẩn, không phí hàng tháng, không hoa hồng.',
    'revenue.salesGrowth': 'Tăng Trưởng 162%',
    'revenue.salesGrowthDesc': 'Các nhà hàng sử dụng hệ thống của chúng tôi thấy tăng trưởng bán hàng trực tuyến trung bình 162%',
    'revenue.seeResults': 'Xem Kết Quả Thực Tế',
    'revenue.seeResultsDesc': 'Xem cách hệ thống AI của chúng tôi biến thực đơn kỹ thuật số thành cỗ máy tạo doanh thu.',
    'revenue.realtimeUpselling': 'Gợi ý bán chéo theo thời gian thực',
    'revenue.smartPromotions': 'Hiển thị khuyến mãi thông minh',
    'revenue.automatedBundles': 'Gợi ý combo tự động',

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
    'benefits.averageRevenue': '$2,400',
    'benefits.averageRevenueDesc': 'Doanh thu thêm trung bình tháng đầu',
    
    // How It Works Section
    'howItWorks.title': 'Cách Hoạt Động',
    'howItWorks.subtitle': 'Đưa hệ thống thực đơn tăng doanh thu của bạn hoạt động chỉ trong 3 bước đơn giản.',
    'howItWorks.upload': 'Tải Lên Thực Đơn (2 phút)',
    'howItWorks.uploadDesc': 'Chỉ cần thêm món ăn, giá cả và mô tả. AI của chúng tôi sẽ tự động tối ưu hóa để bán hàng tối đa',
    'howItWorks.qrCode': 'Tạo Mã QR (30 giây)',
    'howItWorks.qrCodeDesc': 'Nhận mã QR tức thì cho mỗi bàn. Khách hàng quét và bắt đầu đặt hàng ngay lập tức',
    'howItWorks.goLive': 'Bắt Đầu Kiếm Tiền (Tức Thì)',
    'howItWorks.goLiveDesc': 'Thực đơn tăng doanh thu của bạn hoạt động ngay lập tức. Xem doanh số tăng từ ngày đầu',
    'howItWorks.readyTitle': 'Sẵn Sàng Bắt Đầu Kiếm Thêm Tiền?',
    'howItWorks.readyDesc': 'Tham gia hàng nghìn nhà hàng đã sử dụng hệ thống của chúng tôi để tăng doanh thu.',
    'howItWorks.free': 'Miễn phí mãi mãi',
    'howItWorks.setup': 'Thiết lập 5 phút',
    'howItWorks.noCoding': 'Không cần lập trình',
    
    // Testimonials Section
    'testimonials.title': 'Chủ Nhà Hàng Nói Gì',
    'testimonials.subtitle': 'Kết quả thực từ các nhà hàng thực sử dụng hệ thống tăng doanh thu của chúng tôi.',
    'testimonials.maria': 'OishiMenu tăng đơn hàng trực tuyến của chúng tôi 162% chỉ trong 3 tháng. Chúng tôi từ $3,000 lên $7,800 doanh thu hàng tháng. Bán chéo AI như có chuyên gia bán hàng ở mỗi bàn!',
    'testimonials.james': 'Chúng tôi từ $2,000 lên $5,200 doanh thu hàng tháng. Gợi ý thông minh tăng đơn hàng trung bình lên 40%. Thiết lập chỉ mất 5 phút!',
    'testimonials.sarah': 'Khách hàng yêu thích trải nghiệm thực đơn kỹ thuật số. Đơn hàng tăng 35% và chúng tôi kiếm nhiều tiền hơn bao giờ hết! Tính năng combo đơn thuần tăng doanh thu $1,200/tháng.',
    
    // CTA Section
    'cta.title': 'Bắt Đầu Tăng 35% Doanh Thu Trong 5 Phút Tới',
    'cta.subtitle': 'Tham gia 2,500+ nhà hàng đã sử dụng hệ thống của chúng tôi để tăng doanh thu.',
    'cta.averageRevenue': 'Nhà hàng trung bình thấy $2,400 doanh thu thêm trong tháng đầu.',
    'cta.placeholder': 'Tên nhà hàng',
    'cta.button': 'Truy cập ngay',
    'cta.free': 'Miễn phí mãi mãi',
    'cta.noCommissions': 'Không hoa hồng',
    'cta.setup': 'Thiết lập 5 phút',
    
    // Footer
    'footer.copyright': '© 2024 OishiMenu. Tất cả quyền được bảo lưu.'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vn')) {
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
