'use client';

import { useState } from 'react';
import CopyButton from '../ui/CopyButton';

interface Props {
  prompt: string;
  sourceUrl: string;
}

const AI_LINKS = [
  { label: 'Claude', href: 'https://claude.ai' },
  { label: 'ChatGPT', href: 'https://chatgpt.com' },
  { label: 'Gemini', href: 'https://gemini.google.com' },
];

export default function CloneTab({ prompt, sourceUrl }: Props) {
  const [expanded, setExpanded] = useState(false);

  const preview = prompt.slice(0, 600);
  const isLong = prompt.length > 600;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-200 mb-1">
            AI Clone Prompt
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-lg">
            Copy this prompt and paste it into any AI assistant. It instructs
            the model to recreate{' '}
            <span className="text-zinc-400 font-mono text-[11px]">
              {new URL(sourceUrl).hostname}
            </span>{' '}
            as a self-contained HTML file.
          </p>
        </div>
        <CopyButton text={prompt} label="Copy Prompt" />
      </div>

      {/* Open in links */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-zinc-600">Open in:</span>
        {AI_LINKS.map((ai) => (
          <a
            key={ai.label}
            href={ai.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 bg-zinc-800/80 transition-all duration-150"
          >
            {ai.label} ↗
          </a>
        ))}
      </div>

      {/* Prompt preview */}
      <div className="relative">
        <pre
          className={`bg-zinc-950 rounded-lg border border-zinc-800 p-4 text-[12.5px] font-mono text-zinc-300 overflow-auto leading-relaxed whitespace-pre-wrap break-words transition-all duration-200 ${
            expanded ? 'max-h-[600px]' : 'max-h-[260px]'
          }`}
        >
          {expanded ? prompt : preview}
          {!expanded && isLong && '…'}
        </pre>

        {isLong && (
          <div
            className={`${
              expanded ? '' : 'absolute bottom-0 left-0 right-0'
            } flex justify-center pt-2 pb-1`}
          >
            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent rounded-b-lg pointer-events-none" />
            )}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="relative z-10 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:border-zinc-600 transition-all duration-150"
            >
              {expanded ? '↑ Collapse' : '↓ Show full prompt'}
            </button>
          </div>
        )}
      </div>

      {/* Prompt stats */}
      <p className="mt-3 text-[11px] text-zinc-700">
        {prompt.length.toLocaleString()} characters ·{' '}
        {Math.ceil(prompt.length / 4).toLocaleString()} tokens (approx)
      </p>
    </div>
  );
}
