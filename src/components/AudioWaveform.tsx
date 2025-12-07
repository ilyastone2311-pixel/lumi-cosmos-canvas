import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AudioWaveformProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
}

const AudioWaveform = ({ audioRef, isPlaying }: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Web Audio API
  const initializeAudio = () => {
    if (isInitialized || !audioRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 128;
      analyzer.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyzerRef.current = analyzer;
      sourceRef.current = source;
      setIsInitialized(true);
    } catch (error) {
      console.log("Web Audio API initialization failed:", error);
    }
  };

  // Draw waveform
  const draw = () => {
    const canvas = canvasRef.current;
    const analyzer = analyzerRef.current;
    if (!canvas || !analyzer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzer.getByteFrequencyData(dataArray);

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = (width / bufferLength) * 2.5;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "hsla(195, 85%, 55%, 0.8)");
    gradient.addColorStop(0.5, "hsla(220, 70%, 50%, 0.8)");
    gradient.addColorStop(1, "hsla(265, 70%, 65%, 0.8)");

    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = isPlaying ? (dataArray[i] / 255) * (height * 0.8) : 4;
      const y = centerY - barHeight / 2;

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth - 2, barHeight, 2);
      ctx.fill();

      // Add glow effect
      if (isPlaying && barHeight > 10) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "hsla(195, 85%, 55%, 0.5)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      x += barWidth;
    }

    animationRef.current = requestAnimationFrame(draw);
  };

  // Handle play state changes
  useEffect(() => {
    if (isPlaying && !isInitialized) {
      initializeAudio();
    }

    if (isPlaying && isInitialized) {
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
      draw();
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, isInitialized]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 60;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Static bars when not playing
  const staticBars = Array.from({ length: 32 }, (_, i) => ({
    height: 4 + Math.sin(i * 0.3) * 2,
  }));

  return (
    <div className="relative w-full h-16 rounded-xl overflow-hidden" style={{
      background: "hsla(var(--card), 0.3)",
    }}>
      {/* Canvas for real waveform */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: isInitialized ? "block" : "none" }}
      />

      {/* Static visualization when not initialized */}
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center gap-0.5 px-4">
          {staticBars.map((bar, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full"
              style={{
                background: "linear-gradient(180deg, hsl(var(--neon-cyan)), hsl(var(--neon-purple)))",
                height: bar.height,
              }}
              animate={isPlaying ? {
                height: [bar.height, bar.height * 4, bar.height * 2, bar.height * 3, bar.height],
                opacity: [0.6, 1, 0.8, 1, 0.6],
              } : {
                height: bar.height,
                opacity: 0.4,
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.02,
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient glow overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, hsla(var(--neon-cyan), 0.1) 0%, transparent 70%)",
        }}
        animate={{
          opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
};

export default AudioWaveform;
