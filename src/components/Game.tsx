import { useState, useEffect } from "react";
import { Board } from "./Board";
import { ScoreCounter } from "./ScoreCounter";
import { BingoSquare, bingoSquares } from "../data/bingoData";

interface GameProps {
  onGameStateChange?: (checkedSquares: Set<number>, isMobile: boolean) => void;
}

export function Game({ onGameStateChange }: GameProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' && window.innerWidth < 768
  );
  
  // Initialize checkedSquares from localStorage or default
  const [checkedSquares, setCheckedSquares] = useState<Set<number>>(() => {
    if (typeof window === 'undefined') return new Set();
    
    try {
      const saved = localStorage.getItem('bpw-bingo-checked-squares');
      if (saved) {
        const savedArray = JSON.parse(saved) as number[];
        const savedSet = new Set(savedArray);
        
        // For mobile, remove free square (25) if it exists
        if (window.innerWidth < 768 && savedSet.has(25)) {
          savedSet.delete(25);
        }
        // For desktop, ensure free square (25) is included
        else if (window.innerWidth >= 768 && !savedSet.has(25)) {
          savedSet.add(25);
        }
        
        return savedSet;
      }
    } catch (error) {
      console.warn('Failed to load saved bingo state:', error);
    }
    
    // Default state
    const initialMobile = window.innerWidth < 768;
    return new Set(initialMobile ? [] : [25]);
  });

  const toggleSquare = (id: number) => {
    if (id === 25) return;

    const newChecked = new Set(checkedSquares);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('bpw-bingo-checked-squares', JSON.stringify(Array.from(newChecked)));
    } catch (error) {
      console.warn('Failed to save bingo state:', error);
    }
    
    setCheckedSquares(newChecked);
    onGameStateChange?.(newChecked, isMobile);
  };

  const arrangeSquares = (mobile: boolean) => {
    const nonFreeSquares = bingoSquares.filter(
      (square) => square.category !== "free"
    );
    const shuffled = [...nonFreeSquares].sort(() => Math.random() - 0.5);
    
    if (mobile) {
      // Mobile: return 24 squares (no free square)
      return shuffled.slice(0, 24);
    } else {
      // Desktop: return 25 squares with free square in center
      const grid: BingoSquare[] = [];
      let shuffledIndex = 0;

      for (let i = 0; i < 25; i++) {
        if (i === 12) {
          grid.push(bingoSquares.find((s) => s.category === "free")!);
        } else {
          grid.push(shuffled[shuffledIndex]);
          shuffledIndex++;
        }
      }

      return grid;
    }
  };

  const [gridSquares, setGridSquares] = useState<BingoSquare[]>(() => arrangeSquares(isMobile));

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setGridSquares(arrangeSquares(newIsMobile));
        
        // Update checked squares: remove free square if switching to mobile, add it if switching to desktop
        setCheckedSquares(prev => {
          const newChecked = new Set(prev);
          if (newIsMobile && newChecked.has(25)) {
            newChecked.delete(25);
          } else if (!newIsMobile && !newChecked.has(25)) {
            newChecked.add(25);
          }
          
          // Save to localStorage
          try {
            localStorage.setItem('bpw-bingo-checked-squares', JSON.stringify(Array.from(newChecked)));
          } catch (error) {
            console.warn('Failed to save bingo state:', error);
          }
          
          return newChecked;
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Notify parent of initial state and any changes
  useEffect(() => {
    if (onGameStateChange) {
      onGameStateChange(checkedSquares, isMobile);
    }
  }, [checkedSquares, isMobile, onGameStateChange]);

  return (
    <div className="w-full max-w-lg mx-auto md:max-w-4xl">
      <div className="flex flex-col p-1 md:p-2">
        <Board
          gridSquares={gridSquares}
          checkedSquares={checkedSquares}
          onToggleSquare={toggleSquare}
        />
        
        <ScoreCounter
          checkedSquares={checkedSquares}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}