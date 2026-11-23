/**
 * Language Parser for Tipkur Tipkha Chatbot
 * Handles both Formal and Informal Khasi and English conversational texting formats
 * based on docs/language.md.
 * 
 * Supports extracting clan surnames from conversational sentences like:
 * - "Dei Dkhar", "Kur Dkhar", "Jait Dkhar"
 * - "Jong i dei Dkhar", "Jong i ka dei Dkhar"
 * - "I dei jait Dkhar", "I dei na ka jait Dkhar", "I dei na ka kur Dkhar"
 * - "Ka jait jong i ka dei Dkhar", "U dei jait Dkhar", "Ka dei jait Dkhar"
 * - "Nga dei jait Nongkynrih", "Nga dei kur Nongkynrih"
 * - "Ka kur jong nga ka dei Nongkynrih", "Ka jait jong nga ka dei Nongkynrih"
 * - Multi-surname formats for maternal uncle's children:
 *   "Ki dei jait Mawlong, Pyngrope, Shadap", "Dei kur Mawlong bad Pyngrope"
 */

import { sanitizeClanInput } from './sanitize';

// Regex patterns to strip formal and informal prefixes in Khasi & English
const PREFIX_REGEX = new RegExp(
  '^(' +
  // "ka jait jong nga/i/u/ka/u kpa ka dei ..."
  '(?:ka\\s+)?(?:jait|kur)\\s+jong\\s+(?:nga|i|u|ka|ki|u\\s+kpa)\\s+(?:ka\\s+|ki\\s+)?dei\\s+' +
  '|' +
  // "jong nga/i/u/ka/u kpa ka jait ka dei ..."
  '(?:jong\\s+(?:nga|i|u|ka|ki|u\\s+kpa)\\s+)?(?:ka\\s+|ki\\s+)?(?:jait|kur)\\s+(?:ka\\s+|ki\\s+)?dei\\s+' +
  '|' +
  // "jong nga/i/u/ka/u kpa dei (na ka jait/kur) ..."
  '(?:jong\\s+(?:nga|i|u|ka|ki|u\\s+kpa)\\s+)(?:ka\\s+|ki\\s+)?dei\\s+(?:na\\s+ka\\s+)?(?:jait\\s+|kur\\s+)?' +
  '|' +
  // "nga/i/u/ka/ki dei na ka jait/kur ..."
  '(?:nga|i|u|ka|ki)\\s+dei\\s+(?:na\\s+ka\\s+)?(?:jait\\s+|kur\\s+)?' +
  '|' +
  // "ki dei / dei na ka jait/kur ..."
  '(?:ki\\s+)?dei\\s+(?:na\\s+ka\\s+)?(?:jait|kur)\\s+' +
  '|' +
  // "dei na ka ..."
  'dei\\s+(?:na\\s+ka\\s+)?' +
  '|' +
  // "ki dei ..."
  'ki\\s+dei\\s+' +
  '|' +
  // "dei ..."
  'dei\\s+' +
  '|' +
  // "ki jait / ki kur ..."
  '(?:ki\\s+)?(?:jait|kur)\\s+' +
  '|' +
  // "ka jait / ka kur ..."
  '(?:ka\\s+)?(?:jait|kur)\\s+' +
  '|' +
  // English common patterns
  '(?:my|his|her|their|friend\'?s?)\\s+(?:surname|clan|last\\s+name)?\\s*(?:is|is\\s+a)?\\s+' +
  '|' +
  '(?:it\'?s?|it\\s+is)\\s+' +
  ')',
  'i'
);

/**
 * Extracts a single clean surname from formal or informal conversational text.
 */
export function extractSurnameFromText(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text.trim();

  // Strip square brackets if user typed e.g. [Dkhar]
  cleaned = cleaned.replace(/^\[+|\]+$/g, '').trim();

  // Strip conversational prefixes iteratively in case user typed e.g. "Jong i ka dei jait Dkhar"
  let prev = '';
  while (prev !== cleaned) {
    prev = cleaned;
    cleaned = cleaned.replace(PREFIX_REGEX, '').trim();
  }

  // Strip any trailing punctuation (.,!?)
  cleaned = cleaned.replace(/[.,!?]+$/, '').trim();

  // Strip any remaining brackets
  cleaned = cleaned.replace(/^\[+|\]+$/g, '').trim();

  return sanitizeClanInput(cleaned);
}

export interface UncleSurnamesResult {
  isNone: boolean;
  surnames: string[];
}

const NONE_KEYWORDS = new Set([
  'em',
  'no',
  '0',
  'zero',
  'none',
  'khlem',
  'ym don',
  'ym don mama',
  'ym don knii',
  'khlem mama',
  'khlem knii',
  'don em'
]);

/**
 * Extracts multiple surnames for maternal uncle's children from formal/informal text.
 * Handles comma-separated lists, "bad" (and), prefixes, or negative responses (Em/0/None).
 */
export function extractUncleSurnamesFromText(text: string): UncleSurnamesResult {
  if (!text || typeof text !== 'string') {
    return { isNone: true, surnames: [] };
  }

  const rawTrimmed = text.trim().toLowerCase().replace(/[.,!?]+$/, '');

  // Check if user answered negatively (no maternal uncles/cousins)
  if (NONE_KEYWORDS.has(rawTrimmed)) {
    return { isNone: true, surnames: [] };
  }

  let cleaned = text.trim();

  // Strip conversational prefixes iteratively
  let prev = '';
  while (prev !== cleaned) {
    prev = cleaned;
    cleaned = cleaned.replace(PREFIX_REGEX, '').trim();
  }

  // Strip brackets: e.g. [Mawlong], [Pyngrope], [Shadap] -> Mawlong, Pyngrope, Shadap
  cleaned = cleaned.replace(/\[/g, '').replace(/\]/g, '');

  // Split by commas, slashes, or Khasi word "bad" (and) / "ne" (or)
  const tokens = cleaned.split(/[,/]|(?:\s+bad\s+)|\n/i);

  const surnames: string[] = [];

  for (const token of tokens) {
    let t = token.trim();
    // Strip redundant leading words like "jait", "kur", "dei" inside tokens
    t = t.replace(/^(?:jait|kur|dei|ki|na\s+ka)\s+/i, '').trim();
    const sanitized = sanitizeClanInput(t);
    if (sanitized && !NONE_KEYWORDS.has(sanitized.toLowerCase())) {
      surnames.push(sanitized);
    }
  }

  if (surnames.length === 0) {
    return { isNone: true, surnames: [] };
  }

  return { isNone: false, surnames };
}

