import { useState, useCallback } from "react";
import { Game } from "./components/Game";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ContactForm } from "./components/ContactForm";

export default function App() {
  const [gameState, setGameState] = useState<{
    checkedSquares: Set<number>;
    isMobile: boolean;
  }>({
    checkedSquares: new Set(),
    isMobile: false
  });

  const handleGameStateChange = useCallback((checkedSquares: Set<number>, isMobile: boolean) => {
    setGameState({ checkedSquares, isMobile });
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 relative">
      <div className="w-full max-w-lg md:max-w-2xl mx-auto">
        <Header />
        <Game onGameStateChange={handleGameStateChange} />
        <Footer />
        <ContactForm
          checkedSquares={gameState.checkedSquares}
          isMobile={gameState.isMobile}
        />
      </div>
      <LanguageSwitcher />
    </div>
  );
}
