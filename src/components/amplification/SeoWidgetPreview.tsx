import React, { useState } from 'react';
import { Star, Code, Copy, Check, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import { Review } from '../../types/reputation';
import { PHYSICIAN_PROFILE } from '../../data/mockReviews';
import { SchemaGenerator } from '../../services/schemaGenerator';

interface SeoWidgetPreviewProps {
  reviews: Review[];
}

export const SeoWidgetPreview: React.FC<SeoWidgetPreviewProps> = ({ reviews }) => {
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'JSON_LD' | 'EMBED_CODE'>('PREVIEW');
  const [copied, setCopied] = useState<boolean>(false);

  const jsonLd = SchemaGenerator.generateJsonLd(reviews);
  const embedCode = SchemaGenerator.generateEmbedWidgetCode();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const topReviews = reviews.filter(r => r.rating >= 4).slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Explanation Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Globe className="w-4 h-4 text-teal-400" />
            <span>Pillar 2: Website "Social Proof" Widget & Google Rich Snippets</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Embed your verified patient reviews from Google, Healthgrades, and Vitals directly onto your practice website. 
            Injects Google-compliant Schema.org JSON-LD to display <strong>bright gold stars in Google search results</strong>.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center space-x-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
              activeTab === 'PREVIEW' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Website View
          </button>
          <button
            onClick={() => setActiveTab('JSON_LD')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
              activeTab === 'JSON_LD' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Google JSON-LD SEO
          </button>
          <button
            onClick={() => setActiveTab('EMBED_CODE')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
              activeTab === 'EMBED_CODE' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Embed Snippet
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'PREVIEW' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6 shadow-inner">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-teal-400 font-bold bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
              Verified Neurosurgical Patient Reviews
            </span>
            <h2 className="text-xl font-bold text-white">What Patients Say About {PHYSICIAN_PROFILE.name}</h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-300">
              <div className="flex items-center text-yellow-400">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400" />)}
              </div>
              <span className="font-bold text-white">{PHYSICIAN_PROFILE.aggregateRating} out of 5.0</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{PHYSICIAN_PROFILE.totalReviews} verified patient reviews across Google, Healthgrades, & Vitals</span>
            </div>
          </div>

          {/* Cards Stream */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topReviews.map(r => (
              <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-400">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400" />)}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      via {r.platform}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-4 leading-relaxed">
                    "{r.reviewText}"
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">{r.authorName}</span>
                  <span className="flex items-center space-x-1 text-emerald-400 text-[10px]">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Patient</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'JSON_LD' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Google SEO Rich Snippet Structured Data (Schema.org / JSON-LD for {PHYSICIAN_PROFILE.name})
            </label>
            <button
              onClick={() => handleCopy(jsonLd)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON-LD!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-emerald-400 font-mono overflow-x-auto leading-relaxed max-h-96">
            {jsonLd}
          </pre>
        </div>
      )}

      {activeTab === 'EMBED_CODE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              HTML Embed Tag (Paste into your practice website)
            </label>
            <button
              onClick={() => handleCopy(embedCode)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied HTML!' : 'Copy Embed Code'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-cyan-400 font-mono overflow-x-auto leading-relaxed">
            {embedCode}
          </pre>
        </div>
      )}

    </div>
  );
};
