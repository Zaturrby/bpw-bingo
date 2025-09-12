export interface BingoSquare {
  id: number;
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
  { id: 1, translationKey: "questions.zekerheid.1", category: "zekerheid" },
  { id: 2, translationKey: "questions.zekerheid.2", category: "zekerheid" },
  { id: 3, translationKey: "questions.zekerheid.3", category: "zekerheid" },
  { id: 4, translationKey: "questions.zekerheid.4", category: "zekerheid" },
  { id: 5, translationKey: "questions.zekerheid.5", category: "zekerheid" },
  { id: 6, translationKey: "questions.zekerheid.6", category: "zekerheid" },

  // Betaalbaarheid
  { id: 7, translationKey: "questions.betaalbaarheid.7", category: "betaalbaarheid" },
  { id: 8, translationKey: "questions.betaalbaarheid.8", category: "betaalbaarheid" },
  { id: 9, translationKey: "questions.betaalbaarheid.9", category: "betaalbaarheid" },
  { id: 10, translationKey: "questions.betaalbaarheid.10", category: "betaalbaarheid" },
  { id: 11, translationKey: "questions.betaalbaarheid.11", category: "betaalbaarheid" },
  { id: 12, translationKey: "questions.betaalbaarheid.12", category: "betaalbaarheid" },

  // Tijdelijkheid
  { id: 13, translationKey: "questions.tijdelijkheid.13", category: "tijdelijkheid" },
  { id: 14, translationKey: "questions.tijdelijkheid.14", category: "tijdelijkheid" },
  { id: 15, translationKey: "questions.tijdelijkheid.15", category: "tijdelijkheid" },
  { id: 16, translationKey: "questions.tijdelijkheid.16", category: "tijdelijkheid" },
  { id: 17, translationKey: "questions.tijdelijkheid.17", category: "tijdelijkheid" },
  { id: 18, translationKey: "questions.tijdelijkheid.18", category: "tijdelijkheid" },

  // Beschikbaarheid
  { id: 19, translationKey: "questions.beschikbaarheid.19", category: "beschikbaarheid" },
  { id: 20, translationKey: "questions.beschikbaarheid.20", category: "beschikbaarheid" },
  { id: 21, translationKey: "questions.beschikbaarheid.21", category: "beschikbaarheid" },
  { id: 22, translationKey: "questions.beschikbaarheid.22", category: "beschikbaarheid" },
  { id: 23, translationKey: "questions.beschikbaarheid.23", category: "beschikbaarheid" },
  { id: 24, translationKey: "questions.beschikbaarheid.24", category: "beschikbaarheid" },

  // Free space
  { id: 25, translationKey: "categories.free", category: "free" },
];