import type { ScrapeResult } from './types';

/**
 * Generates a ready-to-paste prompt for Claude / ChatGPT / any LLM.
 * The prompt instructs the model to recreate the page as working frontend code.
 */
export function generateClonePrompt(result: ScrapeResult): string {
  const headingsBlock =
    result.headings.length > 0
      ? result.headings
          .slice(0, 20)
          .map((h) => `${'  '.repeat(h.level - 1)}- ${'#'.repeat(h.level)} ${h.text}`)
          .join('\n')
      : '(no headings found)';

  const internalLinks = result.links
    .filter((l) => !l.isExternal)
    .slice(0, 15)
    .map((l) => `- [${l.text}](${l.href})`)
    .join('\n');

  // Truncate markdown to keep the prompt within typical LLM context limits
  const MAX_CONTENT_CHARS = 6_000;
  const contentBlock =
    result.markdown.length > MAX_CONTENT_CHARS
      ? result.markdown.slice(0, MAX_CONTENT_CHARS) +
        '\n\n... [content truncated for length]'
      : result.markdown;

  return `You are an expert frontend developer. Your task is to recreate the following webpage as clean, working code.

---

## Source page
- **URL:** ${result.url}
- **Title:** ${result.title}${result.description ? `\n- **Description:** ${result.description}` : ''}
- **Word count:** ~${result.wordCount}

---

## Page structure (headings)
${headingsBlock}

${internalLinks ? `## Internal navigation links\n${internalLinks}\n\n---\n` : ''}
## Full page content (markdown)
${contentBlock}

---

## Your task

Create a **single, self-contained HTML file** that visually recreates this page.

Requirements:
1. **Layout** — Match the visual hierarchy, spacing, and structure as closely as possible.
2. **Typography** — Use a clean sans-serif font (system-ui or Inter). Preserve heading levels (h1–h4).
3. **Content** — Include all headings, paragraphs, lists, code blocks, and links from the content above.
4. **Links** — Keep all hrefs as-is (relative or absolute).
5. **Responsive** — Must look good on desktop and mobile (use CSS flexbox/grid or media queries).
6. **Style** — Embed all CSS in a \`<style>\` tag. No external CSS frameworks required, but you may use Tailwind CDN if it helps.
7. **No placeholder text** — Use the actual content from the markdown above.
8. **No JavaScript required** — Unless the original page clearly needed it for layout.

Output only the complete HTML file, starting with \`<!DOCTYPE html>\`.`.trim();
}
