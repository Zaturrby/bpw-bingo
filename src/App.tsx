import { BingoCard } from './components/BingoCard';
import bpwLogo from './images/400-400-max.jpg';

export default function App() {
  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <div className="w-full max-w-[148mm] mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-end justify-center gap-4 mb-2 h-48">
            <img 
              src={bpwLogo} 
              alt="BPW Amsterdam Logo" 
              className="h-full w-1/3 object-contain"
            />
            <div className="text-left flex flex-col justify-between h-full">
              <div>
                <h1 className="text-3xl font-black text-black uppercase tracking-wide font-activist mb-3">
                  PRECAIR WONEN BINGO
                </h1>
                <p className="text-black font-bold text-lg">
                  Onthul hoe precair jij woont – en hoe het woonbeleid faalt
                </p>
              </div>
              <p className="text-black font-bold text-lg">
                Check de vakjes die jouw woononzekerheid onthullen
              </p>
            </div>
          </div>
        </div>
        
        <BingoCard />
      </div>
    </div>
  );
}