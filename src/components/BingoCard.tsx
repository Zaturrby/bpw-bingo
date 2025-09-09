import { useState } from "react";
import wordLidImage from "../images/583593e2-659c-713e-3712-9947442f1601.png";

interface BingoSquare {
  id: number;
  text: string;
  category:
    | "zekerheid"
    | "betaalbaarheid"
    | "tijdelijkheid"
    | "beschikbaarheid"
    | "free";
  color: string;
}

const bingoSquares: BingoSquare[] = [
  // Zekerheid (donker lila)
  {
    id: 1,
    text: "Weet je niet of je volgend jaar nog in je huis kunt wonen?",
    category: "zekerheid",
    color: "bg-purple-200",
  },
  {
    id: 2,
    text: "Heb je geen huur-bescherming?",
    category: "zekerheid",
    color: "bg-purple-200",
  },
  {
    id: 3,
    text: "Kun je geen vrienden uitnodigen vanwege woonsituatie?",
    category: "zekerheid",
    color: "bg-purple-200",
  },
  {
    id: 4,
    text: "Leef je met de angst uit je huis gezet te worden?",
    category: "zekerheid",
    color: "bg-purple-200",
  },
  {
    id: 5,
    text: "Heb je geen zeggenschap over je leefomgeving?",
    category: "zekerheid",
    color: "bg-purple-200",
  },
  {
    id: 6,
    text: "Voel je je niet thuis in je huis?",
    category: "zekerheid",
    color: "bg-purple-200",
  },

  // Betaalbaarheid (medium lila)
  {
    id: 7,
    text: "Is je huur hoger dan 700 euro?",
    category: "betaalbaarheid",
    color: "bg-violet-200",
  },
  {
    id: 8,
    text: "Besteed je meer dan 40% van je inkomen aan wonen?",
    category: "betaalbaarheid",
    color: "bg-violet-200",
  },
  {
    id: 9,
    text: "Kun je geen geld sparen door hoge woonkosten?",
    category: "betaalbaarheid",
    color: "bg-violet-200",
  },
  {
    id: 10,
    text: "Krijg je huurverhoging bij slecht onderhoud?",
    category: "betaalbaarheid",
    color: "bg-violet-200",
  },
  {
    id: 11,
    text: "Heb je huur-achterstand gehad?",
    category: "betaalbaarheid",
    color: "bg-violet-200",
  },
  {
    id: 12,
    text: "Kun je geen huurtoeslag krijgen?",
    category: "betaalbaarheid",
    color: "bg-violet-200",
  },

  // Tijdelijkheid (licht lila)
  {
    id: 13,
    text: "Woon je anti-kraak?",
    category: "tijdelijkheid",
    color: "bg-fuchsia-200",
  },
  {
    id: 14,
    text: "Heb je een contract korter dan 2 jaar?",
    category: "tijdelijkheid",
    color: "bg-fuchsia-200",
  },
  {
    id: 15,
    text: "Moet je om de paar maanden verhuizen?",
    category: "tijdelijkheid",
    color: "bg-fuchsia-200",
  },
  {
    id: 16,
    text: "Woon je in een tijdelijke voorziening?",
    category: "tijdelijkheid",
    color: "bg-fuchsia-200",
  },
  {
    id: 17,
    text: "Slaap je op verschillende adressen?",
    category: "tijdelijkheid",
    color: "bg-fuchsia-200",
  },
  {
    id: 18,
    text: "Heb je geen vast adres?",
    category: "tijdelijkheid",
    color: "bg-fuchsia-200",
  },

  // Beschikbaarheid (roze-lila)
  {
    id: 19,
    text: "Sta je langer dan 5 jaar ingeschreven?",
    category: "beschikbaarheid",
    color: "bg-pink-200",
  },
  {
    id: 20,
    text: "Heb je meer dan 50 reacties geplaatst zonder succes?",
    category: "beschikbaarheid",
    color: "bg-pink-200",
  },
  {
    id: 21,
    text: "Woon je nog bij je ouders terwijl je wilt verhuizen?",
    category: "beschikbaarheid",
    color: "bg-pink-200",
  },
  {
    id: 22,
    text: "Heb je je zoekgebied moeten uitbreiden?",
    category: "beschikbaarheid",
    color: "bg-pink-200",
  },
  {
    id: 23,
    text: "Kun je niet verhuizen terwijl dit wel nodig is?",
    category: "beschikbaarheid",
    color: "bg-pink-200",
  },
  {
    id: 24,
    text: "Heb je je eisen naar beneden moeten bijstellen?",
    category: "beschikbaarheid",
    color: "bg-pink-200",
  },

  // Free space
  { id: 25, text: "GRATIS VAKJE", category: "free", color: "bg-purple-300" },
];

