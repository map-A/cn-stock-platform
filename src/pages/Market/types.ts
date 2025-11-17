export type ChartType = 
  | 'bars'
  | 'candles'
  | 'hollow_candles'
  | 'volume_candles'
  | 'line'
  | 'line_with_markers'
  | 'step_line'
  | 'area'
  | 'hlc_area'
  | 'baseline'
  | 'column'
  | 'hi_lo'
  | 'heikinashi';

export type { CandleData } from './utils/mockData';
