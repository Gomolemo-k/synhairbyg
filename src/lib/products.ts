export type WigType = "Synthetic" | "Human Blend";

export type CollectionSlug = "signature-blend" | "synthetic" | "bridal-occasion";

export type Product = {
  id: string;
  slug: string;
  name: string;
  short: string;
  description: string;
  type: WigType;
  price: number;
  compareAtPrice?: number;
  length: string;
  texture: string;
  capType: string;
  density: string;
  color: string;
  stock: number;
  featured?: boolean;
  badge?: string;
  collection: CollectionSlug;
  gradient: [string, string];
};

export type Collection = {
  slug: CollectionSlug;
  name: string;
  tagline: string;
  description: string;
  gradient: [string, string];
};

export const collections: Collection[] = [
  {
    slug: "signature-blend",
    name: "Signature Human Blend",
    tagline: "The crown jewels",
    description:
      "Hand-finished human blend wigs with soft lace and a natural scalp line. The everyday luxury our babes swear by.",
    gradient: ["#6b1f2b", "#8b3040"],
  },
  {
    slug: "synthetic",
    name: "Synthetic Edit",
    tagline: "Flawless on a budget",
    description:
      "Silky, pre-styled synthetics that hold their shape from day one. Affordable, low-maintenance, and seriously pretty.",
    gradient: ["#f4dde2", "#ffffff"],
  },
  {
    slug: "bridal-occasion",
    name: "Bridal & Occasion",
    tagline: "For the days you shine",
    description:
      "Soft waves and romantic lengths made for weddings, parties, and every moment you want to feel unforgettable.",
    gradient: ["#c9a46c", "#f4dde2"],
  },
];

