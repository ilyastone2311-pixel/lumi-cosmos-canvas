-- Create article_likes table for tracking liked articles
CREATE TABLE public.article_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for article_likes
CREATE POLICY "Users can view their own likes" 
ON public.article_likes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes" 
ON public.article_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.article_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create article_reads table for tracking read articles
CREATE TABLE public.article_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS
ALTER TABLE public.article_reads ENABLE ROW LEVEL SECURITY;

-- RLS policies for article_reads
CREATE POLICY "Users can view their own reads" 
ON public.article_reads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reads" 
ON public.article_reads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create article_views table for tracking views per category
CREATE TABLE public.article_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id TEXT NOT NULL,
  category TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- RLS policies for article_views
CREATE POLICY "Users can view their own views" 
ON public.article_views 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own views" 
ON public.article_views 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);