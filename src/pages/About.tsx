import { Sparkles } from "lucide-react";
import PageHead from "@/components/PageHead";
import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Rreth FemraDD",
    description: "Misioni ynë është të frymëzojmë dhe fuqizojmë gratë e reja shqiptare kudo në botë. Njihuni me historinë, vlerat dhe ekipin tonë redaksional.",
    inLanguage: "sq",
    url: "https://www.femradd.com/rreth-nesh",
  };

  return (
    <main id="main-content">
      <PageHead
        title="Rreth Nesh"
        description="Misioni ynë është të frymëzojmë dhe fuqizojmë gratë e reja shqiptare kudo në botë. Njihuni me historinë, vlerat dhe ekipin tonë redaksional."
        url="https://www.femradd.com/rreth-nesh"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        title="Rreth Nesh"
        subtitle="Misioni ynë është të frymëzojmë dhe fuqizojmë gratë e reja shqiptare kudo në botë."
        icon={<Sparkles className="w-6 h-6" />}
        breadcrumbs={[
          { label: "Ballina", href: "/" },
          { label: "Rreth Nesh" },
        ]}
      />

      <div className="container max-w-3xl py-8 md:py-12">
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <FadeIn>
            <p className="text-lg">
              <strong className="text-foreground">FemraDD</strong> është revista online e krijuar për gratë e reja shqiptare kudo në botë. Ne besojmë se çdo grua shqiptare meriton një hapësirë ku ndihet e përfaqësuar, e frymëzuar dhe e fuqizuar.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">Misioni ynë</h2>
          </FadeIn>
          <FadeIn>
            <p>
              Ne krijuam FemraDD sepse na mungonte një zë i ri, modern dhe autentik që flet gjuhën tonë — jo vetëm gjuhën shqipe, por edhe gjuhën e përvojave tona unikale si gra shqiptare.
            </p>
          </FadeIn>
          <FadeIn>
            <p>
              Nga kultura te dashuria, nga karriera te argëtimi — ne mbulojmë temat që kanë rëndësi për jetën tënde. Pa gjykime, pa klishe, pa filtra.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">Çfarë na bën të ndryshme</h2>
          </FadeIn>
          <FadeIn>
            <ul className="list-disc pl-6 space-y-2">
              <li>Përmbajtje 100% në shqip, e shkruar nga gra shqiptare</li>
              <li>Histori reale, jo clickbait</li>
              <li>Vlerësim i kulturës sonë duke sfiduar stereotipat</li>
              <li>Komunitet i fuqishëm grash që mbështesin njëra-tjetrën</li>
            </ul>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">Bashkohu me ne</h2>
          </FadeIn>
          <FadeIn>
            <p>
              FemraDD nuk është vetëm një revistë — është një lëvizje. Ndiq-na në rrjetet sociale dhe bëhu pjesë e komunitetit.
            </p>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
