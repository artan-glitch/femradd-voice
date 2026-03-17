import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";

export interface AuthorSocial {
  platform: "instagram" | "twitter" | "linkedin" | "facebook";
  url: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  socials?: AuthorSocial[];
}

export const authors: Author[] = [
  {
    id: "1",
    name: "Elira Hoxha",
    slug: "elira-hoxha",
    avatar: profile1,
    bio: "Gazetare dhe shkrimtare me përvojë në median shqiptare. Pasionante e kulturës, letërsisë dhe historive që frymëzojnë gratë shqiptare kudo në botë.",
    socials: [
      { platform: "instagram", url: "https://instagram.com/elirahoxha" },
      { platform: "twitter", url: "https://twitter.com/elirahoxha" },
      { platform: "linkedin", url: "https://linkedin.com/in/elirahoxha" },
    ],
  },
  {
    id: "2",
    name: "Arta Berisha",
    slug: "arta-berisha",
    avatar: profile2,
    bio: "Redaktore e lifestyle-it dhe udhëtimeve. Beson se çdo grua shqiptare meriton të jetojë jetën më të mirë të mundshme.",
    socials: [
      { platform: "instagram", url: "https://instagram.com/artaberisha" },
      { platform: "facebook", url: "https://facebook.com/artaberisha" },
      { platform: "linkedin", url: "https://linkedin.com/in/artaberisha" },
    ],
  },
  {
    id: "3",
    name: "Drenushë Krasniqi",
    slug: "drenushe-krasniqi",
    avatar: profile3,
    bio: "Eksperte e marrëdhënieve dhe psikologjisë sociale. Shkruan për dashurinë, takimet dhe dinamikat moderne të çifteve shqiptare.",
    socials: [
      { platform: "instagram", url: "https://instagram.com/drenushekrasniqi" },
      { platform: "twitter", url: "https://twitter.com/drenushek" },
      { platform: "linkedin", url: "https://linkedin.com/in/drenushekrasniqi" },
    ],
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}
