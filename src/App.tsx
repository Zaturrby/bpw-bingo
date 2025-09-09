import { BingoCard } from "./components/BingoCard";
import bpwLogo from "./images/400-400-max.jpg";

export default function App() {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full max-w-lg md:max-w-2xl mx-auto">
        <div className="text-center mb-6">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 mb-2">
            <a 
              href="https://bondprecairewoonvormen.nl/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:opacity-80 transition-opacity"
            >
              <img
                src={bpwLogo}
                alt="BPW Amsterdam Logo - Click to visit website"
                className="w-36 h-36 md:h-56 md:w-56 object-contain cursor-pointer"
              />
            </a>
            <div className="text-center md:text-left flex flex-col justify-between md:h-56">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-black uppercase tracking-wide font-activist mb-3">
                  PRECAIR WONEN BINGO
                </h1>
                <p className="text-black font-bold text-base md:text-lg mb-3">
                  Onthul hoe precair jij woont – en hoe het woonbeleid faalt
                </p>
              </div>
              <p className="text-black font-bold text-base md:text-lg">
                Check de vakjes die jouw woononzekerheid onthullen ↓
              </p>
            </div>
          </div>
        </div>

        <BingoCard />
      </div>
    </div>
  );
}
