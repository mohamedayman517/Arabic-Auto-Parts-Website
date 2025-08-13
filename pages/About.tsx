import {
  Award,
  Users,
  Target,
  Shield,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { RouteContext } from "../components/Router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTranslation } from "../hooks/useTranslation";

interface AboutProps {
  setCurrentPage: (page: string) => void;
}

export default function About({ setCurrentPage }: AboutProps) {
  const { t, locale } = useTranslation();

  // الإنجازات
const achievements = [
    {
      icon: Users,
      number: "50,000+",
      label: { ar: "عميل راضٍ", en: "Satisfied Customers" },
    },
    {
      icon: Award,
      number: "15+",
      label: { ar: "سنة من الخبرة", en: "Years of Experience" },
    },
    {
      icon: Target,
      number: "98%",
      label: { ar: "معدل رضا العملاء", en: "Customer Satisfaction Rate" },
    },
    {
      icon: Shield,
      number: "24/7",
      label: { ar: "دعم فني متواصل", en: "24/7 Technical Support" },
    },
  ];

  // القيم
const values = [
  {
    icon: Shield,
      title: { ar: "الجودة والثقة", en: "Quality & Trust" },
      description: {
        ar: "نحن ملتزمون بتقديم قطع غيار أصلية وعالية الجودة من أفضل الشركات المصنعة حول العالم",
        en: "We are committed to providing original, high-quality parts from the best manufacturers worldwide.",
      },
  },
  {
    icon: Target,
      title: { ar: "خدمة العملاء", en: "Customer Service" },
      description: {
        ar: "رضا عملائنا هو أولويتنا القصوى، ونسعى دائماً لتقديم أفضل تجربة تسوق ممكنة",
        en: "Customer satisfaction is our top priority, and we always strive to provide the best shopping experience.",
      },
  },
  {
    icon: CheckCircle,
      title: { ar: "الشفافية", en: "Transparency" },
      description: {
        ar: "نؤمن بأهمية الوضوح في جميع معاملاتنا ونقدم معلومات دقيقة حول منتجاتنا وأسعارنا",
        en: "We believe in clarity in all our dealings and provide accurate information about our products and prices.",
      },
  },
  {
    icon: Users,
      title: { ar: "الابتكار", en: "Innovation" },
      description: {
        ar: "نواكب أحدث التقنيات لتطوير منصتنا وتحسين تجربة التسوق الإلكتروني",
        en: "We keep up with the latest technologies to develop our platform and enhance the e-commerce experience.",
      },
    },
  ];

  // الفريق
const team = [
  {
      name: { ar: "محمد الأحمد", en: "Mohammed Al-Ahmad" },
      position: { ar: "المؤسس والرئيس التنفيذي", en: "Founder & CEO" },
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
      description: {
        ar: "خبرة أكثر من 20 عاماً في مجال قطع غيار السيارات",
        en: "Over 20 years of experience in auto parts industry.",
      },
    },
    {
      name: { ar: "فاطمة العلي", en: "Fatima Al-Ali" },
      position: { ar: "مديرة العمليات", en: "Operations Manager" },
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=300",
      description: {
        ar: "متخصصة في إدارة سلسلة التوريد والخدمات اللوجستية",
        en: "Specialist in supply chain and logistics management.",
      },
    },
    {
      name: { ar: "أحمد الخالد", en: "Ahmed Al-Khaled" },
      position: { ar: "رئيس قسم التقنية", en: "Head of Technology" },
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
      description: {
        ar: "مهندس برمجيات مع خبرة واسعة في التجارة الإلكترونية",
        en: "Software engineer with extensive e-commerce experience.",
      },
    },
    {
      name: { ar: "سارة المحمد", en: "Sara Al-Mohammed" },
      position: { ar: "مديرة التسويق", en: "Marketing Manager" },
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
      description: {
        ar: "خبيرة في التسويق الرقمي وإدارة العلامة التجارية",
        en: "Expert in digital marketing and brand management.",
      },
    },
  ];

  // الشهادات (certifications) - اجعلها تعتمد على الترجمة أو هيكل {ar, en}
  const certifications = [
    {
      icon: Shield,
      title: { ar: "شهادة ISO 9001", en: "ISO 9001 Certificate" },
      description: {
        ar: "معتمدون في إدارة الجودة وضمان أعلى معايير الخدمة",
        en: "Certified in quality management and ensuring the highest standards of service.",
      },
    },
    {
      icon: Award,
      title: {
        ar: "عضوية الغرفة التجارية",
        en: "Chamber of Commerce Membership",
      },
      description: {
        ar: "عضو معتمد في الغرفة التجارية السعودية",
        en: "Member of the Saudi Chamber of Commerce.",
      },
    },
    {
      icon: Star,
      title: { ar: "جائزة أفضل متجر", en: "Best Store Award" },
      description: {
        ar: "حاصلون على جائزة أفضل متجر إلكتروني لعام 2023",
        en: "Won the Best Online Store Award for 2023.",
      },
    },
  ];

  // فقرات القصة
  const storyParagraphs = [
    {
      ar: "مع نمو الطلب، على منتجاتنا وخدماتنا، قررنا التوسع رقمياً لنصل إلى جميع أنحاء المملكة. في عام 2020، أطلقنا منصة العارف الإلكترونية لتكون الجسر بين العملاء والبائعين المتخصصين.",
      en: "As demand for our products and services grew, we decided to expand digitally to reach all regions of the Kingdom. In 2020, we launched the Al Aaref online platform to bridge the gap between customers and specialized sellers.",
    },
    {
      ar: "اليوم، نفخر بخدمة أكثر من 50,000 عميل ونعمل مع شبكة من أفضل البائعين والموردين لضمان توفير أكبر تشكيلة من قطع الغيار الأصلية والبديلة.",
      en: "Today, we are proud to serve over 50,000 customers and work with a network of top sellers and suppliers to ensure the largest selection of original and alternative spare parts.",
    },
  ];

  // الرؤية
  const visionParagraph = {
    ar: "أن نكون المنصة الرائدة في مجال التجارة الإلكترونية لقطع غيار السيارات في الشرق الأوسط، ونساهم في تطوير قطاع صيانة السيارات من خلال توفير حلول تقنية مبتكرة.",
    en: "To be the leading e-commerce platform for auto parts in the Middle East, contributing to the development of the car maintenance sector by providing innovative technical solutions.",
  };

  // المهمة
  const missionParagraph = {
    ar: "تسهيل الحصول على قطع غيار السيارات عالية الجودة من خلال منصة إلكترونية موثوقة تربط بين العملاء والبائعين المحترفين، مع ضمان أفضل أسعار وخدمة عملاء متميزة.",
    en: "To make it easy to obtain high-quality auto parts through a reliable online platform that connects customers with professional sellers, ensuring the best prices and excellent customer service.",
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="about" setCurrentPage={setCurrentPage} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">{t("about")}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("storeDescription")}
          </p>
        </div>

        {/* Company Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">{t("ourStory")}</h2>
            <div className="space-y-4 text-muted-foreground">
              {storyParagraphs.map((p, i) => (
                <p key={i}>{p[locale]}</p>
              ))}
            </div>
          </div>
          
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <iframe
              title={locale === 'ar' ? 'خريطة موقعنا' : 'Our Location Map'}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.8310843730234!2d46.67529631500328!3d24.713551184115356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f038c7f4d9b1f%3A0x8f7c9e8a8f8c0f2a!2sRiyadh!5e0!3m2!1sar!2ssa!4v1700000000000!5m2!1sar!2ssa"
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("ourAchievements")}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="text-center p-8 hover:shadow-lg transition-shadow"
              >
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <achievement.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {achievement.number}
                  </div>
                  <div className="text-muted-foreground">
                    {achievement.label[locale]}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <Card className="p-8">
            <CardContent className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{t("vision")}</h3>
              <p className="text-muted-foreground">{visionParagraph[locale]}</p>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardContent className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{t("mission")}</h3>
              <p className="text-muted-foreground">
                {missionParagraph[locale]}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("ourValues")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">{value.title[locale]}</h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description[locale]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("ourTeam")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name[locale]}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-medium">
                      {member.name[locale]}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {member.position[locale]}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {member.description[locale]}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("certifications")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {certifications.map((certification, index) => (
              <Card key={index} className="p-6 text-center">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <certification.icon className="w-8 h-8 text-green-600" />
                </div>
                  <h3 className="text-lg font-medium">
                    {certification.title[locale]}
                  </h3>
                <p className="text-sm text-muted-foreground">
                    {certification.description[locale]}
                </p>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mb-20">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-center mb-3">{t("faq")}</h2>
              <p className="text-muted-foreground text-center mb-4">
                {t("faqQuickHint")}
              </p>
              <div className="text-center">
                <Button variant="outline" onClick={() => setCurrentPage("faq")}>
                  {t("faq")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="p-8">
          <CardContent>
            <h2 className="text-2xl font-bold text-center mb-8">
              {t("contactUs")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium">{t("ourAddress")}</h3>
                <p className="text-muted-foreground">
                  شارع الملك فهد، حي العليا
                  <br />
                  الرياض 11564، المملكة العربية السعودية
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium">{t("callUs")}</h3>
                <p className="text-muted-foreground">
                  +966 11 123 4567
                  <br />
                  +966 50 123 4567
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium">{t("emailUs")}</h3>
                <p className="text-muted-foreground">
                  info@alaareef.com
                  <br />
                  support@alaareef.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
