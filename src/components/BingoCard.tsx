import { useState, useEffect } from "react";
import wordLidImage from "../images/583593e2-659c-713e-3712-9947442f1601.png";
import { BingoSquare, categoryColors, bingoSquares } from "../data/bingoData";


export function BingoCard() {
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [checkedSquares, setCheckedSquares] = useState<Set<number>>(
    () => new Set(isMobile ? [] : [25])
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

  const arrangeSquares = (mobile: boolean) => {
    const nonFreeSquares = bingoSquares.filter(
      (square) => square.category !== "free"
    );
    const shuffled = [...nonFreeSquares].sort(() => Math.random() - 0.5);
    
    if (mobile) {
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

  const [gridSquares, setGridSquares] = useState<BingoSquare[]>(() => arrangeSquares(isMobile));

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setGridSquares(arrangeSquares(newIsMobile));
        
        // Update checked squares: remove free square if switching to mobile, add it if switching to desktop
        setCheckedSquares(prev => {
          const newChecked = new Set(prev);
          if (newIsMobile && newChecked.has(25)) {
            newChecked.delete(25);
          } else if (!newIsMobile && !newChecked.has(25)) {
            newChecked.add(25);
          }
          return newChecked;
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const getButtonClasses = (square: BingoSquare) => {
    const baseClasses =
      "relative border-2 border-black p-1.5 transition-all duration-200 aspect-square -ml-px -mt-px";
    const colorClasses = categoryColors[square.category];
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
        : "text-xs md:text-xs leading-tight h-full flex items-start justify-start text-left font-bold hyphens-auto break-words overflow-hidden p-1 [word-break:break-word] [hyphens:auto]";
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
      className="w-full max-w-lg mx-auto md:max-w-4xl"
    >
      <div className="flex flex-col p-1 md:p-2">
        <div className="grid grid-cols-3 md:grid-cols-5 border-2 md:border-4 border-black">
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
                  Totaal: {isMobile ? checkedSquares.size : (checkedSquares.has(25) ? checkedSquares.size - 1 : checkedSquares.size)} / 24
                </p>
              </div>
            </div>

            <div className="text-center md:text-left mt-6">
              <p className="text-black font-bold text-base md:text-lg">
                Scoor je 0 of meer punten? Word dan lid van de bond <span className="inline md:hidden">↓</span><span className="hidden md:inline">→</span>
              </p>
            </div>
          </div>

          <div className="w-full md:flex-1 flex items-center justify-center p-2">
            <div className="w-44 h-44 md:w-[70%] md:h-[70%]">
              <a 
                href="https://bondprecairewoonvormen.nl/en/lidworden/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full h-full hover:opacity-80 transition-opacity"
              >
                <img
                  src={wordLidImage}
                  alt="Word Lid van BPW - Click to join"
                  className="w-full h-full object-contain cursor-pointer"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
