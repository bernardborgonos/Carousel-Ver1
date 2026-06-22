import React, { useState } from 'react';

interface ThemeOption {
  id: string;
  name: string;
  bgClass: string;
  cardBgClass: string;
  textColorClass: string;
  accentClass: string;
  borderClass: string;
}
import { Sparkles, Code2, RefreshCw, Copy, Check, Eye } from 'lucide-react';

const THEMES: ThemeOption[] = [
  {
    id: 'slate',
    name: 'Minimalist Slate',
    bgClass: 'bg-slate-50',
    cardBgClass: 'bg-white',
    textColorClass: 'text-slate-900',
    accentClass: 'bg-slate-900 hover:bg-slate-800 text-white',
    borderClass: 'border-slate-200',
  },
  {
    id: 'indigo',
    name: 'Indigo Royal',
    bgClass: 'bg-indigo-50/50',
    cardBgClass: 'bg-white',
    textColorClass: 'text-slate-900',
    accentClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    borderClass: 'border-indigo-100',
  },
  {
    id: 'emerald',
    name: 'Emerald Clean',
    bgClass: 'bg-emerald-50/30',
    cardBgClass: 'bg-white',
    textColorClass: 'text-slate-900',
    accentClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    borderClass: 'border-emerald-100',
  },
  {
    id: 'cosmic',
    name: 'Cosmic Dark',
    bgClass: 'bg-slate-950',
    cardBgClass: 'bg-slate-900',
    textColorClass: 'text-slate-100',
    accentClass: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    borderClass: 'border-slate-800',
  },
];

