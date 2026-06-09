import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  revenue: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

const mockLeaderboard: LeaderboardEntry[] = [
  { id: 'B1', name: 'KTM Main', revenue: 450000, rank: 1, trend: 'up' },
  { id: 'B2', name: 'Pokhara Lakeside', revenue: 320000, rank: 2, trend: 'stable' },
  { id: 'B3', name: 'Lalitpur Hub', revenue: 280000, rank: 3, trend: 'up' },
  { id: 'B4', name: 'Butwal City', revenue: 150000, rank: 4, trend: 'down' },
];

const BranchLeaderboard: React.FC = () => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-3xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="text-amber-500" size={24} />
          <h3 className="text-xl font-black uppercase tracking-tight text-slate-200 italic">Branch Leaderboard</h3>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
          This Month
        </span>
      </div>

      <div className="space-y-4">
        {mockLeaderboard.map((entry, idx) => (
          <motion.div 
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-center justify-between p-5 rounded-2xl border transition-all hover:scale-[1.02] cursor-default ${
                entry.rank === 1 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-6">
                <div className="w-10 h-10 flex items-center justify-center relative">
                    {entry.rank === 1 ? (
                        <Crown className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]" size={28} />
                    ) : entry.rank === 2 ? (
                        <Medal className="text-slate-300" size={24} />
                    ) : entry.rank === 3 ? (
                        <Medal className="text-amber-700" size={24} />
                    ) : (
                        <span className="text-lg font-black text-slate-700">{entry.rank}</span>
                    )}
                </div>
                <div>
                    <div className="font-black text-slate-100 uppercase tracking-tight">{entry.name}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Revenue Alpha Index</div>
                </div>
            </div>

            <div className="text-right">
                <div className="text-lg font-black italic text-emerald-400">रु {entry.revenue.toLocaleString()}</div>
                <div className="flex items-center justify-end gap-1">
                    <TrendingUp size={12} className={entry.trend === 'up' ? 'text-emerald-500' : 'text-slate-600'} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{entry.trend}</span>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
                  <Trophy size={14} className="text-slate-950" />
              </div>
              <div>
                  <div className="text-[10px] font-black text-emerald-500 uppercase">Top Performer Reward</div>
                  <div className="text-xs font-bold text-slate-300 tracking-tight">KTM Main is currently 12% ahead of target.</div>
              </div>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 underline underline-offset-4">Details</button>
      </div>
    </div>
  );
};

export default BranchLeaderboard;
