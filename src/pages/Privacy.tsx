import heroImg from "@/assets/hero-privacy.webp";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";

export default function Privacy() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Politika e Privatësisë",
<<<<<<< HEAD
    description: "Politika e privatësisë së FemraDD — si i mbledhim, përdorim dhe mbrojmë të dhënat tuaja.",
    url: "https://www.femradd.com/privatesia",
=======
    description: "Politika e privatësisë së FemraDD — si i mbledhim, përdorim dhe mbrojmë të dhënat tuaja personale. Transparencë e plotë mbi cookies dhe ruajtjen e informacioneve.",
    url: "https://femradd.com/privatesia",
>>>>>>> 5030f00 (Fix all remaining Ahrefs SEO issues for 90+ health score)
    inLanguage: "sq",
    dateModified: "2026-03-10",
    publisher: {
      "@type": "Organization",
      name: "FemraDD",
      url: "https://www.femradd.com",
    },
  };

  return (
    <main id="main-content">
      <PageHead
        title="Politika e Privatësisë"
<<<<<<< HEAD
        description="Politika e privatësisë së FemraDD — si i mbledhim, përdorim dhe mbrojmë të dhënat tuaja."
        url="https://www.femradd.com/privatesia"
=======
        description="Politika e privatësisë së FemraDD — si i mbledhim, përdorim dhe mbrojmë të dhënat tuaja personale. Transparencë e plotë mbi cookies dhe ruajtjen e informacioneve."
        url="https://femradd.com/privatesia"
>>>>>>> 5030f00 (Fix all remaining Ahrefs SEO issues for 90+ health score)
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero image */}
      <div className="w-full aspect-[3/1] max-h-[340px] overflow-hidden">
        <img
          src={heroImg}
          alt="Politika e Privatësisë — FemraDD"
          className="w-full h-full object-cover"
          width={1200}
          height={400}
        />
      </div>

      <div className="container max-w-3xl py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label: "Politika e Privatësisë" },
          ]}
        />

        <FadeIn>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
            Politika e Privatësisë
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Përditësuar më: 10 Mars, 2026
          </p>
        </FadeIn>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <FadeIn>
            <p>
              Kjo politikë privatësie shpjegon si <strong className="text-foreground">FemraDD</strong> ("ne", "tonë") mbledh, përdor dhe mbron informacionin tuaj kur vizitoni faqen tonë në femradd.com.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">1. Informacioni që mbledhim</h2>
            <p>
              Ne mbledhim vetëm informacion minimal teknik që na ndihmon të përmirësojmë përmbajtjen tonë:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Informacion teknik si lloji i shfletuesit, sistemi operativ, dhe rezolucioni i ekranit</li>
              <li>Faqet që vizitoni dhe kohën e kaluar në to</li>
              <li>Vendi i përgjithshëm (shteti/qyteti) bazuar në adresën IP</li>
            </ul>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">2. Si e përdorim informacionin</h2>
            <p>Informacioni përdoret vetëm për:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Analizimin e trafikut dhe përmirësimin e përmbajtjes</li>
              <li>Kuptimin e preferencave të lexuesve tanë</li>
              <li>Sigurimin e funksionimit teknik të faqes</li>
            </ul>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">3. Cookies</h2>
            <p>
              FemraDD përdor cookies themelore për funksionimin e faqes (si ruajtja e preferencës tuaj të modalitetit të errët/dritës). Ne nuk përdorim cookies për gjurmimin reklamues ose ndarjen e të dhënave me palë të treta.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">4. Ndarja e të dhënave</h2>
            <p>
              Ne nuk shesim, tregtojmë, ose ndajmë informacionin tuaj personal me palë të treta, përveç rasteve kur kërkohet me ligj.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">5. Të drejtat tuaja</h2>
            <p>
              Ju keni të drejtë të kërkoni qasje, korrigjim, ose fshirje të çdo informacioni personal që kemi për ju. Për të ushtruar këto të drejta, na kontaktoni përmes{" "}
              <a href="/kontakt" className="text-primary hover:underline">formularit tonë të kontaktit</a>.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">6. Lidhjet e jashtme</h2>
            <p>
              Faqja jonë mund të përmbajë lidhje drejt faqeve të tjera. Ne nuk jemi përgjegjës për praktikat e privatësisë së faqeve të tjera dhe ju inkurajojmë të lexoni politikat e tyre të privatësisë.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">7. Ndryshimet</h2>
            <p>
              Kjo politikë mund të përditësohet herë pas here. Ndryshimet do të publikohen në këtë faqe me datën e përditësimit. Vazhdimi i përdorimit të faqes pas ndryshimeve përbën pranimin tuaj.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">8. Kontakti</h2>
            <p>
              Për çdo pyetje rreth privatësisë, na shkruani përmes{" "}
              <a href="/kontakt" className="text-primary hover:underline">faqes sonë të kontaktit</a>.
            </p>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
