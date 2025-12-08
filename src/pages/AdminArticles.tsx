import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { 
  FileText,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  Save,
  Send,
  Eye,
  Upload,
  Clock,
  Tag,
  User,
  Link,
  Music,
  FileAudio,
  Image,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Categories matching the Library page
const categories = [
  { value: 'politics', label: 'Politics' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'culture', label: 'Culture' },
  { value: 'technology', label: 'Technology' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'history', label: 'History' },
  { value: 'personal-growth', label: 'Personal Growth' },
  { value: 'science', label: 'Science' },
  { value: 'business', label: 'Business' },
];

interface ArticleForm {
  title: string;
  subtitle: string;
  content: string;
  readTime: string;
  heroImage: File | null;
  thumbnailImage: File | null;
  category: string;
  tags: string;
  author: string;
  slug: string;
  audioFile: File | null;
  audioDuration: string;
  transcript: string;
}

const AdminArticles = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const [form, setForm] = useState<ArticleForm>({
    title: '',
    subtitle: '',
    content: '',
    readTime: '',
    heroImage: null,
    thumbnailImage: null,
    category: '',
    tags: '',
    author: '',
    slug: '',
    audioFile: null,
    audioDuration: '',
    transcript: '',
  });

  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && !form.slug) {
      const generatedSlug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50);
      setForm(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.title]);

  const handleInputChange = (field: keyof ArticleForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (field: 'heroImage' | 'thumbnailImage', file: File | null) => {
    if (file) {
      setForm(prev => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field === 'heroImage') {
          setHeroPreview(e.target?.result as string);
        } else {
          setThumbnailPreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (file: File | null) => {
    if (file) {
      setForm(prev => ({ ...prev, audioFile: file }));
      setAudioFileName(file.name);
      
      // Auto-detect duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        setForm(prev => ({ ...prev, audioDuration: `${minutes}:${seconds.toString().padStart(2, '0')}` }));
      };
    }
  };

  const removeImage = (field: 'heroImage' | 'thumbnailImage') => {
    setForm(prev => ({ ...prev, [field]: null }));
    if (field === 'heroImage') {
      setHeroPreview(null);
    } else {
      setThumbnailPreview(null);
    }
  };

  const removeAudio = () => {
    setForm(prev => ({ ...prev, audioFile: null, audioDuration: '' }));
    setAudioFileName(null);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Черновик сохранён');
    }, 1000);
  };

  const handlePublish = () => {
    if (!form.title || !form.content || !form.category) {
      toast.error('Заполните обязательные поля: заголовок, контент и категорию');
      return;
    }
    
    setIsSaving(true);
    // Simulate publish
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Статья опубликована');
    }, 1000);
  };

  const handlePreview = () => {
    toast.info('Функция предпросмотра будет добавлена позже');
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Доступ запрещён</h1>
          <p className="text-muted-foreground mb-6">У вас нет прав администратора для доступа к этой странице.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на главную
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            К панели администратора
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 icon-glow">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Добавить статью</h1>
              <p className="text-muted-foreground">Создание новой статьи для Lumi</p>
            </div>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Main Content Card */}
            <div className="glass-card rounded-2xl p-6 shadow-deep">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Основной контент
              </h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-foreground">
                    Заголовок статьи *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Введите заголовок статьи..."
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-sm font-medium text-foreground">
                    Краткое описание
                  </Label>
                  <Input
                    id="subtitle"
                    placeholder="Короткое описание для превью..."
                    value={form.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>

                {/* Full Content */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium text-foreground">
                    Текст статьи *
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Введите полный текст статьи..."
                    value={form.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="min-h-[300px] bg-background/50 border-border/50 focus:border-primary/50 resize-y"
                  />
                </div>

                {/* Read Time */}
                <div className="space-y-2">
                  <Label htmlFor="readTime" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Время чтения (минуты)
                  </Label>
                  <Input
                    id="readTime"
                    type="number"
                    placeholder="5"
                    value={form.readTime}
                    onChange={(e) => handleInputChange('readTime', e.target.value)}
                    className="w-32 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="glass-card rounded-2xl p-6 shadow-deep">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Изображения
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hero Image */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Hero изображение
                  </Label>
                  {heroPreview ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={heroPreview} alt="Hero preview" className="w-full h-40 object-cover" />
                      <button
                        onClick={() => removeImage('heroImage')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border/50 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Загрузить hero изображение</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('heroImage', e.target.files?.[0] || null)}
                      />
                    </label>
                  )}
                </div>

                {/* Thumbnail Image */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Миниатюра карточки
                  </Label>
                  {thumbnailPreview ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-40 object-cover" />
                      <button
                        onClick={() => removeImage('thumbnailImage')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border/50 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Загрузить миниатюру</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('thumbnailImage', e.target.files?.[0] || null)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Audio Card */}
            <div className="glass-card rounded-2xl p-6 shadow-deep">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                Аудио версия
              </h2>
              
              <div className="space-y-6">
                {/* Audio Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    MP3 файл
                  </Label>
                  {audioFileName ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <FileAudio className="w-8 h-8 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{audioFileName}</p>
                        {form.audioDuration && (
                          <p className="text-xs text-muted-foreground">Длительность: {form.audioDuration}</p>
                        )}
                      </div>
                      <button
                        onClick={removeAudio}
                        className="p-1.5 rounded-full hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border/50 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Загрузить MP3 файл</span>
                      <input
                        type="file"
                        accept="audio/mp3,audio/mpeg"
                        className="hidden"
                        onChange={(e) => handleAudioUpload(e.target.files?.[0] || null)}
                      />
                    </label>
                  )}
                </div>

                {/* Manual Duration */}
                <div className="space-y-2">
                  <Label htmlFor="audioDuration" className="text-sm font-medium text-foreground">
                    Длительность (если не определена автоматически)
                  </Label>
                  <Input
                    id="audioDuration"
                    placeholder="5:30"
                    value={form.audioDuration}
                    onChange={(e) => handleInputChange('audioDuration', e.target.value)}
                    className="w-32 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>

                {/* Transcript */}
                <div className="space-y-2">
                  <Label htmlFor="transcript" className="text-sm font-medium text-foreground">
                    Транскрипт (опционально)
                  </Label>
                  <Textarea
                    id="transcript"
                    placeholder="Вставьте транскрипт аудио для синхронизации текста..."
                    value={form.transcript}
                    onChange={(e) => handleInputChange('transcript', e.target.value)}
                    className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 resize-y"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Metadata Card */}
            <div className="glass-card rounded-2xl p-6 shadow-deep">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Метаданные
              </h2>
              
              <div className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Категория *
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    Теги
                  </Label>
                  <Input
                    id="tags"
                    placeholder="тег1, тег2, тег3"
                    value={form.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                  <p className="text-xs text-muted-foreground">Разделяйте теги запятой</p>
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Автор
                  </Label>
                  <Input
                    id="author"
                    placeholder="Имя автора"
                    value={form.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Link className="w-4 h-4 text-muted-foreground" />
                    URL (slug)
                  </Label>
                  <Input
                    id="slug"
                    placeholder="url-статьи"
                    value={form.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                  <p className="text-xs text-muted-foreground">Генерируется автоматически из заголовка</p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="glass-card rounded-2xl p-6 shadow-deep sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Действия
              </h2>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Сохранить черновик
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handlePreview}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Предпросмотр
                </Button>
                
                <Button
                  className="w-full justify-start bg-primary hover:bg-primary/90"
                  onClick={handlePublish}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Опубликовать
                </Button>
              </div>

              {/* Status info */}
              <div className="mt-6 pt-6 border-t border-border/30">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>* — обязательные поля</p>
                  <p>Черновики сохраняются локально</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminArticles;
