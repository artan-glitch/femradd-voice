import heroImg from "@/assets/hero-article.jpg";
import lifestyleImg from "@/assets/article-lifestyle.jpg";
import datingImg from "@/assets/article-dating.jpg";
import cultureImg from "@/assets/article-culture.jpg";
import entertainmentImg from "@/assets/article-entertainment.jpg";
import wellnessImg from "@/assets/article-wellness.jpg";
import foodImg from "@/assets/article-food.jpg";
import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";
import profile4 from "@/assets/profile-4.jpg";

export type Category = "kulture" | "dashuri" | "grate-shqiptare" | "lifestyle" | "argetim";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: Category;
  categoryLabel: string;
  author: Author;
  readingTime: number;
  publishedAt: string;
  modifiedAt: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
}

export interface AlbanianWoman {
  id: string;
  name: string;
  title: string;
  image: string;
  slug: string;
}

export const categoryColors: Record<Category, string> = {
  kulture: "bg-terracotta text-primary-foreground",
  dashuri: "bg-warm-rose text-primary-foreground",
  "grate-shqiptare": "bg-charcoal text-primary-foreground",
  lifestyle: "bg-sage text-primary-foreground",
  argetim: "bg-primary text-primary-foreground",
};

export const categoryLabels: Record<Category, string> = {
  kulture: "Kulturë",
  dashuri: "Dashuri & Takime",
  "grate-shqiptare": "Gratë Shqiptare",
  lifestyle: "Lifestyle",
  argetim: "Argëtim",
};

export const authors: Author[] = [
  {
    id: "1",
    name: "Elira Hoxha",
    slug: "elira-hoxha",
    avatar: profile1,
    bio: "Gazetare dhe shkrimtare me përvojë në median shqiptare. Pasionante e kulturës, letërsisë dhe historive që frymëzojnë gratë shqiptare kudo në botë.",
  },
  {
    id: "2",
    name: "Arta Berisha",
    slug: "arta-berisha",
    avatar: profile2,
    bio: "Redaktore e lifestyle-it dhe udhëtimeve. Beson se çdo grua shqiptare meriton të jetojë jetën më të mirë të mundshme.",
  },
  {
    id: "3",
    name: "Drenushë Krasniqi",
    slug: "drenushe-krasniqi",
    avatar: profile3,
    bio: "Eksperte e marrëdhënieve dhe psikologjisë sociale. Shkruan për dashurinë, takimet dhe dinamikat moderne të çifteve shqiptare.",
  },
];

export const albanianWomen: AlbanianWoman[] = [
  { id: "1", name: "Dua Lipa", title: "Këngëtare & Ikonë Globale", image: profile1, slug: "dua-lipa" },
  { id: "2", name: "Rita Ora", title: "Këngëtare & Sipërmarrëse", image: profile2, slug: "rita-ora" },
  { id: "3", name: "Elina Duni", title: "Artiste & Muzikante Jazz", image: profile3, slug: "elina-duni" },
  { id: "4", name: "Majlinda Kelmendi", title: "Kampione Olimpike", image: profile4, slug: "majlinda-kelmendi" },
];

