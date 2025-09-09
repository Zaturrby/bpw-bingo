import { BingoCard } from "./components/BingoCard";
import bpwLogo from "./images/400-400-max.jpg";

export default function App() {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full max-w-[148mm] mx-auto">
        <div className="text-center mb-6">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-4 mb-2">
            <img
              src={bpwLogo}
              alt="BPW Amsterdam Logo"
              className="w-32 h-32 md:h-48 md:w-1/3 object-contain"
            />
            <div className="text-center md:text-left flex flex-col justify-between">
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
