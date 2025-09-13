import { useTranslation } from "react-i18next";
import { BingoSquare, categoryColors } from "./bingoData";
import { CrackOverlay } from "./cracks";

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

  // Convert Tailwind background classes to hex colors for canvas
  const getSquareColor = (square: BingoSquare) => {
    if (colorless) return "#ffffff";

    const colorMap = {
      "bg-purple-200": "#e9d5ff",
      "bg-violet-200": "#ddd6fe",
      "bg-fuchsia-200": "#f5d0fe",
      "bg-pink-200": "#fbcfe8",
      "bg-purple-300": "#d8b4fe"
    };

    return colorMap[categoryColors[square.category]] || "#e9d5ff";
  };

  const getButtonClasses = (square: BingoSquare, index: number) => {
    const gridCols = printMode ? 5 : isMobile ? 3 : 5;
    const isFirstRow = index < gridCols;
    const isFirstCol = index % gridCols === 0;

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
    <div className="relative">
      <div
        className={
          printMode ? "grid grid-cols-5" : "grid grid-cols-3 md:grid-cols-5"
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
              {square.category === "free" ? <></> : t(square.translationKey)}
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
                  {/* Checkmark hidden - cracks provide visual feedback */}
                </div>
              </div>
            )}

            {/* Crack overlay for all squares (finale shows on ALL boxes) */}
            {!printMode && (
              <CrackOverlay
                globalProgress={checkedSquares.size / gridSquares.length}
                squareColor={getSquareColor(square)}
                isVisible={checkedSquares.has(square.id) || (checkedSquares.size >= 25)}
                squareId={square.id}
              />
            )}
          </Element>
        );
        })}
      </div>
    </div>
  );
}
