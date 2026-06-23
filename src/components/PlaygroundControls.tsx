import React from 'react';
import { UNIT2CCacouselOptions } from '../types';
import { Settings, Sparkles, Sliders, Layers, RefreshCw } from 'lucide-react';

interface PlaygroundControlsProps {
  options: UNIT2CCacouselOptions;
  onChange: (options: UNIT2CCacouselOptions) => void;
  onReset: () => void;
  onPresetSelect: (presetName: string) => void;
  activePreset: string;
}

export default function PlaygroundControls({
  options,
  onChange,
  onReset,
  onPresetSelect,
  activePreset,
}: PlaygroundControlsProps) {

  // Handle number slides / updates helper
  const handleNumChange = (key: keyof UNIT2CCacouselOptions, val: number) => {
    onChange({
      ...options,
      [key]: val,
    });
  };

  // Handle boolean slides / updates helper
  const handleBoolChange = (key: keyof UNIT2CCacouselOptions, val: boolean) => {
    onChange({
      ...options,
      [key]: val,
    });
  };

  return (
    <div className="flex flex-col gap-6" id="playground-slider-panel">
      {/* 1. Presets Header Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4" id="presets-panel">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Settings className="h-4 w-4 text-indigo-500" /> Choose Preset Styles
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" id="preset-grid-btns">
          {[
            { name: 'Default 3D', id: 'default3d' },
            { name: 'Pure 2D Flat', id: 'flat2d' },
            { name: 'Classic Coverflow', id: 'coverflow' },
            { name: 'High-Tilt Slant', id: 'slanted' },
            { name: 'Panoramic Orbit', id: 'panoramic' },
            { name: 'Z-Depth Tunnel', id: 'tunnel' },
          ].map((preset) => (
            <button
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              onClick={() => onPresetSelect(preset.id)}
              className={`text-xs px-2.5 py-2 font-semibold rounded-lg text-center cursor-pointer transition-all border ${
                activePreset === preset.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Parameters Adjustments Sliders */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col gap-5" id="sliders-panel">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800" id="sliders-header">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sliders className="h-4 w-4 text-indigo-400" /> Orbit & Optics Params
          </h4>
          <button
            id="reset-params-btn"
            onClick={onReset}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-2.5 py-1 rounded transition-colors"
          >
            Reset Default
          </button>
        </div>

        {/* Orbit Radius Dimensions */}
        <div className="flex flex-col gap-4" id="slider-group-radius">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Orbit Radius (X / Horizontal spread)</span>
            <span className="text-xs text-indigo-400 font-mono font-bold">{options.xRadius}px</span>
          </div>
          <input
            type="range"
            id="range-xRadius"
            min="50"
            max="600"
            value={options.xRadius}
            onChange={(e) => handleNumChange('xRadius', parseInt(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 h-1 rounded cursor-pointer"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Orbit Radius (Z / Depth spread)</span>
            <span className="text-xs text-indigo-400 font-mono font-bold">{options.zRadius}px</span>
          </div>
          <input
            type="range"
            id="range-zRadius"
            min="50"
            max="500"
            value={options.zRadius}
            onChange={(e) => handleNumChange('zRadius', parseInt(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 h-1 rounded cursor-pointer"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Orbit Horizontal Slant (Tilt angle)</span>
            <span className="text-xs text-indigo-400 font-mono font-bold">{options.tilt}°</span>
          </div>
          <input
            type="range"
            id="range-tilt"
            min="-90"
            max="90"
            value={options.tilt}
            onChange={(e) => handleNumChange('tilt', parseInt(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 h-1 rounded cursor-pointer"
          />
        </div>

        {/* Math & Lens properties */}
        <div className="flex flex-col gap-4 border-t border-slate-800/80 pt-4" id="slider-group-optics">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Camera Focus (Perspective)</span>
            <span className="text-xs text-indigo-400 font-mono font-bold">{options.perspective}px</span>
          </div>
          <input
            type="range"
            id="range-perspective"
            min="200"
            max="2000"
            value={options.perspective}
            onChange={(e) => handleNumChange('perspective', parseInt(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 h-1 rounded cursor-pointer"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Slide Flat Off-Angle Rotation</span>
            <span className="text-xs text-indigo-400 font-mono font-bold">{options.yRotation}°</span>
          </div>
          <input
            type="range"
            id="range-yRotation"
            min="-180"
            max="180"
            value={options.yRotation}
            onChange={(e) => handleNumChange('yRotation', parseInt(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 h-1 rounded cursor-pointer"
          />
        </div>

        {/* Feature Triggers Checkboxes */}
        <div className="border-t border-slate-800/80 pt-4" id="checkbox-group">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
            <Layers className="h-3 w-3 text-slate-500" /> Feature Enhancers
          </h4>
          <div className="grid grid-cols-2 gap-3" id="checkbox-grid">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                id="chk-opt-infinite"
                checked={options.infinite}
                onChange={(e) => handleBoolChange('infinite', e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-600 h-4 w-4"
              />
              Infinite Loop
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                id="chk-opt-autoslideshow"
                checked={options.autoSlideshow}
                onChange={(e) => handleBoolChange('autoSlideshow', e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-600 h-4 w-4"
              />
              Auto Play
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                id="chk-opt-reflection"
                checked={options.reflection}
                onChange={(e) => handleBoolChange('reflection', e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-600 h-4 w-4"
              />
              Reflections
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                id="chk-opt-shadow"
                checked={options.shadow}
                onChange={(e) => handleBoolChange('shadow', e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-600 h-4 w-4"
              />
              Drop Shadows
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 col-span-2">
              <input
                type="checkbox"
                id="chk-opt-zdepth"
                checked={options.zDepthFade}
                onChange={(e) => handleBoolChange('zDepthFade', e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-600 h-4 w-4"
              />
              Z-Depth Darkness Fade
            </label>
          </div>
        </div>

        {/* Reflection Controls details (if enabled) */}
        {options.reflection && (
          <div className="bg-slate-300/5 dark:bg-black/40 border border-slate-800 rounded-lg p-3 flex flex-col gap-3" id="reflection-options-panel">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Reflection Height</span>
              <span className="text-[11px] font-mono text-indigo-400 font-bold">{options.reflectionHeight}%</span>
            </div>
            <input
              type="range"
              id="range-reflectionHeight"
              min="10"
              max="100"
              value={options.reflectionHeight}
              onChange={(e) => handleNumChange('reflectionHeight', parseInt(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-1 rounded cursor-pointer"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Reflection Opacity</span>
              <span className="text-[11px] font-mono text-indigo-400 font-bold">{(options.reflectionOpacity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              id="range-reflectionOpacity"
              min="0"
              max="1"
              step="0.05"
              value={options.reflectionOpacity}
              onChange={(e) => handleNumChange('reflectionOpacity', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-1 rounded cursor-pointer"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Background Opacity</span>
              <span className="text-[11px] font-mono text-indigo-400 font-bold">{(options.backgroundImageOpacity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              id="range-backgroundImageOpacity"
              min="0"
              max="1"
              step="0.05"
              value={options.backgroundImageOpacity}
              onChange={(e) => handleNumChange('backgroundImageOpacity', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-1 rounded cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Code generator matching live user configurations */}
      <div className="bg-slate-950 border border-indigo-950 rounded-xl p-4 flex flex-col gap-2.5" id="live-jquery-printer">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">CODE SYNC OUTPUT</span>
          <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono">UNIT@C = Underground Nomadic Information Technology API</span>
        </div>
        <pre className="text-[11px] leading-relaxed font-mono p-3 bg-black rounded-lg border border-slate-850 overflow-x-auto text-indigo-300">
          {`// jQuery UNIT2CCacousel initialization
$('.carousel').unit2ccacousel({
  width: ${options.width},
  height: ${options.height},
  perspective: ${options.perspective},
  xRadius: ${options.xRadius},
  zRadius: ${options.zRadius},
  tilt: ${options.tilt},
  yRotation: ${options.yRotation},
  infinite: ${options.infinite},
  autoSlideshow: ${options.autoSlideshow},
  reflection: ${options.reflection},
  reflectionHeight: ${options.reflectionHeight},
  reflectionOpacity: ${options.reflectionOpacity},
  shadow: ${options.shadow},
  zDepthFade: ${options.zDepthFade}
});`}
        </pre>
      </div>
    </div>
  );
}
