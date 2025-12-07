-- Create audio_progress table for cross-device sync
CREATE TABLE public.audio_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id TEXT NOT NULL,
  progress_time DECIMAL NOT NULL DEFAULT 0,
  total_duration DECIMAL,
  playback_speed DECIMAL NOT NULL DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable Row Level Security
ALTER TABLE public.audio_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own audio progress" 
ON public.audio_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own audio progress" 
ON public.audio_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audio progress" 
ON public.audio_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audio progress" 
ON public.audio_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_audio_progress_updated_at
BEFORE UPDATE ON public.audio_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();