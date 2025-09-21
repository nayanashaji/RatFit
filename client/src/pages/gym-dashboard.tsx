import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function GymDashboardPage() {
  const { data: gymsData, isLoading } = useQuery({
    queryKey: ["/api/gyms"],
  });

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="loading">Loading gym data...</div>
        </div>
      </div>
    );
  }

  const chartData = gymsData?.gyms?.map((gym: any) => ({
    name: gym.name.split(' ')[0], // Shortened name for chart
    checkins: gym.checkins,
    revenue: gym.revenue / 100, // Convert to hundreds for better visualization
  })) || [];

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="text-center mb-16">
          <h1 style={{ fontSize: '32px', fontWeight: '400', color: '#202124', marginBottom: '8px' }}>
            Gym Dashboard
          </h1>
          <p style={{ fontSize: '16px', color: '#5f6368' }}>
            Analytics and insights for gym partners
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-3" style={{ marginBottom: '24px' }}>
          <div className="card text-center">
            <div className="card-content">
              <div 
                style={{ fontSize: '32px', fontWeight: '700', color: '#4285f4', marginBottom: '8px' }}
                data-testid="stat-total-checkins"
              >
                {gymsData?.stats?.totalCheckins || 0}
              </div>
              <p style={{ color: '#5f6368', margin: '0' }}>Total Check-ins</p>
            </div>
          </div>
          <div className="card text-center">
            <div className="card-content">
              <div 
                style={{ fontSize: '32px', fontWeight: '700', color: '#34a853', marginBottom: '8px' }}
                data-testid="stat-active-users"
              >
                {gymsData?.stats?.activeUsers || 0}
              </div>
              <p style={{ color: '#5f6368', margin: '0' }}>Active Users</p>
            </div>
          </div>
          <div className="card text-center">
            <div className="card-content">
              <div 
                style={{ fontSize: '32px', fontWeight: '700', color: '#fbbc04', marginBottom: '8px' }}
                data-testid="stat-total-revenue"
              >
                ${gymsData?.stats?.totalRevenue || 0}
              </div>
              <p style={{ color: '#5f6368', margin: '0' }}>Revenue</p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h2 className="card-title">Check-ins by Gym</h2>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => `${label}`}
                    formatter={(value, name) => [
                      name === 'checkins' ? value : `$${(value as number) * 100}`,
                      name === 'checkins' ? 'Check-ins' : 'Revenue'
                    ]}
                  />
                  <Bar dataKey="checkins" fill="#4285f4" name="checkins" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gym List */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Gym Performance</h2>
          </div>
          <div className="card-content">
            <div className="table-container">
              <table className="google-table">
                <thead>
                  <tr>
                    <th>Gym Name</th>
                    <th>Check-ins</th>
                    <th>Revenue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gymsData?.gyms?.map((gym: any) => (
                    <tr 
                      key={gym.id} 
                      data-testid={`gym-row-${gym.id}`}
                    >
                      <td>
                        <div className="flex flex-gap">
                          <div 
                            style={{
                              width: '32px',
                              height: '32px',
                              background: '#4285f4',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '700'
                            }}
                          >
                            {gym.name.split(' ').map((word: string) => word[0]).join('').substring(0, 2)}
                          </div>
                          <span style={{ fontWeight: '500', color: '#202124' }}>{gym.name}</span>
                        </div>
                      </td>
                      <td data-testid={`gym-checkins-${gym.id}`}>
                        {gym.checkins}
                      </td>
                      <td data-testid={`gym-revenue-${gym.id}`}>
                        ${gym.revenue}
                      </td>
                      <td>
                        <span 
                          className={`badge ${gym.isRatFitAssured ? 'badge-assured' : 'badge-standard'}`}
                          data-testid={`gym-status-${gym.id}`}
                        >
                          {gym.isRatFitAssured ? 'RatFit Assured' : 'Standard'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}