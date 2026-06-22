import React, { useState, useEffect } from 'react';
import { 
  Compass, Laptop, Monitor, Code, Settings, Play, 
  Activity, ArrowRight, RefreshCw, Layers, Sliders, CheckSquare,
  Navigation, Terminal, TerminalIcon, Cpu, BookOpen
} from 'lucide-react';
import { KillerCarouselOptions } from '../types';

export interface ExampleSuiteMode {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultOptions: Partial<KillerCarouselOptions>;
}

export const OFFICIAL_MODES: ExampleSuiteMode[] = [
  {
    id: 'tutorial_image',
    name: 'Tutorial: Image Carousel',
    category: 'GETTING STARTED',
    description: 'The standard setup of Killer Carousel demonstrating high-fidelity watch and camera item cards, deep reflections, and dynamic radial rotation.',
    defaultOptions: {
      width: 200,
      height: 250,
      reflection: true,
      shadow: true,
      zDepthFade: true,
      tilt: 0,
      xRadius: 300,
      zRadius: 200,
      autoSlideshow: false,
    }
  },
  {
    id: 'fixed_size',
    name: 'Fixed Size Carousel',
    category: 'DIMENSIONING',
    description: 'Carousel items are strictly locked at exact width/height ratios, preventing any external responsive stretch. Perfect for standardized grids.',
    defaultOptions: {
      width: 250,
      height: 180,
      xRadius: 280,
      zRadius: 180,
      tilt: 0,
    }
  },
  {
    id: 'responsive_carousel',
    name: 'Responsive Carousel',
    category: 'REFLOWS',
    description: 'The orbit radius, perspective, and items scale continuously relative to the parent viewport dimensions. Try resizing the window.',
    defaultOptions: {
      width: 180,
      height: 230,
      xRadius: 310,
      zRadius: 210,
      tilt: 5,
    }
  },
  {
    id: 'html_items',
    name: 'HTML Carousel Items',
    category: 'INTERACTIVITY',
    description: 'Instead of raw static images, slides contain fully custom interactive React code layouts: checkboxes, digital inputs, live counts, and color pickers.',
    defaultOptions: {
      width: 220,
      height: 260,
      xRadius: 320,
      zRadius: 220,
      reflection: false,
      shadow: true,
    }
  },
  {
    id: 'rendering_modes',
    name: 'Rendering Modes (Hardware vs Soft)',
    category: 'ENGINE PIPELINE',
    description: 'Toggle between Hardware CSS3 preserved-3D rendering (featuring orbital rotational angles) and standard Orthographic Flat 2D calculations.',
    defaultOptions: {
      width: 200,
      height: 250,
      tilt: 0,
    }
  },
  {
    id: 'using_events',
    name: 'Using Events with Items',
    category: 'LOGGING INTERFACES',
    description: 'Enables telemetry tracking. Watch interactive logs scroll below showing user drag vectors, swiping momentum, and hover targeting.',
    defaultOptions: {
      width: 190,
      height: 240,
      drag: true,
      swipe: true,
    }
  },
  {
    id: 'extra_responsive',
    name: 'Extra Responsive Breakpoints',
    category: 'ADAPTERS',
    description: 'Configures individual breakpoint thresholds. Automatically shifts from a panoramic 5-item visible loop to a flat 1-item card view on mobile screens.',
    defaultOptions: {
      width: 210,
      height: 260,
      xRadius: 340,
      zRadius: 230,
    }
  },
  {
    id: 'carousel_api',
    name: 'Killer Carousel API',
    category: 'PROGRAMMATIC CONTROL',
    description: 'Use the programmatic API controller panel below to manually spin, scroll to, resume, or pause the rotational state from external custom scripts.',
    defaultOptions: {
      width: 200,
      height: 240,
    }
  },
  {
    id: 'callbacks_demo',
    name: 'Callbacks Hooks',
    category: 'HOOK LISTENERS',
    description: 'Outputs precise Javascript timing intervals. Registers callbacks like onInitCompleted, onTargetAligned, and onSwipeReleased with millisecond precision.',
    defaultOptions: {
      width: 190,
      height: 240,
    }
  },
  {
    id: 'banner_layout',
    name: 'Banner Slider Mode',
    category: 'LAYOUT STYLES',
    description: 'Transforms the carousel into an ultra wide-span slide banner interface. Uses low depth-radius for sleek corporate headers.',
    defaultOptions: {
      width: 360,
      height: 140,
      xRadius: 380,
      zRadius: 30,
      tilt: 0,
      reflection: false,
      zDepthFade: false,
      autoSlideshow: true,
      autoSlideshowDelay: 3500,
    }
  },
  {
    id: 'navigation_presets',
    name: 'Navigation Options',
    category: 'PAGINATION DESIGNS',
    description: 'Easily switch between three layout designs for navigation overlays: Classic floating side-arrows, linear bullets, or digital indicators.',
    defaultOptions: {
      width: 200,
      height: 250,
    }
  },
  {
    id: 'ajax_items_demo',
    name: 'Ajax Asynchronous Items',
    category: 'LAZY LOADERS',
    description: 'Simulates lazy loading from an external JSON endpoint. Displays immediate spinner wait conditions before filling items dynamically on load completion.',
    defaultOptions: {
      width: 200,
      height: 250,
      autoSlideshow: false,
    }
  },
];

