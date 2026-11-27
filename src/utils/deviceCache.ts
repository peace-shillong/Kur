import { TipkurResponse, BisharSangResponse } from '../types';

const WADKUR_PREFIX = 'kur_cache_wadkur_';
const BISHAR_PREFIX = 'kur_cache_bishar_';
const CACHE_VERSION = 'v2';
const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

interface CacheEnvelope<T> {
  version: string;
  timestamp: number;
  data: T;
}

/**
 * Normalizes Khasi string for cache key consistency
 */
function normalizeForCache(str: string): string {
  return str
    .toLowerCase()
    .replace(/[ïï]/g, 'i')
    .replace(/[ññ]/g, 'n')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .trim();
}

/**
 * Order-independent pair key for Bishar-Sang combinations
 */
function makeBisharCacheKey(jaitA: string, jaitB: string): string {
  const normA = normalizeForCache(jaitA);
  const normB = normalizeForCache(jaitB);
  return normA < normB ? `${BISHAR_PREFIX}${normA}__${normB}` : `${BISHAR_PREFIX}${normB}__${normA}`;
}

/**
 * Retrieve cached Wad-Kur query result from device LocalStorage
 */
export function getDeviceCachedWadKur(jait: string): TipkurResponse | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const key = `${WADKUR_PREFIX}${normalizeForCache(jait)}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const item: CacheEnvelope<TipkurResponse> = JSON.parse(raw);
    if (Date.now() - item.timestamp > DEFAULT_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch (e) {
    console.warn('[DeviceCache] Failed reading wad-kur item:', e);
    return null;
  }
}

/**
 * Store Wad-Kur query result into device LocalStorage
 */
export function saveDeviceCachedWadKur(jait: string, data: TipkurResponse): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const key = `${WADKUR_PREFIX}${normalizeForCache(jait)}`;
  try {
    const envelope: CacheEnvelope<TipkurResponse> = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch (e) {
    console.warn('[DeviceCache] Failed saving wad-kur item:', e);
  }
}

/**
 * Retrieve cached Bishar-Sang query result from device LocalStorage
 */
export function getDeviceCachedBishar(jaitA: string, jaitB: string): BisharSangResponse | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const key = makeBisharCacheKey(jaitA, jaitB);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const item: CacheEnvelope<BisharSangResponse> = JSON.parse(raw);
    if (Date.now() - item.timestamp > DEFAULT_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch (e) {
    console.warn('[DeviceCache] Failed reading bishar item:', e);
    return null;
  }
}

/**
 * Store Bishar-Sang query result into device LocalStorage
 */
export function saveDeviceCachedBishar(jaitA: string, jaitB: string, data: BisharSangResponse): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const key = makeBisharCacheKey(jaitA, jaitB);
  try {
    const envelope: CacheEnvelope<BisharSangResponse> = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch (e) {
    console.warn('[DeviceCache] Failed saving bishar item:', e);
  }
}