export function BingoCard() {
  const [checkedSquares, setCheckedSquares] = useState<Set<number>>(
    new Set([25])
  );

  const toggleSquare = (id: number) => {
    if (id === 25) return;

    const newChecked = new Set(checkedSquares);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedSquares(newChecked);
  };

  const arrangeSquares = () => {
    const nonFreeSquares = bingoSquares.filter(
      (square) => square.category !== "free"
    );
    const shuffled = [...nonFreeSquares].sort(() => Math.random() - 0.5);

    // Check if mobile (window width < 768px)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isMobile) {
      // Mobile: return 24 squares (no free square)
      return shuffled.slice(0, 24);
    } else {
      // Desktop: return 25 squares with free square in center
      const grid: BingoSquare[] = [];
      let shuffledIndex = 0;

      for (let i = 0; i < 25; i++) {
        if (i === 12) {
          grid.push(bingoSquares.find((s) => s.category === "free")!);
        } else {
          grid.push(shuffled[shuffledIndex]);
          shuffledIndex++;
        }
      }

      return grid;
    }
  };

  const [gridSquares] = useState<BingoSquare[]>(() => arrangeSquares());

  const getButtonClasses = (square: BingoSquare) => {
    const baseClasses =
      "relative border-2 border-black p-1.5 transition-all duration-200 aspect-square";
    const colorClasses = square.color;
    const hoverClasses =
      square.category !== "free" ? "hover:brightness-95" : "";
    const categoryClasses =
      square.category === "free"
        ? "cursor-default font-black text-purple-800"
        : "cursor-pointer";

    return `${baseClasses} ${colorClasses} ${hoverClasses} ${categoryClasses}`;
  };

  const getTextClasses = (square: BingoSquare) => {
    const baseClasses =
      square.category === "free"
        ? "text-xs md:text-xs leading-tight h-full flex flex-col items-center justify-center text-center font-bold"
        : "text-xs md:text-xs leading-tight h-full flex items-start justify-start text-left font-bold hyphens-auto break-words overflow-hidden p-1";
    const colorClasses =
      square.category === "free" ? "text-purple-900" : "text-gray-800";
    return `${baseClasses} ${colorClasses}`;
  };

  const getCategoryScore = (category: string) => {
    const categorySquares = bingoSquares.filter(
      (square) => square.category === category
    );
    const checkedCategorySquares = categorySquares.filter((square) =>
      checkedSquares.has(square.id)
    );
    return checkedCategorySquares.length;
  };

  const getCategoryTotal = (category: string) => {
    return bingoSquares.filter((square) => square.category === category).length;
  };

  return (
    <div
      className="w-full max-w-lg mx-auto md:max-w-none"
      style={{ aspectRatio: "148/210" }}
    >
      <div className="h-full flex flex-col p-1 md:p-2">
        <div className="flex-1 grid grid-cols-3 md:grid-cols-5 border-2 md:border-4 border-black gap-0">
          {gridSquares.map((square, index) => (
            <button
              key={`${square.id}-${index}`}
              onClick={() => toggleSquare(square.id)}
              className={getButtonClasses(square)}
              disabled={square.category === "free"}
            >
              <div className={getTextClasses(square)}>
                {square.category === "free" ? (
                  <>
                    <div>GRATIS</div>
                    <div>VAKJE</div>
                  </>
                ) : (
                  square.text
                )}
              </div>

              {checkedSquares.has(square.id) && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(124, 58, 237, 1.0)" }}
                >
                  <div className="w-8 h-8 bg-primary flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 text-primary-foreground">✓</div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 items-start">
          <div className="w-full md:flex-1">
            <div className="bg-purple-100 border-4 border-black p-2">
              <div className="space-y-1 text-xs font-bold mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-200 border-2 border-black"></div>
                    <span className="text-purple-800">Zekerheid</span>
                  </div>
                  <span className="text-purple-800">
                    {getCategoryScore("zekerheid")}/
                    {getCategoryTotal("zekerheid")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-violet-200 border-2 border-black"></div>
                    <span className="text-violet-800">Betaalbaarheid</span>
                  </div>
                  <span className="text-violet-800">
                    {getCategoryScore("betaalbaarheid")}/
                    {getCategoryTotal("betaalbaarheid")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-fuchsia-200 border-2 border-black"></div>
                    <span className="text-fuchsia-800">Tijdelijkheid</span>
                  </div>
                  <span className="text-fuchsia-800">
                    {getCategoryScore("tijdelijkheid")}/
                    {getCategoryTotal("tijdelijkheid")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-pink-200 border-2 border-black"></div>
                    <span className="text-pink-800">Beschikbaarheid</span>
                  </div>
                  <span className="text-pink-800">
                    {getCategoryScore("beschikbaarheid")}/
                    {getCategoryTotal("beschikbaarheid")}
                  </span>
                </div>
              </div>
              <div className="text-center border-t-4 border-black pt-2">
                <p className="text-sm font-black text-purple-800">
                  Totaal: {checkedSquares.size} / 25
                </p>
              </div>
            </div>

            <div className="text-center md:text-left mt-6">
              <p className="text-black font-bold text-base md:text-lg">
                Scoor je 0 of meer punten? Wordt dan lid van de bond →
              </p>
            </div>
          </div>

          <div className="w-full md:flex-1 flex items-center justify-center p-2">
            <div className="w-48 h-48 md:w-[80%] md:h-[80%]">
              <img
                src={wordLidImage}
                alt="Word Lid van BPW"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
