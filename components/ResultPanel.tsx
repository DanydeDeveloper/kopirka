'use client';

import { useState, useMemo } from 'react';
import type { ScrapeResult } from '@/lib/types';
import { generateClonePrompt } from '@/lib/clone-prompt';
import MarkdownTab from './tabs/MarkdownTab';
import JsonTab from './tabs/JsonTab';
import SummaryTab from './tabs/SummaryTab';
import LinksTab from './tabs/LinksTab';
import CloneTab from './tabs/CloneTab';

interface Props {
  result: ScrapeResult;
  onClear: () => void;
}

const TABS = [
  { id: 'markdown', label: 'Markdown' },
  { id: 'json',     label: 'JSON' },
  { id: 'summary',  label: 'Summary' },
  { id: 'links',    label: 'Links' },
  { id: 'clone',    label: 'Clone ✦' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ResultPanel({ result, onClear }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('markdown');

  // Memoised so the prompt isn't regenerated on every render
  const clonePrompt = useMemo(() => generateClonePrompt(result), [result]);

  return (
    <div className="mt-8 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-zinc-800/60">
        <div className="min-w-0 flex-1 pr-4">
          <p className="text-sm font-medium text-zinc-200 truncate leading-snug">
            {result.title}
          </p>
          <p className="text-xs text-zinc-600 truncate mt-0.5">{result.url}</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          {result.usedPlaywright && (
            <span className="text-[11px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              JS rendered
            </span>
          )}
          <span className="text-xs text-zinc-600">
            {result.wordCount.toLocaleString()} words
          </span>
          <button
            onClick={onClear}
            className="text-zinc-700 hover:text-zinc-400 text-sm transition-colors leading-none"
            aria-label="Clear result"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-zinc-800/60 px-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? tab.id === 'clone'
                  ? 'border-indigo-400 text-indigo-300'
                  : 'border-indigo-500 text-zinc-100'
                : tab.id === 'clone'
                ? 'border-transparent text-indigo-500/70 hover:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
            {tab.id === 'links' && (
              <span className="ml-1.5 text-[11px] text-zinc-700">
                {result.links.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'markdown' && <MarkdownTab markdown={result.markdown} />}
        {activeTab === 'json'     && <JsonTab result={result} />}
        {activeTab === 'summary'  && <SummaryTab summary={result.summary} />}
        {activeTab === 'links'    && <LinksTab links={result.links} />}
        {activeTab === 'clone'    && (
          <CloneTab prompt={clonePrompt} sourceUrl={result.url} />
        )}
      </div>
    </div>
  );
}
