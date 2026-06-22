import React from 'react';
import { Palette } from 'lucide-react';
import { THEMES } from '../data/themes';
import { Theme } from '../types';

interface ThemeSelectorProps {
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;
}

export default function ThemeSelector({ currentThemeId, onThemeChange }: ThemeSelectorProps) {
  const currentTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
        <Palette className="h-3 w-3" />
        Visual Theme
      </label>
      <select
        value={currentThemeId}
        onChange={(e) => onThemeChange(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500/60"
      >
        {THEMES.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
}
