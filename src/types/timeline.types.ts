export interface TimelineEvent {
  year: number;
  title: string;
  description?: string;
}

export interface TimelinePeriod {
  id: number;
  title: string;
  yearStart: number;
  yearEnd: number;
  events: TimelineEvent[];
}

export interface TimelineConfig {
  periods: TimelinePeriod[];
  initialPeriod?: number;
  circleRadius?: number;
  animationDuration?: number;
  enableKeyboardNavigation?: boolean;
  swiperConfig?: any;
}

export interface CirclePoint {
  id: number;
  x: number;
  y: number;
  angle: number;
  period: TimelinePeriod;
}