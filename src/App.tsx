import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Game } from "./components/game/Game";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Header } from "./components/Header";
import { OrganiseBlock } from "./components/OrganiseBlock";
import { ContactForm } from "./components/ContactForm";
import { ConfettiBurst } from "./components/ConfettiBurst";
import { AnimatedFooter } from "./components/animations/activistMarch";

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
      // Calculate actual score (excluding free square on desktop)
      const getActualScore = (squares: Set<number>, mobile: boolean) => {
        return mobile
          ? squares.size
          : squares.has(25)
          ? squares.size - 1
          : squares.size;
      };

      const prevScore = getActualScore(
        gameState.checkedSquares,
        gameState.isMobile
      );
      const currentScore = getActualScore(checkedSquares, isMobile);

      setGameState({ checkedSquares, isMobile });

      // Trigger confetti when completing all 24 boxes
      if (prevScore === 23 && currentScore === 24) {
        console.log(
          "🎆 BINGO! All 24 squares completed - triggering fireworks!"
        );
        setShowConfetti(true);
      }
    },
    [gameState.checkedSquares, gameState.isMobile]
  );

  return (
    <>
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

          <div className="text-center mt-16">
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

      <AnimatedFooter />
    </>
  );
}
