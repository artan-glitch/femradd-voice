import Breadcrumbs from "@/components/Breadcrumbs";
import NewsletterForm from "@/components/NewsletterForm";

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Rreth FemraDD",
    description: "Misioni ynë është të frymëzojmë dhe fuqizojmë gratë e reja shqiptare kudo në botë.",
    inLanguage: "sq",
    url: "https://femradd.com/rreth-nesh",
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container max-w-3xl py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label: "Rreth Nesh" },
          ]}
        />

        <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">
          Rreth Nesh
        </h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            <strong className="text-foreground">FemraDD</strong> është revista online e krijuar për gratë e reja shqiptare kudo në botë. Ne besojmë se çdo grua shqiptare meriton një hapësirë ku ndihet e përfaqësuar, e frymëzuar dhe e fuqizuar.
          </p>

          <h2 className="font-serif text-2xl font-bold text-foreground pt-4">Misioni ynë</h2>
          <p>
            Ne krijuam FemraDD sepse na mungonte një zë i ri, modern dhe autentik që flet gjuhën tonë — jo vetëm gjuhën shqipe, por edhe gjuhën e përvojave tona unikale si gra shqiptare.
          </p>
          <p>
            Nga kultura te dashuria, nga karriera te argëtimi — ne mbulojmë temat që kanë rëndësi për jetën tënde. Pa gjykime, pa klishe, pa filtra.
          </p>

          <h2 className="font-serif text-2xl font-bold text-foreground pt-4">Çfarë na bën të ndryshme</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Përmbajtje 100% në shqip, e shkruar nga gra shqiptare</li>
            <li>Histori reale, jo clickbait</li>
            <li>Vlerësim i kulturës sonë duke sfiduar stereotipat</li>
            <li>Komunitet i fuqishëm grash që mbështesin njëra-tjetrën</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-foreground pt-4">Bashkohu me ne</h2>
          <p>
            FemraDD nuk është vetëm një revistë — është një lëvizje. Abonohu në newsletter-in tonë, ndiq-na në rrjetet sociale, dhe bëhu pjesë e komunitetit.
          </p>
        </div>

        <div className="mt-12">
          <NewsletterForm variant="inline" />
        </div>
      </div>
    </main>
  );
}
