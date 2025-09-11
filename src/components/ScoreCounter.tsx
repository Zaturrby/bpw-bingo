import { useTranslation } from "react-i18next";
import { bingoSquares } from "../data/bingoData";

interface ScoreCounterProps {
  checkedSquares: Set<number>;
  isMobile: boolean;
}

export function ScoreCounter({ checkedSquares, isMobile }: ScoreCounterProps) {
  const { t } = useTranslation();

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
    <div className="mt-6">
      <div className="bg-purple-100 border-4 border-black p-2">
        <div className="space-y-1 text-xs font-bold mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-200 border-2 border-black"></div>
              <span className="text-purple-800">
                {t("categories.zekerheid")}
              </span>
            </div>
            <span className="text-purple-800">
              {getCategoryScore("zekerheid")}/{getCategoryTotal("zekerheid")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-violet-200 border-2 border-black"></div>
              <span className="text-violet-800">
                {t("categories.betaalbaarheid")}
              </span>
            </div>
            <span className="text-violet-800">
              {getCategoryScore("betaalbaarheid")}/
              {getCategoryTotal("betaalbaarheid")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-fuchsia-200 border-2 border-black"></div>
              <span className="text-fuchsia-800">
                {t("categories.tijdelijkheid")}
              </span>
            </div>
            <span className="text-fuchsia-800">
              {getCategoryScore("tijdelijkheid")}/
              {getCategoryTotal("tijdelijkheid")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-pink-200 border-2 border-black"></div>
              <span className="text-pink-800">
                {t("categories.beschikbaarheid")}
              </span>
            </div>
            <span className="text-pink-800">
              {getCategoryScore("beschikbaarheid")}/
              {getCategoryTotal("beschikbaarheid")}
            </span>
          </div>
        </div>
        <div className="text-center border-t-4 border-black pt-2">
          <p className="text-sm font-black text-purple-800">
            {t("app.total")}:{" "}
            {isMobile
              ? checkedSquares.size
              : checkedSquares.has(25)
              ? checkedSquares.size - 1
              : checkedSquares.size}{" "}
            / 24
          </p>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-black font-bold text-base md:text-lg">
          {checkedSquares.size > 1
            ? t("app.joinText")
            : t("app.joinTextZeroScore")}{" "}
          <span className="inline md:hidden">
            {t("app.joinTextArrowMobile")}
          </span>
          <span className="hidden md:inline">
            {t("app.joinTextArrowDesktop")}
          </span>
        </p>
      </div>
    </div>
  );
}
