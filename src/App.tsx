import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Game } from "./components/game/Game";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Header } from "./components/Header";
import { OrganiseBlock } from "./components/OrganiseBlock";
import { ContactForm } from "./components/ContactForm";

export default function App() {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<{
    checkedSquares: Set<number>;
    isMobile: boolean;
  }>({
    checkedSquares: new Set(),
    isMobile: false,
  });

  const handleGameStateChange = useCallback(
    (checkedSquares: Set<number>, isMobile: boolean) => {
      setGameState({ checkedSquares, isMobile });
    },
    []
  );

  return (
    <div className="min-h-screen bg-white p-4 relative">
      <div className="w-full max-w-lg md:max-w-2xl mx-auto">
        <Header />
        <Game onGameStateChange={handleGameStateChange} />

        <div className="text-center mt-16">
          <p className="text-black font-bold text-base md:text-lg">
            {gameState.checkedSquares.size > 1
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

        <OrganiseBlock />

        <div className="text-center mt-6 mb-16">
          <p className="text-black font-bold text-base md:text-lg">
            {t("app.joinTextBetween")}
          </p>
        </div>

        <ContactForm
          checkedSquares={gameState.checkedSquares}
          isMobile={gameState.isMobile}
        />
      </div>
      <LanguageSwitcher />
    </div>
  );
}
