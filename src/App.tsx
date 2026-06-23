import React, { useState, useEffect } from 'react';
import UNIT2CCacousel from './components/UNIT2CCacousel';
import PlaygroundControls from './components/PlaygroundControls';
import DocumentationTable from './components/DocumentationTable';
import SystemEvaluator from './components/SystemEvaluator';
import ThemeSelector from './components/ThemeSelector';
import DocumentationPage from './components/DocumentationPage';
import RegistrationCode from './components/RegistrationCode';
import TokenAuditor from './components/TokenAuditor';
import LicensingCard from './components/LicensingCard';
import FAQSection from './components/FAQSection';
import ExamplesSuite, { OFFICIAL_MODES } from './components/ExamplesSuite';
import DriveIntegration from './components/DriveIntegration';
import { CAROUSEL_PRODUCTS } from './data/carouselItems';
import { THEMES } from './data/themes';
import { UNIT2CCacouselOptions, Theme } from './types';
import { Sparkles, Terminal, ShieldCheck, Heart, Cpu, AppWindow, Globe, Layers, Zap, HardDrive } from 'lucide-react';

const INITIAL_OPTIONS: UNIT2CCacouselOptions = {
  width: 200,
  height: 250,
  perspective: 1000,
  xRadius: 300,
  yRadius: 0,
  zRadius: 200,
  tilt: 0,
  xRotation: 0,
  yRotation: 0,
  zRotation: 0,
  infinite: true,
  autoSlideshow: false,
  autoSlideshowDelay: 3000,
  autoSlideshowDirection: 'right',
  swipe: true,
  drag: true,
  reflection: true,
  reflectionHeight: 35,
  reflectionOpacity: 0.35,
  shadow: true,
  shadowOpacity: 0.6,
  zDepthFade: true,
  itemClickToFocus: true,
  backgroundImageOpacity: 1,
  overlayColor: '0, 0, 0',
  overlayOpacity: 0.5,
  autoPlaySpeed: 5,
};

const PRESETS_MAP: Record<string, Partial<UNIT2CCacouselOptions>> = {
  default3d: {
    xRadius: 320,
    zRadius: 200,
    tilt: 0,
    perspective: 1000,
    yRotation: 0,
    reflection: true,
    shadow: true,
    zDepthFade: true,
  },
  flat2d: {
    xRadius: 360,
    zRadius: 0,
    tilt: 0,
    perspective: 1200,
    yRotation: 1, // small tilt to align layout flat
    reflection: false,
    shadow: true,
    zDepthFade: false,
  },
  coverflow: {
    xRadius: 280,
    zRadius: 180,
    tilt: 0,
    perspective: 800,
    yRotation: 40,
    reflection: true,
    shadow: true,
    zDepthFade: true,
  },
  slanted: {
    xRadius: 320,
    zRadius: 200,
    tilt: 18,
    perspective: 1000,
    yRotation: -12,
    reflection: true,
    shadow: true,
    zDepthFade: true,
  },
  panoramic: {
    xRadius: 420,
    zRadius: 380,
    tilt: -5,
    perspective: 1500,
    yRotation: 0,
    reflection: true,
    shadow: true,
    zDepthFade: false,
  },
  tunnel: {
    xRadius: 10,
    zRadius: 350,
    tilt: 0,
    perspective: 600,
    yRotation: 0,
    reflection: false,
    shadow: false,
    zDepthFade: true,
  },
};

