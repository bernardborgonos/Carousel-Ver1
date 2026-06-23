export type ViewMode = 'small' | 'normal' | 'full';

export interface CarouselItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  color: string;
  isNavigation?: boolean; // New property
  urlLink?: string; // New property
}

export interface Theme {
  id: string;
  name: string;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  backgroundEffect: 'gradient' | 'noise' | 'solid' | 'mesh';
  backgroundImage?: string;
  cardStyle: string;
}

export interface UNIT2CCacouselOptions {
  width: number; // item width
  height: number; // item height
  perspective: number; // 3d perspective depth
  xRadius: number; // horizontal radius of orbit
  yRadius: number; // vertical radius of orbit (slant)
  zRadius: number; // depth radius of orbit
  tilt: number; // orbit tilt angle (degrees)
  xRotation: number; // item X rotation
  yRotation: number; // item Y rotation
  zRotation: number; // item Z rotation
  infinite: boolean; // loop items
  autoSlideshow: boolean; // autoplay
  autoSlideshowDelay: number; // autoplay delay
  autoSlideshowDirection: 'left' | 'right'; // autoplay direction
  swipe: boolean; // swipe support
  drag: boolean; // drag support
  reflection: boolean; // enable reflection
  reflectionHeight: number; // reflection height (%)
  reflectionOpacity: number; // reflection opacity (0-1)
  shadow: boolean; // floor shadow
  shadowOpacity: number; // shadow opacity (0-1)
  zDepthFade: boolean; // darken background items
  itemClickToFocus: boolean; // click item to rotate to it
  backgroundImageOpacity: number; // background opacity (0-1)
  overlayColor: string; // Background tint color
  overlayOpacity: number; // Background tint opacity (0-1)
  autoPlaySpeed: number; // seconds
}

export interface TokenStats {
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  costRateInput: number; // cost per 1M tokens
  costRateOutput: number; // cost per 1M tokens
  costRateCached: number; // cost per 1M tokens
}

export interface TestSuiteResult {
  fps: number;
  dragLatency: number; // ms
  convergenceScore: number; // 0-100
  apiCompliance: number; // 0-100
  overallRating: number; // ⭐ stars
}
