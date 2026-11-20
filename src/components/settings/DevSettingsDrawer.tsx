import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useClan } from '../../context/ClanContext';
import { getStoredApiConfig, saveApiConfig } from '../../services/api';
import { ApiConfig } from '../../types';
import { 
  X, 
  Settings2, 
  Save, 
  Server, 
  Key, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  Palette,
  Terminal
} from 'lucide-react';

interface DevSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevSettingsDrawer: React.FC<DevSettingsDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { searchClan, query } = useClan();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [config, setConfig] = useState<ApiConfig>(getStoredApiConfig);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync with native <dialog> element per Modern Web Guidance
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  // Click outside fallback per Modern Web Guidance
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isContent) {
        onClose();
      }
    };

    dialog.addEventListener('click', handleBackdropClick);
    return () => dialog.removeEventListener('click', handleBackdropClick);
  }, [onClose]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveApiConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2200);

    // Refresh query with new config
    searchClan(query);
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      // MANDATORY per Modern Web Guidance: closedby="any"
      {...({ closedby: 'any' } as any)}
      aria-labelledby="settings-dialog-title"
      className="m-0 sm:m-auto w-full sm:max-w-lg max-h-[90vh] sm:rounded-3xl rounded-t-3xl bg-white dark:bg-stone-900 text-sand-900 dark:text-stone-100 p-0 shadow-2xl border border-sand-300 dark:border-stone-800 backdrop:bg-black/60 backdrop:backdrop-blur-sm fixed bottom-0 sm:bottom-auto inset-x-0 overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="p-6 overflow-y-auto max-h-[90vh] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <h3 id="settings-dialog-title" className="font-serif font-bold text-lg text-sand-900 dark:text-stone-100">
                {t('settingsTitle')}
              </h3>
              <p className="text-xs text-sand-500 dark:text-stone-400">
                {t('settingsDesc')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-sand-500 hover:text-sand-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-sand-100 dark:hover:bg-stone-800 transition"
            aria-label="Close"
            autoFocus
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Mock Data Mode Switch */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-sand-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>{t('mockToggleLabel')}</span>
              </div>
              <p className="text-xs text-sand-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                {t('mockToggleDesc')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, useMock: !prev.useMock }))}
              className="text-amber-600 dark:text-amber-400 shrink-0 cursor-pointer pt-0.5"
              aria-label="Toggle Mock Mode"
            >
              {config.useMock ? (
                <ToggleRight className="w-8 h-8" />
              ) : (
                <ToggleLeft className="w-8 h-8 opacity-60 text-sand-400" />
              )}
            </button>
          </div>

          {/* API Endpoint Input */}
          <div className="space-y-1.5">
            <label 
              htmlFor="api-endpoint-url" 
              className="text-xs font-semibold text-sand-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5"
            >
              <Server className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              {t('apiEndpointLabel')}
            </label>
            <input
              id="api-endpoint-url"
              type="url"
              value={config.baseUrl}
              onChange={e => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
              placeholder="http://localhost/tipkur-api"
              className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 dark:bg-stone-800 border border-sand-300 dark:border-stone-700 text-sand-900 dark:text-stone-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-sand-500 dark:text-stone-400">
              Target for POST requests: <code className="font-mono bg-sand-100 dark:bg-stone-800 px-1 py-0.5 rounded">http://localhost/tipkur-api</code>
            </p>
          </div>

          {/* Bearer Token Input */}
          <div className="space-y-1.5">
            <label 
              htmlFor="api-bearer-token" 
              className="text-xs font-semibold text-sand-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              {t('apiTokenLabel')}
            </label>
            <input
              id="api-bearer-token"
              type="password"
              value={config.token}
              onChange={e => setConfig(prev => ({ ...prev, token: e.target.value }))}
              placeholder="YOUR_API_KEY (optional)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-sand-50 dark:bg-stone-800 border border-sand-300 dark:border-stone-700 text-sand-900 dark:text-stone-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-sand-500 dark:text-stone-400">
              Attached as: <code className="font-mono bg-sand-100 dark:bg-stone-800 px-1 py-0.5 rounded">Authorization: Bearer &lt;TOKEN&gt;</code>
            </p>
          </div>

          {/* Theme Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sand-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              {t('themeLabel')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['system', 'light', 'dark'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTheme(m)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition capitalize ${
                    theme === m
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-sand-50 dark:bg-stone-800 text-sand-700 dark:text-stone-300 border-sand-300 dark:border-stone-700 hover:bg-sand-100'
                  }`}
                >
                  {m === 'system' ? t('themeSystem') : m === 'light' ? t('themeLight') : t('themeDark')}
                </button>
              ))}
            </div>
          </div>

          {/* Curl Reference Drawer Info */}
          <div className="space-y-1.5 pt-1">
            <div className="text-xs font-semibold text-sand-600 dark:text-stone-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-600" />
              <span>Matching Backend Curl Spec (docs/curl.md):</span>
            </div>
            <pre className="p-3 rounded-xl bg-stone-950 text-stone-300 text-[11px] font-mono overflow-x-auto leading-relaxed border border-stone-800">
{`curl POST ${config.baseUrl || 'http://localhost/tipkur-api'} \\
  -H "Authorization: Bearer ${config.token || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"mode": "wad-kur", "jait": "${query}"}'`}
            </pre>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              {savedSuccess && (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('savedNotice')}</span>
                </>
              )}
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-xs transition flex items-center gap-2 shadow-md shadow-amber-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t('saveSettings')}</span>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
