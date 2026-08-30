import React, { useState, useMemo } from 'react';
import { PlatformType, RoboticErrorItem, TriageCategory, SurgicalPhase } from '../../data/roboticPlatforms';
import { EXCELSIUS_ERROR_ITEMS } from '../../data/excelsiusKnowledgeBase';
import { MAZOR_X_ERROR_ITEMS } from '../../data/mazorXKnowledgeBase';
import { 
  Search, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  Camera, 
  CheckCircle2, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ErrorCodeLookupProps {
  currentPlatform: PlatformType;
  selectedCategory?: TriageCategory | 'ALL';
  onSelectCategory?: (category: TriageCategory | 'ALL') => void;
}

export const ErrorCodeLookup: React.FC<ErrorCodeLookupProps> = ({
  currentPlatform,
  selectedCategory = 'ALL',
  onSelectCategory
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhase, setActivePhase] = useState<SurgicalPhase>('ALL');
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);

  const rawItems: RoboticErrorItem[] = useMemo(() => {
    return currentPlatform === 'EXCELSIUS' ? EXCELSIUS_ERROR_ITEMS : MAZOR_X_ERROR_ITEMS;
  }, [currentPlatform]);

  const filteredItems = useMemo(() => {
    return rawItems.filter(item => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (activePhase !== 'ALL' && item.clinicalPhase !== activePhase) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        item.errorCode.toLowerCase().includes(q) ||
        item.displayTitle.toLowerCase().includes(q) ||
        item.whatItMeans.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });
  }, [rawItems, selectedCategory, activePhase, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedErrorId(prev => prev === id ? null : id);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertOctagon className="w-3 h-3 mr-1 text-rose-400" />
            CRITICAL STOP
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-400" />
            WARNING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <Info className="w-3 h-3 mr-1 text-blue-400" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
            Console Code Decoder
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Software Error Codes & Alert Banners
          </h3>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800/80 text-xs font-mono">
          {(['ALL', 'SETUP', 'REGISTRATION', 'EXECUTION'] as SurgicalPhase[]).map(phase => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`px-3 py-1 rounded transition-colors ${
                activePhase === phase
                  ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {phase === 'ALL' ? 'All Phases' : phase}
            </button>
          ))}
        </div>
      </div>

      <div className="relative my-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${currentPlatform === 'EXCELSIUS' ? 'Excelsius' : 'Mazor X'} error code (e.g. E-3104, ST-104, Tracking, Shift, Camera)...`}
          className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/80 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 font-mono outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 hover:text-slate-300 px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-mono">No matching error codes found for "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setActivePhase('ALL'); if (onSelectCategory) onSelectCategory('ALL'); }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-cyan-300 hover:bg-slate-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map(item => {
            const isExpanded = expandedErrorId === item.id;
            return (
              <div 
                key={item.id}
                className={`rounded-xl border transition-all ${
                  isExpanded 
                    ? 'bg-slate-950 border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                }`}
              >
                <div 
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 text-cyan-400 font-mono font-bold text-xs tracking-wider">
                      {item.errorCode}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300">
                        {item.displayTitle}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 line-clamp-1">
                        {item.whatItMeans}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {getSeverityBadge(item.severity)}
                    {item.fluoroCheckRecommended && (
                      <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        <Camera className="w-3 h-3 mr-1 text-purple-400" />
                        FLUORO CHECK
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-5 pt-2 border-t border-slate-800/80 space-y-4">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Clinical & Technical Explanation:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed">
                        {item.whatItMeans}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                        Top Probable Root Causes:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                        {item.probableCauses.map((cause, cIdx) => (
                          <li key={cIdx} className="flex items-start space-x-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Immediate Step-by-Step Fix:</span>
                      </span>
                      <ol className="space-y-2 text-xs sm:text-sm text-slate-100 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                        {item.immediateSteps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start space-x-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="leading-snug">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 flex items-start space-x-2 text-xs font-mono">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-amber-400 font-bold">Escalation Protocol: </span>
                        <span className="text-slate-300">{item.escalationFallback}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
