import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookingSchema, insertCheckinSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Signup route
  app.post("/api/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ success: true, user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Check-in route
  app.post("/api/checkin", async (req, res) => {
    try {
      const checkinData = insertCheckinSchema.parse(req.body);
      
      // Create checkin record
      const checkin = await storage.createCheckin(checkinData);
      
      // Increment gym checkins
      await storage.incrementGymCheckins(checkinData.gymId);
      
      // Update user streak
      const user = await storage.getUser(checkinData.userId);
      if (user) {
        const newStreak = user.streak + 1;
        await storage.updateUserStreak(checkinData.userId, newStreak);
      }

      res.json({ success: true, checkin });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Booking route
  app.post("/api/book", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json({ success: true, booking });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get gyms route
  app.get("/api/gyms", async (req, res) => {
    try {
      const gyms = await storage.getAllGyms();
      const totalCheckins = gyms.reduce((sum, gym) => sum + gym.checkins, 0);
      const totalRevenue = gyms.reduce((sum, gym) => sum + gym.revenue, 0);
      const activeUsers = Math.floor(totalCheckins / 3); // Rough estimate

      res.json({ 
        gyms,
        stats: {
          totalCheckins,
          activeUsers,
          totalRevenue
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user data route
  app.get("/api/user/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const homeGym = await storage.getGym(user.homeGymId);
      const awayGym = await storage.getGym(user.awayGymId);
      const recentCheckins = await storage.getUserCheckins(user.id);

      res.json({ 
        user,
        homeGym,
        awayGym,
        recentActivity: recentCheckins.slice(-5).reverse()
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