export default function InteractiveSandbox() {
  const [activeThemeId, setActiveThemeId] = useState<string>('slate');
  const [padding, setPadding] = useState<'compact' | 'relaxed' | 'spacious'>('relaxed');
  const [rounded, setRounded] = useState<'none' | 'md' | 'full'>('md');
  const [showIcon, setShowIcon] = useState<boolean>(true);
  const [withShadow, setWithShadow] = useState<boolean>(true);
  const [demoValue, setDemoValue] = useState<string>('Try changing my code!');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const selectedTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];

  // Derive styles
  const getPaddingClass = () => {
    switch (padding) {
      case 'compact': return 'p-4 gap-2';
      case 'spacious': return 'p-10 gap-6';
      case 'relaxed':
      default:
        return 'p-6 gap-4';
    }
  };

  const getRoundedClass = () => {
    switch (rounded) {
      case 'none': return 'rounded-none';
      case 'full': return 'rounded-3xl';
      case 'md':
      default:
        return 'rounded-xl';
    }
  };

  const shadowClass = withShadow 
    ? (selectedTheme.id === 'cosmic' ? 'shadow-lg shadow-indigo-950/40' : 'shadow-md shadow-slate-100')
    : 'shadow-none';

  // Component title state
  const [clickCount, setClickCount] = useState(0);

  // Dynamic code generation block
  const generatedCode = `import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function InteractiveCard() {
  const [count, setCount] = useState(0);

  return (
    <div className="${selectedTheme.bgClass} min-h-[180px] w-full flex items-center justify-center p-4">
      <div className="${selectedTheme.cardBgClass} w-full max-w-sm border ${selectedTheme.borderClass} ${getPaddingClass()} ${getRoundedClass()} ${shadowClass} flex flex-col transition-all duration-300">
        <div className="flex items-center justify-between">
          <h4 className="font-bold tracking-tight ${selectedTheme.textColorClass} text-base">
            Responsive Code Card
          </h4>
          ${showIcon ? `<span className="text-indigo-500 bg-indigo-50 p-1.5 rounded-lg">
            <Sparkles className="h-4 w-4" />
          </span>` : '<!-- Icon hidden -->'}
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed">
          This customized reactive component demonstrates standard dynamic styling bindings.
        </p>

        <button 
          onClick={() => setCount(prev => prev + 1)}
          className="${selectedTheme.accentClass} py-2 px-4 text-xs font-semibold ${getRoundedClass() === 'rounded-3xl' ? 'rounded-full' : getRoundedClass()} transition-colors"
        >
          Clicked {count} times
        </button>
      </div>
    </div>
  );
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="py-12 bg-slate-50/50 border-y border-slate-200/80" id="sandbox-section">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center md:text-left" id="sandbox-title">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Proof of Concept</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Interactive Code Sandbox</h2>
          <p className="mt-2 text-slate-600 max-w-xl">
            Tinker with the styling knobs below to see how standard React 19 code and Tailwind utility definitions compile instantly in our UI sandbox.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" id="sandbox-grid">
          {/* Controls column */}
          <div className="lg:col-span-5 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" id="sandbox-controls">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4 text-indigo-600" /> UI Customizer Knobs
            </h3>

            {/* Accent Theme Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Color Palette Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    id={`btn-theme-${theme.id}`}
                    onClick={() => setActiveThemeId(theme.id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all ${
                      activeThemeId === theme.id
                        ? 'border-indigo-600 bg-indigo-50/30 text-indigo-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <span className={`h-3 w-3 rounded-full border border-black/10 ${theme.accentClass.split(' ')[0]}`} />
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Padding Config */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Card Spacing (Padding)</label>
              <div className="grid grid-cols-3 gap-2">
                {(['compact', 'relaxed', 'spacious'] as const).map((p) => (
                  <button
                    key={p}
                    id={`btn-padding-${p}`}
                    onClick={() => setPadding(p)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                      padding === p
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Smoothness */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Corner Smoothness (Border Radius)</label>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'md', 'full'] as const).map((r) => (
                  <button
                    key={r}
                    id={`btn-radius-${r}`}
                    onClick={() => setRounded(r)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                      rounded === r
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-500'
                    }`}
                  >
                    {r === 'none' ? 'Square' : r === 'full' ? 'Pill' : 'Standard'}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  id="chk-show-icon"
                  checked={showIcon}
                  onChange={(e) => setShowIcon(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                Show Accent Icon
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  id="chk-with-shadow"
                  checked={withShadow}
                  onChange={(e) => setWithShadow(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                With Outer Shadow
              </label>
            </div>
          </div>

          {/* Interactive display output column */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden" id="sandbox-display">
            {/* Display header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2" id="display-header">
              <div className="flex gap-2">
                <button
                  id="tab-btn-preview"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'preview' ? 'bg-white text-slate-900 shadow-2xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" /> Interactive Render
                </button>
                <button
                  id="tab-btn-code"
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'code' ? 'bg-white text-slate-900 shadow-2xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" /> Generated React Code
                </button>
              </div>

              {activeTab === 'code' && (
                <button
                  id="btn-copy-code"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 text-2xs cursor-pointer transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Code
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Display Body */}
            <div className="flex-1 min-h-[340px] flex flex-col justify-center items-center" id="display-body">
              {activeTab === 'preview' ? (
                <div className={`w-full h-full flex flex-col items-center justify-center p-8 transition-colors duration-300 ${selectedTheme.bgClass}`}>
                  <div className={`w-full max-w-sm border ${selectedTheme.cardBgClass} ${selectedTheme.borderClass} ${getPaddingClass()} ${getRoundedClass()} ${shadowClass} flex flex-col transition-all duration-300`}>
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold tracking-tight ${selectedTheme.textColorClass} text-sm`}>
                        Responsive Code Card
                      </h4>
                      {showIcon && (
                        <span className="text-indigo-500 bg-indigo-50 p-1.5 rounded-lg">
                          <Sparkles className="h-4 w-4 animate-spin-slow" />
                        </span>
                      )}
                    </div>

                    <p className={`text-xs ${selectedTheme.id === 'cosmic' ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
                      Click the custom state modifier button below to verify responsive react triggers, binding dynamically.
                    </p>

                    <button
                      id="simulated-action-btn"
                      onClick={() => setClickCount(prev => prev + 1)}
                      className={`active:scale-95 text-xs font-bold py-2 px-4 transition-all duration-200 ${selectedTheme.accentClass} ${
                        getRoundedClass() === 'rounded-3xl' ? 'rounded-full' : getRoundedClass()
                      }`}
                    >
                      Clicked {clickCount} times
                    </button>
                  </div>
                </div>
              ) : (
                <pre className="w-full h-[340px] text-left p-6 font-mono text-[11px] leading-relaxed overflow-auto bg-slate-950 text-indigo-200">
                  {generatedCode}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
