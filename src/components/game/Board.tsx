import { useTranslation } from "react-i18next";
import { BingoSquare, categoryColors } from "./bingoData";

interface BoardProps {
  gridSquares: BingoSquare[];
  checkedSquares: Set<number>;
  onToggleSquare: (id: number) => void;
  printMode?: boolean;
  colorless?: boolean;
  isMobile?: boolean;
}

export function Board({
  gridSquares,
  checkedSquares,
  onToggleSquare,
  printMode = false,
  colorless = false,
  isMobile = false,
}: BoardProps) {
  const { t } = useTranslation();

  const getButtonClasses = (square: BingoSquare, index: number) => {
    const gridCols = printMode ? 5 : (isMobile ? 3 : 5);
    const isFirstRow = index < gridCols;
    const isLastRow = index >= gridSquares.length - gridCols;
    const isFirstCol = index % gridCols === 0;
    const isLastCol = index % gridCols === gridCols - 1;
    
    const baseClasses = printMode
      ? "relative border-black p-2 aspect-square print:border-black"
      : "relative border-black p-1.5 transition-all duration-200 aspect-square";
    
    // Build border classes based on position
    let borderClasses = "border-r-4 border-b-4";
    if (isFirstRow) borderClasses += " border-t-4";
    if (isFirstCol) borderClasses += " border-l-4";
    
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

    return `${baseClasses} ${borderClasses} ${colorClasses} ${hoverClasses} ${categoryClasses}`;
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
          ? "grid grid-cols-5"
          : "grid grid-cols-3 md:grid-cols-5"
      }
    >
      {gridSquares.map((square, index) => {
        const Element = printMode ? "div" : "button";
        return (
          <Element
            key={`${square.id}-${index}`}
            onClick={printMode ? undefined : () => onToggleSquare(square.id)}
            className={getButtonClasses(square, index)}
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
