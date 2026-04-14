import CopyButton from '../ui/CopyButton';
import type { Link } from '@/lib/types';

interface Props {
  links: Link[];
}

export default function LinksTab({ links }: Props) {
  const internal = links.filter((l) => !l.isExternal).length;
  const external = links.filter((l) => l.isExternal).length;
  const allText = links.map((l) => `${l.text}\n${l.href}`).join('\n\n');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <span>{links.length} total</span>
          <span className="text-zinc-800">·</span>
          <span>{internal} internal</span>
          <span className="text-zinc-800">·</span>
          <span>{external} external</span>
        </div>
        {links.length > 0 && (
          <CopyButton text={allText} label="Copy All" />
        )}
      </div>

      {links.length === 0 ? (
        <p className="text-sm text-zinc-600 py-6 text-center">
          No links found on this page.
        </p>
      ) : (
        <div className="space-y-1 max-h-[480px] overflow-auto">
          {links.map((link, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-2.5 py-2 rounded-lg hover:bg-zinc-800/50 group transition-colors"
            >
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 mt-0.5 ${
                  link.isExternal
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {link.isExternal ? 'ext' : 'int'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-300 truncate leading-snug">
                  {link.text}
                </p>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-zinc-600 hover:text-indigo-400 truncate block transition-colors leading-snug mt-0.5"
                >
                  {link.href}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
