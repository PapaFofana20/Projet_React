import { motion } from 'framer-motion';

interface ActivityChartProps {
  data: number[];
  labels: string[];
  color?: string;
}

export default function ActivityChart({
  data,
  labels,
  color = "#E50914"
}: ActivityChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const height = 200;
  const width = 600;
  const padding = 40;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;
  const areaData = `${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div className="w-full bg-dark-800 rounded-3xl p-8 border border-dark-700">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold uppercase tracking-tighter italic">Activité des Réservations</h3>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-brand-500" />
             <span>Cette année</span>
           </div>
           <div className="flex items-center gap-2 text-gray-600">
             <div className="w-2 h-2 rounded-full bg-gray-700" />
             <span>L'an dernier</span>
           </div>
        </div>
      </div>

      <div className="relative h-[240px] w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (height - 2 * padding)) / 3}
              x2={width - padding}
              y2={padding + (i * (height - 2 * padding)) / 3}
              stroke="#333"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          <motion.path
            d={areaData}
            fill={`url(#gradient-${color.replace('#', '')})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1.5 }}
          />

          <motion.path
            d={pathData}
            fill="transparent"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {points.map((p, i) => {
            const [x, y] = p.split(',');
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                stroke="#141414"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                whileHover={{ scale: 1.5 }}
              />
            );
          })}

          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-[40px] text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none">
          {labels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
