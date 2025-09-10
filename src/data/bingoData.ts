export interface BingoSquare {
  id: number;
  text: string;
  category:
    | "zekerheid"
    | "betaalbaarheid"
    | "tijdelijkheid"
    | "beschikbaarheid"
    | "free";
}

export const categoryColors = {
  zekerheid: "bg-purple-200",
  betaalbaarheid: "bg-violet-200",
  tijdelijkheid: "bg-fuchsia-200",
  beschikbaarheid: "bg-pink-200",
  free: "bg-purple-300",
} as const;

export const bingoSquares: BingoSquare[] = [
  // Zekerheid
  {
    id: 1,
    text: "Weet je niet of je volgend jaar nog in je huis kunt wonen?",
    category: "zekerheid",
  },
  {
    id: 2,
    text: "Heb je geen huur-bescherming?",
    category: "zekerheid",
  },
  {
    id: 3,
    text: "Kun je geen vrienden uitnodigen vanwege woonsituatie?",
    category: "zekerheid",
  },
  {
    id: 4,
    text: "Leef je met de angst uit je huis gezet te worden?",
    category: "zekerheid",
  },
  {
    id: 5,
    text: "Heb je geen zeggenschap over je leefomgeving?",
    category: "zekerheid",
  },
  {
    id: 6,
    text: "Voel je je niet thuis in je huis?",
    category: "zekerheid",
  },

  // Betaalbaarheid
  {
    id: 7,
    text: "Is je huur hoger dan 700 euro?",
    category: "betaalbaarheid",
  },
  {
    id: 8,
    text: "Besteed je meer dan 40% van je inkomen aan wonen?",
    category: "betaalbaarheid",
  },
  {
    id: 9,
    text: "Kun je geen geld sparen door hoge woonkosten?",
    category: "betaalbaarheid",
  },
  {
    id: 10,
    text: "Krijg je huurverhoging bij slecht onderhoud?",
    category: "betaalbaarheid",
  },
  {
    id: 11,
    text: "Heb je huur-achterstand gehad?",
    category: "betaalbaarheid",
  },
  {
    id: 12,
    text: "Kun je geen huurtoeslag krijgen?",
    category: "betaalbaarheid",
  },

  // Tijdelijkheid
  {
    id: 13,
    text: "Woon je anti-kraak?",
    category: "tijdelijkheid",
  },
  {
    id: 14,
    text: "Heb je een contract korter dan 2 jaar?",
    category: "tijdelijkheid",
  },
  {
    id: 15,
    text: "Moet je om de paar maanden verhuizen?",
    category: "tijdelijkheid",
  },
  {
    id: 16,
    text: "Woon je in een tijdelijke voorziening?",
    category: "tijdelijkheid",
  },
  {
    id: 17,
    text: "Slaap je op verschillende adressen?",
    category: "tijdelijkheid",
  },
  {
    id: 18,
    text: "Heb je geen vast adres?",
    category: "tijdelijkheid",
  },

  // Beschikbaarheid
  {
    id: 19,
    text: "Sta je langer dan 5 jaar ingeschreven?",
    category: "beschikbaarheid",
  },
  {
    id: 20,
    text: "Heb je meer dan 50 reacties geplaatst zonder succes?",
    category: "beschikbaarheid",
  },
  {
    id: 21,
    text: "Woon je nog bij je ouders terwijl je wilt verhuizen?",
    category: "beschikbaarheid",
  },
  {
    id: 22,
    text: "Heb je je zoekgebied moeten uitbreiden?",
    category: "beschikbaarheid",
  },
  {
    id: 23,
    text: "Kun je niet verhuizen terwijl dit wel nodig is?",
    category: "beschikbaarheid",
  },
  {
    id: 24,
    text: "Heb je je eisen naar beneden moeten bijstellen?",
    category: "beschikbaarheid",
  },

  // Free space
  { id: 25, text: "GRATIS VAKJE", category: "free" },
];