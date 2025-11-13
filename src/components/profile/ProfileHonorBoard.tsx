// src/components/profile/ProfileHonorBoard.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, MessageCircle, Star, Users, BadgeDollarSign } from 'lucide-react';

interface UserStats {
  posts_count: number;
  comments_count: number;
  reactions_count: number;
  friends_count: number;
  total_reward: number;
}

interface ProfileHonorBoardProps {
  userId: string;
  username: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

export const ProfileHonorBoard = ({ 
  userId, 
  username, 
  avatarUrl,
  isDemo = false 
}: ProfileHonorBoardProps) => {
  const [stats, setStats] = useState<UserStats>({
    posts_count: 0,
    comments_count: 0,
    reactions_count: 0,
    friends_count: 0,
    total_reward: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      setTimeout(() => {
        setStats({
          posts_count: 1000,
          comments_count: 2000,
          reactions_count: 5000,
          friends_count: 5000,
          total_reward: 9999999,
        });
        setLoading(false);
      }, 800);
      return;
    }

    fetchUserStats();
  }, [userId, isDemo]);

  const fetchUserStats = async () => {
    try {
      const [
        { count: postsCount },
        { count: commentsCount },
        { count: reactionsCount },
        { count: friendsCount },
      ] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('reactions').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('friendships').select('*', { count: 'exact', head: true })
          .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
          .eq('status', 'accepted'),
      ]);

      setStats({
        posts_count: postsCount || 0,
        comments_count: commentsCount || 0,
        reactions_count: reactionsCount || 0,
        friends_count: friendsCount || 0,
        total_reward: 9999999,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-[680px] w-80 rounded-3xl" />;
  }

  const StatRow = ({ icon, label, value, isBig = false }: { icon: React.ReactNode; label: string; value: number; isBig?: boolean }) => (
    <div className={`
      relative overflow-hidden rounded-2xl p-4 
      bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-md border-2 
      ${isBig ? 'border-yellow-600 shadow-2xl animate-bounce' : 'border-yellow-500'} 
      transform transition-all duration-300 hover:scale-105 ${isBig ? 'animate-pulse' : ''}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`text-yellow-400 ${isBig ? 'text-4xl' : 'text-2xl'}`}>{icon}</div>
          <span className="text-yellow-300 font-black text-lg uppercase tracking-widest">{label}</span>
        </div>
        <div className={`
          font-black bg-gradient-to-r text-transparent bg-clip-text
          ${isBig ? 'text-4xl from-rose-500 via-red-500 to-amber-500 animate-pulse' : 'text-2xl from-yellow-400 to-amber-400'}
        `}>
          {value.toLocaleString()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed right-4 top-20 z-50 hidden lg:block">
      <div className="w-80 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 border-4 border-yellow-500 p-6 animate-pulse-slow honor-glow-profile">
        
        {/* SPARKLE STARS */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>

        <div className="relative space-y-5">
          {/* HEADER */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 p-1 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={isDemo ? "/lovable-avatar.jpg" : avatarUrl} />
                    <AvatarFallback className="bg-yellow-500 text-black font-bold text-lg">
                      {username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-black text-yellow-400 tracking-widest">{username.toUpperCase()}</h2>
            <h1 className="text-4xl font-black text-yellow-300 tracking-widest drop-shadow-2xl">HONOR BOARD</h1>
          </div>

          {/* STATS */}
          <div className="space-y-3">
            <StatRow icon="↑" label="POSTS" value={stats.posts_count} />
            <StatRow icon="💬" label="COMMENTS" value={stats.comments_count} />
            <StatRow icon="⭐" label="REACTIONS" value={stats.reactions_count} />
            <StatRow icon={<Users className="w-7 h-7" />} label="FRIENDS" value={stats.friends_count} />
            <StatRow icon="💎" label="TOTAL REWARD" value={stats.total_reward} isBig={true} />
          </div>

          {/* FOOTER */}
          <div className="text-center pt-3">
            <p className="text-yellow-500 text-xs font-bold tracking-widest animate-pulse">
              ★ TOP 1 FUN PROFILE WEB3 ★
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