export const products: Product[] = [
  {
    id: "p01",
    slug: "cape-signature",
    name: "Cape Signature",
    short: "Silky straight, melt-away 360 lace",
    description:
      "Our best-selling human blend made silky straight with a soft 360 lace that lets you style any part. Pre-plucked hairline, single machine weft, and a cap that sits light all day.",
    type: "Human Blend",
    price: 1650,
    compareAtPrice: 1990,
    length: "20\u2033",
    texture: "Silky Straight",
    capType: "360 Lace Frontal",
    density: "150%",
    color: "Natural Black",
    stock: 8,
    featured: true,
    badge: "Best Seller",
    collection: "signature-blend",
    gradient: ["#6b1f2b", "#8b3040"],
  },
  {
    id: "p02",
    slug: "royal-blend-curls",
    name: "Royal Blend Curls",
    short: "Bouncy body wave with a HD hairline",
    description:
      "Deep, defined body wave in a 26-inch royal fall. The HD lace blends into any skin tone and the baby hairs are ready-made for a snatched install.",
    type: "Human Blend",
    price: 2190,
    compareAtPrice: 2590,
    length: "26\u2033",
    texture: "Body Wave",
    capType: "Glueless HD Frontal",
    density: "180%",
    color: "Dark Brown",
    stock: 6,
    featured: true,
    badge: "Fan Favourite",
    collection: "signature-blend",
    gradient: ["#8b3040", "#6b1f2b"],
  },
  {
    id: "p03",
    slug: "bella-360",
    name: "Bella 360",
    short: "Long, straight and full-bodied",
    description:
      "A 28-inch straight with serious swing. The 360 frontal allows for high ponytails, sleek buns, and all your middle-part bosses.",
    type: "Human Blend",
    price: 2390,
    length: "28\u2033",
    texture: "Bone Straight",
    capType: "360 Frontal",
    density: "180%",
    color: "Jet Black",
    stock: 5,
    collection: "signature-blend",
    gradient: ["#6b1f2b", "#211a1c"],
  },
  {
    id: "p04",
    slug: "aurelia-glueless",
    name: "Aurelia Glueless",
    short: "Waist-length kinky straight, zero glue",
    description:
      "Our longest style at 30 inches. Kinky straight texture with a glueless cap that grips with combs and straps — install in minutes, wear for weeks.",
    type: "Human Blend",
    price: 3250,
    length: "30\u2033",
    texture: "Kinky Straight",
    capType: "Glueless (Comb & Strap)",
    density: "200%",
    color: "Natural Black",
    stock: 4,
    badge: "Premium",
    collection: "signature-blend",
    gradient: ["#211a1c", "#6b1f2b"],
  },
  {
    id: "p05",
    slug: "midas-touch",
    name: "Midas Touch",
    short: "Honey-blonde balayage body wave",
    description:
      "Sunkissed honey-blonde balayage over a dark root, cut into body wave. The blend transitions so smoothly people will test the hairline.",
    type: "Human Blend",
    price: 2290,
    compareAtPrice: 2750,
    length: "22\u2033",
    texture: "Body Wave",
    capType: "Glueless Frontal",
    density: "150%",
    color: "Honey Blonde Balayage",
    stock: 3,
    badge: "Trending",
    collection: "signature-blend",
    gradient: ["#c9a46c", "#8b3040"],
  },
  {
    id: "p06",
    slug: "everyday-wear",
    name: "Everyday Wear",
    short: "Budget-friendly kinky straight",
    description:
      "The wig you live in. 16 inches of kinky straight on a breathable cap that stays put through workouts, school runs, and long days.",
    type: "Human Blend",
    price: 1390,
    compareAtPrice: 1650,
    length: "16\u2033",
    texture: "Kinky Straight",
    capType: "Lace Front, Adjustable Straps",
    density: "180%",
    color: "Natural Black",
    stock: 12,
    featured: true,
    badge: "Value Pick",
    collection: "signature-blend",
    gradient: ["#f4dde2", "#8b3040"],
  },
  {
    id: "p07",
    slug: "elegance-u-part",
    name: "Elegance U-Part",
    short: "Quick leave-out glory",
    description:
      "A laid-back U-part wig that lets your own edges do the talking. 18 inches of silky straight with an open crown for natural scalp.",
    type: "Human Blend",
    price: 1790,
    length: "18\u2033",
    texture: "Silky Straight",
    capType: "U-Part",
    density: "130%",
    color: "Natural Black",
    stock: 7,
    collection: "bridal-occasion",
    gradient: ["#8b3040", "#c9a46c"],
  },
  {
    id: "p08",
    slug: "wedding-day-wonder",
    name: "Wedding Day Wonder",
    short: "Soft romantic waves for your big day",
    description:
      "24 inches of soft, romantic curl with a sweet scalp and pre-plucked part. Made for vows, first dances, and a thousand photos.",
    type: "Human Blend",
    price: 2490,
    length: "24\u2033",
    texture: "Soft Water Wave",
    capType: "HD Frontal",
    density: "180%",
    color: "Honey Brown",
    stock: 5,
    featured: true,
    badge: "Bridal Pick",
    collection: "bridal-occasion",
    gradient: ["#c9a46c", "#f4dde2"],
  },
  {
    id: "p09",
    slug: "luna-silhouette",
    name: "Luna Silhouette",
    short: "Waist-length body wave glam",
    description:
      "A 30-inch body wave silhouette with a glueless cap and feather-soft ends. Turn heads from every angle without touching glue.",
    type: "Human Blend",
    price: 2790,
    compareAtPrice: 3290,
    length: "30\u2033",
    texture: "Body Wave",
    capType: "Glueless Frontal",
    density: "200%",
    color: "Natural Black",
    stock: 4,
    collection: "bridal-occasion",
    gradient: ["#8b3040", "#6b1f2b"],
  },
  {
    id: "p10",
    slug: "gisele-glossy-bob",
    name: "Gisele Glossy Bob",
    short: "Effortless jaw-skimming bob",
    description:
      "A chin-skimming bob with a glassy gloss finish. Pre-styled, cut, and layered — this one is literally zip-and-go.",
    type: "Synthetic",
    price: 549,
    compareAtPrice: 699,
    length: "10\u2033",
    texture: "Silky Straight",
    capType: "Glueless Lace Front",
    density: "120%",
    color: "Jet Black",
    stock: 15,
    badge: "New",
    collection: "synthetic",
    gradient: ["#f4dde2", "#ffffff"],
  },
  {
    id: "p11",
    slug: "miami-deep-wave",
    name: "Miami Deep Wave",
    short: "Slinky waves with major volume",
    description:
      "Deep, slinky waves that hold their pattern wash after wash. A lace front you can part, plus heat-friendly fibres for restyling.",
    type: "Synthetic",
    price: 699,
    compareAtPrice: 849,
    length: "24\u2033",
    texture: "Deep Wave",
    capType: "Lace Front",
    density: "130%",
    color: "Burgundy Black",
    stock: 10,
    featured: true,
    badge: "Best Seller",
    collection: "synthetic",
    gradient: ["#8b3040", "#6b1f2b"],
  },
  {
    id: "p12",
    slug: "silk-straight-basics",
    name: "Silk Straight Basics",
    short: "Sleek and shiny, zero effort",
    description:
      "The essential silk-straight synthetic with a natural shine and a skin-top part. Wear down with the length or pull into a low pony.",
    type: "Synthetic",
    price: 589,
    length: "22\u2033",
    texture: "Silk Straight",
    capType: "Glueless Lace Front",
    density: "120%",
    color: "Natural Black",
    stock: 12,
    collection: "synthetic",
    gradient: ["#f4dde2", "#c9a46c"],
  },
  {
    id: "p13",
    slug: "strawberry-kiss",
    name: "Strawberry Kiss Colour",
    short: "Playful strawberry-blonde waves",
    description:
      "A soft strawberry-blonde fade on loose waves that light up every room. A colour piece for the days your personality needs colour.",
    type: "Synthetic",
    price: 529,
    compareAtPrice: 649,
    length: "18\u2033",
    texture: "Loose Wave",
    capType: "Lace Front",
    density: "130%",
    color: "Strawberry Blonde",
    stock: 9,
    badge: "Limited Colour",
    collection: "synthetic",
    gradient: ["#c9a46c", "#f4dde2"],
  },
  {
    id: "p14",
    slug: "midnight-curls",
    name: "Midnight Curls",
    short: "Tight, springy midnight black curls",
    description:
      "Bouncy 3B curls in deep midnight black. Heat-safe fibres hold their shape through humidity, rain, and dancefloors.",
    type: "Synthetic",
    price: 649,
    length: "20\u2033",
    texture: "3B Curly",
    capType: "Glueless Lace Front",
    density: "140%",
    color: "Blue Black",
    stock: 8,
    badge: "New",
    collection: "synthetic",
    gradient: ["#211a1c", "#6b1f2b"],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function getProductsByCollection(slug: CollectionSlug) {
  return products.filter((p) => p.collection === slug);
}

export const FEATURED = products.filter((p) => p.featured);

export const FREE_SHIPPING_THRESHOLD = 1500;
export const SHIPPING_FLAT_RATE = 129;