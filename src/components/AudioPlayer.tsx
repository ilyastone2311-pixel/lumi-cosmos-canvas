import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Headphones, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import MiniAudioPlayer from "./MiniAudioPlayer";
import AudioWaveform from "./AudioWaveform";
import { toast } from "sonner";

interface AudioPlayerProps {
  audioUrl?: string;
  duration?: string;
  articleId?: string;
  articleTitle?: string;
  articleText?: string;
  onTimeUpdate?: (time: number) => void;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const AudioPlayer = ({ 
  audioUrl,
  duration = "3:24",
  articleId = "default",
  articleTitle = "Discovering Insights That Transform Perspectives",
  articleText,
  onTimeUpdate
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [showResumeTooltip, setShowResumeTooltip] = useState(false);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [hasGeneratedAudio, setHasGeneratedAudio] = useState(false);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Load saved progress
  const loadProgress = useCallback(async () => {
    if (hasLoadedProgress) return;
    
    // First try localStorage
    const localKey = `audio_progress_${articleId}`;
    const localData = localStorage.getItem(localKey);
    let savedTime = 0;
    let savedSpeed = 1;
    
    if (localData) {
      const parsed = JSON.parse(localData);
      savedTime = parsed.time || 0;
      savedSpeed = parsed.speed || 1;
    }
    
    // If logged in, try backend
    if (user) {
      const { data } = await supabase
        .from('audio_progress')
        .select('progress_time, playback_speed')
        .eq('article_id', articleId)
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        savedTime = Number(data.progress_time) || savedTime;
        savedSpeed = Number(data.playback_speed) || savedSpeed;
      }
    }
    
    if (savedTime > 0 && audioRef.current) {
      audioRef.current.currentTime = savedTime;
      setCurrentTime(savedTime);
      setShowResumeTooltip(true);
      setTimeout(() => setShowResumeTooltip(false), 3000);
    }
    
    setPlaybackSpeed(savedSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = savedSpeed;
    }
    
    setHasLoadedProgress(true);
  }, [articleId, user, hasLoadedProgress]);

  // Save progress
  const saveProgress = useCallback(async (time: number, speed: number) => {
    const localKey = `audio_progress_${articleId}`;
    localStorage.setItem(localKey, JSON.stringify({ time, speed, updatedAt: Date.now() }));
    
    if (user) {
      await supabase
        .from('audio_progress')
        .upsert({
          user_id: user.id,
          article_id: articleId,
          progress_time: time,
          playback_speed: speed,
          total_duration: audioDuration
        }, { onConflict: 'user_id,article_id' });
    }
  }, [articleId, user, audioDuration]);

  // Auto-save every 5 seconds while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      saveProgress(currentTime, playbackSpeed);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, playbackSpeed, saveProgress]);

  // Detect if main player is out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMiniPlayer(!entry.isIntersecting && isPlaying);
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [isPlaying]);

