import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function GymDashboardPage() {
  const { data: gymsData, isLoading } = useQuery({
    queryKey: ["/api/gyms"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">Loading gym data...</div>
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
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gym Dashboard</h1>
          <p className="text-muted-foreground">Analytics and insights for gym partners</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-total-checkins">
                {gymsData?.stats?.totalCheckins || 0}
              </div>
              <p className="text-muted-foreground">Total Check-ins</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-secondary mb-2" data-testid="stat-active-users">
                {gymsData?.stats?.activeUsers || 0}
              </div>
              <p className="text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-accent mb-2" data-testid="stat-total-revenue">
                ${gymsData?.stats?.totalRevenue || 0}
              </div>
              <p className="text-muted-foreground">Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card>
          <CardHeader>
            <CardTitle>Check-ins by Gym</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                  <Bar dataKey="checkins" fill="hsl(213 94% 68%)" name="checkins" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gym List */}
        <Card>
          <CardHeader>
            <CardTitle>Gym Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">Gym Name</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Check-ins</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gymsData?.gyms?.map((gym: any) => (
                    <tr 
                      key={gym.id} 
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                      data-testid={`gym-row-${gym.id}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {gym.name.split(' ').map((word: string) => word[0]).join('').substring(0, 2)}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">{gym.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground" data-testid={`gym-checkins-${gym.id}`}>
                        {gym.checkins}
                      </td>
                      <td className="py-3 px-4 text-foreground" data-testid={`gym-revenue-${gym.id}`}>
                        ${gym.revenue}
                      </td>
                      <td className="py-3 px-4">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            gym.isRatFitAssured 
                              ? 'bg-accent text-accent-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