export const articles: Article[] = [
  {
    id: "1",
    slug: "si-po-ndryshojne-grate-shqiptare-boten",
    title: "Si po ndryshojnë gratë shqiptare botën — nga skena deri te politika",
    excerpt: "Nga Dua Lipa te politikanet e reja, gratë shqiptare po lënë gjurmë kudo. Ja pse kjo dekadë u përket atyre.",
    content: `<p>Gratë shqiptare kanë qenë gjithmonë forca e heshtur pas çdo suksesi të madh. Por tani, ato nuk janë më pas skenës — ato janë në qendër të saj.</p>
<p>Nga muzika pop globale me Dua Lipën dhe Rita Orën, deri te sukseset olimpike të Majlinda Kelmendit, gratë shqiptare po tregojnë botës se çfarë do të thotë guxim, talent dhe vendosmëri.</p>
<h2>Një gjeneratë e re liderësh</h2>
<p>Në politikë, biznes dhe art, gratë e reja shqiptare po thyejnë barrierat. Ato po sfidojnë stereotipat dhe po hapin rrugë të reja për gjeneratat e ardhshme.</p>
<h2>Ndikimi kulturor</h2>
<p>Kultura shqiptare gjithmonë ka pasur gra të forta. Por sot, ky forcë po transformohet në ndikim global. Gratë shqiptare po përcaktojnë trendet, jo vetëm duke i ndjekur ato.</p>
<p>Kjo dekadë u përket grave shqiptare. Dhe ne jemi këtu për ta treguar çdo histori.</p>`,
    image: heroImg,
    category: "grate-shqiptare",
    categoryLabel: "Gratë Shqiptare",
    author: authors[0],
    readingTime: 6,
    publishedAt: "2026-03-08",
    modifiedAt: "2026-03-08",
  },
  {
    id: "2",
    slug: "takimet-ne-epoken-dixhitale-per-shqiptaret",
    title: "Takimet në epokën dixhitale: Si po ndryshon dashuria për shqiptarët",
    excerpt: "Nga njohjet tradicionale te aplikacionet e takimeve — ja si navigojnë gratë e reja shqiptare dashurinë sot.",
    content: `<p>Dashuria ka ndryshuar. Për gratë e reja shqiptare, navigimi midis traditës dhe modernitetit është një sfidë e përditshme.</p>
<h2>Mes traditës dhe teknologjisë</h2>
<p>Aplikacionet e takimeve janë bërë pjesë e jetës, por kultura shqiptare ende vlerëson njohjet përmes familjes dhe shoqërisë. Si e gjejnë balancën gratë e reja?</p>`,
    image: datingImg,
    category: "dashuri",
    categoryLabel: "Dashuri & Takime",
    author: authors[2],
    readingTime: 5,
    publishedAt: "2026-03-07",
    modifiedAt: "2026-03-07",
  },
  {
    id: "3",
    slug: "ritualet-e-mengjesit-per-nje-jete-me-te-mire",
    title: "7 ritualet e mëngjesit që do të ndryshojnë jetën tënde",
    excerpt: "Mëngjesi yt përcakton gjithë ditën. Zbulo ritualet që gratë më të suksesshme i ndjekin çdo ditë.",
    content: `<p>Si e filloni mëngjesin tregon shumë për jetën tuaj. Këto 7 rituale janë provuar shkencërisht për të përmirësuar produktivitetin dhe mirëqenien.</p>`,
    image: wellnessImg,
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    author: authors[1],
    readingTime: 4,
    publishedAt: "2026-03-06",
    modifiedAt: "2026-03-06",
  },
  {
    id: "4",
    slug: "festivalet-e-veres-ne-shqiperi",
    title: "Festivalet e verës në Shqipëri që nuk duhet t'i humbisni",
    excerpt: "Nga Kala Festival te ngjarjet lokale — guida juaj e plotë për verën kulturore shqiptare 2026.",
    content: `<p>Vera shqiptare nuk është vetëm plazh dhe diell. Është edhe muzikë, art dhe kulturë. Ja festivalet që duhet t'i keni në kalendar.</p>`,
    image: cultureImg,
    category: "kulture",
    categoryLabel: "Kulturë",
    author: authors[0],
    readingTime: 7,
    publishedAt: "2026-03-05",
    modifiedAt: "2026-03-05",
  },
  {
    id: "5",
    slug: "receta-tradicionale-shqiptare-moderne",
    title: "5 receta tradicionale shqiptare me një kthesë moderne",
    excerpt: "Byrek, tavë kosi, dhe më shumë — por siç nuk i keni parë kurrë më parë. Gatimi shqiptar takon kuzhinën bashkëkohore.",
    content: `<p>Kuzhina shqiptare është e pasur dhe e larmishme. Por çfarë ndodh kur recetat e gjysheve takojnë teknikat moderne të gatimit?</p>`,
    image: foodImg,
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    author: authors[1],
    readingTime: 8,
    publishedAt: "2026-03-04",
    modifiedAt: "2026-03-04",
  },
  {
    id: "6",
    slug: "filmat-shqiptare-ne-festivalet-nderkombetare",
    title: "Filmat shqiptarë që po pushtojnë festivalet ndërkombëtare",
    excerpt: "Kinema shqiptare po jeton një moment artë. Zbuloni filmat që po fitojnë çmime kudo në botë.",
    content: `<p>Nga Cannes te Berlin, filmat shqiptarë po tërheqin vëmendjen e botës. Ja pse kjo periudhë është e veçantë për kinematografinë shqiptare.</p>`,
    image: entertainmentImg,
    category: "argetim",
    categoryLabel: "Argëtim",
    author: authors[0],
    readingTime: 5,
    publishedAt: "2026-03-03",
    modifiedAt: "2026-03-03",
  },
  {
    id: "7",
    slug: "self-care-per-grate-shqiptare",
    title: "Self-care nuk është luks — është domosdoshmëri për gratë shqiptare",
    excerpt: "Pse kujdesi për veten nuk është egoizëm, por akti më i rëndësishëm i dashurisë që mund të bëni.",
    content: `<p>Në kulturën shqiptare, gratë shpesh vënë të tjerët përpara vetes. Por kujdesi për veten është themeli i çdo gjëje tjetër.</p>`,
    image: lifestyleImg,
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    author: authors[2],
    readingTime: 4,
    publishedAt: "2026-03-02",
    modifiedAt: "2026-03-02",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: Category): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getRelatedArticles(articleId: string, count = 3): Article[] {
  const article = articles.find((a) => a.id === articleId);
  if (!article) return articles.slice(0, count);
  return articles
    .filter((a) => a.id !== articleId && a.category === article.category)
    .concat(articles.filter((a) => a.id !== articleId && a.category !== article.category))
    .slice(0, count);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return articles.filter((a) => a.author.slug === authorSlug);
}
