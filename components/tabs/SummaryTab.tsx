import CopyButton from '../ui/CopyButton';

interface Props {
  summary: string;
}

export default function SummaryTab({ summary }: Props) {
  // Summary is formatted as bullet points separated by \n\n
  const bullets = summary
    .split('\n\n')
    .map((s) => s.replace(/^[•\-]\s*/, '').trim())
    .filter(Boolean);

  const isBulletted = summary.startsWith('•') || summary.startsWith('-');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-600">Extractive summary</span>
        <CopyButton text={summary} label="Copy Summary" />
      </div>

      {isBulletted ? (
        <ul className="space-y-3">
          {bullets.map((point, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-indigo-500 mt-0.5 shrink-0 text-sm leading-relaxed">
                •
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed">{point}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-300 leading-relaxed">{summary}</p>
      )}
    </div>
  );
}
