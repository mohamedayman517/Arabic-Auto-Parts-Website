import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { RouteContext } from "./Router";
import { useTranslation } from "../hooks/useTranslation";

const categories = (t: (key: any) => string) => [
  {
    id: "engines",
    title: t("enginePartsTitle"),
    description: t("enginePartsDesc"),
    image:
      "https://images.unsplash.com/photo-1752774579270-523a9e91e6d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0cyUyMGF1dG9tb3RpdmV8ZW58MXx8fHwxNzU0MDYzODU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    count: t("productsCount2500"),
  },
  {
    id: "tires",
    title: t("tiresWheelsTitle"),
    description: t("tiresWheelsDesc"),
    image:
      "https://images.unsplash.com/photo-1710009437292-77d057fd47f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB0aXJlcyUyMHdoZWVscyUyMGF1dG9tb3RpdmV8ZW58MXx8fHwxNzU0MDYzODU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    count: t("productsCount1800"),
  },
  {
    id: "electrical",
    title: t("electricalPartsTitle"),
    description: t("electricalPartsDesc"),
    image:
      "https://images.unsplash.com/photo-1621992906830-b3f3aabac38b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbGVjdHJpY2FsJTIwcGFydHMlMjBiYXR0ZXJ5fGVufDF8fHx8MTc1NDA2Mzg2NHww&ixlib=rb-4.1.0&q=80&w=1080",
    count: t("productsCount1200"),
  },
  {
    id: "tools",
    title: t("workshopToolsTitle"),
    description: t("workshopToolsDesc"),
    image:
      "https://images.unsplash.com/photo-1727413434026-0f8314c037d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwdG9vbHMlMjBnYXJhZ2UlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU0MDYzODYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    count: t("productsCount950"),
  },
];

export default function ProductCategories({ setCurrentPage, setSearchFilters }: Partial<RouteContext>) {
  const { t, locale } = useTranslation();

  return (
    <section className="py-16 bg-gray-50" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("categories")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("categoryDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories(t).map((category) => (
            <Card
              key={category.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {category.count}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">{category.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-900 bg-white"
                  onClick={() => {
                    // Set normalized part category id (engines, tires, electrical, tools)
                    setSearchFilters && setSearchFilters({ term: '', partCategory: category.id });
                    setCurrentPage && setCurrentPage("products");
                  }}
                >
                  {t("viewAll")}
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
