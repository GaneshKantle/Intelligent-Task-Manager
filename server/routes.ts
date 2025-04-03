import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema } from "@shared/schema";
import express from "express";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = express.Router();
  
  // Get all profiles
  apiRouter.get("/profiles", async (req, res) => {
    try {
      const profiles = await storage.getProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });
  
  // Get single profile
  apiRouter.get("/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      const profile = await storage.getProfile(id);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  
  // Create profile
  apiRouter.post("/profiles", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const newProfile = await storage.createProfile(profileData);
      res.status(201).json(newProfile);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });
  
  // Update profile
  apiRouter.patch("/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      // Partial validation of the update data
      const profilePartialSchema = insertProfileSchema.partial();
      const profileData = profilePartialSchema.parse(req.body);
      
      const updatedProfile = await storage.updateProfile(id, profileData);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  // Delete profile
  apiRouter.delete("/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      const success = await storage.deleteProfile(id);
      
      if (!success) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete profile" });
    }
  });
  
  // Search profiles
  apiRouter.get("/profiles/search", async (req, res) => {
    try {
      const query = z.string().optional().parse(req.query.q || "");
      const profiles = await storage.searchProfiles(query);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to search profiles" });
    }
  });
  
  // Filter profiles by location
  apiRouter.get("/profiles/filter/location", async (req, res) => {
    try {
      const location = z.string().optional().parse(req.query.location || "");
      const profiles = await storage.filterProfilesByLocation(location);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter profiles" });
    }
  });

  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
