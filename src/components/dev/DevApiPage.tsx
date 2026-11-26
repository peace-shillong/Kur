import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  Send,
  Copy,
  Check,
  Code2,
  Key,
  Globe,
  Loader2,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  History,
  FileJson,
  Search
} from 'lucide-react';

interface RequestHistoryItem {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status: number | null;
  durationMs: number | null;
  requestPayload: string;
  responsePayload: string;
}

const STORAGE_KEYS = {
  ENDPOINT: 'tipkur-dev-endpoint',
  TOKEN: 'tipkur-dev-token',
  PAYLOAD: 'tipkur-dev-payload',
  HISTORY: 'tipkur-dev-history'
};

const DEFAULT_JSON_ARRAY = JSON.stringify(
  [
    {
      mode: 'bishar-sang',
      jait_a: 'Nongkynrih',
      jait_b: 'Nongbri'
    },
    {
      mode: 'bishar-sang',
      jait_a: 'Nongbsap Pyrtuh',
      jait_b: 'Mylliem Pyrtuh'
    },
    {
      mode: 'bishar-sang',
      jait_a: 'Nongbsap Pyrtuh',
      jait_b: 'Nongrum'
    }
  ],
  null,
  2
);

const PRESET_ENDPOINTS = [
  'https://tynrai.in/.netlify/functions/tipkur-api',
  'http://localhost/tipkur-api',
  'http://localhost:8888/.netlify/functions/tipkur-api',
  'https://api.tynrai.in/v1/tipkur'
];

interface DevApiPageProps {
  onBack: () => void;
}

