import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp, Droplets, Leaf, AlertTriangle } from 'lucide-react';
import { useFieldsStore, usePlantsStore } from '../../../stores';
import styles from './ReportsPage.module.css';

export function ReportsPage() {
  const { fields } = useFieldsStore();
  const { plants } = usePlantsStore();

  // Calculate stats for charts
  const plantsByField = fields.map((field) => ({
    name: field.name.length > 15 ? field.name.slice(0, 15) + '...' : field.name,
    plants: plants.filter((p) => p.fieldId === field.id).reduce((sum, p) => sum + p.quantity, 0),
  }));

  const wateringStatusData = [
    { name: 'Watered', value: plants.filter((p) => p.wateringStatus === 'watered').length, color: '#22c55e' },
    { name: 'Due Soon', value: plants.filter((p) => p.wateringStatus === 'due_soon').length, color: '#f59e0b' },
    { name: 'Overdue', value: plants.filter((p) => p.wateringStatus === 'overdue').length, color: '#f97316' },
    { name: 'Critical', value: plants.filter((p) => p.wateringStatus === 'critical').length, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const healthStatusData = [
    { name: 'Healthy', value: plants.filter((p) => p.healthStatus === 'healthy').length, color: '#22c55e' },
    { name: 'Observation', value: plants.filter((p) => p.healthStatus === 'observation').length, color: '#f59e0b' },
    { name: 'Sick', value: plants.filter((p) => p.healthStatus === 'sick').length, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  // Mock weekly watering data
  const weeklyWatering = [
    { day: 'Mon', waterings: 12 },
    { day: 'Tue', waterings: 8 },
    { day: 'Wed', waterings: 15 },
    { day: 'Thu', waterings: 10 },
    { day: 'Fri', waterings: 18 },
    { day: 'Sat', waterings: 6 },
    { day: 'Sun', waterings: 4 },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Farm Reports</h2>
        <button className={styles.exportBtn}>
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'rgba(45, 90, 39, 0.2)', color: '#2D5A27' }}>
            <Leaf size={20} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Total Plants</span>
            <span className={styles.summaryValue}>
              {plants.reduce((sum, p) => sum + p.quantity, 0)}
            </span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
            <Droplets size={20} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Waterings This Week</span>
            <span className={styles.summaryValue}>73</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
            <TrendingUp size={20} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Healthy Plants</span>
            <span className={styles.summaryValue}>
              {Math.round((plants.filter((p) => p.healthStatus === 'healthy').length / plants.length) * 100) || 0}%
            </span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
            <AlertTriangle size={20} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Plants with Issues</span>
            <span className={styles.summaryValue}>
              {plants.filter((p) => p.healthStatus !== 'healthy').length}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Plants by Field */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Plants by Field</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={plantsByField}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                />
                <Bar dataKey="plants" fill="#8B5A2B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watering Status */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Watering Status</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={wateringStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {wateringStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.chartLegend}>
              {wateringStatusData.map((entry) => (
                <div key={entry.name} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: entry.color }} />
                  <span>{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Watering */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Weekly Watering Activity</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyWatering}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="waterings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Status */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Plant Health Status</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={healthStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.chartLegend}>
              {healthStatusData.map((entry) => (
                <div key={entry.name} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: entry.color }} />
                  <span>{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
