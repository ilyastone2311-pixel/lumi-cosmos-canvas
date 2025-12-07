import { motion } from "framer-motion";

interface WordTiming {
  word: string;
  startTime: number;
  endTime: number;
}

interface KaraokeTextProps {
  text: string;
  currentTime: number;
  isPlaying: boolean;
  onWordClick: (time: number) => void;
}

// Generate simulated timing data for demo
const generateTimingData = (text: string, startOffset: number = 0): WordTiming[] => {
  const words = text.split(/\s+/);
  let currentTime = startOffset;
  
  return words.map((word) => {
    const duration = Math.max(0.3, word.length * 0.08 + Math.random() * 0.2);
    const timing = {
      word,
      startTime: currentTime,
      endTime: currentTime + duration,
    };
    currentTime += duration + 0.05; // Small gap between words
    return timing;
  });
};

const KaraokeText = ({ text, currentTime, isPlaying, onWordClick }: KaraokeTextProps) => {
  const timingData = generateTimingData(text);
  
  const getWordState = (timing: WordTiming): "past" | "current" | "future" => {
    if (currentTime >= timing.endTime) return "past";
    if (currentTime >= timing.startTime && currentTime < timing.endTime) return "current";
    return "future";
  };

  return (
    <p className="text-lg leading-relaxed">
      {timingData.map((timing, index) => {
        const state = getWordState(timing);
        
        return (
          <motion.span
            key={`${timing.word}-${index}`}
            className="inline cursor-pointer transition-all duration-200 ease-out"
            onClick={() => onWordClick(timing.startTime)}
            style={{
              color: state === "current" 
                ? "hsl(var(--neon-cyan))" 
                : state === "past" 
                  ? "hsl(var(--neon-purple))" 
                  : "hsl(var(--foreground) / 0.8)",
              textShadow: state === "current" 
                ? "0 0 20px hsla(var(--neon-cyan), 0.8), 0 0 40px hsla(var(--neon-cyan), 0.4)" 
                : "none",
            }}
            animate={state === "current" && isPlaying ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={{ duration: 0.3 }}
            whileHover={{
              color: "hsl(var(--primary))",
              textShadow: "0 0 10px hsla(var(--primary), 0.5)",
            }}
          >
            {timing.word}{" "}
          </motion.span>
        );
      })}
    </p>
  );
};

export default KaraokeText;
