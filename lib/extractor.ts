import { load } from 'cheerio';
import type { Heading, Link } from './types';

export interface ExtractedContent {
  title: string;
  description: string;
  mainHtml: string;
  textContent: string;
  headings: Heading[];
  links: Link[];
}

const NOISE_SELECTORS = [
  'script',
  'style',
  'noscript',
  'nav',
  'header',
  'footer',
  'aside',
  'form',
  '[role="banner"]',
  '[role="navigation"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '.cookie-notice',
  '.cookie-banner',
  '.cookie-bar',
  '#cookie-notice',
  '#cookie-banner',
  '.ad',
  '.ads',
  '.advertisement',
  '.advert',
  '.popup',
  '.modal',
  '.overlay',
  '.sidebar',
  '#sidebar',
  '.related-posts',
  '.newsletter',
  '[aria-hidden="true"]',
  // Reference / citation sections
  '.references',
  '.reflist',
  '.refbegin',
  '.mw-references-wrap',
  // Table of contents (usually redundant noise)
  '#toc',
  '.toc',
  '.table-of-contents',
  // Breadcrumbs, share buttons, social widgets
  '.breadcrumb',
  '.share-buttons',
  '.social-share',
].join(', ');

export function extractContent(html: string, pageUrl: string): ExtractedContent {
  const $ = load(html);

  // Strip noise first
  $(NOISE_SELECTORS).remove();

  // Metadata
  const title = (
    $('meta[property="og:title"]').attr('content') ||
    $('title').text() ||
    $('h1').first().text() ||
    'Untitled'
  ).trim().replace(/\s+/g, ' ');

  const description = (
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    ''
  ).trim();

  // Find the main content container
  const mainEl = findMainContent($);

  // Headings
  const headings: Heading[] = [];
  mainEl.find('h1,h2,h3,h4,h5,h6').each((_: number, el: any) => {
    const level = parseInt((el.name as string).slice(1), 10);
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text) headings.push({ level, text });
  });

  // Links
  const links = extractLinks($, pageUrl);

  const mainHtml = mainEl.html() ?? '';
  const textContent = mainEl
    .text()
    .replace(/\s+/g, ' ')
    .trim();

  return { title, description, mainHtml, textContent, headings, links };
}

function findMainContent($: ReturnType<typeof load>): ReturnType<typeof $> {
  const candidates = [
    'article',
    'main',
    '[role="main"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    '.post-body',
    '.article-body',
    '.content-body',
    '#content',
    '.content',
  ];

  for (const selector of candidates) {
    const el = $(selector).first();
    if (el.length && el.text().trim().length > 200) {
      return el as unknown as ReturnType<typeof $>;
    }
  }

  // Density heuristic: pick the div/section with the most text relative to markup
  const best = findDenseContainer($);
  if (best) return best;

  return $('body') as unknown as ReturnType<typeof $>;
}

function findDenseContainer(
  $: ReturnType<typeof load>,
): ReturnType<typeof $> | null {
  let bestEl: ReturnType<typeof $> | null = null;
  let bestScore = 0;

  $('div,section').each((_: number, el: any) => {
    const element = $(el);
    const text = element.text().trim();
    const wordCount = text.split(/\s+/).length;
    const htmlLen = (element.html()?.length ?? 1) || 1;

    // Score = word² / htmlLength — penalises markup-heavy wrappers
    const score = (wordCount * wordCount) / htmlLen;

    if (score > bestScore && wordCount > 100) {
      bestScore = score;
      bestEl = element as unknown as ReturnType<typeof $>;
    }
  });

  return bestEl;
}

function extractLinks(
  $: ReturnType<typeof load>,
  pageUrl: string,
): Link[] {
  let origin = '';
  try {
    origin = new URL(pageUrl).origin;
  } catch {
    // ignore
  }

  const seen = new Set<string>();
  const links: Link[] = [];

  $('a[href]').each((_: number, el: any) => {
    const rawHref = ($(el).attr('href') ?? '').trim();
    const text = $(el).text().trim().replace(/\s+/g, ' ');

    if (!text || text.length > 200 || !rawHref) return;
    // Skip anchor-only links and non-HTTP schemes
    if (rawHref.startsWith('#')) return;
    if (/^(mailto|tel|javascript|data):/i.test(rawHref)) return;

    // Resolve relative paths
    let href = rawHref;
    if (rawHref.startsWith('/') && origin) {
      href = origin + rawHref;
    } else if (!rawHref.startsWith('http')) {
      try {
        href = new URL(rawHref, pageUrl).toString();
      } catch {
        return;
      }
    }

    if (seen.has(href)) return;
    seen.add(href);

    const isExternal = origin ? !href.startsWith(origin) : true;
    links.push({ text, href, isExternal });
  });

  return links.slice(0, 300);
}
