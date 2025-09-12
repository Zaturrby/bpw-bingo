import { useTranslation } from "react-i18next";
import { BingoSquare, categoryColors } from "./bingoData";

interface BoardProps {
  gridSquares: BingoSquare[];
  checkedSquares: Set<number>;
  onToggleSquare: (id: number) => void;
  printMode?: boolean;
  colorless?: boolean;
}

export function Board({
  gridSquares,
  checkedSquares,
  onToggleSquare,
  printMode = false,
  colorless = false,
}: BoardProps) {
  const { t } = useTranslation();

  const getButtonClasses = (square: BingoSquare) => {
    const baseClasses = printMode
      ? "relative border-2 border-black p-2 aspect-square -ml-px -mt-px print:border-black"
      : "relative border-2 border-black p-1.5 transition-all duration-200 aspect-square -ml-px -mt-px";
    const colorClasses = colorless
      ? "bg-white"
      : categoryColors[square.category];
    const hoverClasses =
      square.category !== "free" && !printMode ? "hover:brightness-95" : "";
    const categoryClasses =
      square.category === "free"
        ? colorless
          ? "cursor-default font-black text-black"
          : "cursor-default font-black text-purple-800"
        : printMode
        ? ""
        : "cursor-pointer";

    return `${baseClasses} ${colorClasses} ${hoverClasses} ${categoryClasses}`;
  };

  const getTextClasses = (square: BingoSquare) => {
    const baseClasses = printMode
      ? square.category === "free"
        ? "text-sm leading-tight h-full flex flex-col items-center justify-center text-center font-bold"
        : "text-sm leading-tight h-full flex items-start justify-start text-left font-bold hyphens-auto break-words overflow-hidden p-1 [word-break:break-word] [hyphens:auto]"
      : square.category === "free"
      ? "text-xs md:text-xs leading-tight h-full flex flex-col items-center justify-center text-center font-bold"
      : "text-xs md:text-xs leading-tight h-full flex items-start justify-start text-left font-bold hyphens-auto break-words overflow-hidden p-1 [word-break:break-word] [hyphens:auto]";
    const colorClasses = colorless
      ? "text-black"
      : square.category === "free"
      ? "text-purple-900"
      : "text-gray-800";
    return `${baseClasses} ${colorClasses}`;
  };

  return (
    <div
      className={
        printMode
          ? "grid grid-cols-5 border-4 border-black print:border-2"
          : "grid grid-cols-3 md:grid-cols-5 border-2 md:border-4 border-black"
      }
    >
      {gridSquares.map((square, index) => {
        const Element = printMode ? "div" : "button";
        return (
          <Element
            key={`${square.id}-${index}`}
            onClick={printMode ? undefined : () => onToggleSquare(square.id)}
            className={getButtonClasses(square)}
            disabled={printMode ? undefined : square.category === "free"}
          >
            <div className={getTextClasses(square)}>
              {square.category === "free" ? (
                <>
                  <div>FREE</div>
                  <div>SPACE</div>
                </>
              ) : (
                t(square.translationKey)
              )}
            </div>

            {checkedSquares.has(square.id) && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  backgroundColor: colorless
                    ? "rgba(0, 0, 0, 1.0)"
                    : "rgba(124, 58, 237, 1.0)",
                }}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center shadow-lg ${
                    colorless ? "bg-black" : "bg-primary"
                  }`}
                >
                  <div
                    className={`w-5 h-5 ${
                      colorless ? "text-white" : "text-primary-foreground"
                    }`}
                  >
                    ✓
                  </div>
                </div>
              </div>
            )}
          </Element>
        );
      })}
    </div>
  );
}
