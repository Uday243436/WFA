import * as Icons from 'lucide-react';

export interface KpiCardModel {
  id: string;
  title: string;
  value: string | number;
  changePercentage: string;
  changeDirection: 'up' | 'down' | 'neutral';
  timeframe: string;
  iconName: keyof typeof Icons;
  colorTheme?: string;
}
