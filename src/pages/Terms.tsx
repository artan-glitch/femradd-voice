import heroImg from "@/assets/hero-terms.jpg";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";

export default function Terms() {
  return (
    <main id="main-content">
      <PageHead
        title="Kushtet e Përdorimit"
        description="Kushtet e përdorimit të faqes FemraDD — rregullat dhe kushtet për përdorimin e platformës sonë."
        url="https://femradd.com/kushtet"
      />

      {/* Hero image */}
      <div className="w-full aspect-[3/1] max-h-[340px] overflow-hidden">
        <img
          src={heroImg}
          alt="Kushtet e Përdorimit — FemraDD"
          className="w-full h-full object-cover"
          width={1200}
          height={400}
        />
      </div>

      <div className="container max-w-3xl py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label: "Kushtet e Përdorimit" },
          ]}
        />

        <FadeIn>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-2">
            Kushtet e Përdorimit
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Përditësuar më: 10 Mars, 2026
          </p>
        </FadeIn>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <FadeIn>
            <p>
              Duke përdorur faqen <strong className="text-foreground">FemraDD</strong> (femradd.com), ju pranoni këto kushte përdorimi. Nëse nuk pajtoheni me to, ju lutemi mos e përdorni faqen.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="font-serif text-2xl font-bold text-foreground pt-4">1. Përmbajtja</h2>
            <p>
              E gjithë përmbajtja në FemraDD — duke përfshirë artikujt, imazhet, dizajnin dhe logon — janë pronësi intelektuale e FemraDD ose autorëve përkatës. Përmbajtja ofrohet vetëm për përdorim personal dhe jo-komercial.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="font-serif text-2xl font-bold text-foreground pt-4">2. Përdorimi i lejuar</h2>
            <p>Ju mund të:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Lexoni dhe ndani artikujt me lidhje direkte</li>
              <li>Citoni fragmente të shkurtra me kredit dhe lidhje</li>
              <li>Printoni artikujt për përdorim personal</li>
            </ul>
          </FadeIn>

          <FadeIn>
            <h2 className="font-serif text-2xl font-bold text-foreground pt-4">3. Përdorimi i ndaluar</h2>
            <p>Nuk lejohet:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Kopjimi, ripublikimi, ose shpërndarja e përmbajtjes pa lejen tonë</li>
              <li>Përdorimi i përmbajtjes për qëllime komerciale pa autorizim</li>
              <li>Modifikimi ose shtrembërimi i përmbajtjes sonë</li>
              <li>Përdorimi i emrit ose logos së FemraDD pa lejen tonë me shkrim</li>
            </ul>
          </FadeIn>

          <FadeIn>
            <h2 className="font-serif text-2xl font-bold text-foreground pt-4">4. Mohimi i përgjegjësisë</h2>
            <p>
              Përmbajtja në FemraDD ofrohet "siç është" për qëllime informuese dhe argëtuese. Ne nuk garantojmë saktësinë, plotësinë, ose aktualitetin e informacionit. Artikujt nuk përbëjnë këshillë profesionale mjekësore, ligjore, ose financiare.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="font-serif text-2xl font-bold text-foreground pt-4">5. Lidhjet e jashtme</h2>
            <p>
              FemraDD mund të përfshijë lidhje drejt faqeve të tjera. Ne nuk jemi përgjegjës për përmbajtjen ose praktikat e faqeve të jashtme.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="font-serif text-2xl font-bold text-foreground pt-4">6. Ndryshimet</h2>
            <p>
              Ne rezervojmë të drejtën të ndryshojmë këto kushte në çdo kohë. Ndryshimet hyjnë në fuqi menjëherë pas publikimit në këtë faqe. Vazhdimi i përdorimit pas ndryshimeve përbën pranimin tuaj.
            </p>
          </FadeIn>

          <FadeIn>
            <h2 className="font-serif text-2xl font-bold text-foreground pt-4">7. Kontakti</h2>
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
