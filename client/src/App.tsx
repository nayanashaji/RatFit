import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import SignupPage from "@/pages/signup";
import DashboardPage from "@/pages/dashboard";
import QRCheckinPage from "@/pages/qr-checkin";
import GymDashboardPage from "@/pages/gym-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SignupPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/qr" component={QRCheckinPage} />
      <Route path="/gyms" component={GymDashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Navbar />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
