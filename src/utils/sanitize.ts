/**
 * Input sanitization utility for Tipkur Tipkha
 * Protects against XSS, script injection, and invalid characters while preserving
 * authentic Khasi orthography (such as Ï, ï, Ñ, ñ, apostrophes for glottal stops, and hyphens).
 */

export function sanitizeClanInput(raw: string, maxLength: number = 100): string {
  if (!raw || typeof raw !== 'string') return '';

  // 1. Strip any HTML tags
  let cleaned = raw.replace(/<[^>]*>/g, '');

  // 2. Remove script / javascript: / data: URI patterns
  cleaned = cleaned.replace(/javascript\s*:/gi, '');
  cleaned = cleaned.replace(/data\s*:/gi, '');
  cleaned = cleaned.replace(/vbscript\s*:/gi, '');

  // 3. Remove dangerous control / angle bracket characters (<, >, ", `, ;, {, })
  cleaned = cleaned.replace(/[<>"`{};\\]/g, '');

  // 4. Normalize multiple whitespaces into a single space
  cleaned = cleaned.replace(/\s+/g, ' ');

  // 5. Trim and clamp to maxLength
  return cleaned.trim().slice(0, maxLength);
}

export function sanitizeTextInput(raw: string, maxLength: number = 300): string {
  if (!raw || typeof raw !== 'string') return '';

  let cleaned = raw.replace(/<[^>]*>/g, '');
  cleaned = cleaned.replace(/javascript\s*:/gi, '');
  cleaned = cleaned.replace(/data\s*:/gi, '');
  cleaned = cleaned.replace(/[<>"`\\]/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ');

  return cleaned.trim().slice(0, maxLength);
}
