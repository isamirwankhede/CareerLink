import { TrendingUp } from 'lucide-react';

const DashboardCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="card group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(135deg, ${stat.from}10, ${stat.to}10)` }} />

          <div className="relative">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
              style={{ background: `linear-gradient(135deg, ${stat.from}, ${stat.to})` }}
            >
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
            {stat.change !== undefined && (
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                <TrendingUp size={11} /> {stat.change}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