interface ExamplesSuiteProps {
  activeMode: string;
  onModeChange: (modeId: string) => void;
  eventLogs: string[];
  onClearLogs: () => void;
  onTriggerApi: (action: string, param?: any) => void;
}

export default function ExamplesSuite({
  activeMode,
  onModeChange,
  eventLogs,
  onClearLogs,
  onTriggerApi
}: ExamplesSuiteProps) {
  
  const currentModeInfo = OFFICIAL_MODES.find(m => m.id === activeMode) || OFFICIAL_MODES[0];

  return (
    <div className="bg-slate-900 border-t border-slate-800 py-12" id="examples-suite-section">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* Module title header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4" id="suite-header">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase tracking-wider text-xs">
              <BookOpen className="h-4 w-4" /> RECREATED EXAMPLES DIRECTORY
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white mt-2">
              StarPlugins Core Feature Demonstration Suite
            </h3>
            <p className="text-slate-450 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              We recreated the complete <strong>12-scenario showcase ecosystem</strong> of the original StarPlugins portal. Click a template below to load precise coordinates, simulation structures, and console monitors immediately.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
            LOADED MODULES: 12 OF 12
          </span>
        </div>

        {/* 12-grids dashboard list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8" id="suite-dashboard-grid">
          {OFFICIAL_MODES.map((mode) => {
            const isSelected = mode.id === activeMode;
            return (
              <button
                key={mode.id}
                id={`btn-suite-mode-${mode.id}`}
                onClick={() => onModeChange(mode.id)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-600/5 text-white' 
                    : 'bg-slate-950/60 border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {mode.category}
                  </span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                </div>
                <h4 className="font-extrabold text-xs mt-2.5 truncate font-sans tracking-tight">
                  {mode.name}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Currently selected example details */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col md:flex-row gap-6 items-stretch" id="selected-module-overview">
          
          <div className="flex-1 flex flex-col justify-between gap-4" id="details-panel-left">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md text-[10px] text-indigo-400 font-mono font-bold">
                <Sliders className="h-3 w-3" /> ACTIVE SIMULATION : {currentModeInfo.category}
              </div>
              <h4 className="text-lg font-bold text-white mt-3">{currentModeInfo.name}</h4>
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5">
                {currentModeInfo.description}
              </p>
            </div>

            {/* Config difference preview layout code block */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5" id="code-snippet-preset">
              <span className="text-[9px] font-bold text-slate-500 font-mono block uppercase">Original StarPlugins jQuery Initialization:</span>
              <pre className="text-[10px] text-slate-350 font-mono leading-relaxed mt-1 overflow-x-auto whitespace-pre p-2 bg-slate-950/60 rounded border border-slate-850/80">
{`// jQuery legacy integration
$('#carousel').killerCarousel({
  width: ${currentModeInfo.defaultOptions.width || 200},
  height: ${currentModeInfo.defaultOptions.height || 250},
  xRadius: ${currentModeInfo.defaultOptions.xRadius || 'Auto'},
  reflection: ${currentModeInfo.defaultOptions.reflection !== false ? 'true' : 'false'},
  shadow: ${currentModeInfo.defaultOptions.shadow !== false ? 'true' : 'false'}
});`}
              </pre>
            </div>
          </div>

          {/* Interactive elements depending on activeMode */}
          <div className="w-full md:w-80 bg-slate-900/60 border border-slate-850 rounded-xl p-5 flex flex-col" id="details-panel-right">
            
            {/* AJAX SIMULATOR CONTROLS */}
            {activeMode === 'ajax_items_demo' && (
              <div className="flex-1 flex flex-col justify-between" id="ajax-controls-box">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Asynchronous AJAX Pipe</h5>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Test the dynamic lazy-loader mechanism. Triggers real-time fetching state overlays before rendering.
                  </p>
                </div>
                <button
                  id="btn-trigger-ajax-load"
                  onClick={() => onTriggerApi('ajax_reload')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs cursor-pointer select-none mt-4 transition-all active:scale-95"
                >
                  <RefreshCw className="h-4 w-4 shrink-0" /> Simulation Fetch Trigger
                </button>
              </div>
            )}

            {/* PROGRAMMATIC API CONTROLS */}
            {activeMode === 'carousel_api' && (
              <div className="flex-1 flex flex-col justify-between" id="api-controls-box">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Programmatic Engine Controls</h5>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Trigger internal API handlers directly from parent callback threads to control navigation dynamically.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4" id="api-btn-triggers">
                  <button
                    id="btn-api-prev"
                    onClick={() => onTriggerApi('prev')}
                    className="py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono font-bold text-[10px] rounded cursor-pointer transition-all text-center"
                  >
                    .prev()
                  </button>
                  <button
                    id="btn-api-next"
                    onClick={() => onTriggerApi('next')}
                    className="py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono font-bold text-[10px] rounded cursor-pointer transition-all text-center"
                  >
                    .next()
                  </button>
                  <button
                    id="btn-api-random"
                    onClick={() => onTriggerApi('random')}
                    className="py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono font-bold text-[10px] rounded cursor-pointer transition-all text-center col-span-2"
                  >
                    .scrollTo(random)
                  </button>
                  <button
                    id="btn-api-toggle-slideshow"
                    onClick={() => onTriggerApi('toggle_slideshow')}
                    className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-[10px] rounded cursor-pointer transition-all text-center col-span-2"
                  >
                    .toggleAutoplay()
                  </button>
                </div>
              </div>
            )}

            {/* EVENTS & CALLBACKS TELEMETRY LOGGER */}
            {(activeMode === 'using_events' || activeMode === 'callbacks_demo' || activeMode === 'rendering_modes') && (
              <div className="flex-1 flex flex-col justify-between min-h-[220px]" id="telemetry-logger-box">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="h-4 w-4 text-emerald-400 animate-pulse" /> Telemetry Log
                  </span>
                  <button 
                    id="btn-clear-telemetry"
                    onClick={onClearLogs}
                    className="text-[9px] font-bold text-slate-500 hover:text-white transition-colors cursor-pointer block"
                  >
                    Clear Logs
                  </button>
                </div>

                {/* Log outputs terminal screen */}
                <div className="flex-1 bg-black/90 p-3 rounded-lg border border-slate-850 font-mono text-[9px] text-emerald-400 leading-snug overflow-y-auto max-h-[140px] space-y-1.5" id="telemetry-terminal-viewport">
                  {eventLogs.length > 0 ? (
                    eventLogs.map((log, idx) => (
                      <div key={idx} className="border-b border-slate-950/20 pb-1 break-all flex items-start gap-1">
                        <span className="text-slate-500 select-none">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-600 animate-pulse text-center p-2">
                      Awaiting user interaction event metrics...
                    </div>
                  )}
                </div>

                <div className="mt-3 text-[9px] leading-relaxed text-slate-500 bg-slate-950/40 p-2 border border-slate-850/60 rounded">
                  {activeMode === 'rendering_modes' && (
                    <span><strong>Calculation note:</strong> software fallback translates coordinates straight flat 2D without skewing rotationY properties.</span>
                  )}
                  {activeMode === 'using_events' && (
                    <span><strong>Event triggers:</strong> records drag, acceleration, click aligned target indexes dynamically.</span>
                  )}
                  {activeMode === 'callbacks_demo' && (
                    <span><strong>Precise timestamps:</strong> tracks precise event handler alignment steps.</span>
                  )}
                </div>
              </div>
            )}

            {/* HTML ITEMS INFO BOX */}
            {activeMode === 'html_items' && (
              <div className="flex-1 flex flex-col justify-between" id="html-items-right-p">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">True HTML Content Rendering</h5>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Each slide card is rendered as a dynamic React component containing interactive input fields, color selectors, and numeric counters rather than a static image file. 
                  </p>
                </div>
                <div className="mt-3 p-3 bg-indigo-950/20 border border-indigo-900 rounded text-[10px] text-indigo-300 leading-relaxed">
                  <strong>Try it out!</strong> Scroll the carousel to an HTML item card and interact directly with standard checkboxes and sliders inside the item!
                </div>
              </div>
            )}

            {/* RENDERING MODES PREVIEW OPTIONS */}
            {activeMode !== 'ajax_items_demo' && activeMode !== 'carousel_api' && activeMode !== 'using_events' && activeMode !== 'callbacks_demo' && activeMode !== 'rendering_modes' && activeMode !== 'html_items' && (
              <div className="flex-1 flex flex-col justify-between" id="default-info-right">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Example Calibration Parameters</h5>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    This example loads custom options carefully selected to mirror classic StarPlugins features. Feel free to tweak them manually using the sliders panel!
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-1.5 text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span>Width x Height:</span>
                    <span className="text-white">{currentModeInfo.defaultOptions.width || '200'}px * {currentModeInfo.defaultOptions.height || '250'}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reflection Enabled:</span>
                    <span className="text-white">{currentModeInfo.defaultOptions.reflection !== false ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tilt Angle:</span>
                    <span className="text-white">{currentModeInfo.defaultOptions.tilt || '0'}°</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
