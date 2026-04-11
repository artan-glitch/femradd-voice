import { FileText } from "lucide-react";
import PageHead from "@/components/PageHead";
import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";

export default function Terms() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Kushtet e Përdorimit",
    description: "Kushtet e përdorimit të faqes FemraDD — rregullat, detyrimet dhe kushtet për përdorimin e platformës sonë. Lexoni përpara se të vazhdoni.",
    url: "https://www.femradd.com/kushtet",
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
        title="Kushtet e Përdorimit"
        description="Kushtet e përdorimit të faqes FemraDD — rregullat, detyrimet dhe kushtet për përdorimin e platformës sonë. Lexoni përpara se të vazhdoni."
        url="https://www.femradd.com/kushtet"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        title="Kushtet e Përdorimit"
        icon={<FileText className="w-6 h-6" />}
        breadcrumbs={[
          { label: "Ballina", href: "/" },
          { label: "Kushtet e Përdorimit" },
        ]}
        updatedAt="10 Mars, 2026"
      />

      <div className="container max-w-3xl py-8 md:py-12">
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <FadeIn>
            <p>
              Duke përdorur faqen <strong className="text-foreground">FemraDD</strong> (femradd.com), ju pranoni këto kushte përdorimi. Nëse nuk pajtoheni me to, ju lutemi mos e përdorni faqen.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">1. Përmbajtja</h2>
            <p>
              E gjithë përmbajtja në FemraDD — duke përfshirë artikujt, imazhet, dizajnin dhe logon — janë pronësi intelektuale e FemraDD ose autorëve përkatës. Përmbajtja ofrohet vetëm për përdorim personal dhe jo-komercial.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">2. Përdorimi i lejuar</h2>
            <p>Ju mund të:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Lexoni dhe ndani artikujt me lidhje direkte</li>
              <li>Citoni fragmente të shkurtra me kredit dhe lidhje</li>
              <li>Printoni artikujt për përdorim personal</li>
            </ul>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">3. Përdorimi i ndaluar</h2>
            <p>Nuk lejohet:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Kopjimi, ripublikimi, ose shpërndarja e përmbajtjes pa lejen tonë</li>
              <li>Përdorimi i përmbajtjes për qëllime komerciale pa autorizim</li>
              <li>Modifikimi ose shtrembërimi i përmbajtjes sonë</li>
              <li>Përdorimi i emrit ose logos së FemraDD pa lejen tonë me shkrim</li>
            </ul>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">4. Mohimi i përgjegjësisë</h2>
            <p>
              Përmbajtja në FemraDD ofrohet "siç është" për qëllime informuese dhe argëtuese. Ne nuk garantojmë saktësinë, plotësinë, ose aktualitetin e informacionit. Artikujt nuk përbëjnë këshillë profesionale mjekësore, ligjore, ose financiare.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">5. Lidhjet e jashtme</h2>
            <p>
              FemraDD mund të përfshijë lidhje drejt faqeve të tjera. Ne nuk jemi përgjegjës për përmbajtjen ose praktikat e faqeve të jashtme.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">6. Ndryshimet</h2>
            <p>
              Ne rezervojmë të drejtën të ndryshojmë këto kushte në çdo kohë. Ndryshimet hyjnë në fuqi menjëherë pas publikimit në këtë faqe. Vazhdimi i përdorimit pas ndryshimeve përbën pranimin tuaj.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground pt-4">7. Kontakti</h2>
            <p>
              Për pyetje rreth këtyre kushteve, na shkruani përmes{" "}
              <a href="/kontakt" className="text-primary hover:underline">faqes sonë të kontaktit</a>.
            </p>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
