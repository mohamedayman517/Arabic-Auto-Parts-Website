import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { RouteContext } from "../components/Router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "../hooks/useTranslation";

interface ContactProps {
  setCurrentPage: (page: string) => void;
}

export default function Contact({ setCurrentPage }: ContactProps) {
  const { t } = useTranslation();

  // contactInfo يجب أن يكون هنا
  const contactInfo = [
    {
      icon: MapPin,
      title: t("ourAddress"),
      details: [t("addressLine1"), t("addressLine2")],
      color: "text-blue-500",
    },
    {
      icon: Phone,
      title: t("callUs"),
      details: [t("phone1"), t("phone2")],
      color: "text-green-500",
    },
    {
      icon: Mail,
      title: t("emailUs"),
      details: [t("email1"), t("email2")],
      color: "text-purple-500",
    },
    {
      icon: Clock,
      title: t("workingHours"),
      details: [t("workingHoursWeekdays"), t("workingHoursWeekend")],
      color: "text-orange-500",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert(t("contactSuccessMessage"));
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      category: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="contact" setCurrentPage={setCurrentPage} />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("contactUs")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("supportTeamReady")}
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-lg transition-shadow"
            >
              <CardContent className="space-y-4">
                <div
                  className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto ${info.color}`}
                >
                  <info.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted-foreground text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t("sendMessage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t("fullName")} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t("emailAddress")} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">{t("phoneNumber")}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">{t("inquiryCategory")}</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("choosCategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">{t("general")}</SelectItem>
                        <SelectItem value="order">{t("order")}</SelectItem>
                        <SelectItem value="product">{t("product")}</SelectItem>
                        <SelectItem value="technical">
                          {t("technical")}
                        </SelectItem>
                        <SelectItem value="complaint">
                          {t("complaint")}
                        </SelectItem>
                        <SelectItem value="suggestion">
                          {t("suggestion")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">{t("messageSubject")} *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t("messageText")} *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    placeholder={t("writeMessage")}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "جاري الإرسال..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 ml-2" />
                      {t("sendMessage")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Map and Additional Info */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>{t("ourLocation")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">{t("mapLocation")}</p>
                    <p className="text-sm text-gray-400">{t("addressMap")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">{t("faq")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("faqQuickHint")}
                </p>
                <Button variant="outline" onClick={() => setCurrentPage("faq")}>
                  {t("faq")}
                </Button>
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">
                  {t("customerSupport")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("supportTeamHint")}
                </p>
                <Button onClick={() => setCurrentPage("support")}>
                  {t("customerSupport")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
