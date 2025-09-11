import { useTranslation } from "react-i18next";
import { bingoSquares } from "../data/bingoData";
import bpwLogo from "../images/400-400-max.jpg";
import { Board } from "./Board";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ColorSwitcher } from "./ColorSwitcher";

interface PrintProps {
  colorless?: boolean;
}

export function Print({ colorless = false }: PrintProps) {
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

  // Create a set for checked squares in print mode - only free space is "checked"
  const checkedSquares = new Set<number>();
  const freeSquare = bingoSquares.find((s) => s.category === "free");
  if (freeSquare) {
    checkedSquares.add(freeSquare.id);
  }

  return (
    <div className="print:m-0 print:p-4 max-w-4xl mx-auto bg-white min-h-screen print:min-h-0 mt-8 mb-8">
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
          <Board
            gridSquares={gridSquares}
            checkedSquares={checkedSquares}
            onToggleSquare={() => {}} // No-op function for print mode
            printMode={true}
            colorless={colorless}
          />
        </div>
      </div>
      <LanguageSwitcher />
      <ColorSwitcher />
    </div>
  );
}
