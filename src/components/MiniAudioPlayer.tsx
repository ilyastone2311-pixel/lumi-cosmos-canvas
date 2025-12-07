import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Maximize2 } from "lucide-react";

interface MiniAudioPlayerProps {
  isVisible: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  title: string;
  progress: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onExpand: () => void;
}

const MiniAudioPlayer = ({
  isVisible,
  isPlaying,
  currentTime,
  duration,
  title,
  progress,
  onTogglePlay,
  onSeek,
  onExpand,
}: MiniAudioPlayerProps) => {
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onSeek(newTime);
  };

  const truncateTitle = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 w-[320px] sm:w-[360px]"
        >
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsla(var(--card), 0.95) 0%, hsla(var(--background), 0.95) 100%)",
              backdropFilter: "blur(20px)",
              boxShadow: `
                0 0 40px hsla(var(--neon-cyan), 0.2),
                0 0 80px hsla(var(--neon-purple), 0.1),
                0 20px 40px hsla(0, 0%, 0%, 0.4)
              `,
              border: "1px solid hsla(var(--neon-cyan), 0.2)",
            }}
            animate={{
              borderColor: isPlaying
                ? ["hsla(var(--neon-cyan), 0.3)", "hsla(var(--neon-purple), 0.3)", "hsla(var(--neon-cyan), 0.3)"]
                : "hsla(var(--neon-cyan), 0.2)",
            }}
            transition={{ duration: 3, repeat: isPlaying ? Infinity : 0 }}
          >
            {/* Particle Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/30"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    y: [0, -5, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <div className="relative p-4">
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <motion.button
                  onClick={onTogglePlay}
                  className="relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--neon-cyan)), hsl(var(--primary)), hsl(var(--neon-purple)))",
                    boxShadow: "0 0 20px hsla(var(--neon-cyan), 0.4)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Pause className="w-5 h-5 text-white" fill="white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <p className="text-sm font-medium text-foreground truncate mb-2">
                    {truncateTitle(title)}
                  </p>

                  {/* Progress Bar */}
                  <div
                    ref={progressRef}
                    className="relative h-1.5 bg-muted/30 rounded-full cursor-pointer group"
                    onClick={handleProgressClick}
                  >
                    <motion.div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--neon-purple)))",
                        boxShadow: "0 0 8px hsla(var(--neon-cyan), 0.5)",
                      }}
                    >
                      {isPlaying && (
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(90deg, transparent, hsla(0, 0%, 100%, 0.4), transparent)",
                            backgroundSize: "200% 100%",
                          }}
                          animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* Time */}
                  <div className="flex justify-between mt-1.5 text-xs text-muted-foreground font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Expand Button */}
                <motion.button
                  onClick={onExpand}
                  className="p-2 rounded-full transition-colors flex-shrink-0"
                  style={{
                    background: "hsla(var(--primary), 0.1)",
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    background: "hsla(var(--primary), 0.2)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Maximize2 className="w-4 h-4 text-primary" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniAudioPlayer;
