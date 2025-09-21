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
  awayGymId: string;
};

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  const onSubmit = (data: SignupForm) => {
    signupMutation.mutate(data);
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
            <label htmlFor="awayGymId" className="google-label">
              Away Gym
            </label>
            <select
              id="awayGymId"
              className="google-select"
              {...register("awayGymId")}
              data-testid="select-away-gym"
            >
              <option value="">Select your away gym</option>
              {gymsData?.gyms?.map((gym: any) => (
                <option key={gym.id} value={gym.id}>
                  {gym.name} - {gym.location}
                </option>
              ))}
            </select>
            {errors.awayGymId && (
              <div className="error" style={{ fontSize: '14px', marginTop: '4px' }}>
                {errors.awayGymId.message}
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
          Already have an account? Sign in to RatFit
        </div>
      </div>
    </div>
  );
}