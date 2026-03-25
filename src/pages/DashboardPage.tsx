import { Ticket, Film, Star, TrendingUp, TrendingDown, Calendar, MapPin } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

type TicketData = {
  id: string;
  movieTitle: string;
  date: string;
  time: string;
  cinema: string;
  seats: string;
  status: 'active' | 'cancelled';
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_TICKETS: TicketData[] = [
  {
    id: 'TKT-001',
    movieTitle: 'Dune: Deuxième Partie',
    date: "Aujourd'hui",
    time: '20:30',
    cinema: 'CineStar Grand Rex',
    seats: 'Salle 4 • Rangée G • Siège 12, 13',
    status: 'active',
  },
  {
    id: 'TKT-002',
    movieTitle: 'Le Voyage Interdit',
    date: 'Demain',
    time: '18:15',
    cinema: 'Cinéma Lumière',
    seats: 'Salle 2 • Rangée B • Siège 9, 10',
    status: 'active',
  },
];

const WEEKLY_DATA = [
  { month: 'Jan', thisYear: 4, lastYear: 2 },
  { month: 'Fév', thisYear: 6, lastYear: 4 },
  { month: 'Mar', thisYear: 5, lastYear: 7 },
  { month: 'Avr', thisYear: 10, lastYear: 6 },
  { month: 'Mai', thisYear: 14, lastYear: 9 },
  { month: 'Jun', thisYear: 11, lastYear: 12 },
  { month: 'Jul', thisYear: 13, lastYear: 10 },
];

const GENRE_DATA = [
  { genre: 'Action', count: 12 },
  { genre: 'Drame', count: 8 },
  { genre: 'SF', count: 15 },
  { genre: 'Comédie', count: 6 },
  { genre: 'Horreur', count: 4 },
  { genre: 'Autre', count: 5 },
];

const CINEMA_DATA = [
  { name: 'Grand Rex', value: 42.5, color: '#f59e0b' },
  { name: 'UGC Ciné Cité', value: 28.3, color: '#6366f1' },
  { name: 'Pathé', value: 17.1, color: '#10b981' },
  { name: 'Autre', value: 12.1, color: '#d1d1d8' },
];

const GENRE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#d1d1d8'];

const CHART_TABS = ['Réservations', 'Films vus', 'Dépenses'] as const;
type ChartTab = (typeof CHART_TABS)[number];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  change: number;
  icon: any;
  color: string;
}) {
  const positive = change >= 0;
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5ea] p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#8a8a9a] uppercase tracking-wide">{label}</p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color + '18' }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-semibold text-[#1a1a2e] tracking-tight">{value}</p>
      <div className="flex items-center gap-1.5">
        {positive ? (
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
        )}
        <span
          className={`text-xs font-semibold ${positive ? 'text-emerald-500' : 'text-red-400'}`}
        >
          {positive ? '+' : ''}{change.toFixed(2)}%
        </span>
        <span className="text-xs text-[#c0c0cc]">vs mois dernier</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [activeTab, setActiveTab] = useState<ChartTab>('Réservations');

  const activeTickets = useMemo(() => tickets.filter((t) => t.status === 'active'), [tickets]);

  const stats = [
    { label: 'Billets actifs', value: activeTickets.length, change: 11.01, icon: Ticket, color: '#f59e0b' },
    { label: 'Films vus ce mois', value: 8, change: -0.03, icon: Film, color: '#6366f1' },
    { label: 'Nouvelles sorties', value: 24, change: 15.03, icon: Star, color: '#10b981' },
    { label: 'Séances à venir', value: activeTickets.length, change: 6.08, icon: Calendar, color: '#8b5cf6' },
  ];

  const handleDeleteTicket = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce billet ?')) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a2e] tracking-tight">Vue d'ensemble</h1>
          <p className="text-sm text-[#8a8a9a] mt-0.5">Suivez vos réservations et découvrez les séances à venir.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/settings')}>
            Paramètres
          </Button>
          <Button size="sm" onClick={() => navigate('/')}>
            Réserver un billet
          </Button>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Area chart ── */}
      <div className="bg-white rounded-2xl border border-[#e5e5ea] p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div>
            <div className="flex items-center gap-4 flex-wrap">
              {CHART_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium pb-1 transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'text-[#1a1a2e] border-[#1a1a2e]'
                      : 'text-[#8a8a9a] border-transparent hover:text-[#1a1a2e]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#8a8a9a]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a1a2e] inline-block" />
              Cette année
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-[#c0c0cc] inline-block" />
              Année dernière
            </span>
          </div>
        </div>

        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a1a2e" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#1a1a2e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c0c0cc" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#c0c0cc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f0f0f5" strokeDasharray="4 4" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#8a8a9a', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e5e5ea',
                  borderRadius: 10,
                  fontSize: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                labelStyle={{ color: '#1a1a2e', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="lastYear"
                name="Année dernière"
                stroke="#c0c0cc"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                fill="url(#grad2)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="thisYear"
                name="Cette année"
                stroke="#1a1a2e"
                strokeWidth={2}
                fill="url(#grad1)"
                dot={false}
                activeDot={{ r: 4, fill: '#1a1a2e' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom row: bar chart + donut + tickets ── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Bar chart - Réservations par genre */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e5e5ea] p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-[#1a1a2e]">Réservations par genre</h2>
            <p className="text-xs text-[#8a8a9a] mt-0.5">Nombre de billets selon le genre de film</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GENRE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#f0f0f5" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="genre"
                  tick={{ fill: '#8a8a9a', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: '#8a8a9a', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e5e5ea',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  cursor={{ fill: '#f4f4f6' }}
                />
                <Bar dataKey="count" name="Billets" radius={[5, 5, 0, 0]}>
                  {GENRE_DATA.map((_, i) => (
                    <Cell key={i} fill={GENRE_COLORS[i % GENRE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut chart - Cinémas favoris */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#e5e5ea] p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-[#1a1a2e]">Cinémas favoris</h2>
            <p className="text-xs text-[#8a8a9a] mt-0.5">Fréquence de visite</p>
          </div>
          <div className="h-36 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CINEMA_DATA}
                  cx="40%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={62}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {CINEMA_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={7}
                  formatter={(value, entry: any) => (
                    <span style={{ color: '#1a1a2e', fontSize: 11 }}>
                      {value}{' '}
                      <span style={{ color: '#8a8a9a' }}>{entry?.payload?.value}%</span>
                    </span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e5e5ea',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  formatter={(val) => [`${val}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming tickets */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#e5e5ea] p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#1a1a2e]">Prochaines réservations</h2>
              <p className="text-xs text-[#8a8a9a] mt-0.5">D'un coup d'œil</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-xs font-medium text-amber-500 hover:text-amber-600 transition-colors"
            >
              + Nouvelle
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-auto">
            {activeTickets.length ? (
              activeTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-[#f0f0f5] bg-[#fafafa] hover:border-amber-200 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-amber-500 mb-0.5">
                      {ticket.date} · {ticket.time}
                    </p>
                    <p className="text-sm font-semibold text-[#1a1a2e] truncate">{ticket.movieTitle}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#c0c0cc] flex-shrink-0" />
                      <p className="text-xs text-[#8a8a9a] truncate">{ticket.cinema}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="flex-shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-[#e5e5ea] text-[#8a8a9a] hover:border-red-200 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-[#e5e5ea] p-6">
                <p className="text-xs text-[#8a8a9a] text-center">
                  Aucune réservation active.<br />Réservez votre prochain film !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}