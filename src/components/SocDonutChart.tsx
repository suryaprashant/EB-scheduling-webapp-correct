import React from 'react';

interface SocDonutChartProps {
  title: string;
  socValue: number;
  color: string;
  subtitle?: string;
  size?: number;
}

export const SocDonutChart: React.FC<SocDonutChartProps> = ({
  title,
  socValue,
  color,
  subtitle = 'SOC',
  size = 140,
}) => {
  const clamped = Math.max(0, Math.min(100, socValue));
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center flex-1">
      <h4 className="text-xs font-bold text-gray-700 tracking-wide uppercase mb-3 text-center">
        {title}
      </h4>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8E4"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-[#183129]">
            {clamped.toFixed(2)}%
          </span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};
