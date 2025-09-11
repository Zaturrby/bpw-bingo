import { Game } from "./components/Game";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white p-4 relative">
      <div className="w-full max-w-lg md:max-w-2xl mx-auto">
        <Header />
        <Game />
        <Footer />
      </div>
      <LanguageSwitcher />
    </div>
  );
}