export default function App() {
  const [options, setOptions] = useState<UNIT2CCacouselOptions>(INITIAL_OPTIONS);
  const [themeId, setThemeId] = useState<string>(THEMES[0].id);
  const activeTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<string>('default3d');
  const [currentFPS, setCurrentFPS] = useState<number>(60);

  // Recreated 12-Examples states
  const [activeMode, setActiveMode] = useState<string>('tutorial_image');
  const [eventLogs, setEventLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] SYSTEMS ONLINE: Recreated UNIT@C = Underground Nomadic Information Technology v2.0 core engine bootstrapped successfully.`,
    `[${new Date().toLocaleTimeString()}] PIPELINE: Preserved-3D Hardware matrix coordinates activated.`
  ]);
  const [isAjaxLoading, setIsAjaxLoading] = useState<boolean>(false);
  const [renderingEngine, setRenderingEngine] = useState<'gpu' | 'cpu'>('gpu');
  const [carouselItems, setCarouselItems] = useState([...CAROUSEL_PRODUCTS, { id: 9999, title: "Navigation", category: "Nav", imageUrl: "", color: "", isNavigation: true }]);

  // Helper to push clean telemetry logs
  const addEventLog = (event: string, details: string) => {
    const time = new Date().toLocaleTimeString();
    setEventLogs((prev) => [
      `[${time}] ${event.toUpperCase()}: ${details}`,
      ...prev.slice(0, 24) // limit queue size for memory performance
    ]);
  };

  // Sync mode changes to update carousel parameters perfectly
  const handleModeChange = (modeId: string) => {
    setActiveMode(modeId);
    
    // Highlight the aligned preset
    const matchedMode = OFFICIAL_MODES.find(m => m.id === modeId);
    if (matchedMode) {
      setOptions((prev) => ({
        ...prev,
        ...INITIAL_OPTIONS,
        ...matchedMode.defaultOptions,
      }));
      
      // Update custom preset helpers / alignments
      if (modeId === 'banner_layout') {
        setActivePreset('banner');
      } else if (modeId === 'fixed_size') {
        setActivePreset('fixed');
      } else if (modeId === 'responsive_carousel') {
        setActivePreset('responsive');
      } else if (modeId === 'html_items') {
        setActivePreset('html');
      } else if (modeId === 'rendering_modes') {
        setActivePreset('hardware3d');
        setRenderingEngine('gpu');
      } else {
        setActivePreset('default3d');
      }

      addEventLog('mode_changed', `Activated demo template [${matchedMode.name}]. Options recalibrated.`);
    }
  };

  const handleModuleClick = (moduleName: string) => {
    const map: Record<string, string> = {
      "Tutorial": "tutorial_image",
      "Fixed": "fixed_size",
      "Responsive": "responsive_carousel",
      "HTML": "html_items",
      "Hardware": "rendering_modes",
      "Events": "event_listeners",
      "Breakpoints": "additional_breakpoints",
      "API": "killer_carousel_api",
      "Callbacks": "callbacks_hooks",
      "Banner": "banner_layout",
      "Nav": "navigation_options",
      "Map Navigator": "map_navigator",
      "Ajax": "ajax_asynchronous"
    };
    if (moduleName === "Map Navigator") {
        addEventLog("MODULE_SELECTED", "Map Navigator selected. This module is in development.");
        return;
    }
    if (map[moduleName]) {
      handleModeChange(map[moduleName]);
      addEventLog("MODULE_SELECTED", `User selected module: ${moduleName}`);
    }
  };

  // Handle triggered actions from programmatic controllers
  const handleTriggerApi = (action: string, param?: any) => {
    const total = carouselItems.length;
    
    if (action === 'prev') {
      setActiveIndex((prev) => (prev - 1 + total) % total);
      addEventLog('api_call', `.prev() handler executed. Sliding left.`);
    } else if (action === 'next') {
      setActiveIndex((prev) => (prev + 1) % total);
      addEventLog('api_call', `.next() handler executed. Sliding right.`);
    } else if (action === 'random') {
      const randIdx = Math.floor(Math.random() * total);
      setActiveIndex(randIdx);
      addEventLog('api_call', `.scrollTo(${randIdx}) dynamic handler fired. Gliding focal point.`);
    } else if (action === 'toggle_slideshow') {
      setOptions((prev) => {
        const nextState = !prev.autoSlideshow;
        addEventLog('api_call', `autoSlideshow toggled to: ${nextState ? 'ENABLED' : 'DISABLED'}`);
        return {
          ...prev,
          autoSlideshow: nextState
        };
      });
    } else if (action === 'ajax_reload') {
      setIsAjaxLoading(true);
      addEventLog('ajax_request', `POST request dispatched to mock UNIT@C = Underground Nomadic Information Technology JSON endpoint. Waiting latency response...`);
      
      setTimeout(() => {
        setIsAjaxLoading(false);
        // Shuffle current list to simulate dynamic items
        const shuffled = [...CAROUSEL_PRODUCTS].sort(() => Math.random() - 0.5);
        setCarouselItems([...shuffled, { id: 9999, title: "Navigation", category: "Nav", imageUrl: "", color: "", isNavigation: true }]);
        addEventLog('ajax_success', `Loaded ${shuffled.length} fresh product records asynchronously. Carousel state refilled.`);
      }, 1400);
    }
  };

  // Synchronize dynamic preset choices
  const handlePresetSelect = (presetId: string) => {
    setActivePreset(presetId);
    if (PRESETS_MAP[presetId]) {
      setOptions((prev) => ({
        ...prev,
        ...PRESETS_MAP[presetId],
      }));
      addEventLog('preset_selected', `Applied coordinate preset profile [${presetId}]`);
    }
  };

  // AutoPlay logic
  useEffect(() => {
    if (!options.autoSlideshow) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, options.autoSlideshowDelay);

    return () => clearInterval(timer);
  }, [options.autoSlideshow, options.autoSlideshowDelay, carouselItems.length]);

  return (
    <div className={`min-h-screen ${activeTheme.backgroundColor} ${activeTheme.textColor} transition-colors duration-500`} style={{ fontFamily: activeTheme.fontFamily }} id="landing-app">
      
      {/* 1. Header Navigation and Logo Bar */}
      <nav id="top-nav" className="sticky top-0 z-55 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-sm shadow-sm shadow-indigo-600/30">
              C
            </span>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold text-slate-900 tracking-tight leading-none text-sm">
                UNIT@C
              </span>
              <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
                UNIT2C Cacousel 3D
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6" id="navigation-links">
            <a href="#playground-hero" className="text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors">Playground</a>
            <a href="#testing-evaluation-section" className="text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors">Evaluations</a>
            <a href="#documentation-section" className="text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors">API Parameters</a>
            <a href="#token-auditor-section" className="text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors">Token Audit</a>
            <a href="#licensing-section" className="text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors">Licensing</a>
          </div>

          {/* FPS Badge indicator */}
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1" id="fps-counter-badge">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold font-mono text-indigo-800">
              {currentFPS} FPS
            </span>
          </div>
        </div>
      </nav>

      {/* 2. Responsive Hero Pitch Block */}
      <header className="relative w-full overflow-hidden border-b border-slate-200/80 bg-slate-950 text-white py-16 md:py-24" id="playground-hero">
        {/* Background decorative layers */}
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-10 bottom-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="mx-auto max-w-5xl px-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-6" id="hero-taglines">
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              <Sparkles className="h-3 w-3 animate-pulse" /> Recreated UNIT2C Cacousel v2.0
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400">
              <Terminal className="h-3 w-3 text-slate-500" /> React 19 Hardware Presets
            </span>
          </div>

          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl" id="hero-heading">
            The Legendary <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">UNIT2C Cacousel</span> Recreated
          </h1>

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base" id="hero-lead">
            Experience absolute coordinate projection engineering. Below is an exhaustive 1:1 functional recreation of UNIT@C's signature <strong>UNIT2C Cacousel plugin</strong>, fully reprogrammed as a physics-driven, hardware-accelerated, custom theoretical 3D model in robust React 19.
          </p>

          <div className="mt-10 flex flex-wrap gap-4" id="hero-cta-buttons">
            <a 
              href="#playground-visualiser" 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-slate-50 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/15"
            >
              Enter Code Playground
            </a>
            <a 
              href="#testing-evaluation-section" 
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs border border-slate-800 transition-colors"
            >
              Verify & Rate Performance
            </a>
          </div>
        </div>
      </header>

      {/* 3. The Flagship Live Carousel & Playground Control Center */}
      <section className="py-12 bg-slate-950 border-b border-indigo-950" id="playground-visualiser">
        <div className="mx-auto max-w-5xl px-6">
          
          {/* Recreated 12-Examples Showcase Suite block */}
          <ExamplesSuite
            activeMode={activeMode}
            onModeChange={handleModeChange}
            eventLogs={eventLogs}
            onClearLogs={() => {
              setEventLogs([`[${new Date().toLocaleTimeString()}] Telemetry buffer cleared. Monitoring dynamic matrix updates.`]);
            }}
            onTriggerApi={handleTriggerApi}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-12" id="playground-grid-area">
            
            {/* Carousel Output Render screen */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-800 bg-black/40 overflow-hidden" id="visualiser-stage-side">
              {/* Stage header */}
              <div className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between" id="stage-header">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Stage Rendering Container</span>
                </div>
                <div className="flex gap-1.5 items-center" id="preset-id-indicator">
                  {activeMode === 'rendering_modes' && (
                    <div className="flex bg-slate-950 border border-slate-800 rounded-md p-0.5 text-[9px] font-mono mr-2">
                      <button
                        onClick={() => {
                          setRenderingEngine('gpu');
                          addEventLog('config_change', 'Flipped pipeline to HW 3D Perspective Matrix transforms');
                        }}
                        className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${renderingEngine === 'gpu' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        GPU (3D)
                      </button>
                      <button
                        onClick={() => {
                          setRenderingEngine('cpu');
                          addEventLog('config_change', 'Flipped pipeline to flat orthographic 2D transforms');
                        }}
                        className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${renderingEngine === 'cpu' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        CPU (2D)
                      </button>
                    </div>
                  )}
                  <span className="text-[9px] font-bold bg-indigo-950 border border-indigo-800 text-indigo-400 px-2 py-0.5 rounded-full capitalize">
                    {activePreset} preset
                  </span>
                </div>
              </div>

              {/* The Live Carousel Canvas */}
              <div className="flex-1 min-h-[480px] bg-slate-950 border-b border-slate-850 flex items-center justify-center relative" id="carousel-canvas-cell">
                <UNIT2CCacousel
                  items={carouselItems}
                  options={options}
                  activeIndex={activeIndex}
                  onActiveIndexChange={setActiveIndex}
                  onFPSChange={setCurrentFPS}
                  activeMode={activeMode}
                  onEventTriggered={addEventLog}
                  isAjaxLoading={isAjaxLoading}
                  renderingEngine={renderingEngine}
                  activeTheme={activeTheme}
                  onThemeChange={setThemeId}
                  onModuleClick={handleModuleClick}
                  onRecordsUpdated={(newRecords) => {
                     setCarouselItems([...CAROUSEL_PRODUCTS, ...newRecords, { id: 9999, title: "Navigation", category: "Nav", imageUrl: "", color: "", isNavigation: true }]);
                  }}
                />
              </div>

              {/* Stage footer feedback help */}
              <div className="bg-slate-950 p-4 border-t border-slate-850 flex text-left gap-3 text-[10px] text-slate-400" id="stage-footer">
                <Globe className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                <span className="leading-relaxed">
                  <strong>Swipe / Drag:</strong> Drag cards or swipe left/right to scroll. Hover card for tilt reflection depth. Custom calculations handle slide placement without external template overrides.
                </span>
              </div>
            </div>

            {/* Controls sidebar adjustments */}
            <div className="lg:col-span-5 space-y-6" id="visualiser-control-side">
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <ThemeSelector currentThemeId={themeId} onThemeChange={setThemeId} />
              </div>
              <PlaygroundControls
                options={options}
                onChange={setOptions}
                onPresetSelect={handlePresetSelect}
                activePreset={activePreset}
                onReset={() => {
                  setOptions(INITIAL_OPTIONS);
                  setActivePreset('default3d');
                }}
              />
            </div>

          </div>

          {/* Google Drive Integration Snapshot Suite */}
          <div className="mt-12 border-t border-slate-800/60 pt-12" id="gdrive-section-wrap">
            <DriveIntegration 
              currentOptions={options}
              onLoadOptions={(opts) => {
                setOptions(opts);
                setActivePreset('custom_backup');
                addEventLog('gdrive_load', 'Flashed options snapshot successfully loaded from Google Workspace storage!');
              }}
              onLogEvent={addEventLog}
            />
          </div>

        </div>
      </section>

      {/* 4. Automated Performance Tester: Run, evaluate and rate */}
      <SystemEvaluator currentFPS={currentFPS} />

      {/* 5. Complete Parameter Audit */}
      <DocumentationPage options={options} />

      {/* 6. Model Token Auditor: Input, Output, Cache, Costs */}
      <TokenAuditor />

      {/* 7. Pricing plans */}
      <LicensingCard />

      {/* 8. Registration Code */}
      <RegistrationCode />

      {/* 9. FAQs & Custom layout explanations */}
      <FAQSection />

      {/* 9. Footers */}
      <footer className="border-t border-slate-200 bg-white py-16 px-6" id="app-footer">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              <span className="font-bold text-slate-900 tracking-tight text-sm">
                UNIT@C Web Guide
              </span>
            </div>
            <p className="text-2xs text-slate-500 leading-relaxed max-w-sm">
              Reverse engineered design of UNIT2C Cacousel, demonstrating full React compatibility. Handled cleanly with zero templates.
            </p>
          </div>

          <div className="flex gap-1 items-center text-2xs text-slate-400 font-mono" id="copyright-box">
            <span>Compiled & Audited with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by UNIT@C, 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