  // Generate audio using ElevenLabs TTS
  const generateAudio = useCallback(async () => {
    if (!articleText || isGeneratingAudio || hasGeneratedAudio) return;
    
    setIsGeneratingAudio(true);
    toast.info("Generating audio narration...");
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: articleText }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate audio: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const blobUrl = URL.createObjectURL(audioBlob);
      setGeneratedAudioUrl(blobUrl);
      setHasGeneratedAudio(true);
      toast.success("Audio ready to play!");
      
      // Set the audio source and play
      if (audioRef.current) {
        audioRef.current.src = blobUrl;
        audioRef.current.load();
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate audio");
    } finally {
      setIsGeneratingAudio(false);
    }
  }, [articleText, isGeneratingAudio, hasGeneratedAudio]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (generatedAudioUrl) {
        URL.revokeObjectURL(generatedAudioUrl);
      }
    };
  }, [generatedAudioUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    // If we have article text but haven't generated audio yet, generate it first
    if (articleText && !hasGeneratedAudio && !generatedAudioUrl) {
      await generateAudio();
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      saveProgress(currentTime, playbackSpeed);
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.5;
        setVolume(volume || 0.5);
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
      loadProgress();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audioDuration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = percent * audioDuration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setShowMiniPlayer(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    saveProgress(0, playbackSpeed);
  };

  const cycleSpeed = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    const newSpeed = PLAYBACK_SPEEDS[nextIndex];
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    saveProgress(currentTime, newSpeed);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const scrollToMainPlayer = () => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <>
      <div ref={containerRef} className="relative my-8 animate-fade-in" style={{ animationDelay: "50ms" }}>
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={generatedAudioUrl || audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload={audioUrl ? "metadata" : "none"}
        />

        {/* Resume Tooltip */}
        <AnimatePresence>
          {showResumeTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium z-20"
              style={{
                background: "linear-gradient(135deg, hsla(var(--neon-cyan), 0.2), hsla(var(--neon-purple), 0.2))",
                border: "1px solid hsla(var(--neon-cyan), 0.4)",
                boxShadow: "0 0 20px hsla(var(--neon-cyan), 0.3)"
              }}
            >
              ✨ Resuming from where you left off
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle Shimmer Background */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/40"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Main Player Container - Mobile optimized with larger touch targets */}
        <motion.div
          className={`relative glass rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-500 ${
            isPlaying ? "audio-player-active" : ""
          }`}
          style={{
            background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
            boxShadow: isPlaying
              ? "0 0 40px hsla(var(--neon-cyan), 0.2), 0 0 60px hsla(var(--neon-purple), 0.1), 0 15px 40px hsla(240, 35%, 4%, 0.5)"
              : "0 0 30px hsla(var(--neon-cyan), 0.08), 0 15px 40px hsla(240, 35%, 4%, 0.4)",
            border: "1px solid hsla(var(--primary), 0.2)",
          }}
          animate={{
            borderColor: isPlaying
              ? ["hsla(var(--neon-cyan), 0.3)", "hsla(var(--neon-purple), 0.3)", "hsla(var(--neon-cyan), 0.3)"]
              : "hsla(var(--primary), 0.2)",
          }}
          transition={{ duration: 3, repeat: isPlaying ? Infinity : 0 }}
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Top Row: Play Button + Content - Stack on mobile */}
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
              {/* Play/Pause Button */}
              <div className="relative flex-shrink-0">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--neon-cyan)), hsl(var(--primary)), hsl(var(--neon-purple)))",
                    filter: "blur(15px)",
                  }}
                  animate={{
                    opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.3,
                    scale: isPlaying ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <motion.button
                  onClick={togglePlay}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center z-10 active:scale-95 ${isGeneratingAudio ? 'cursor-wait' : 'cursor-pointer'}`}
                  disabled={isGeneratingAudio}
                  style={{
                    background: isGeneratingAudio 
                      ? "linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted-foreground)))"
                      : "linear-gradient(135deg, hsl(var(--neon-cyan)), hsl(var(--primary)), hsl(var(--neon-purple)))",
                    boxShadow: "0 0 30px hsla(var(--neon-cyan), 0.4), inset 0 2px 10px hsla(0, 0%, 100%, 0.2)",
                  }}
                  whileHover={{ 
                    scale: 1.08,
                    boxShadow: "0 0 50px hsla(var(--neon-cyan), 0.6), inset 0 2px 10px hsla(0, 0%, 100%, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, hsla(0, 0%, 100%, 0.2) 45%, hsla(0, 0%, 100%, 0.3) 50%, transparent 55%)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  
                  <AnimatePresence mode="wait">
                    {isGeneratingAudio ? (
                      <motion.div
                        key="loading"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white drop-shadow-lg animate-spin" />
                      </motion.div>
                    ) : isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Pause className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white drop-shadow-lg" fill="white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white drop-shadow-lg ml-0.5" fill="white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Content Section - Optimized for mobile */}
              <div className="flex-1 w-full min-w-0">
                {/* Header Row - Hidden on small mobile */}
                <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground font-medium tracking-wide">
                      Listen and learn on the go
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Volume Control */}
                    <div className="flex items-center gap-2 group">
                      <motion.button
                        onClick={toggleMute}
                        className="p-1.5 rounded-full transition-all"
                        style={{
                          background: "hsla(var(--primary), 0.1)",
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 0 10px hsla(var(--neon-cyan), 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-primary" />
                        )}
                      </motion.button>
                      <div className="relative w-20 h-1.5 group">
                        <div 
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "hsla(var(--muted), 0.3)",
                          }}
                        />
                        <motion.div
                          className="absolute top-0 left-0 h-full rounded-full"
                          style={{ 
                            width: `${isMuted ? 0 : volume * 100}%`,
                            background: "linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--primary)))",
                            boxShadow: "0 0 8px hsla(var(--neon-cyan), 0.5)",
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Speed Control */}
                    <motion.button
                      onClick={cycleSpeed}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                      style={{
                        background: "hsla(var(--primary), 0.15)",
                        border: "1px solid hsla(var(--neon-cyan), 0.3)",
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 0 15px hsla(var(--neon-cyan), 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-primary">{playbackSpeed}x</span>
                    </motion.button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  ref={progressRef}
                  className="relative h-2 bg-muted/30 rounded-full cursor-pointer group mb-4"
                  onClick={handleProgressClick}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseMove={handleProgressDrag}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchMove={handleProgressDrag}
                >
                  <div 
                    className="absolute inset-0 rounded-full opacity-50"
                    style={{
                      background: "linear-gradient(90deg, hsla(var(--neon-cyan), 0.1), hsla(var(--neon-purple), 0.1))",
                    }}
                  />
                  
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full overflow-hidden"
                    style={{ 
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--primary)), hsl(var(--neon-purple)))",
                      boxShadow: "0 0 10px hsla(var(--neon-cyan), 0.5)",
                    }}
                  >
                    {isPlaying && (
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(90deg, transparent, hsla(0, 0%, 100%, 0.3), transparent)",
                          backgroundSize: "200% 100%",
                        }}
                        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </motion.div>

                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ 
                      left: `calc(${progress}% - 8px)`,
                      background: "hsl(var(--neon-cyan))",
                      boxShadow: "0 0 15px hsl(var(--neon-cyan))",
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                </div>

                {/* Time Display */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-mono tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "hsla(var(--primary), 0.15)",
                      color: "hsl(var(--primary))",
                      border: "1px solid hsla(var(--primary), 0.3)",
                    }}
                  >
                    {audioDuration > 0 ? formatTime(audioDuration) : duration}
                  </span>
                  <span className="text-muted-foreground font-mono tabular-nums">
                    -{formatTime(Math.max(0, audioDuration - currentTime))}
                  </span>
                </div>
              </div>
            </div>

            {/* Waveform Visualization */}
            <AudioWaveform audioRef={audioRef} isPlaying={isPlaying} />
          </div>
        </motion.div>
      </div>

      {/* Mini Player */}
      <MiniAudioPlayer
        isVisible={showMiniPlayer}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={audioDuration}
        title={articleTitle}
        progress={progress}
        onTogglePlay={togglePlay}
        onSeek={seekTo}
        onExpand={scrollToMainPlayer}
      />
    </>
  );
};

export default AudioPlayer;
