import { motion } from 'framer-motion';

interface CircularChartProps {
  value: number;
  total: number;
  label: string;
  subLabel?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export default function CircularChart({
  value,
  total,
  label,
  subLabel,
  color = "#E50914",
  size = 120,
  strokeWidth = 10,
}: CircularChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / total) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-dark-700"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">{Math.round(percentage)}%</span>
          {subLabel && <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{subLabel}</span>}
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-gray-300">{label}</span>
    </div>
  );
}

interface MultiDoughnutProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
}

export function MultiDoughnut({
  data,
  size = 160,
  strokeWidth = 15,
  centerLabel
}: MultiDoughnutProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  let currentOffset = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeOffset = circumference - (percentage / 100) * circumference;
            const animationOffset = currentOffset;
            currentOffset += (percentage / 100) * circumference;

            return (
              <motion.circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                style={{ 
                   transformOrigin: 'center',
                   transform: `rotate(${(animationOffset / circumference) * 360}deg)` 
                }}
                transition={{ duration: 1, delay: 0.2 * index }}
              />
            );
          })}
        </svg>
        {centerLabel && (
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <span className="text-sm font-bold leading-tight">{centerLabel}</span>
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-400 truncate">{item.label} ({Math.round((item.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
