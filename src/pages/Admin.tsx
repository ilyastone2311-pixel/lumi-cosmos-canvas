import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Heart,
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  Loader2,
  UserX,
  UserCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface UserStats {
  favorites_count: number;
  categories_read: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, users, usersLoading, fetchAllUsers, getUserStats, assignRole, removeRole } = useAdmin();
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<Record<string, UserStats>>({});
  const [loadingStats, setLoadingStats] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      fetchAllUsers();
    }
  }, [isAdmin, adminLoading]);

  const handleExpandUser = async (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }
    
    setExpandedUser(userId);
    
    if (!userStats[userId]) {
      setLoadingStats(userId);
      const stats = await getUserStats(userId);
      if (stats) {
        setUserStats(prev => ({ ...prev, [userId]: stats }));
      }
      setLoadingStats(null);
    }
  };

  const handleAssignRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    const { error } = await assignRole(userId, role);
    if (error) {
      toast.error(`Не удалось назначить роль: ${error.message}`);
    } else {
      toast.success(`Роль "${role}" успешно назначена`);
    }
  };

  const handleRemoveRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    const { error } = await removeRole(userId, role);
    if (error) {
      toast.error(`Не удалось удалить роль: ${error.message}`);
    } else {
      toast.success(`Роль "${role}" успешно удалена`);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Никогда';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'default';
      default: return 'secondary';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldAlert className="w-3 h-3" />;
      case 'moderator': return <ShieldCheck className="w-3 h-3" />;
      default: return <Shield className="w-3 h-3" />;
    }
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к настройкам
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 icon-glow">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Панель администратора</h1>
              <p className="text-muted-foreground">Управление пользователями и ролями</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 shadow-deep"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Все пользователи ({users.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllUsers}
              disabled={usersLoading}
            >
              {usersLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Обновить'
              )}
            </Button>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <UserX className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Пользователи не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Имя пользователя</TableHead>
                    <TableHead>Роли</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead>Последний вход</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <>
                      <TableRow 
                        key={u.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleExpandUser(u.id)}
                      >
                        <TableCell>
                          <motion.div
                            animate={{ rotate: expandedUser === u.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        </TableCell>
                        <TableCell className="font-medium">{u.email}</TableCell>
                        <TableCell>{u.username || '—'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {u.roles.length === 0 ? (
                              <Badge variant="outline" className="text-xs">
                                Нет ролей
                              </Badge>
                            ) : (
                              u.roles.map((role) => (
                                <Badge 
                                  key={role} 
                                  variant={getRoleBadgeVariant(role)}
                                  className="flex items-center gap-1 text-xs"
                                >
                                  {getRoleIcon(role)}
                                  {role}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(u.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDate(u.last_sign_in_at)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm">
                                Управление ролями
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!u.roles.includes('admin') && (
                                <DropdownMenuItem onClick={() => handleAssignRole(u.id, 'admin')}>
                                  <ShieldAlert className="w-4 h-4 mr-2 text-destructive" />
                                  Назначить Admin
                                </DropdownMenuItem>
                              )}
                              {!u.roles.includes('moderator') && (
                                <DropdownMenuItem onClick={() => handleAssignRole(u.id, 'moderator')}>
                                  <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
                                  Назначить Moderator
                                </DropdownMenuItem>
                              )}
                              {!u.roles.includes('user') && (
                                <DropdownMenuItem onClick={() => handleAssignRole(u.id, 'user')}>
                                  <Shield className="w-4 h-4 mr-2" />
                                  Назначить User
                                </DropdownMenuItem>
                              )}
                              {u.roles.includes('admin') && (
                                <DropdownMenuItem 
                                  onClick={() => handleRemoveRole(u.id, 'admin')}
                                  className="text-destructive"
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  Удалить Admin
                                </DropdownMenuItem>
                              )}
                              {u.roles.includes('moderator') && (
                                <DropdownMenuItem 
                                  onClick={() => handleRemoveRole(u.id, 'moderator')}
                                  className="text-destructive"
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  Удалить Moderator
                                </DropdownMenuItem>
                              )}
                              {u.roles.includes('user') && (
                                <DropdownMenuItem 
                                  onClick={() => handleRemoveRole(u.id, 'user')}
                                  className="text-destructive"
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  Удалить User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      
                      {expandedUser === u.id && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-muted/30">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="py-4 px-6"
                            >
                              <h4 className="font-semibold mb-4 text-foreground">Статистика пользователя</h4>
                              {loadingStats === u.id ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Загрузка статистики...
                                </div>
                              ) : userStats[u.id] ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="glass-panel p-4 rounded-xl">
                                    <div className="flex items-center gap-2 text-primary mb-2">
                                      <Heart className="w-4 h-4" />
                                      <span className="text-sm font-medium">Избранное</span>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">
                                      {userStats[u.id].favorites_count}
                                    </p>
                                  </div>
                                  <div className="glass-panel p-4 rounded-xl">
                                    <div className="flex items-center gap-2 text-primary mb-2">
                                      <BookOpen className="w-4 h-4" />
                                      <span className="text-sm font-medium">Категорий прочитано</span>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">
                                      {userStats[u.id].categories_read}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-muted-foreground">Статистика недоступна</p>
                              )}
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
