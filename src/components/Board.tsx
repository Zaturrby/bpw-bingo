import { useTranslation } from 'react-i18next';
import { BingoSquare, categoryColors } from "../data/bingoData";

interface BoardProps {
  gridSquares: BingoSquare[];
  checkedSquares: Set<number>;
  onToggleSquare: (id: number) => void;
}

export function Board({ gridSquares, checkedSquares, onToggleSquare }: BoardProps) {
  const { t } = useTranslation();

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

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 border-2 md:border-4 border-black">
      {gridSquares.map((square, index) => (
        <button
          key={`${square.id}-${index}`}
          onClick={() => onToggleSquare(square.id)}
          className={getButtonClasses(square)}
          disabled={square.category === "free"}
        >
          <div className={getTextClasses(square)}>
            {square.category === "free" ? (
              <>
                <div>{t('freeSquare.line1')}</div>
                <div>{t('freeSquare.line2')}</div>
              </>
            ) : (
              t(square.translationKey)
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
  );
}