import { profiles, type Profile, type InsertProfile } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getProfiles(): Promise<Profile[]>;
  getProfile(id: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  deleteProfile(id: number): Promise<boolean>;
  searchProfiles(query: string): Promise<Profile[]>;
  filterProfilesByLocation(location: string): Promise<Profile[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private profiles: Map<number, Profile>;
  private userCurrentId: number;
  private profileCurrentId: number;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.userCurrentId = 1;
    this.profileCurrentId = 1;
    
    // Initialize with sample profiles
    this.initializeProfiles();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Profile methods
  async getProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }
  
  async getProfile(id: number): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }
  
  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.profileCurrentId++;
    const profile: Profile = { ...insertProfile, id };
    this.profiles.set(id, profile);
    return profile;
  }
  
  async updateProfile(id: number, profileUpdate: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existingProfile = this.profiles.get(id);
    
    if (!existingProfile) {
      return undefined;
    }
    
    const updatedProfile: Profile = {
      ...existingProfile,
      ...profileUpdate,
    };
    
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  async deleteProfile(id: number): Promise<boolean> {
    return this.profiles.delete(id);
  }
  
  async searchProfiles(query: string): Promise<Profile[]> {
    if (!query) {
      return this.getProfiles();
    }
    
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.profiles.values()).filter(profile => {
      return (
        profile.name.toLowerCase().includes(lowercaseQuery) ||
        profile.location.toLowerCase().includes(lowercaseQuery) ||
        profile.company.toLowerCase().includes(lowercaseQuery) ||
        profile.title.toLowerCase().includes(lowercaseQuery) ||
        profile.description.toLowerCase().includes(lowercaseQuery)
      );
    });
  }
  
  async filterProfilesByLocation(location: string): Promise<Profile[]> {
    if (!location) {
      return this.getProfiles();
    }
    
    return Array.from(this.profiles.values()).filter(profile => 
      profile.location.toLowerCase() === location.toLowerCase()
    );
  }
  
  // Initialize with sample profiles
  private initializeProfiles() {
    const sampleProfiles: InsertProfile[] = [
      {
        name: "John Doe",
        title: "Senior Software Developer",
        company: "Acme Inc.",
        location: "New York",
        description: "Senior Software Developer with 8+ years of experience in frontend and backend technologies. Specialized in building scalable web applications using React, Node.js, and cloud services.",
        email: "john.doe@example.com",
        phone: "(555) 123-4567",
        website: "johndoe.com",
        linkedin: "linkedin.com/in/johndoe",
        experience: "8+ years",
        latitude: 40.7128,
        longitude: -74.0060,
        imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        name: "Emily Johnson",
        title: "UX/UI Designer",
        company: "Design Studio",
        location: "San Francisco",
        description: "UX/UI Designer passionate about creating intuitive and accessible user experiences for web and mobile applications.",
        email: "emily.j@example.com",
        phone: "(555) 234-5678",
        website: "emilyjdesign.com",
        linkedin: "linkedin.com/in/emilyjohnson",
        experience: "5 years",
        latitude: 37.7749,
        longitude: -122.4194,
        imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        name: "Michael Chang",
        title: "Product Manager",
        company: "Global Finance",
        location: "London",
        description: "Product Manager with extensive experience in fintech and e-commerce platforms. Strong focus on data-driven decisions and user-centered design.",
        email: "michael.c@example.com",
        phone: "(555) 345-6789",
        website: "michaelchang.io",
        linkedin: "linkedin.com/in/michaelchang",
        experience: "6 years",
        latitude: 51.5074,
        longitude: -0.1278,
        imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      {
        name: "Sarah Martinez",
        title: "Data Scientist",
        company: "Tech Solutions",
        location: "Berlin",
        description: "Data Scientist specializing in machine learning algorithms and predictive modeling. Experienced in implementing solutions for business intelligence and analytics.",
        email: "sarah.m@example.com",
        phone: "(555) 456-7890",
        website: "sarahmartinez.dev",
        linkedin: "linkedin.com/in/sarahmartinez",
        experience: "4 years",
        latitude: 52.5200,
        longitude: 13.4050,
        imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
      }
    ];
    
    sampleProfiles.forEach(profile => {
      this.createProfile(profile);
    });
  }
}

export const storage = new MemStorage();
