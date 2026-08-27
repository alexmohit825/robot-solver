import React from 'react';
import { Award, Star, TrendingUp, MapPin, Building2 } from 'lucide-react';
import { REGIONAL_BENCHMARKS } from '../../data/mockReviews';

export const RegionalCompetitorRadar: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>Regional Neurosurgery Benchmarking (Puget Sound & Pierce County)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time reputation comparison across leading Pacific Northwest neurosurgical and spine centers.
          </p>
        </div>
        <span className="text-[11px] bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
          <span>🏆 #1 Ranked in Tacoma</span>
        </span>
      </div>

      <div className="space-y-3">
        {REGIONAL_BENCHMARKS.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-3.5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              item.isCurrentUser
                ? 'bg-teal-950/30 border-teal-500/60 ring-1 ring-teal-500/40 shadow-sm'
                : 'bg-slate-800/50 border-slate-700/60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                item.isCurrentUser ? 'bg-teal-500 text-slate-950' : 'bg-slate-700 text-slate-300'
              }`}>
                #{idx + 1}
              </span>
              <div>
                <span className={`text-xs font-bold block ${item.isCurrentUser ? 'text-white' : 'text-slate-200'}`}>
                  {item.institutionName}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500 inline" />
                  <span>{item.location}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 self-end sm:self-center text-xs">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white text-sm">{item.rating}</span>
                <span className="text-slate-400 text-[11px]">/ 5.0</span>
              </div>
              <span className="text-slate-400 text-[11px] font-mono">({item.totalReviews} reviews)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
