import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState("");
  const [streakAnimation, setStreakAnimation] = useState(false);

  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["/api/user", currentUser],
    enabled: !!currentUser,
  });

  const checkinMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/checkin", {
        userId: userData?.user?.id,
        gymId: userData?.user?.homeGymId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Check-in Successful!",
        description: `Welcome to ${userData?.homeGym?.name}`,
      });
      setStreakAnimation(true);
      setTimeout(() => setStreakAnimation(false), 800);
      queryClient.invalidateQueries({ queryKey: ["/api/user", currentUser] });
    },
    onError: (error: any) => {
      toast({
        title: "Check-in Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/book", {
        userId: userData?.user?.id,
        gymId: userData?.user?.awayGymId,
        date: selectedDate,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful!",
        description: `Session booked at ${userData?.awayGym?.name} for ${selectedDate}`,
      });
      setSelectedDate("");
      queryClient.invalidateQueries({ queryKey: ["/api/user", currentUser] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-muted py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userData.user.username}!
          </h1>
          <p className="text-muted-foreground">Ready for your workout?</p>
        </div>

        {/* Streak Counter */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span 
                className={`text-4xl ${streakAnimation ? 'confetti-animation' : ''}`}
                data-testid="streak-emoji"
              >
                🔥
              </span>
              <div>
                <h3 className="text-2xl font-bold text-foreground" data-testid="streak-count">
                  {userData.user.streak}
                </h3>
                <p className="text-muted-foreground">Day Streak</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Keep it up! You're on fire!</p>
          </CardContent>
        </Card>

        {/* Gym Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Home Gym Check-in */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🏠</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {userData.homeGym?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Your home gym</p>
                </div>
              </div>
              <Button
                onClick={() => checkinMutation.mutate()}
                disabled={checkinMutation.isPending}
                className="w-full bg-secondary text-secondary-foreground floating-action hover:bg-secondary/90"
                data-testid="button-checkin"
              >
                {checkinMutation.isPending ? "Checking in..." : "Check In"}
              </Button>
            </CardContent>
          </Card>

          {/* Away Gym Booking */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✈️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {userData.awayGym?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Your away gym</p>
                </div>
              </div>
              <div className="space-y-3">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  data-testid="input-booking-date"
                />
                <Button
                  onClick={() => bookingMutation.mutate()}
                  disabled={bookingMutation.isPending || !selectedDate}
                  className="w-full floating-action"
                  data-testid="button-book-session"
                >
                  {bookingMutation.isPending ? "Booking..." : "Book Session"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userData.recentActivity?.length > 0 ? (
                userData.recentActivity.map((activity: any, index: number) => (
                  <div key={activity.id} className="flex items-center space-x-3 py-2" data-testid={`activity-${index}`}>
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        Checked in at {userData.homeGym?.name || userData.awayGym?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
