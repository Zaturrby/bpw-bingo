export interface BingoSquare {
  id: number;
  text: string;
  translationKey: string;
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
    translationKey: "questions.zekerheid.1",
    category: "zekerheid",
  },
  {
    id: 2,
    text: "Heb je geen huur-bescherming?",
    translationKey: "questions.zekerheid.2",
    category: "zekerheid",
  },
  {
    id: 3,
    text: "Kun je geen vrienden uitnodigen vanwege woonsituatie?",
    translationKey: "questions.zekerheid.3",
    category: "zekerheid",
  },
  {
    id: 4,
    text: "Leef je met de angst uit je huis gezet te worden?",
    translationKey: "questions.zekerheid.4",
    category: "zekerheid",
  },
  {
    id: 5,
    text: "Heb je geen zeggenschap over je leefomgeving?",
    translationKey: "questions.zekerheid.5",
    category: "zekerheid",
  },
  {
    id: 6,
    text: "Voel je je niet thuis in je huis?",
    translationKey: "questions.zekerheid.6",
    category: "zekerheid",
  },

  // Betaalbaarheid
  {
    id: 7,
    text: "Is je huur hoger dan 700 euro?",
    translationKey: "questions.betaalbaarheid.7",
    category: "betaalbaarheid",
  },
  {
    id: 8,
    text: "Besteed je meer dan 40% van je inkomen aan wonen?",
    translationKey: "questions.betaalbaarheid.8",
    category: "betaalbaarheid",
  },
  {
    id: 9,
    text: "Kun je geen geld sparen door hoge woonkosten?",
    translationKey: "questions.betaalbaarheid.9",
    category: "betaalbaarheid",
  },
  {
    id: 10,
    text: "Krijg je huurverhoging bij slecht onderhoud?",
    translationKey: "questions.betaalbaarheid.10",
    category: "betaalbaarheid",
  },
  {
    id: 11,
    text: "Heb je huur-achterstand gehad?",
    translationKey: "questions.betaalbaarheid.11",
    category: "betaalbaarheid",
  },
  {
    id: 12,
    text: "Kun je geen huurtoeslag krijgen?",
    translationKey: "questions.betaalbaarheid.12",
    category: "betaalbaarheid",
  },

  // Tijdelijkheid
  {
    id: 13,
    text: "Woon je anti-kraak?",
    translationKey: "questions.tijdelijkheid.13",
    category: "tijdelijkheid",
  },
  {
    id: 14,
    text: "Heb je een contract korter dan 2 jaar?",
    translationKey: "questions.tijdelijkheid.14",
    category: "tijdelijkheid",
  },
  {
    id: 15,
    text: "Moet je om de paar maanden verhuizen?",
    translationKey: "questions.tijdelijkheid.15",
    category: "tijdelijkheid",
  },
  {
    id: 16,
    text: "Woon je in een tijdelijke voorziening?",
    translationKey: "questions.tijdelijkheid.16",
    category: "tijdelijkheid",
  },
  {
    id: 17,
    text: "Slaap je op verschillende adressen?",
    translationKey: "questions.tijdelijkheid.17",
    category: "tijdelijkheid",
  },
  {
    id: 18,
    text: "Heb je geen vast adres?",
    translationKey: "questions.tijdelijkheid.18",
    category: "tijdelijkheid",
  },

  // Beschikbaarheid
  {
    id: 19,
    text: "Sta je langer dan 5 jaar ingeschreven?",
    translationKey: "questions.beschikbaarheid.19",
    category: "beschikbaarheid",
  },
  {
    id: 20,
    text: "Heb je meer dan 50 reacties geplaatst zonder succes?",
    translationKey: "questions.beschikbaarheid.20",
    category: "beschikbaarheid",
  },
  {
    id: 21,
    text: "Woon je nog bij je ouders terwijl je wilt verhuizen?",
    translationKey: "questions.beschikbaarheid.21",
    category: "beschikbaarheid",
  },
  {
    id: 22,
    text: "Heb je je zoekgebied moeten uitbreiden?",
    translationKey: "questions.beschikbaarheid.22",
    category: "beschikbaarheid",
  },
  {
    id: 23,
    text: "Kun je niet verhuizen terwijl dit wel nodig is?",
    translationKey: "questions.beschikbaarheid.23",
    category: "beschikbaarheid",
  },
  {
    id: 24,
    text: "Heb je je eisen naar beneden moeten bijstellen?",
    translationKey: "questions.beschikbaarheid.24",
    category: "beschikbaarheid",
  },

  // Free space
  { id: 25, text: "GRATIS VAKJE", translationKey: "categories.free", category: "free" },
];