export const DevApiPage: React.FC<DevApiPageProps> = ({ onBack }) => {
  const { language } = useLanguage();

  // Inputs
  const [method, setMethod] = useState<'POST' | 'GET' | 'PUT' | 'DELETE'>('POST');
  const [endpointUrl, setEndpointUrl] = useState<string>(() => {
    return (
      localStorage.getItem(STORAGE_KEYS.ENDPOINT) ||
      'https://tynrai.in/.netlify/functions/tipkur-api'
    );
  });
  const [bearerToken, setBearerToken] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || 'tynrai_demo_api';
  });
  const [showToken, setShowToken] = useState(false);
  const [contentType, setContentType] = useState<string>('application/json');
  const [useAuth, setUseAuth] = useState(true);

  // Payload
  const [payloadText, setPayloadText] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PAYLOAD) || DEFAULT_JSON_ARRAY;
  });
  const [jsonValidationError, setJsonValidationError] = useState<string | null>(null);
  const [isPayloadArray, setIsPayloadArray] = useState<boolean>(true);
  const [arrayItemCount, setArrayItemCount] = useState<number>(3);

  // Execution & Response
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string>('');
  const [responseData, setResponseData] = useState<string | null>(null);
  const [responseDuration, setResponseDuration] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy feedback
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [history, setHistory] = useState<RequestHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Validate JSON on change
  useEffect(() => {
    try {
      const parsed = JSON.parse(payloadText);
      setJsonValidationError(null);
      if (Array.isArray(parsed)) {
        setIsPayloadArray(true);
        setArrayItemCount(parsed.length);
      } else {
        setIsPayloadArray(false);
        setArrayItemCount(0);
      }
      localStorage.setItem(STORAGE_KEYS.PAYLOAD, payloadText);
    } catch (e: any) {
      setJsonValidationError(e.message || 'Invalid JSON syntax');
      setIsPayloadArray(false);
      setArrayItemCount(0);
    }
  }, [payloadText]);

  // Persist config changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENDPOINT, endpointUrl);
  }, [endpointUrl]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, bearerToken);
  }, [bearerToken]);

  // Format / Prettify JSON
  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(payloadText);
      setPayloadText(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore if invalid
    }
  };

  // Minify JSON
  const handleMinify = () => {
    try {
      const parsed = JSON.parse(payloadText);
      setPayloadText(JSON.stringify(parsed));
    } catch {
      // ignore if invalid
    }
  };

  // Preset Loaders
  const loadPreset = (type: 'array-bishar' | 'array-clans' | 'single-bishar' | 'single-wadkur') => {
    if (type === 'array-bishar') {
      setPayloadText(DEFAULT_JSON_ARRAY);
    } else if (type === 'array-clans') {
      setPayloadText(JSON.stringify(['Diengdoh', 'Kharkongor', 'Nongkynrih', 'Shadap', 'Marbaniang'], null, 2));
    } else if (type === 'single-bishar') {
      setPayloadText(
        JSON.stringify(
          {
            mode: 'bishar-sang',
            jait_a: 'Nongkynrih',
            jait_b: 'Nongbri'
          },
          null,
          2
        )
      );
    } else if (type === 'single-wadkur') {
      setPayloadText(
        JSON.stringify(
          {
            mode: 'wad-kur',
            jait: 'Diengdoh'
          },
          null,
          2
        )
      );
    }
  };

  // Send API Request
  const handleSendRequest = async () => {
    if (!endpointUrl.trim()) return;

    // Validate JSON if sending payload
    if (method !== 'GET') {
      try {
        JSON.parse(payloadText);
      } catch (err: any) {
        setErrorMessage(`Invalid JSON Payload: ${err.message}`);
        return;
      }
    }

    setLoading(true);
    setErrorMessage(null);
    setResponseData(null);
    setResponseStatus(null);
    setStatusText('');
    const startTime = performance.now();

    // Setup AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const headers: Record<string, string> = {
        'Content-Type': contentType
      };

      if (useAuth && bearerToken.trim()) {
        headers['Authorization'] = `Bearer ${bearerToken.trim()}`;
      }

      const requestOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal
      };

      if (method !== 'GET') {
        requestOptions.body = payloadText;
      }

      const response = await fetch(endpointUrl.trim(), requestOptions);
      const elapsed = Math.round(performance.now() - startTime);
      setResponseDuration(elapsed);
      setResponseStatus(response.status);
      setStatusText(response.statusText);

      // Parse JSON response
      const rawText = await response.text();
      let formatted = rawText;
      try {
        const json = JSON.parse(rawText);
        formatted = JSON.stringify(json, null, 2);
      } catch {
        // Leave as raw text if not json
      }

      setResponseData(formatted);

      // Save to history
      const historyItem: RequestHistoryItem = {
        id: `req-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        method,
        url: endpointUrl.trim(),
        status: response.status,
        durationMs: elapsed,
        requestPayload: payloadText,
        responsePayload: formatted
      };

      const updatedHistory = [historyItem, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      setResponseDuration(elapsed);

      if (err.name === 'AbortError') {
        setErrorMessage('Request aborted by user.');
      } else {
        setErrorMessage(
          err.message || 'Network error occurred. Check CORS headers, network connectivity, or endpoint URL.'
        );
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Copy response to clipboard
  const handleCopyResponse = async () => {
    if (!responseData) return;
    try {
      await navigator.clipboard.writeText(responseData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  // Download response as JSON file
  const handleDownloadResponse = () => {
    if (!responseData) return;
    try {
      const blob = new Blob([responseData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `response-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download JSON', err);
    }
  };

  // Restore previous request from history
  const handleRestoreHistory = (item: RequestHistoryItem) => {
    setEndpointUrl(item.url);
    setMethod(item.method as any);
    setPayloadText(item.requestPayload);
    setResponseData(item.responsePayload);
    setResponseStatus(item.status);
    setResponseDuration(item.durationMs);
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  };

  // Filtered response text
  const displayedResponse = React.useMemo(() => {
    if (!responseData) return null;
    if (!searchFilter.trim()) return responseData;

    try {
      const lines = responseData.split('\n');
      const filtered = lines.filter(line =>
        line.toLowerCase().includes(searchFilter.toLowerCase())
      );
      return filtered.join('\n');
    } catch {
      return responseData;
    }
  }, [responseData, searchFilter]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>{language === 'kha' ? 'Phai sha ka App (Back)' : 'Back to App'}</span>
        </button>

        <div className="text-left sm:text-right">
          <div className="flex items-center sm:justify-end gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-800/50">
              Dev Only
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">
              API Testing Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Send custom requests with Bearer Auth & JSON Array payloads
          </p>
        </div>
      </div>

      {/* Main Grid: Request Builder (Left/Top) & Response Inspector (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Request Configuration (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Endpoint & Method */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111a16] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Endpoint URL</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">POST / GET</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={method}
                onChange={e => setMethod(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16231e] font-bold text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer sm:w-28"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              <input
                type="url"
                value={endpointUrl}
                onChange={e => setEndpointUrl(e.target.value)}
                placeholder="https://tynrai.in/.netlify/functions/tipkur-api"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16231e] text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Quick URL Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Quick Endpoints:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_ENDPOINTS.map(url => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setEndpointUrl(url)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono transition cursor-pointer truncate max-w-full"
                    title={url}
                  >
                    {url.replace('https://', '').replace('http://', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Headers & Authorization */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111a16] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-serif font-bold text-slate-900 dark:text-slate-100">
                  Headers & Authorization
                </h3>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={useAuth}
                  onChange={e => setUseAuth(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Include Bearer Token</span>
              </label>
            </div>

            {/* Bearer Token */}
            {useAuth && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Authorization Header: <span className="font-mono text-emerald-600 dark:text-emerald-400">Bearer &lt;token&gt;</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={bearerToken}
                    onChange={e => setBearerToken(e.target.value)}
                    placeholder="Enter API Key / Token (e.g. tynrai_demo_api)"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16231e] text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                    title={showToken ? 'Hide token' : 'Show token'}
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Stored securely in your local browser storage for convenience.
                </p>
              </div>
            )}

            {/* Content Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Content-Type:
              </label>
              <input
                type="text"
                value={contentType}
                onChange={e => setContentType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16231e] text-xs font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Card 3: Data Payload (JSON Array by Default) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111a16] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-serif font-bold text-slate-900 dark:text-slate-100">
                  Data Payload (JSON Array)
                </h3>
                {isPayloadArray ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    JSON Array ({arrayItemCount} items)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                    JSON Object
                  </span>
                )}
              </div>

              {/* Formatting Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrettify}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer flex items-center gap-1"
                  title="Format JSON with indentation"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Prettify</span>
                </button>
                <button
                  type="button"
                  onClick={handleMinify}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  title="Minify JSON"
                >
                  Minify
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1 self-center">
                Presets:
              </span>
              <button
                type="button"
                onClick={() => loadPreset('array-bishar')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold cursor-pointer"
              >
                Array: Batch Sang
              </button>
              <button
                type="button"
                onClick={() => loadPreset('array-clans')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold cursor-pointer"
              >
                Array: Clan Names
              </button>
              <button
                type="button"
                onClick={() => loadPreset('single-bishar')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Single: Bishar Sang
              </button>
              <button
                type="button"
                onClick={() => loadPreset('single-wadkur')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Single: Wad Kur
              </button>
            </div>

            {/* JSON Code Textarea */}
            <div className="relative">
              <textarea
                rows={11}
                value={payloadText}
                onChange={e => setPayloadText(e.target.value)}
                placeholder="Enter JSON array payload: [...]"
                className={`w-full p-4 rounded-2xl border font-mono text-xs leading-relaxed transition resize-y focus:outline-none focus:ring-2 ${
                  jsonValidationError
                    ? 'border-red-300 dark:border-red-800 bg-red-50/20 text-red-950 dark:text-red-200 focus:ring-red-500'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16231e] text-slate-900 dark:text-slate-100 focus:ring-emerald-500'
                }`}
                spellCheck={false}
              />
            </div>

            {/* JSON Syntax Status */}
            <div className="flex items-center justify-between text-xs">
              {jsonValidationError ? (
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{jsonValidationError}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Valid JSON Syntax</span>
                </div>
              )}

              <span className="text-[11px] text-slate-400">
                Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Ctrl+Enter</kbd> to Send
              </span>
            </div>

            {/* Action Send Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSendRequest}
                disabled={loading || Boolean(jsonValidationError)}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm transition shadow-md shadow-emerald-700/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending API Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Request to Endpoint</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Response Inspector & History (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Response Viewer */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111a16] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col min-h-[460px]">
            {/* Response Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-serif font-bold text-slate-900 dark:text-slate-100">
                  Response Output
                </h3>
              </div>

              {/* Status Code & Duration Badge */}
              <div className="flex items-center gap-2">
                {responseStatus !== null && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                        : responseStatus >= 400 && responseStatus < 500
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
                        : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300'
                    }`}
                  >
                    {responseStatus} {statusText}
                  </span>
                )}

                {responseDuration !== null && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {responseDuration}ms
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Bar: Copy icon to copy response to clipboard! */}
            {responseData && (
              <div className="flex items-center justify-between gap-2 pt-1">
                {/* Search in response */}
                <div className="relative flex-1 max-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                    placeholder="Filter response..."
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16231e] text-[11px] font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDownloadResponse}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                    title="Download response JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {/* PROMINENT COPY BUTTON WITH COPY ICON */}
                  <button
                    type="button"
                    onClick={handleCopyResponse}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs ${
                      copied
                        ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                        : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}
                    title="Copy full JSON response to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Response'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Response Display Box */}
            <div className="flex-1 min-h-[320px] max-h-[560px] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1410] p-4 font-mono text-xs text-slate-900 dark:text-slate-100">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3 py-16 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  <span className="text-xs font-sans">Connecting to endpoint...</span>
                </div>
              ) : errorMessage ? (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Request Error</span>
                  </div>
                  <p className="text-xs font-mono leading-relaxed">{errorMessage}</p>
                  <p className="text-[11px] opacity-80 font-sans pt-1">
                    Tip: If running against a local or Netlify server, verify the URL and CORS headers.
                  </p>
                </div>
              ) : displayedResponse ? (
                <pre className="whitespace-pre-wrap break-all leading-relaxed font-mono">
                  {displayedResponse}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-2 py-20 text-slate-400 text-center">
                  <Code2 className="w-8 h-8 opacity-40" />
                  <p className="text-xs font-sans">
                    No response yet. Configure your URL and press <strong>Send Request</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Request History */}
          {history.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111a16] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Recent Requests
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-600 transition"
                  title="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                {history.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRestoreHistory(item)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#15221d] hover:border-emerald-500 text-left transition flex items-center justify-between gap-2 text-xs cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[10px] text-emerald-700 dark:text-emerald-400">
                          {item.method}
                        </span>
                        <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate">
                          {item.url}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                            item.status >= 200 && item.status < 300
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                              : 'bg-red-100 dark:bg-red-950 text-red-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.durationMs}ms
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
