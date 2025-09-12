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
  { id: 1, translationKey: "game.questions.zekerheid.1", category: "zekerheid" },
  { id: 2, translationKey: "game.questions.zekerheid.2", category: "zekerheid" },
  { id: 3, translationKey: "game.questions.zekerheid.3", category: "zekerheid" },
  { id: 4, translationKey: "game.questions.zekerheid.4", category: "zekerheid" },
  { id: 5, translationKey: "game.questions.zekerheid.5", category: "zekerheid" },
  { id: 6, translationKey: "game.questions.zekerheid.6", category: "zekerheid" },

  // Betaalbaarheid
  { id: 7, translationKey: "game.questions.betaalbaarheid.7", category: "betaalbaarheid" },
  { id: 8, translationKey: "game.questions.betaalbaarheid.8", category: "betaalbaarheid" },
  { id: 9, translationKey: "game.questions.betaalbaarheid.9", category: "betaalbaarheid" },
  { id: 10, translationKey: "game.questions.betaalbaarheid.10", category: "betaalbaarheid" },
  { id: 11, translationKey: "game.questions.betaalbaarheid.11", category: "betaalbaarheid" },
  { id: 12, translationKey: "game.questions.betaalbaarheid.12", category: "betaalbaarheid" },

  // Tijdelijkheid
  { id: 13, translationKey: "game.questions.tijdelijkheid.13", category: "tijdelijkheid" },
  { id: 14, translationKey: "game.questions.tijdelijkheid.14", category: "tijdelijkheid" },
  { id: 15, translationKey: "game.questions.tijdelijkheid.15", category: "tijdelijkheid" },
  { id: 16, translationKey: "game.questions.tijdelijkheid.16", category: "tijdelijkheid" },
  { id: 17, translationKey: "game.questions.tijdelijkheid.17", category: "tijdelijkheid" },
  { id: 18, translationKey: "game.questions.tijdelijkheid.18", category: "tijdelijkheid" },

  // Beschikbaarheid
  { id: 19, translationKey: "game.questions.beschikbaarheid.19", category: "beschikbaarheid" },
  { id: 20, translationKey: "game.questions.beschikbaarheid.20", category: "beschikbaarheid" },
  { id: 21, translationKey: "game.questions.beschikbaarheid.21", category: "beschikbaarheid" },
  { id: 22, translationKey: "game.questions.beschikbaarheid.22", category: "beschikbaarheid" },
  { id: 23, translationKey: "game.questions.beschikbaarheid.23", category: "beschikbaarheid" },
  { id: 24, translationKey: "game.questions.beschikbaarheid.24", category: "beschikbaarheid" },

  // Free space
  { id: 25, translationKey: "", category: "free" },
];