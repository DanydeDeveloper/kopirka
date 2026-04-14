'use client';

import CopyButton from '../ui/CopyButton';

interface Props {
  markdown: string;
}

function download(text: string) {
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'page.md';
  a.click();
  URL.revokeObjectURL(url);
}

export default function MarkdownTab({ markdown }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-600">
          {markdown.length.toLocaleString()} characters
        </span>
        <div className="flex items-center gap-2">
          <CopyButton text={markdown} label="Copy Markdown" />
          <button
            onClick={() => download(markdown)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 bg-zinc-800/80 transition-all duration-150"
          >
            ↓ .md
          </button>
        </div>
      </div>
      <pre className="bg-zinc-950 rounded-lg border border-zinc-800 p-4 text-[12.5px] font-mono text-zinc-300 overflow-auto max-h-[480px] leading-relaxed whitespace-pre-wrap break-words">
        {markdown || 'No markdown content extracted.'}
      </pre>
    </div>
  );
}
