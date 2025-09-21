import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState("");
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
      setMessage({
        type: 'success',
        text: `Check-in successful at ${userData?.homeGym?.name}! 🔥`
      });
      setStreakAnimation(true);
      setTimeout(() => setStreakAnimation(false), 800);
      setTimeout(() => setMessage(null), 3000);
      queryClient.invalidateQueries({ queryKey: ["/api/user", currentUser] });
    },
    onError: (error: any) => {
      setMessage({
        type: 'error',
        text: error.message || "Check-in failed. Please try again."
      });
      setTimeout(() => setMessage(null), 5000);
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
      setMessage({
        type: 'success',
        text: `Session booked at ${userData?.awayGym?.name} for ${selectedDate}!`
      });
      setSelectedDate("");
      setTimeout(() => setMessage(null), 3000);
      queryClient.invalidateQueries({ queryKey: ["/api/user", currentUser] });
    },
    onError: (error: any) => {
      setMessage({
        type: 'error',
        text: error.message || "Booking failed. Please try again."
      });
      setTimeout(() => setMessage(null), 5000);
    },
  });

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="loading">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="error">User not found. Please sign up first.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 style={{ fontSize: '32px', fontWeight: '400', color: '#202124', marginBottom: '8px' }}>
            Welcome back, {userData.user.username}!
          </h1>
          <p style={{ fontSize: '16px', color: '#5f6368' }}>Ready for your workout?</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`card mb-16 text-center ${message.type === 'error' ? 'error' : ''}`} style={{ padding: '16px' }}>
            {message.text}
          </div>
        )}

        {/* Streak Counter */}
        <div className="streak-container">
          <div className={`streak-emoji ${streakAnimation ? 'confetti-animation' : ''}`} data-testid="streak-emoji">
            🔥
          </div>
          <div>
            <div className="streak-number" data-testid="streak-count">
              {userData.user.streak}
            </div>
            <div className="streak-label">Day Streak</div>
          </div>
        </div>

        {/* Gym Actions */}
        <div className="gym-actions">
          {/* Home Gym Check-in */}
          <div className="gym-card">
            <div className="gym-header">
              <div className="gym-icon home">🏠</div>
              <div className="gym-info">
                <h3>{userData.homeGym?.name}</h3>
                <p>Your home gym</p>
              </div>
            </div>
            <button
              onClick={() => checkinMutation.mutate()}
              disabled={checkinMutation.isPending}
              className="google-button google-button-secondary"
              style={{ width: '100%' }}
              data-testid="button-checkin"
            >
              {checkinMutation.isPending ? "Checking in..." : "Check In"}
            </button>
          </div>

          {/* Away Gym Booking */}
          <div className="gym-card">
            <div className="gym-header">
              <div className="gym-icon away">✈️</div>
              <div className="gym-info">
                <h3>{userData.awayGym?.name}</h3>
                <p>Your away gym</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="google-input"
                data-testid="input-booking-date"
              />
              <button
                onClick={() => bookingMutation.mutate()}
                disabled={bookingMutation.isPending || !selectedDate}
                className="google-button"
                style={{ width: '100%' }}
                data-testid="button-book-session"
              >
                {bookingMutation.isPending ? "Booking..." : "Book Session"}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
          </div>
          <div className="card-content">
            {userData.recentActivity?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {userData.recentActivity.map((activity: any, index: number) => (
                  <div 
                    key={activity.id} 
                    className="flex flex-gap py-6" 
                    data-testid={`activity-${index}`}
                    style={{ borderBottom: index < userData.recentActivity.length - 1 ? '1px solid #f1f3f4' : 'none' }}
                  >
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      background: '#34a853', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px'
                    }}>
                      ✓
                    </div>
                    <div style={{ flex: '1' }}>
                      <p style={{ fontSize: '14px', color: '#202124', margin: '0 0 4px 0' }}>
                        Checked in at {userData.homeGym?.name || userData.awayGym?.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#5f6368', margin: '0' }}>
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center" style={{ color: '#5f6368', padding: '24px' }}>
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}