import { Link } from "react-router-dom";
import { authors, getArticlesByAuthor } from "@/data/articles";
import heroImg from "@/assets/hero-editorial.webp";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";

export default function Editorial() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Redaksia — FemraDD",
    description: "Njihuni me ekipin redaksional pas FemraDD — gazetaret dhe shkrimtaret që krijojnë përmbajtjen tonë.",
    inLanguage: "sq",
    url: "https://femradd.com/redaksia",
  };

  return (
    <main id="main-content">
      <PageHead
        title="Redaksia"
        description="Njihuni me ekipin redaksional pas FemraDD — gazetaret dhe shkrimtaret që krijojnë përmbajtjen tonë."
        url="https://femradd.com/redaksia"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero image */}
      <div className="w-full aspect-[3/1] max-h-[340px] overflow-hidden">
        <img
          src={heroImg}
          alt="Redaksia e FemraDD"
          className="w-full h-full object-cover"
          width={1200}
          height={400}
        />
      </div>

      <div className="container max-w-4xl py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label: "Redaksia" },
          ]}
        />

        <FadeIn>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Redaksia
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-2xl">
            Pas çdo artikulli në FemraDD qëndron një grua shqiptare me pasion, përvojë dhe zë unik. Njihuni me ekipin tonë.
          </p>
        </FadeIn>

        <div className="space-y-8">
          {authors.map((author, i) => {
            const articleCount = getArticlesByAuthor(author.slug).length;
            return (
              <FadeIn key={author.id} delay={i * 100}>
                <Link
                  to={`/autore/${author.slug}`}
                  className="group flex flex-col sm:flex-row items-start gap-6 bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <img
                    src={author.avatar}
                    alt={author.name}
                    loading="lazy"
                    width={120}
                    height={120}
                    className="w-28 h-28 rounded-full object-cover ring-2 ring-primary/20 ring-offset-4 ring-offset-card shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {author.name}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {author.bio}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      {articleCount} {articleCount === 1 ? "artikull" : "artikuj"} të publikuar
                    </p>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn>
          <div className="mt-16 bg-card rounded-xl p-8 shadow-card text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Dëshiron të shkruash për ne?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
              FemraDD gjithmonë kërkon zëra të rinj. Nëse je gazetare, shkrimtare, ose krijuese përmbajtjeje dhe dëshiron të kontribuosh, na shkruaj.
            </p>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Na kontakto
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
