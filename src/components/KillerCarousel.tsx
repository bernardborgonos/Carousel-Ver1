import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CarouselItem, KillerCarouselOptions, Theme, ViewMode } from '../types';
import { THEMES } from '../data/themes';
import { MoveLeft, MoveRight, RefreshCw, Maximize2, Minimize2, Square, Settings, ChevronLeft, ChevronRight, BookOpen, Maximize, Smartphone, Code, Cpu, Calendar, GitBranch, MessageSquare, Layout, Navigation, Database, Edit } from 'lucide-react';
import NavigationCarouselPage from './NavigationCarouselPage';

interface KillerCarouselProps {
  items: CarouselItem[];
  options: KillerCarouselOptions;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onFPSChange?: (fps: number) => void;
  activeMode?: string;
  onEventTriggered?: (eventName: string, details: string) => void;
  isAjaxLoading?: boolean;
  renderingEngine?: 'gpu' | 'cpu';
  activeTheme: Theme;
  onThemeChange?: (themeId: string) => void;
  onModuleClick?: (moduleName: string) => void;
  onRecordsUpdated?: (items: CarouselItem[]) => void;
}

export default function KillerCarousel({
  items,
  options,
  activeIndex,
  onActiveIndexChange,
  onFPSChange,
  activeMode = 'tutorial_image',
  onEventTriggered,
  isAjaxLoading = false,
  renderingEngine = 'gpu',
  activeTheme,
  onThemeChange,
  onModuleClick,
  onRecordsUpdated,
}: KillerCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalItems = items.length;
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('carousel-view-mode') as ViewMode) || 'normal';
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const [isToolbarOpen, setIsToolbarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('presets');
  const [demoRecords, setDemoRecords] = useState<CarouselItem[]>(() => {
    const cached = localStorage.getItem('demoRecords');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 3600000) return parsed.items;
      localStorage.removeItem('demoRecords');
    }
    return [];
  });
  const [recordName, setRecordName] = useState('');
  const [recordAddress, setRecordAddress] = useState('');
  const [recordImage, setRecordImage] = useState('');
  const [recordUrlLink, setRecordUrlLink] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (demoRecords.length > 0) {
      onRecordsUpdated?.(demoRecords);
      localStorage.setItem('demoRecords', JSON.stringify({ items: demoRecords, timestamp: Date.now() }));
    }
  }, [demoRecords, onRecordsUpdated]);

  const addRecord = () => {
    if (demoRecords.length >= 10 || !recordName) return;
    if (editingId) {
       setDemoRecords(prev => prev.map(r => r.id === editingId ? { ...r, title: recordName, category: recordAddress, imageUrl: recordImage, urlLink: recordUrlLink } : r));
       setEditingId(null);
    } else {
        const newItem: CarouselItem = {
          id: Date.now(),
          title: recordName,
          category: recordAddress,
          imageUrl: recordImage,
          urlLink: recordUrlLink,
          color: '#4f46e5'
        };
        setDemoRecords(prev => [...prev, newItem]);
    }
    setRecordName('');
    setRecordAddress('');
    setRecordImage('');
    setRecordUrlLink('');
  };

  const startEdit = (record: CarouselItem) => {
    setEditingId(record.id);
    setRecordName(record.title);
    setRecordAddress(record.category || '');
    setRecordImage(record.imageUrl || '');
    setRecordUrlLink(record.urlLink || '');
  };

  const removeRecord = (id: number) => {
    setDemoRecords(prev => prev.filter(r => r.id !== id));
  };

  const clearRecords = () => {
    setDemoRecords([]);
    localStorage.removeItem('demoRecords');
  };

  // Internal state for options, initialized from props
  const [localOptions, setLocalOptions] = useState<KillerCarouselOptions>(options);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const updateOption = <K extends keyof KillerCarouselOptions>(key: K, value: KillerCarouselOptions[K]) => {
    setLocalOptions(prev => ({ ...prev, [key]: value }));
  };

  const resetOptions = () => {
    setLocalOptions(options);
  };

  const PRESETS: Record<string, Partial<KillerCarouselOptions>> = {
    'Default 3D': { xRadius: 300, zRadius: 200, tilt: 0, perspective: 1000 },
    'Pure 2D Flat': { xRadius: 400, zRadius: 0, tilt: 0, perspective: 0 },
    'Classic Coverflow': { xRadius: 300, zRadius: 50, tilt: 0, perspective: 800 },
    'High-Tilt Slant': { xRadius: 250, zRadius: 150, tilt: 45, perspective: 1200 },
    'Panoramic Orbit': { xRadius: 500, zRadius: 300, tilt: 0, perspective: 1500 },
    'Z-Depth Tunnel': { xRadius: 100, zRadius: 400, tilt: 0, perspective: 500 },
  };

  // Parallax mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Helper to get height based on mode
  const getContainerStyles = () => {
    switch (viewMode) {
      case 'small': return 'relative w-full h-[300px]';
      case 'full': return 'fixed inset-0 z-[100]';
      case 'normal':
      default: return 'relative w-full h-[520px]';
    }
  };

  // States backporting for true interactive HTML sliders inside slides
  const [mixR, setMixR] = useState(99);
  const [mixG, setMixG] = useState(102);
  const [mixB, setMixB] = useState(241);
  const [clickCount, setClickCount] = useState(42);
  const [toggles, setToggles] = useState({ perf: true, shadow: true, glow: false });
  const [followed, setFollowed] = useState(false);
  const [gaugeSpeed, setGaugeSpeed] = useState(3000);

  // Trigger telemetry logs
  useEffect(() => {
    if (onEventTriggered) {
      onEventTriggered('onInitCompleted', `Killer Carousel initialized in mode [${activeMode}] with ${totalItems} items.`);
    }
  }, [activeMode, totalItems]);

  useEffect(() => {
    if (onEventTriggered) {
      onEventTriggered('onTargetAligned', `Target aligned to Index ${activeIndex} - "${items[activeIndex]?.title || 'Dynamic loaded Item'}"`);
    }
  }, [activeIndex, activeMode]);

  // The angle (in radians) tracking the rotation of our carousel orbit
  const [angle, setAngle] = useState(0);
  
  // Animation loop refs for smooth spring tension physics
  const requestRef = useRef<number | null>(null);
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartAngle = useRef(0);
  const dragStartX = useRef(0);
  const isTransitioningRef = useRef(false);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const fpsFrameCount = useRef(0);
  const fpsLastTime = useRef(Date.now());

  // Trigger smooth shift to index on program change
  useEffect(() => {
    if (!draggingRef.current) {
      isTransitioningRef.current = true;
      const stepAngle = (2 * Math.PI) / totalItems;
      targetAngleRef.current = -activeIndex * stepAngle;
    }
  }, [activeIndex, totalItems]);

  // Spring physics variables
  const stiffness = 0.08;
  const damping = 0.85;

  // Animation ticks
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const dt = Math.max(now - lastTimeRef.current, 1);
      lastTimeRef.current = now;

      // Handle FPS tracking
      fpsFrameCount.current += 1;
      if (now - fpsLastTime.current >= 1000) {
        if (onFPSChange) {
          onFPSChange(Math.round((fpsFrameCount.current * 1000) / (now - fpsLastTime.current)));
        }
        fpsFrameCount.current = 0;
        fpsLastTime.current = now;
      }

      if (draggingRef.current) {
        // Friction when dragging is hand-controlled, update velocity on move
        currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * 0.4;
      } else {
        // Physics inertia on release
        if (Math.abs(velocityRef.current) > 0.001) {
          targetAngleRef.current += velocityRef.current;
          velocityRef.current *= damping;
        }

        // Spring pull to target angle
        const diff = targetAngleRef.current - currentAngleRef.current;
        currentAngleRef.current += diff * stiffness;
        if (isTransitioningRef.current && Math.abs(diff) < 0.01) {
          isTransitioningRef.current = false;
        }
      }

      setAngle(currentAngleRef.current);
      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [onFPSChange]);

  // Determine which index is closest to current rotation angle and sync back to parent
  useEffect(() => {
    const stepAngle = (2 * Math.PI) / totalItems;
    // Calculate fractional active item index
    let normalizedAngle = -angle % (2 * Math.PI);
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
    
    const approxIndex = Math.round(normalizedAngle / stepAngle) % totalItems;
    if (approxIndex !== activeIndex && !draggingRef.current && !isTransitioningRef.current && Math.abs(velocityRef.current) < 0.01) {
      onActiveIndexChange(approxIndex);
    }
  }, [angle, totalItems, activeIndex, onActiveIndexChange]);

  // Drag interaction handlers
  const handleDragStart = (clientX: number) => {
    draggingRef.current = true;
    dragStartX.current = clientX;
    dragStartAngle.current = currentAngleRef.current;
    targetAngleRef.current = currentAngleRef.current;
    velocityRef.current = 0;
    lastTimeRef.current = Date.now();
    if (onEventTriggered) {
      onEventTriggered('onDragStarted', `Drag started at mouse cursor X: ${Math.round(clientX)}. Base orbit angle: ${currentAngleRef.current.toFixed(3)} rad.`);
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!draggingRef.current) return;
    const dx = clientX - dragStartX.current;
    const width = containerRef.current?.offsetWidth || 800;
    
    // Convert drag movement to orbital angular displacement (1.5 full orbits max for screen width drag)
    const sensitivity = (2 * Math.PI * 1.2) / width;
    const angleDelta = dx * sensitivity;
    
    const prevTarget = targetAngleRef.current;
    targetAngleRef.current = dragStartAngle.current + angleDelta;
    
    // Real-time velocity tracking for flick momentum
    const dt = Math.max(Date.now() - lastTimeRef.current, 1);
    velocityRef.current = (targetAngleRef.current - prevTarget);
    lastTimeRef.current = Date.now();
  };

  const handleDragEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    
    // Ensure we snap clean into the nearest item slot
    const stepAngle = (2 * Math.PI) / totalItems;
    
    // Add momentum to push further if swiped swiftly
    let finalAngleTarget = targetAngleRef.current + velocityRef.current * 8;
    
    // Find closest stepAngle interval
    const indexSought = Math.round(-finalAngleTarget / stepAngle);
    targetAngleRef.current = -indexSought * stepAngle;
    
    const boundIndex = ((indexSought % totalItems) + totalItems) % totalItems;
    onActiveIndexChange(boundIndex);
    if (onEventTriggered) {
      onEventTriggered('onDragCompleted', `Drag released. Final snap-to Aligned Index: ${boundIndex}. Friction decay momentum velocity: ${velocityRef.current.toFixed(4)}.`);
    }
  };

  // Click handler to rotate background items to the front
  const handleItemClick = (index: number) => {
    if (localOptions.itemClickToFocus && !draggingRef.current && Math.abs(velocityRef.current) < 0.01) {
      onActiveIndexChange(index);
      if (onEventTriggered) {
        onEventTriggered('onItemClicked', `Slide clicked: focused Index ${index} ("${items[index]?.title || 'Blank'}"). Initiating glide animate...`);
      }
    }
  };

  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Manual trigger arrows
  const prevSlide = useCallback(() => {
    // Debounce/Quick skip
    draggingRef.current = false;
    const prevIndex = (activeIndexRef.current - 1 + totalItems) % totalItems;
    onActiveIndexChange(prevIndex);
  }, [totalItems, onActiveIndexChange]);

  const nextSlide = useCallback(() => {
    // Debounce/Quick skip
    draggingRef.current = false;
    const nextIndex = (activeIndexRef.current + 1) % totalItems;
    onActiveIndexChange(nextIndex);
  }, [totalItems, onActiveIndexChange]);

  // Auto-play interval
  useEffect(() => {
    if (!localOptions.autoSlideshow || localOptions.autoSlideshowDelay <= 0) return;
    const interval = setInterval(() => {
      if (localOptions.autoSlideshowDirection === 'right') {
          nextSlide();
      } else {
          prevSlide();
      }
    }, localOptions.autoSlideshowDelay);
    return () => clearInterval(interval);
  }, [localOptions.autoSlideshow, localOptions.autoSlideshowDelay, localOptions.autoSlideshowDirection, nextSlide]);

  // Keyboard listeners for navigation and full screen exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'Escape') {
        setViewMode('normal');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [prevSlide, nextSlide]);

  // Render individual slide locations matching calculations
  const renderSlides = () => {
    const mainItems = items.filter(i => !i.isNavigation);
    const navItem = items.find(i => i.isNavigation);
    
    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(mainItems.length / itemsPerPage));
    const currentPage = Math.min(Math.floor(activeIndex / itemsPerPage), totalPages - 1);
    const paginatedItems = mainItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    
    const renderedItems = navItem ? [...paginatedItems, navItem] : paginatedItems;
    const totalItems = renderedItems.length;
    const stepAngle = (2 * Math.PI) / totalItems;

    // We precalculate coordinates and sorting scores so that standard depth occlusion (z-index overlapping) works optimally
    const slidesData = renderedItems.map((item, i) => {
      const itemAngle = angle + i * stepAngle;

      // X/Y/Z coordinate positions
      const posX = Math.sin(itemAngle) * localOptions.xRadius;
      const posZ = Math.cos(itemAngle) * localOptions.zRadius;
      
      // Slant/tilt factors. A tilt parameter lifts one side of the orbit up and lowers the other
      const posY = Math.sin(itemAngle) * localOptions.tilt + localOptions.yRadius;

      // Size scale and focus decay based on Z-depth position
      const minScale = 0.5;
      const maxScale = 1.0;
      
      // Scale fraction is 1.0 at front (posZ = zRadius) and 0.0 at back (posZ = -zRadius)
      const scaleFrac = (posZ + localOptions.zRadius) / (2 * localOptions.zRadius);
      const scale = minScale + (maxScale - minScale) * scaleFrac;
      
      // Opacity / Darkness decay
      const minOpacity = 0.25;
      const opacity = minOpacity + (1.0 - minOpacity) * scaleFrac;

      // Dark shadow overlay percentage to fade item to dark background
      const darkOverlayMultiplier = localOptions.zDepthFade ? (1.0 - scaleFrac) * 100 : 0;

      // Standard item face rotations. Allows rotating individual items around Y to make them face center or stay billboard flat
      const rotY = (localOptions.yRotation !== 0) 
        ? localOptions.yRotation 
        : (itemAngle * (180 / Math.PI)) + localOptions.yRotation;

      return {
        item,
        index: i,
        posX,
        posY,
        posZ,
        scale,
        opacity,
        darkPercent: darkOverlayMultiplier,
        rotY,
        zDepthScore: posZ, // Higher means further to front
      };
    });

    // Sort layers from back to front (low zDepthScore first) to prevent visual overlapping clipping
    const sortedSlides = [...slidesData].sort((a, b) => a.zDepthScore - b.zDepthScore);

    return sortedSlides.map((slide, layerIdx) => {
      const isFocused = slide.index === activeIndex;

      const isSoftware = renderingEngine === 'cpu';
      // Prepare transform statements
      const transformStyle = {
        transform: isSoftware 
          ? `translate3d(${slide.posX}px, ${slide.posY}px, 0px) scale(${slide.scale})`
          : `translate3d(${slide.posX}px, ${slide.posY}px, ${slide.posZ}px) 
                     rotateX(${localOptions.xRotation}deg) 
                     rotateY(${slide.rotY}deg) 
                     rotateZ(${localOptions.zRotation}deg) 
                     scale(${slide.scale})`,
        width: `${localOptions.width}px`,
        height: `${localOptions.height}px`,
        zIndex: Math.round(slide.zDepthScore + 1000), // Enforce zIndex matching depth position
        willChange: 'transform',
      };

      return (
        <div
          key={slide.item.id}
          id={`carousel-slide-wrapper-${slide.index}`}
          style={transformStyle}
          onClick={() => handleItemClick(slide.index)}
          className={`absolute flex flex-col items-center justify-start cursor-pointer origin-center select-none transition-shadow duration-300 ${
            localOptions.swipe || localOptions.drag ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
        >
          {isAjaxLoading ? (
            <div
              id={`carousel-item-card-loading-${slide.index}`}
              className="relative w-full h-full bg-slate-900 border border-slate-700/60 shadow-xl rounded-2xl flex flex-col justify-center items-center p-4 text-center"
            >
              <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin mb-2" />
              <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400">AJAX LOADING...</span>
            </div>
          ) : slide.item.isNavigation ? (
            <div className="relative w-full h-full">
              <NavigationCarouselPage items={items.filter(i => !i.isNavigation)} activeIndex={activeIndex} onNavigate={onActiveIndexChange} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />
            </div>
          ) : activeMode === 'html_items' ? (
            <div
              id={`carousel-item-card-html-${slide.index}`}
              className="relative w-full h-full bg-slate-950 border border-indigo-500/40 shadow-xl rounded-2xl flex flex-col justify-between p-4 text-white font-sans text-left cursor-default select-text"
              onClick={(e) => e.stopPropagation()} // Stop rotation trigger when interacting with inputs
            >
              {slide.index === 0 && (
                <div className="flex flex-col h-full justify-between gap-1.5" id="html-widget-rgb">
                  <div>
                    <span className="text-[8px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest block">HTML COMPONENT 1/5</span>
                    <h5 className="text-[11px] font-extrabold tracking-tight mt-0.5 text-white">Live 3D Color Mixer</h5>
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-1.5" id="color-sliders-box">
                    <div 
                      className="h-10 rounded-lg border border-white/10 shadow-inner transition-all duration-200"
                      style={{ backgroundColor: `rgb(${mixR}, ${mixG}, ${mixB})` }}
                    />
                    <div className="flex flex-col gap-0.5">
                      <div className="flex justify-between text-[8px] font-mono text-slate-400">
                        <span>Red (R)</span>
                        <span className="text-white font-extrabold font-mono">{mixR}</span>
                      </div>
                      <input 
                        type="range" min="0" max="255" value={mixR}
                        onChange={(e) => setMixR(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded cursor-pointer accent-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex justify-between text-[8px] font-mono text-slate-400">
                        <span>Green (G)</span>
                        <span className="text-white font-extrabold font-mono">{mixG}</span>
                      </div>
                      <input 
                        type="range" min="0" max="255" value={mixG}
                        onChange={(e) => setMixG(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                  <span className="text-[8px] text-center text-slate-500 leading-none">RGBA parameters fully reactive</span>
                </div>
              )}

              {slide.index === 1 && (
                <div className="flex flex-col h-full justify-between" id="html-widget-counter">
                  <div>
                    <span className="text-[8px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest block">HTML COMPONENT 2/5</span>
                    <h5 className="text-[11px] font-extrabold tracking-tight mt-0.5 text-white">Interactive Clicker</h5>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="text-3xl font-extrabold font-mono tracking-tight text-indigo-300 mb-2">{clickCount}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setClickCount(prev => prev - 1)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 active:scale-95 cursor-pointer block text-white"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => setClickCount(prev => prev + 1)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-505 rounded active:scale-95 cursor-pointer block text-white"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  <span className="text-[8px] text-slate-500 text-center leading-none">Internal component state binding</span>
                </div>
              )}

              {slide.index === 2 && (
                <div className="flex flex-col h-full justify-between" id="html-widget-toggles">
                  <div>
                    <span className="text-[8px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest block">HTML COMPONENT 3/5</span>
                    <h5 className="text-[11px] font-extrabold tracking-tight mt-0.5 text-white">Calibration Switches</h5>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 py-1 text-[10px]">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white select-none">
                      <input 
                        type="checkbox" checked={toggles.perf}
                        onChange={(e) => setToggles({ ...toggles, perf: e.target.checked })}
                        className="rounded accent-indigo-500 border-slate-700 bg-slate-800"
                      />
                      <span>Enable Auto Warm-up</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white select-none">
                      <input 
                        type="checkbox" checked={toggles.shadow}
                        onChange={(e) => setToggles({ ...toggles, shadow: e.target.checked })}
                        className="rounded accent-indigo-500 border-slate-700 bg-slate-800"
                      />
                      <span>Friction decay filter</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white select-none">
                      <input 
                        type="checkbox" checked={toggles.glow}
                        onChange={(e) => setToggles({ ...toggles, glow: e.target.checked })}
                        className="rounded accent-indigo-500 border-slate-700 bg-slate-800"
                      />
                      <span>Active orbital guide</span>
                    </label>
                  </div>

                  <span className="text-[8px] text-slate-500 text-center leading-none">Toggles persistent selection states</span>
                </div>
              )}

              {slide.index === 3 && (
                <div className="flex flex-col h-full justify-between" id="html-widget-follow">
                  <div>
                    <span className="text-[8px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest block">HTML COMPONENT 4/5</span>
                    <h5 className="text-[11px] font-extrabold tracking-tight mt-0.5 text-white">Social Engagement</h5>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center font-extrabold text-[9px] text-white">
                      KB
                    </div>
                    <div>
                      <h6 className="text-[10px] font-bold text-white max-w-[120px] truncate">KillerBot 3D</h6>
                      <span className="text-[8px] text-slate-400 block font-mono">
                        {followed ? '1,501 Followers' : '1,500 Followers'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setFollowed(!followed)}
                    className={`w-full py-1 rounded text-[10px] font-bold block cursor-pointer text-center ${
                      followed ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {followed ? '✓ Following' : 'Follow bot'}
                  </button>

                  <span className="text-[8px] text-slate-500 text-center leading-none">Standard DOM follow button</span>
                </div>
              )}

              {slide.index >= 4 && (
                <div className="flex flex-col h-full justify-between" id="html-widget-slider">
                  <div>
                    <span className="text-[8px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest block">HTML COMPONENT 5/5</span>
                    <h5 className="text-[11px] font-extrabold tracking-tight mt-0.5 text-white">Hardware Cycle Gate</h5>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-center py-2">
                    <span className="text-[8px] font-mono text-slate-500">GATE REPEAT CYCLE:</span>
                    <span className="text-xs font-mono font-bold text-indigo-300">{gaugeSpeed} ms</span>
                    <input 
                      type="range" min="500" max="5000" step="500" value={gaugeSpeed}
                      onChange={(e) => setGaugeSpeed(parseInt(e.target.value))}
                      className="w-full mt-1 bg-slate-800 accent-indigo-500 cursor-pointer h-1 rounded text-white"
                    />
                  </div>

                  <span className="text-[8px] text-slate-500 text-center leading-none">Controls timer frequency parameters</span>
                </div>
              )}
            </div>
          ) : (
            /* Main Item Card */
            <div
              id={`carousel-item-card-${slide.index}`}
              className="relative w-full h-full overflow-hidden bg-slate-900 border border-slate-700/60 shadow-xl rounded-2xl flex flex-col justify-between"
            >
              {/* Dark decay mask for depth */}
              {localOptions.zDepthFade && (
                <div 
                  className="absolute inset-0 z-20 pointer-events-none bg-black transition-opacity duration-300" 
                  style={{ opacity: slide.darkPercent / 120 }}
                />
              )}

              {/* Glowing Category Badge */}
              <div className="absolute top-3 left-3 z-30" id={`item-badge-${slide.index}`}>
                <span className={`text-[9px] font-extrabold tracking-widest uppercase px-2 py-1 rounded bg-black/80 text-white border border-slate-700`}>
                  {slide.item.category}
                </span>
              </div>

              {/* Carousel Item Image */}
              <div className="relative w-full flex-1 overflow-hidden pointer-events-none">
                {slide.item.imageUrl && (
                  <img
                    src={slide.item.imageUrl}
                    alt={slide.item.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
              </div>

              {/* Carousel Item Title Label */}
              <div className="p-4 bg-slate-950/95 border-t border-slate-800 z-10" id={`item-title-${slide.index}`}>
                 {slide.item.urlLink ? (
                    <a href={slide.item.urlLink} target="_blank" rel="noopener noreferrer" className="block text-white text-xs font-bold tracking-tight text-center truncate px-2 hover:text-indigo-400 transition-colors" style={{ fontFamily: 'inherit' }}>
                         {slide.item.title}
                    </a>
                ) : (
                    <h4 className="text-white text-xs font-bold tracking-tight text-center truncate px-2" style={{ fontFamily: 'inherit' }}>
                        {slide.item.title}
                    </h4>
                )}
              </div>
            </div>
          )}

          {/* Reflections Overlay */}
          {localOptions.reflection && (
            <div
              id={`carousel-item-reflection-${slide.index}`}
              style={{
                height: `${localOptions.reflectionHeight}%`,
                width: '100%',
                opacity: slide.opacity * localOptions.reflectionOpacity,
              }}
              className="relative overflow-hidden pointer-events-none select-none scale-y-[-1] mt-2 translate-y-[-1px]"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden opacity-60">
                {slide.item.imageUrl && (
                  <img
                    src={slide.item.imageUrl}
                    alt="reflection"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {/* Fade gradient mask overlaying reflection */}
              <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>
          )}

          {/* Depth floor shadow */}
          {localOptions.shadow && (
            <div
              id={`carousel-item-shadow-${slide.index}`}
              style={{
                opacity: (slide.posZ + localOptions.zRadius) / (2 * localOptions.zRadius) * localOptions.shadowOpacity,
                width: `${localOptions.width * 0.9}px`,
                transform: `scale(${1 + slide.posZ / (localOptions.zRadius * 4)})`,
              }}
              className="absolute -bottom-10 h-6 rounded-full bg-black/60 blur-md pointer-events-none -z-10"
            />
          )}
        </div>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      id="killer-carousel-wrapper"
      className={`flex items-center justify-center overflow-hidden bg-cover bg-center px-4 select-none touch-none transition-all duration-500 ${getContainerStyles()}`}
      style={{ 
        backgroundImage: `linear-gradient(rgba(${localOptions.overlayColor}, ${localOptions.overlayOpacity}), rgba(${localOptions.overlayColor}, ${localOptions.overlayOpacity})), ${activeTheme.backgroundImage}`,
        backgroundBlendMode: 'multiply',
        backgroundPosition: `${50 + mousePos.x * 0.05}% ${50 + mousePos.y * 0.05}%`
      }}
      onMouseDown={(e) => {
        if (localOptions.drag) handleDragStart(e.clientX);
      }}
      onMouseMove={(e) => {
        if (localOptions.drag) handleDragMove(e.clientX);
        
        // Parallax effect logic
        const { clientX, clientY, currentTarget } = e;
        const rect = currentTarget.getBoundingClientRect();
        setMousePos({
          x: ((clientX - rect.left) / rect.width - 0.5) * 100,
          y: ((clientY - rect.top) / rect.height - 0.5) * 100
        });
      }}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => {
        if (localOptions.swipe) handleDragStart(e.touches[0].clientX);
      }}
      onTouchMove={(e) => {
        if (localOptions.swipe) handleDragMove(e.touches[0].clientX);
      }}
      onTouchEnd={handleDragEnd}
    >
      {/* 3D Orbit Ambient Guidelines for Visual Debugging */}

      <div 
        id="3d-orbit-axis-map"
        className="absolute w-full border border-dashed border-indigo-500/10 rounded-full pointer-events-none transform -z-50"
        style={{
          width: `${localOptions.xRadius * 2}px`,
          height: `${localOptions.zRadius * 2}px`,
          transform: `rotateX(${localOptions.tilt}deg) translateY(${localOptions.yRadius}px)`,
        }}
      />

      {/* Actual Rotational Slide Hub */}
      <div 
        id="slides-hub"
        className="relative flex items-center justify-center"
        style={{ perspective: `${localOptions.perspective}px`, transformStyle: 'preserve-3d' }}
      >
        {renderSlides()}
      </div>

      {/* Toolbar for fullscreen */}
      {viewMode === 'full' && (
        <div className={`absolute top-4 left-4 z-[110] bg-slate-900/90 border border-slate-700 p-2 rounded-lg text-white font-sans transition-all duration-300 ${isToolbarOpen ? 'w-64' : 'w-10'}`}>
          <button 
            onClick={() => setIsToolbarOpen(!isToolbarOpen)}
            className="flex items-center justify-center w-full h-8 hover:bg-slate-800 rounded transition-colors"
          >
            {isToolbarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
          
          {isToolbarOpen && (
            <div className="flex flex-col mt-2 border-t border-slate-700">
               <button onClick={() => setViewMode('normal')} className="flex items-center gap-2 text-xs text-white bg-slate-800 p-2 rounded m-2 mb-0">
                  <Minimize2 className="h-3 w-3" /> Exit Fullscreen
               </button>

               {/* Preset Styles */}
               <div className="border-b border-slate-700">
                 <button onClick={() => setExpandedSection(expandedSection === 'presets' ? null : 'presets')} className="flex justify-between items-center w-full p-3 text-xs font-bold text-slate-300 uppercase">
                    Preset Styles {expandedSection === 'presets' ? <ChevronLeft className="h-3 w-3 -rotate-90" /> : <ChevronRight className="h-3 w-3 -rotate-90" />}
                 </button>
                 {expandedSection === 'presets' && (
                    <div className="p-3 pt-0 text-xs flex flex-wrap gap-2">
                        {Object.keys(PRESETS).map(name => (
                            <button key={name} onClick={() => setLocalOptions(prev => ({...prev, ...PRESETS[name]}))} className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-white">{name}</button>
                        ))}
                    </div>
                 )}
               </div>

                {/* Modules */}
                <div className="border-b border-slate-700">
                   <button onClick={() => setExpandedSection(expandedSection === 'modules' ? null : 'modules')} className="flex justify-between items-center w-full p-3 text-xs font-bold text-slate-300 uppercase">
                      Modules {expandedSection === 'modules' ? <ChevronLeft className="h-3 w-3 -rotate-90" /> : <ChevronRight className="h-3 w-3 -rotate-90" />}
                   </button>
                   {expandedSection === 'modules' && (
                      <div className="p-3 pt-0 text-xs flex flex-wrap gap-2">
                          {[
                            { short: "Tutorial", icon: BookOpen },
                            { short: "Fixed", icon: Maximize },
                            { short: "Responsive", icon: Smartphone },
                            { short: "HTML", icon: Code },
                            { short: "Hardware", icon: Cpu },
                            { short: "Events", icon: Calendar },
                            { short: "Breakpoints", icon: GitBranch },
                            { short: "API", icon: Settings },
                            { short: "Callbacks", icon: MessageSquare },
                            { short: "Banner", icon: Layout },
                            { short: "Nav", icon: Navigation },
                            { short: "Map Navigator", icon: Navigation },
                            { short: "Ajax", icon: Database }
                          ].map(mod => {
                              const Icon = mod.icon;
                              return <button key={mod.short} onClick={() => onModuleClick?.(mod.short)} className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-white flex items-center gap-1"><Icon className="h-3 w-3" />{mod.short}</button>
                          })}
                      </div>
                   )}
                </div>

                {/* Demo Records */}
                <div className="border-b border-slate-700">
                   <button onClick={() => setExpandedSection(expandedSection === 'demo' ? null : 'demo')} className="flex justify-between items-center w-full p-3 text-xs font-bold text-slate-300 uppercase">
                      Demo Records {expandedSection === 'demo' ? <ChevronLeft className="h-3 w-3 -rotate-90" /> : <ChevronRight className="h-3 w-3 -rotate-90" />}
                   </button>
                   {expandedSection === 'demo' && (
                      <div className="p-3 pt-0 text-xs flex flex-col gap-2">
                          <input placeholder="Name" value={recordName} onChange={e => setRecordName(e.target.value)} className="bg-slate-800 p-2 rounded text-white" />
                          <input placeholder="Address" value={recordAddress} onChange={e => setRecordAddress(e.target.value)} className="bg-slate-800 p-2 rounded text-white" />
                          <input placeholder="Image URL" value={recordImage} onChange={e => setRecordImage(e.target.value)} className="bg-slate-800 p-2 rounded text-white" />
                          <input placeholder="Url Link" value={recordUrlLink} onChange={e => setRecordUrlLink(e.target.value)} className="bg-slate-800 p-2 rounded text-white" />
                          <button onClick={addRecord} className="bg-indigo-600 hover:bg-indigo-500 p-2 rounded text-white italic text-xs">{editingId ? 'Update Record' : 'Add Record'}</button>
                          <button onClick={clearRecords} className="bg-red-800 hover:bg-red-700 p-2 rounded text-white italic text-xs">Clear Cache</button>
                          <div className="flex flex-col gap-1 mt-2">
                            {demoRecords.map(r => (
                                <div key={r.id} className="flex justify-between bg-slate-800 p-1 rounded">
                                   <span>{r.title}</span>
                                   <button onClick={() => removeRecord(r.id)} className="text-red-400">X</button>
                                   <button onClick={() => startEdit(r)} className="text-indigo-400"><Edit className="h-3 w-3" /></button>
                                </div>
                            ))}
                          </div>
                      </div>
                   )}
                </div>

               {/* Orbit & Optics Params */}
               <div className="border-b border-slate-700">
                 <button onClick={() => setExpandedSection(expandedSection === 'orbit' ? null : 'orbit')} className="flex justify-between items-center w-full p-3 text-xs font-bold text-slate-300 uppercase">
                    Orbit & Optics {expandedSection === 'orbit' ? <ChevronLeft className="h-3 w-3 -rotate-90" /> : <ChevronRight className="h-3 w-3 -rotate-90" />}
                 </button>
                 {expandedSection === 'orbit' && (
                   <div className="p-3 pt-0 text-xs flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                         <label>Radius X: {localOptions.xRadius}</label>
                         <RefreshCw className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => updateOption('xRadius', options.xRadius)} />
                      </div>
                      <input type="range" min="100" max="1000" value={localOptions.xRadius} onChange={(e) => updateOption('xRadius', Number(e.target.value))} className="w-full accent-indigo-500" />
                      
                      <div className="flex justify-between items-center">
                         <label>Radius Z: {localOptions.zRadius}</label>
                         <RefreshCw className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => updateOption('zRadius', options.zRadius)} />
                      </div>
                      <input type="range" min="100" max="1000" value={localOptions.zRadius} onChange={(e) => updateOption('zRadius', Number(e.target.value))} className="w-full accent-indigo-500" />
                      
                      <div className="flex justify-between items-center">
                         <label>Tilt: {localOptions.tilt}</label>
                         <RefreshCw className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => updateOption('tilt', options.tilt)} />
                      </div>
                      <input type="range" min="-90" max="90" value={localOptions.tilt} onChange={(e) => updateOption('tilt', Number(e.target.value))} className="w-full accent-indigo-500" />
                   </div>
                 )}
               </div>

               {/* Features */}
               <div className="border-b border-slate-700">
                 <button onClick={() => setExpandedSection(expandedSection === 'enhancers' ? null : 'enhancers')} className="flex justify-between items-center w-full p-3 text-xs font-bold text-slate-300 uppercase">
                    Enhancers {expandedSection === 'enhancers' ? <ChevronLeft className="h-3 w-3 -rotate-90" /> : <ChevronRight className="h-3 w-3 -rotate-90" />}
                 </button>
                 {expandedSection === 'enhancers' && (
                   <div className="p-3 pt-0 text-xs flex flex-col gap-2">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={localOptions.infinite} onChange={(e) => updateOption('infinite', e.target.checked)} className="accent-indigo-500" /> Infinite Loop</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={localOptions.autoSlideshow} onChange={(e) => updateOption('autoSlideshow', e.target.checked)} className="accent-indigo-500" /> Auto Play</label>
                      <div className="flex gap-4 ml-6 items-center">
                        <label className="flex items-center gap-1"><input type="radio" name="autoSlideshowDirection" checked={localOptions.autoSlideshowDirection === 'left'} onChange={() => updateOption('autoSlideshowDirection', 'left')} className="accent-indigo-500" /> Left</label>
                        <label className="flex items-center gap-1"><input type="radio" name="autoSlideshowDirection" checked={localOptions.autoSlideshowDirection === 'right'} onChange={() => updateOption('autoSlideshowDirection', 'right')} className="accent-indigo-500" /> Right</label>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                         <label>Speed (s): {Math.round(localOptions.autoSlideshowDelay / 1000)}</label>
                         <RefreshCw className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => updateOption('autoSlideshowDelay', options.autoSlideshowDelay)} />
                      </div>
                      <input type="range" min="1000" max="60000" step="1000" value={localOptions.autoSlideshowDelay} onChange={(e) => updateOption('autoSlideshowDelay', Number(e.target.value))} className="w-full accent-indigo-500" />
                      <label className="flex items-center gap-2"><input type="checkbox" checked={localOptions.reflection} onChange={(e) => updateOption('reflection', e.target.checked)} className="accent-indigo-500" /> Reflections</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={localOptions.shadow} onChange={(e) => updateOption('shadow', e.target.checked)} className="accent-indigo-500" /> Drop Shadows</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={localOptions.zDepthFade} onChange={(e) => updateOption('zDepthFade', e.target.checked)} className="accent-indigo-500" /> Z-Depth Darkness Fade</label>
                      <div className="flex justify-between items-center mt-2">
                         <label>Bg Opacity: {Math.round(localOptions.backgroundImageOpacity * 100)}%</label>
                         <RefreshCw className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => updateOption('backgroundImageOpacity', options.backgroundImageOpacity)} />
                      </div>
                      <input type="range" min="0" max="1" step="0.05" value={localOptions.backgroundImageOpacity} onChange={(e) => updateOption('backgroundImageOpacity', Number(e.target.value))} className="w-full accent-indigo-500" />
                      
                      <div className="flex justify-between items-center mt-2">
                         <label>Overlay Tint: {Math.round(localOptions.overlayOpacity * 100)}%</label>
                         <RefreshCw className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => updateOption('overlayOpacity', options.overlayOpacity)} />
                      </div>
                      <input type="range" min="0" max="1" step="0.05" value={localOptions.overlayOpacity} onChange={(e) => updateOption('overlayOpacity', Number(e.target.value))} className="w-full accent-indigo-500" />
                   </div>
                 )}
               </div>

               {/* Visual Theme */}
               <div className="border-b border-slate-700">
                 <button onClick={() => setExpandedSection(expandedSection === 'theme' ? null : 'theme')} className="flex justify-between items-center w-full p-3 text-xs font-bold text-slate-300 uppercase">
                    Theme {expandedSection === 'theme' ? <ChevronLeft className="h-3 w-3 -rotate-90" /> : <ChevronRight className="h-3 w-3 -rotate-90" />}
                 </button>
                 {expandedSection === 'theme' && (
                   <div className="p-3 pt-0 text-xs flex flex-col gap-2 text-white">
                      <select 
                        className="bg-slate-800 p-2 rounded w-full"
                        value={activeTheme.id}
                        onChange={(e) => onThemeChange?.(e.target.value)}
                      >
                         {THEMES.map(theme => (
                            <option key={theme.id} value={theme.id}>{theme.name}</option>
                         ))}
                      </select>
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>
      )}

      {/* Slide Arrow Navigation Overlay */}
      <div className="absolute bottom-6 inset-x-6 flex justify-between items-center z-50 pointer-events-none">
        <button
          id="btn-manual-prev"
          aria-label="Previous slide"
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="pointer-events-auto h-11 w-11 rounded-full border border-slate-700/80 bg-slate-900/90 text-slate-300 hover:text-white hover:border-slate-500 focus:outline-none flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-all"
        >
          <MoveLeft className="h-5 w-5" />
        </button>

        {/* Carousel Pagination indicator index indicator */}
        <div className="pointer-events-auto flex gap-3 items-center bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full" id="pager-bullets-container">
          <div className="flex gap-1">
            <button
               onClick={(e) => { e.stopPropagation(); setViewMode('small'); }}
               disabled={viewMode === 'small'}
               title="Small View"
               className="flex items-center justify-center h-6 w-6 text-slate-300 hover:text-white disabled:text-indigo-400 disabled:cursor-not-allowed"
            >
               <Square className="h-4 w-4" />
            </button>
            <button
               onClick={(e) => { e.stopPropagation(); setViewMode('normal'); }}
               disabled={viewMode === 'normal'}
               title="Normal View"
               className="flex items-center justify-center h-6 w-6 text-slate-300 hover:text-white disabled:text-indigo-400 disabled:cursor-not-allowed"
            >
               <Maximize2 className="h-4 w-4" />
            </button>
            <button
               onClick={(e) => { e.stopPropagation(); setViewMode('full'); }}
               disabled={viewMode === 'full'}
               title="Full Screen View"
               className="flex items-center justify-center h-6 w-6 text-slate-300 hover:text-white disabled:text-indigo-400 disabled:cursor-not-allowed"
            >
               <Minimize2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="h-4 w-px bg-slate-700" />
          
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                id={`pager-bullet-${i}`}
                aria-label={`Go to item ${i + 1}`}
                aria-current={activeIndex === i ? 'page' : undefined}
                onClick={(e) => { e.stopPropagation(); onActiveIndexChange(i); }}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  activeIndex === i ? 'w-4 bg-indigo-500' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          id="btn-manual-next"
          aria-label="Next slide"
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="pointer-events-auto h-11 w-11 rounded-full border border-slate-700/80 bg-slate-900/90 text-slate-300 hover:text-white hover:border-slate-500 focus:outline-none flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-all"
        >
          <MoveRight className="h-5 w-5" />
        </button>
      </div>

      {/* Floating Status Label indicating 3D State */}
      <div className="absolute top-4 right-4 bg-black/80 border border-slate-800 px-3 py-1.5 rounded-lg text-[9px] font-mono text-indigo-400 font-extrabold tracking-wider pointer-events-none" id="carousel-status-panel">
        RAD: {angle.toFixed(2)} | ACTIVE: {activeIndex}
      </div>
    </div>
  );
}
