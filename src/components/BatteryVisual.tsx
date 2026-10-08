import React from 'react';
import { Zap } from 'lucide-react';

export interface BatteryVisualProps {
  soc: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showPercentage?: boolean;
  isCharging?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const BatteryVisual: React.FC<BatteryVisualProps> = ({
  soc,
  size = 'md',
  showPercentage = false,
  isCharging = false,
  orientation = 'horizontal',
  className = '',
}) => {
  const clampedSoc = Math.max(0, Math.min(100, Math.round(soc * 100) / 100));

  // Determine color scheme based on SOC
  const getColorScheme = () => {
    if (clampedSoc < 20) {
      return {
        bg: 'from-rose-500 to-red-600',
        glow: 'rgba(239, 68, 68, 0.4)',
        border: 'border-red-400',
        text: 'text-red-700',
        badgeBg: 'bg-red-50 text-red-700 border-red-200',
        pulseGlow: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]',
      };
    }
    if (clampedSoc < 50) {
      return {
        bg: 'from-amber-400 to-amber-500',
        glow: 'rgba(245, 158, 11, 0.4)',
        border: 'border-amber-400',
        text: 'text-[#9A6517]',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        pulseGlow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
      };
    }
    return {
      bg: 'from-emerald-400 via-emerald-500 to-[#1A6B52]',
      glow: 'rgba(16, 185, 129, 0.4)',
      border: 'border-emerald-500',
      text: 'text-[#1A6B52]',
      badgeBg: 'bg-emerald-50 text-[#1A6B52] border-emerald-200',
      pulseGlow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    };
  };

  const scheme = getColorScheme();

  if (orientation === 'vertical') {
    // Vertical high-tech battery pack module
    const heightMap = {
      xs: { h: 'h-14', w: 'w-7', terminal: 'w-3 h-1', bars: 4 },
      sm: { h: 'h-20', w: 'w-10', terminal: 'w-4 h-1.5', bars: 5 },
      md: { h: 'h-28', w: 'w-14', terminal: 'w-6 h-2', bars: 5 },
      lg: { h: 'h-36', w: 'w-18', terminal: 'w-8 h-2.5', bars: 6 },
      hero: { h: 'h-44', w: 'w-22', terminal: 'w-10 h-3', bars: 6 },
    }[size];

    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        {/* Terminal tip */}
        <div
          className={`${heightMap.terminal} rounded-t-sm bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 shadow-xs border border-b-0 border-gray-400`}
        />
        {/* Battery Main Shell */}
        <div
          className={`relative ${heightMap.h} ${heightMap.w} rounded-xl p-1 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-2 border-gray-700 shadow-lg flex flex-col justify-end overflow-hidden`}
        >
          {/* Subtle interior glossy glass highlight */}
          <div className="absolute inset-y-0 left-1 w-1/3 bg-gradient-to-r from-white/20 to-transparent pointer-events-none rounded-l-lg z-10" />

          {/* Cell Grid Guidelines */}
          <div className="absolute inset-x-1 inset-y-1 flex flex-col justify-between pointer-events-none z-10 opacity-30">
            {Array.from({ length: heightMap.bars }).map((_, i) => (
              <div key={i} className="w-full h-px bg-white/40" />
            ))}
          </div>

          {/* Liquid Fill Level */}
          <div
            className={`w-full rounded-lg bg-gradient-to-t ${scheme.bg} transition-all duration-700 relative overflow-hidden ${
              isCharging ? 'animate-pulse' : ''
            }`}
            style={{ height: `${clampedSoc}%` }}
          >
            {/* Top liquid surface glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-white/70 shadow-xs" />
            {isCharging && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white drop-shadow animate-bounce" />
              </div>
            )}
          </div>

          {/* Charge bolt watermark */}
          {!isCharging && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <Zap className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {showPercentage && (
          <span className={`text-xs font-bold mt-1.5 ${scheme.text}`}>
            {clampedSoc.toFixed(1)}%
          </span>
        )}
      </div>
    );
  }

