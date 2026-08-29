import React, { useState } from 'react';
import { AdminProjectsTab } from './AdminProjectsTab';
import { AdminJournalTab } from './AdminJournalTab';
import { AdminContentTab } from './AdminContentTab';
import { Layers, FolderGit2, BookOpen } from 'lucide-react';

export const ContentManagerTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'content' | 'projects' | 'journal'>('projects');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1.5 rounded-2xl bg-[#141414] border border-white/10 w-fit">
        <button
          onClick={() => setSubTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            subTab === 'projects'
              ? 'bg-white text-black font-semibold shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <FolderGit2 size={14} />
          <span>Selected Works</span>
        </button>

        <button
          onClick={() => setSubTab('journal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            subTab === 'journal'
              ? 'bg-white text-black font-semibold shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <BookOpen size={14} />
          <span>Journal Articles</span>
        </button>

        <button
          onClick={() => setSubTab('content')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            subTab === 'content'
              ? 'bg-white text-black font-semibold shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Layers size={14} />
          <span>Hero & General</span>
        </button>
      </div>

      {subTab === 'projects' && <AdminProjectsTab />}
      {subTab === 'journal' && <AdminJournalTab />}
      {subTab === 'content' && <AdminContentTab />}
    </div>
  );
};
