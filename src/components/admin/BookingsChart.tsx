import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BookingsChartProps {
  bookings: any[];
}

export default function BookingsChart({ bookings }: BookingsChartProps) {
  const data = useMemo(() => {
    const days: { [key: string]: number } = {};
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      last7Days.push(key);
      days[key] = 0;
    }
    
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const key = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      if (days[key] !== undefined) {
        days[key]++;
      }
    });
    
    return last7Days.map(day => ({
      name: day,
      réservations: days[day] || 0
    }));
  }, [bookings]);

  return (
    <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-red-500" />
        Réservations des 7 Derniers Jours
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Bar dataKey="réservations" fill="#E50914" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
