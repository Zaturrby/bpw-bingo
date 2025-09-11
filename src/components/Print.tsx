import { useTranslation } from "react-i18next";
import { bingoSquares, categoryColors, BingoSquare } from "../data/bingoData";
import bpwLogo from "../images/400-400-max.jpg";

export function Print() {
  const { t } = useTranslation();

  // Create a fixed layout for printing (5x5 grid always)
  const arrangeSquares = () => {
    const nonFreeSquares = bingoSquares.filter(
      (square) => square.category !== "free"
    );
    const shuffled = [...nonFreeSquares].sort(() => Math.random() - 0.5);

    const grid = [];
    let shuffledIndex = 0;

    for (let i = 0; i < 25; i++) {
      if (i === 12) {
        // Center square (free space)
        grid.push(bingoSquares.find((s) => s.category === "free")!);
      } else {
        grid.push(shuffled[shuffledIndex]);
        shuffledIndex++;
      }
    }

    return grid;
  };

  const gridSquares = arrangeSquares();

  const getButtonClasses = (square: BingoSquare) => {
    const baseClasses =
      "relative border-2 border-black p-2 aspect-square -ml-px -mt-px print:border-black";
    const colorClasses = categoryColors[square.category];
    const categoryClasses =
      square.category === "free" ? "font-black text-purple-800" : "";

    return `${baseClasses} ${colorClasses} ${categoryClasses}`;
  };

  const getTextClasses = (square: BingoSquare) => {
    const baseClasses =
      square.category === "free"
        ? "text-sm leading-tight h-full flex flex-col items-center justify-center text-center font-bold"
        : "text-sm leading-tight h-full flex items-start justify-start text-left font-bold hyphens-auto break-words overflow-hidden p-1 [word-break:break-word] [hyphens:auto]";
    const colorClasses =
      square.category === "free" ? "text-purple-900" : "text-gray-800";
    return `${baseClasses} ${colorClasses}`;
  };

  return (
    <div className="print:m-0 print:p-4 max-w-4xl mx-auto bg-white min-h-screen print:min-h-0 mb-8">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl print:max-w-none">
          {/* Header */}
          <div className="text-center mb-8 print:mb-4">
            <div className="flex flex-row items-center justify-start gap-4 mb-4">
              <div className="flex-shrink-0 flex items-center">
                <img
                  src={bpwLogo}
                  alt={t("app.logoAlt")}
                  className="w-24 h-24 object-contain print-logo"
                />
              </div>
              <div className="text-left flex-grow flex flex-col justify-center">
                <h1 className="text-2xl md:text-3xl print:text-2xl font-black text-black uppercase tracking-wide font-activist mb-2">
                  {t("app.title")}
                </h1>
                <p className="text-black font-bold text-base print:text-sm mb-2">
                  {t("app.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Bingo Grid */}
          <div className="grid grid-cols-5 border-4 border-black print:border-2">
            {gridSquares.map((square, index) => (
              <div
                key={`${square.id}-${index}`}
                className={getButtonClasses(square)}
              >
                <div className={getTextClasses(square)}>
                  {square.category === "free" ? (
                    <>
                      <div>{t("freeSquare.line1")}</div>
                      <div>{t("freeSquare.line2")}</div>
                    </>
                  ) : (
                    t(square.translationKey)
                  )}
                </div>

                {square.category === "free" && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(124, 58, 237, 1.0)" }}
                  >
                    <div className="w-8 h-8 bg-primary flex items-center justify-center shadow-lg">
                      <div className="w-5 h-5 text-primary-foreground">✓</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
