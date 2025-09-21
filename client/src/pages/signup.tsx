import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertUserSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

type SignupForm = {
  username: string;
  homeGymId: string;
  awayGymIds: string[];
};

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [selectedAwayGyms, setSelectedAwayGyms] = useState<string[]>([]);

  const { data: gymsData } = useQuery({
    queryKey: ["/api/gyms"],
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignupForm>({
    resolver: zodResolver(insertUserSchema),
    mode: "onChange",
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await apiRequest("POST", "/api/signup", data);
      return response.json();
    },
    onSuccess: (data) => {
      setMessage({
        type: 'success',
        text: `Welcome to RatFit, ${data.user.username}!`
      });
      localStorage.setItem("currentUser", data.user.username);
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    },
    onError: (error: any) => {
      setMessage({
        type: 'error',
        text: error.message || "Something went wrong. Please try again."
      });
    },
  });

  const handleAwayGymToggle = (gymId: string) => {
    setSelectedAwayGyms(prev => 
      prev.includes(gymId) 
        ? prev.filter(id => id !== gymId)
        : [...prev, gymId]
    );
  };

  const onSubmit = (data: SignupForm) => {
    const submissionData = {
      ...data,
      awayGymIds: selectedAwayGyms
    };
    signupMutation.mutate(submissionData);
  };

  return (
    <div className="google-container">
      <div className="google-card">
        {/* Logo */}
        <div className="logo text-center">
          <div className="logo-icon">RF</div>
          <div className="logo-text">RatFit</div>
        </div>

        {/* Header */}
        <h1 className="google-title">Create your account</h1>
        <p className="google-subtitle">Join RatFit and start your fitness journey</p>

        {/* Message */}
        {message && (
          <div className={`mb-16 py-6 text-center ${message.type === 'error' ? 'error' : ''}`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="google-form">
          <div className="google-input-group">
            <label htmlFor="username" className="google-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="google-input"
              placeholder="Enter your username"
              {...register("username")}
              data-testid="input-username"
            />
            {errors.username && (
              <div className="error" style={{ fontSize: '14px', marginTop: '4px' }}>
                {errors.username.message}
              </div>
            )}
          </div>

          <div className="google-input-group">
            <label htmlFor="homeGymId" className="google-label">
              Home Gym
            </label>
            <select
              id="homeGymId"
              className="google-select"
              {...register("homeGymId")}
              data-testid="select-home-gym"
            >
              <option value="">Select your home gym</option>
              {gymsData?.gyms?.map((gym: any) => (
                <option key={gym.id} value={gym.id}>
                  {gym.name} - {gym.location}
                </option>
              ))}
            </select>
            {errors.homeGymId && (
              <div className="error" style={{ fontSize: '14px', marginTop: '4px' }}>
                {errors.homeGymId.message}
              </div>
            )}
          </div>

          <div className="google-input-group">
            <label className="google-label">
              Away Gyms (optional)
            </label>
            <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '12px' }}>
              Select additional gyms you can visit (you can choose multiple)
            </p>
            <div className="checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              {gymsData?.gyms?.filter((gym: any) => gym.id !== watch("homeGymId")).map((gym: any) => (
                <label 
                  key={gym.id} 
                  className="checkbox-label"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    border: '1px solid #dadce0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedAwayGyms.includes(gym.id) ? '#f8f9ff' : 'white',
                    borderColor: selectedAwayGyms.includes(gym.id) ? '#4285f4' : '#dadce0',
                    transition: 'all 0.2s ease'
                  }}
                  data-testid={`checkbox-away-gym-${gym.id}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAwayGyms.includes(gym.id)}
                    onChange={() => handleAwayGymToggle(gym.id)}
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '12px',
                      accentColor: '#4285f4'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#202124' }}>{gym.name}</div>
                    <div style={{ fontSize: '12px', color: '#5f6368' }}>{gym.location}</div>
                    {gym.isRatFitAssured && (
                      <div 
                        className="badge badge-assured" 
                        style={{ 
                          display: 'inline-block', 
                          marginTop: '4px', 
                          fontSize: '10px',
                          backgroundColor: '#34a853',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '12px'
                        }}
                      >
                        RatFit Assured
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {selectedAwayGyms.length > 0 && (
              <div style={{ fontSize: '12px', color: '#4285f4', marginTop: '8px' }}>
                {selectedAwayGyms.length} away gym{selectedAwayGyms.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          <button
            type="submit"
            className="google-button"
            disabled={signupMutation.isPending || !isValid}
            data-testid="button-signup"
          >
            {signupMutation.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-24" style={{ fontSize: '14px', color: '#5f6368' }}>
          Already have an account? Sign in to continue
        </div>
      </div>
    </div>
  );
}