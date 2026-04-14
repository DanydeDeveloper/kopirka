'use client';

import CopyButton from '../ui/CopyButton';
import type { ScrapeResult } from '@/lib/types';

interface Props {
  result: ScrapeResult;
}

function buildOutput(result: ScrapeResult) {
  return {
    url: result.url,
    title: result.title,
    description: result.description || undefined,
    wordCount: result.wordCount,
    headings: result.headings,
    content: result.content,
    links: result.links,
    metadata: {
      fetchedAt: result.fetchedAt,
      usedPlaywright: result.usedPlaywright,
    },
  };
}

function download(data: object) {
  const text = JSON.stringify(data, null, 2);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'page.json';
  a.click();
  URL.revokeObjectURL(url);
}

export default function JsonTab({ result }: Props) {
  const data = buildOutput(result);
  const jsonText = JSON.stringify(data, null, 2);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-600">
          {result.headings.length} headings · {result.links.length} links
        </span>
        <div className="flex items-center gap-2">
          <CopyButton text={jsonText} label="Copy JSON" />
          <button
            onClick={() => download(data)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 bg-zinc-800/80 transition-all duration-150"
          >
            ↓ .json
          </button>
        </div>
      </div>
      <pre className="bg-zinc-950 rounded-lg border border-zinc-800 p-4 text-[12.5px] font-mono text-zinc-300 overflow-auto max-h-[480px] leading-relaxed">
        {jsonText}
      </pre>
    </div>
  );
}
