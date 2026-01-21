
import React from 'react';
import { AdCopy, Campaign } from '../types';

interface MetaMockupProps {
  campaign: Partial<Campaign>;
  copy: AdCopy;
  creativeUrl?: string;
}

const MetaMockup: React.FC<MetaMockupProps> = ({ campaign, copy, creativeUrl }) => {
  return (
    <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center p-3 gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          {campaign.clientName?.charAt(0) || 'C'}
        </div>
        <div>
          <h4 className="font-bold text-sm leading-tight text-slate-800">{campaign.clientName || 'Client Name'}</h4>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Sponsored <i className="fas fa-globe-americas text-[10px]"></i>
          </p>
        </div>
        <div className="ml-auto text-slate-400">
          <i className="fas fa-ellipsis-h"></i>
        </div>
      </div>

      {/* Primary Text */}
      <div className="px-3 pb-3 text-sm text-slate-800 whitespace-pre-line">
        {copy.primaryText || "Primary text will appear here..."}
      </div>

      {/* Media */}
      <div className="aspect-square bg-slate-100 relative group">
        {creativeUrl ? (
          campaign.creativeType === 'video' ? (
            <video src={creativeUrl} controls className="w-full h-full object-cover" />
          ) : (
            <img src={creativeUrl} alt="Ad Content" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 italic">
            Visual creative placeholder
          </div>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-[10px] uppercase text-slate-500 font-bold truncate">{campaign.url || 'WWW.CLIENT.COM'}</p>
          <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{copy.headline || 'Impactful Headline'}</h3>
          <p className="text-xs text-slate-500 line-clamp-1">{copy.description || 'Description of the offer'}</p>
        </div>
        <button className="px-4 py-1.5 bg-slate-200 text-slate-800 text-xs font-bold rounded-md hover:bg-slate-300 transition-colors uppercase whitespace-nowrap">
          {copy.callToAction || 'Learn More'}
        </button>
      </div>
    </div>
  );
};

export default MetaMockup;
