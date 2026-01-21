
import React from 'react';
import { SegmentationStrategy } from '../types';

interface StrategyPanelProps {
  strategy: SegmentationStrategy;
}

const StrategyPanel: React.FC<StrategyPanelProps> = ({ strategy }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-blue-800 flex items-center gap-2">
          <i className="fas fa-users"></i> Audience Concept: {strategy.audienceName}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Demographics</h4>
          <div className="space-y-2">
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-600">Age:</span>
              <span className="font-semibold">{strategy.ageRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Locations:</span>
              <span className="font-semibold text-right">{strategy.locations?.join(', ') || 'Global'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Key Interests</h4>
          <div className="flex flex-wrap gap-2">
            {strategy.interests?.map((interest, i) => (
              <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 text-white p-6 rounded-xl">
        <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-4">
          <i className="fas fa-bullseye"></i> AI Detailed Targeting Logic
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed italic">
          "{strategy.detailedTargetingSummary}"
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Behaviors</h4>
        <div className="flex flex-wrap gap-2">
          {strategy.behaviors?.map((b, i) => (
            <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrategyPanel;
