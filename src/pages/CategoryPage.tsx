import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticlesByCategory, categoryLabels, categoryColors, type Category } from "@/data/articles";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";
import NotFound from "./NotFound";

const ARTICLES_PER_PAGE = 9;

const categoryDescriptions: Record<Category, string> = {
  kulture:
    "Zbulo kulturën shqiptare përmes artikujve të thellë rreth artit, letërsisë, muzikës dhe traditave tona. Nga ngjarjet kulturore te analizat e tendencave të reja — gjithçka që frymëzon identitetin tonë.",
  dashuri:
    "Këshilla, histori reale dhe perspektiva moderne mbi dashurinë, marrëdhëniet dhe takimet. Sepse çdo grua meriton një hapësirë pa gjykime për të folur mbi zemrën.",
  "grate-shqiptare":
    "Profile frymëzuese të grave shqiptare që po bëjnë ndryshimin — në biznes, art, shkencë dhe jetën e përditshme. Histori suksesi dhe udhëtimesh që të motivojnë.",
  lifestyle:
    "Nga moda te mirëqenia, nga udhëtimet te ushqimi — artikuj praktikë dhe frymëzuese për jetën e përditshme të gruas moderne shqiptare.",
  argetim:
    "Filma, seriale, muzikë, libra dhe kultura pop — gjithçka për t'u argëtuar dhe për të qëndruar në hap me trendet e fundit të botës dhe ato shqiptare.",
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug as Category;
  const label = categoryLabels[category];
  const [page, setPage] = useState(1);

  if (!label) return <NotFound />;

  const articles = getArticlesByCategory(category);
  const [featured, ...rest] = articles;
  const description = categoryDescriptions[category];

  const totalPages = Math.ceil(rest.length / ARTICLES_PER_PAGE);
  const paginatedArticles = rest.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: label,
    description: description || `Artikuj rreth ${label} në FemraDD`,
    inLanguage: "sq",
    url: `https://femradd.com/kategori/${category}`,
  };

  return (
    <main id="main-content">
      <PageHead
        title={label}
        description={description || `Artikuj rreth ${label} në FemraDD — revista online për gratë e reja shqiptare.`}
        url={`https://femradd.com/kategori/${category}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label },
          ]}
        />

        <FadeIn>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColors[category]}`}>
                {label}
              </span>
              <span className="text-sm text-muted-foreground">
                {articles.length} artikuj
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
              {label}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </FadeIn>

        {articles.length === 0 ? (
          <p className="text-muted-foreground">Nuk ka artikuj ende në këtë kategori.</p>
        ) : (
          <>
            {/* Featured article — editorial hero */}
            {featured && (
              <FadeIn className="mb-10">
                <Link
                  to={`/artikull/${featured.slug}`}
                  className="group block md:grid md:grid-cols-2 gap-6 md:gap-8 bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      loading="lazy"
                      width={800}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 md:py-8 md:pr-8 flex flex-col justify-center">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColors[featured.category]} inline-block mb-4 self-start`}>
                      {featured.categoryLabel}
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <img
                        src={featured.author.avatar}
                        alt={featured.author.name}
                        loading="lazy"
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="font-medium">{featured.author.name}</span>
                      <span>·</span>
                      <span>{featured.readingTime} min lexim</span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            )}

            {/* Remaining articles grid */}
            {paginatedArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {paginatedArticles.map((article, i) => (
                  <FadeIn key={article.id} delay={i * 100}>
                    <ArticleCard article={article} />
                  </FadeIn>
                ))}
              </div>
            )}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

      </div>
    </main>
  );
}