  // Horizontal Battery (Default)
  const sizeConfig = {
    xs: { h: 'h-3.5', w: 'w-7', terminal: 'w-1 h-2', padding: 'p-0.5', text: 'text-[10px]' },
    sm: { h: 'h-5', w: 'w-10', terminal: 'w-1.5 h-3', padding: 'p-0.5', text: 'text-xs' },
    md: { h: 'h-7', w: 'w-16', terminal: 'w-2 h-4', padding: 'p-1', text: 'text-xs' },
    lg: { h: 'h-10', w: 'w-24', terminal: 'w-2.5 h-6', padding: 'p-1.5', text: 'text-sm' },
    hero: { h: 'h-12', w: 'w-32', terminal: 'w-3 h-7', padding: 'p-1.5', text: 'text-base' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="relative inline-flex items-center">
        {/* Main Battery Casing */}
        <div
          className={`relative ${sizeConfig.h} ${sizeConfig.w} ${sizeConfig.padding} rounded-lg bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-2 border-gray-700 shadow-md overflow-hidden flex items-center`}
        >
          {/* Glass reflection gradient highlight */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-sm z-10" />

          {/* Internal Fill Level */}
          <div
            className={`h-full rounded-sm bg-gradient-to-r ${scheme.bg} transition-all duration-700 relative overflow-hidden flex items-center justify-end ${
              isCharging ? 'animate-pulse' : ''
            }`}
            style={{ width: `${Math.max(clampedSoc > 0 ? 5 : 0, clampedSoc)}%` }}
          >
            {/* Energy wavefront highlight */}
            <div className="h-full w-1 bg-white/70 shadow-xs" />
          </div>

          {/* Charging Indicator Icon */}
          {isCharging && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Zap className="h-3 w-3 text-white fill-white drop-shadow-md animate-pulse" />
            </div>
          )}
        </div>

        {/* Cathode terminal notch */}
        <div
          className={`${sizeConfig.terminal} rounded-r-xs bg-gradient-to-r from-gray-400 to-gray-500 border border-l-0 border-gray-600`}
        />
      </div>

      {showPercentage && (
        <span className={`font-extrabold ${sizeConfig.text} ${scheme.text}`}>
          {clampedSoc.toFixed(1)}%
        </span>
      )}
    </div>
  );
};

export interface BatteryCardPictureProps {
  title: string;
  soc: number;
  subtitle?: string;
  isDeparture?: boolean;
  gain?: number | null;
}

export const BatteryCardPicture: React.FC<BatteryCardPictureProps> = ({
  title,
  soc,
  subtitle = 'State of Charge',
  isDeparture = false,
  gain = null,
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(soc * 100) / 100));

  // Determine state badge
  const isHigh = clamped >= 75;
  const isLow = clamped < 25;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between flex-1 relative overflow-hidden transition-all hover:shadow-md">
      {/* Decorative background glow */}
      <div
        className={`absolute -right-8 -bottom-8 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
          isDeparture
            ? 'bg-emerald-100/60'
            : isLow
              ? 'bg-red-100/60'
              : 'bg-amber-100/60'
        }`}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3 z-10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            {subtitle}
          </span>
          <h4 className="text-sm font-extrabold text-gray-900">{title}</h4>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
            isDeparture
              ? 'bg-emerald-50 text-[#1A6B52] border-emerald-200'
              : isLow
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-amber-50 text-[#9A6517] border-amber-200'
          }`}
        >
          {isDeparture ? (
            <>
              <Zap className="w-3 h-3 text-[#1A6B52] fill-current animate-pulse" />
              Fast Charged
            </>
          ) : isLow ? (
            'Low Battery'
          ) : (
            'Arrival State'
          )}
        </span>
      </div>

      {/* Visual Battery Section */}
      <div className="py-2 flex items-center justify-between gap-4 z-10">
        {/* Render 3D EV Battery Pack Image */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 group">
          <img
            src={
              isDeparture
                ? '/src/assets/images/battery_charge_3d_1791434765547.jpg'
                : '/src/assets/images/ev_battery_pack_1791434747815.jpg'
            }
            alt={`${title} Battery Graphic`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[9px] font-bold text-white drop-shadow">
            <span>{isDeparture ? '240 kW' : '360 kWh'}</span>
            <span>{clamped.toFixed(0)}%</span>
          </div>
        </div>

        {/* Dynamic Battery Level Gauge & Metrics */}
        <div className="flex-1 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              {clamped.toFixed(2)}
              <span className="text-sm font-semibold text-gray-500 ml-0.5">%</span>
            </span>
            {gain !== null && gain > 0 && (
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                +{gain.toFixed(2)}% gain
              </span>
            )}
          </div>

          {/* Interactive Horizontal Battery Bar */}
          <BatteryVisual
            soc={clamped}
            size="md"
            isCharging={isDeparture}
            orientation="horizontal"
            className="w-full"
          />

          <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 z-10">
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A6B52]" />
          Capacity: {(360 * (clamped / 100)).toFixed(1)} / 360 kWh
        </span>
        <span className="font-semibold text-gray-700">
          {clamped >= 80 ? 'Optimal' : clamped >= 40 ? 'Adequate' : 'Needs Charge'}
        </span>
      </div>
    </div>
  );
};
