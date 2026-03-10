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
  {
    id: "8",
    slug: "fuqia-e-miqesise-femeore-pse-shoqet-jane-shpirti-yt",
    title: "Fuqia e miqësisë femërore: Pse shoqet janë shpirti yt i dytë",
    excerpt: "Miqësia midis grave nuk është thjesht shoqëri — është një forcë transformuese që ndryshon jetën. Zbulo pse lidhjet femërore janë aq të rëndësishme.",
    content: `<p>Ka një të vërtetë që shumë gra e njohin thellë në zemër por rrallë e shprehin me fjalë: miqësia me një grua tjetër mund të jetë një nga lidhjet më të fuqishme dhe transformuese që do të përjetoni ndonjëherë. Në një botë që shpesh na mëson të konkurrojmë me njëra-tjetrën, e vërteta është krejt e kundërta — kur gratë mbështesin gratë, ndodhin gjëra të jashtëzakonshme.</p>

<h2>Çfarë e bën miqësinë femërore kaq të veçantë?</h2>

<h3>Një lidhje që shkon përtej fjalëve</h3>

<p>Miqësia femërore ka një cilësi unike që e dallon nga çdo marrëdhënie tjetër. Është aftësia për të kuptuar pa folur, për të ndjer dhimbjen e tjetrës sikur të ishte e jotja, dhe për të festuar sukseset e shoqes me po aq gëzim sa do të festonit tuajat. Kjo nuk është romantizim — është shkencë. Studimet tregojnë se gratë lëshojnë oksitocin, hormonin e lidhjes, kur ndajnë kohë cilësore me shoqet e tyre. Ky reagim biokimik na ndihmon të ulim stresin, të përmirësojmë shëndetin mendor dhe madje të jetojmë më gjatë.</p>

<h3>Roli i kulturës shqiptare</h3>

<p>Për gratë shqiptare, kjo lidhje ka një shtresë ende më të thellë. Kultura jonë, me gjithë bukuritë e saj, ka vendosur shpesh pritshmëri të larta mbi supet e grave — të jesh nënë e përkryer, bashkëshorte e përkushtuar, bijë e respektueshme, profesioniste e suksesshme. Në mes të gjithë këtyre roleve, shoqet bëhen hapësira e vetme ku mund të jesh thjesht ti — pa maska, pa pritshmëri, pa gjykim. Siç kemi shkruar edhe në artikullin <a href="/artikull/self-care-per-grate-shqiptare">pse self-care është domosdoshmëri për gratë shqiptare</a>, kujdesi për veten fillon pikërisht nga lidhjet që na mbajnë të forta.</p>

<figure><img src="${heroImg}" alt="Gratë shqiptare duke ecur së bashku — fuqia e miqësisë femërore" /><figcaption>Miqësia femërore është një nga forcat më transformuese në jetën e grave shqiptare.</figcaption></figure>

<h2>Shoqet si pasqyrë e vërtetë</h2>

<h3>Ndershmëria me dashuri</h3>

<p>Një nga dhuratat më të mëdha të miqësisë femërore është ndershmëria. Një shoqe e mirë nuk të thotë gjithmonë atë që dëshiron të dëgjosh — ajo të thotë atë që ke nevojë të dëgjosh. Kur je duke bërë një gabim, ajo ta thotë me dashuri por pa frikë. Kur nuk e sheh vlerën tënde, ajo bëhet pasqyra që të kujton kush je në të vërtetë.</p>

<blockquote>Kur gratë mbështesin gratë, ndodhin gjëra të jashtëzakonshme.</blockquote>

<h3>Guximi për të qenë e vërtetë</h3>

<p>Kjo ndershmëri nuk vjen nga dëshira për të kontrolluar apo gjykuar. Vjen nga një vend i thellë dashurije — nga dija se jeta e shoqes tënde mund të jetë më e mirë, dhe refuzimi për ta lënë të kënaqet me më pak sesa meriton. Sa herë keni ndryshuar vendim për diçka të rëndësishme pas një bisede të gjatë me shoqen tuaj të ngushtë? Sa herë ju ka dhënë guximin për të bërë atë hap që e kishit frikë?</p>

<h2>Mbështetja në momentet e vështira</h2>

<h3>Tradita shqiptare e grumbullimit</h3>

<p>Jeta nuk është gjithmonë e lehtë, dhe momentet më të vështira janë ato që tregojnë cilësinë e vërtetë të miqësive tona. Kur humbasim dikë që duam, kur marrëdhënia përfundon, kur puna nuk shkon si duhet, kur shëndeti na tradhton — në këto momente, shoqet bëhen shtylla jonë.</p>

<p>Në kulturën shqiptare, ka një traditë të bukur që shpesh nuk vlerësohet sa duhet: grumbullimi i grave në momente të vështira. Kur dikush sëmuret, kur ndodh një humbje, gratë mblidhen. Sjellin ushqim, ofrojnë krahë, qëndrojnë pranë. Kjo nuk është thjesht zakon — është një sistem mbështetës që ka funksionuar për shekuj, dhe që ne duhet ta ruajmë dhe ta forcojmë. Është e njëjta forcë kolektive që po i çon <a href="/artikull/si-po-ndryshojne-grate-shqiptare-boten">gratë shqiptare të ndryshojnë botën</a> — nga skena deri te politika.</p>

<figure><img src="${wellnessImg}" alt="Moment relaksi dhe kujdesi — mbështetja midis shoqeve" /><figcaption>Mbështetja e përditshme është themeli i çdo miqësie të fortë.</figcaption></figure>

<h3>Prezenca e përditshme</h3>

<p>Por mbështetja nuk duhet të vijë vetëm në momente krize. Miqësia e vërtetë kërkon prezencë të vazhdueshme — telefonata të rregullta, takime për kafe, mesazhe të vogla që thonë "po mendoj për ty." Këto gjeste të vogla ndërtojnë urën që do t'ju mbajë kur stuhia të vijë.</p>

<h2>Festimi i njëra-tjetrës pa zili</h2>

<h3>Krahasimi — armiku i miqësisë</h3>

<p>Një nga sfidat më të mëdha në miqësinë femërore është zilia — ndjenja aq njerëzore por aq shkatërruese. Kultura moderne, veçanërisht rrjetet sociale, na bën të krahasojmë jetët tona me ato të të tjerave çdo ditë. Shoqja u martua? Pse nuk jam unë? Shoqja mori punën e ëndrrave? Pse jo unë? Nëse po ndiheni kështu edhe në marrëdhënie, lexoni artikullin tonë mbi <a href="/artikull/takimet-ne-epoken-dixhitale-per-shqiptaret">si po ndryshon dashuria në epokën dixhitale</a> — navigimi i ndjenjave moderne kërkon vetëdije.</p>

<h3>Suksesi kolektiv</h3>

<p>Por miqësia e vërtetë na mëson diçka të rëndësishme: suksesi i shoqes sate nuk është dështimi yt. Ka vend për të gjitha. Kur shoqja jote fiton, ti nuk humbet — përkundrazi, ti fiton një model, një frymëzim, një provë se ëndrrat realizohen. Gratë që arrijnë të festojnë njëra-tjetrën pa rezerva krijojnë një energji kolektive që i ngre të gjitha.</p>

<p>Në vend që të shikoni suksesin e shoqes si kërcënim, provoni ta shikoni si mundësi. Pyesni veten: çfarë mund të mësoj nga rruga e saj? Si mund ta mbështes? Si mund të inspirohemi nga njëra-tjetra për të arritur qëllimet tona?</p>

<figure><img src="${foodImg}" alt="Takim miqësor për kafe dhe ushqim — ritualet e miqësisë" /><figcaption>Nga kafeja e mëngjesit te darka e së premtes — ritualet e vogla forcojnë lidhjet e mëdha.</figcaption></figure>

<blockquote>Suksesi i shoqes sate nuk është dështimi yt. Ka vend për të gjitha.</blockquote>

<h2>Si të ndërtojmë miqësi më të forta</h2>

<h3>Këshilla praktike për çdo ditë</h3>

<p>Miqësia, si çdo marrëdhënie tjetër, kërkon punë dhe përkushtim. Ja disa mënyra praktike për të forcuar lidhjet me shoqet tuaja:</p>

<p><strong>Jini të pranishme.</strong> Jo vetëm fizikisht, por emocionalisht. Kur shoqja juaj flet, dëgjoni vërtet. Vendoseni telefonin poshtë. Shikojeni në sy. Tregoni se ajo ka rëndësi.</p>

<p><strong>Jini të ndershme me dashuri.</strong> Mos kini frikë të thoni të vërtetën, por gjithmonë me respekt dhe dashuri. Ndershmëria pa empati është thjesht ashpërsi.</p>

<p><strong>Festoni momentet e vogla.</strong> Jo vetëm ditëlindjet dhe arritjet e mëdha — festoni edhe ditët e zakonshme kur shoqja juaj thjesht ekziston në jetën tuaj.</p>

<h3>Rritja dhe falja</h3>

<p><strong>Kërkoni falje kur gaboni.</strong> Askush nuk është i përsosur. Aftësia për të pranuar gabimin dhe për të kërkuar falje është shenja e miqësisë së pjekur.</p>

<p><strong>Lëni hapësirë për rritje.</strong> Njerëzit ndryshojnë, dhe kjo është normale. Lejojeni shoqen tuaj të rritet, edhe nëse kjo do të thotë se marrëdhënia juaj do të duket ndryshe nga si ishte më parë.</p>

<h2>Përfundim: Një thirrje për solidaritet femëror</h2>

<p>Në fund, miqësia femërore nuk është thjesht çështje personale — është çështje sociale. Kur gratë mbështesin njëra-tjetrën, komunitete të tëra forcohen. Fëmijët rritën me modele pozitive marrëdhëniesh. Vendet e punës bëhen më të drejta. Shoqëria bëhet më e mirë.</p>

<p>Pra, sot, merrni telefonin dhe thirrni atë shoqe me të cilën nuk keni folur kohët e fundit. Shkruajini asaj që ju mungon. Organizoni një darkë me shoqet tuaja. Sepse miqësia femërore nuk është luks — është një nga gjërat më të çmuara që kemi në jetë. Dhe ajo meriton të kultivohet çdo ditë.</p>`,
    image: lifestyleImg,
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    author: authors[1],
    readingTime: 7,
    publishedAt: "2026-03-10",
    modifiedAt: "2026-03-10",
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

export function getAdjacentArticles(articleId: string): { prev: Article | undefined; next: Article | undefined } {
  const idx = articles.findIndex((a) => a.id === articleId);
  return {
    prev: idx > 0 ? articles[idx - 1] : undefined,
    next: idx < articles.length - 1 ? articles[idx + 1] : undefined,
  };
}
