import { type User, type InsertUser, type Gym, type Booking, type InsertBooking, type Checkin, type InsertCheckin } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStreak(userId: string, streak: number): Promise<User | undefined>;
  
  // Gyms
  getAllGyms(): Promise<Gym[]>;
  getGym(id: string): Promise<Gym | undefined>;
  getGymsByIds(ids: string[]): Promise<Gym[]>;
  incrementGymCheckins(gymId: string): Promise<void>;
  
  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getUserBookings(userId: string): Promise<Booking[]>;
  
  // Checkins
  createCheckin(checkin: InsertCheckin): Promise<Checkin>;
  getUserCheckins(userId: string): Promise<Checkin[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private gyms: Map<string, Gym>;
  private bookings: Map<string, Booking>;
  private checkins: Map<string, Checkin>;

  constructor() {
    this.users = new Map();
    this.gyms = new Map();
    this.bookings = new Map();
    this.checkins = new Map();

    // Initialize with sample gyms
    this.initializeGyms();
  }

  private initializeGyms() {
    const sampleGyms: Gym[] = [
      {
        id: "powerhouse",
        name: "PowerHouse Fitness",
        location: "Downtown",
        checkins: 423,
        revenue: 4230,
        isRatFitAssured: true,
        qrCode: "powerhouse-qr"
      },
      {
        id: "iron-temple",
        name: "Iron Temple",
        location: "Uptown",
        checkins: 298,
        revenue: 2980,
        isRatFitAssured: false,
        qrCode: "iron-temple-qr"
      },
      {
        id: "fit-zone",
        name: "FitZone Central",
        location: "Midtown",
        checkins: 356,
        revenue: 3560,
        isRatFitAssured: true,
        qrCode: "fit-zone-qr"
      },
      {
        id: "muscle-factory",
        name: "Muscle Factory",
        location: "East Side",
        checkins: 170,
        revenue: 1700,
        isRatFitAssured: false,
        qrCode: "muscle-factory-qr"
      },
      {
        id: "elite-fitness",
        name: "Elite Fitness Studio",
        location: "West End",
        checkins: 445,
        revenue: 4450,
        isRatFitAssured: true,
        qrCode: "elite-fitness-qr"
      },
      {
        id: "strength-hub",
        name: "Strength Hub",
        location: "North District",
        checkins: 201,
        revenue: 2010,
        isRatFitAssured: false,
        qrCode: "strength-hub-qr"
      }
    ];

    sampleGyms.forEach(gym => this.gyms.set(gym.id, gym));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      streak: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStreak(userId: string, streak: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { ...user, streak };
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getAllGyms(): Promise<Gym[]> {
    return Array.from(this.gyms.values());
  }

  async getGym(id: string): Promise<Gym | undefined> {
    return this.gyms.get(id);
  }

  async getGymsByIds(ids: string[]): Promise<Gym[]> {
    return ids.map(id => this.gyms.get(id)).filter((gym): gym is Gym => gym !== undefined);
  }

  async incrementGymCheckins(gymId: string): Promise<void> {
    const gym = this.gyms.get(gymId);
    if (gym) {
      const updatedGym = { 
        ...gym, 
        checkins: gym.checkins + 1,
        revenue: gym.revenue + 10 // $10 per checkin
      };
      this.gyms.set(gymId, updatedGym);
    }
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      createdAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.userId === userId
    );
  }

  async createCheckin(insertCheckin: InsertCheckin): Promise<Checkin> {
    const id = randomUUID();
    const checkin: Checkin = { 
      ...insertCheckin, 
      id,
      createdAt: new Date()
    };
    this.checkins.set(id, checkin);
    return checkin;
  }

  async getUserCheckins(userId: string): Promise<Checkin[]> {
    return Array.from(this.checkins.values()).filter(
      checkin => checkin.userId === userId
    );
  }
}

export const storage = new MemStorage();
