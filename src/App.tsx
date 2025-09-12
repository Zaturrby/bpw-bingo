import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Game } from "./components/game/Game";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Header } from "./components/Header";
import { OrganiseBlock } from "./components/OrganiseBlock";
import { ContactForm } from "./components/ContactForm";
import { ConfettiBurst } from "./components/ConfettiBurst";

export default function App() {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<{
    checkedSquares: Set<number>;
    isMobile: boolean;
  }>({
    checkedSquares: new Set(),
    isMobile: false,
  });

  const [showConfetti, setShowConfetti] = useState(false);

  const handleGameStateChange = useCallback(
    (checkedSquares: Set<number>, isMobile: boolean) => {
      const prevCount = gameState.checkedSquares.size;
      setGameState({ checkedSquares, isMobile });

      // Trigger confetti when transitioning from 23 to 24 checked boxes
      if (prevCount === 24 && checkedSquares.size === 25) {
        setShowConfetti(true);
      }
    },
    [gameState.checkedSquares.size]
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

        <div className="text-center mt-16 mb-16">
          <p className="text-black font-bold text-base md:text-lg">
            {t("app.gratitudeMessage")}
          </p>
        </div>
      </div>
      <LanguageSwitcher />
      <ConfettiBurst
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  );
}
