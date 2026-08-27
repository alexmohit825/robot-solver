import React from 'react';
import { Radar, MessageSquare, ShieldAlert, Sparkles, Bot } from 'lucide-react';

export type ActiveTab = 'RADAR' | 'WORKBENCH' | 'DISPUTES' | 'AMPLIFICATION' | 'AUTOPILOT';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  urgentCount: number;
  disputeCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  urgentCount,
  disputeCount
}) => {
  const tabs = [
    {
      id: 'RADAR' as ActiveTab,
      label: 'Reputation Radar & Inbox',
      icon: Radar,
      badge: urgentCount > 0 ? urgentCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'WORKBENCH' as ActiveTab,
      label: 'Action & Response Workbench',
      icon: MessageSquare
    },
    {
      id: 'DISPUTES' as ActiveTab,
      label: 'Dispute & Takedown Studio',
      icon: ShieldAlert,
      badge: disputeCount > 0 ? disputeCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'AMPLIFICATION' as ActiveTab,
      label: 'Positive Amplification Studio',
      icon: Sparkles
    },
    {
      id: 'AUTOPILOT' as ActiveTab,
      label: '24/7 Background Autopilot Hub',
      icon: Bot,
      highlight: true
    }
  ];

  return (
    <nav className="bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex space-x-1 sm:space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
