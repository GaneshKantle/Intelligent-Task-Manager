import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

export async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create the profiles table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        website TEXT,
        linkedin TEXT,
        experience TEXT,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        image_url TEXT NOT NULL
      );
    `);
    
    // Create the users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    
    // Check if there are any profiles in the database
    const result = await pool.query('SELECT COUNT(*) FROM profiles');
    const count = parseInt(result.rows[0].count);
    
    // If there are no profiles, add sample profiles
    if (count === 0) {
      await insertSampleProfiles();
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function insertSampleProfiles() {
  console.log('Inserting sample profiles...');
  
  const sampleProfiles = [
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
      image_url: "https://randomuser.me/api/portraits/men/1.jpg",
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
      image_url: "https://randomuser.me/api/portraits/women/2.jpg",
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
      image_url: "https://randomuser.me/api/portraits/men/3.jpg",
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
      image_url: "https://randomuser.me/api/portraits/women/4.jpg",
    }
  ];
  
  for (const profile of sampleProfiles) {
    await pool.query(`
      INSERT INTO profiles 
      (name, title, company, location, description, email, phone, website, linkedin, experience, latitude, longitude, image_url)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `, [
      profile.name,
      profile.title,
      profile.company,
      profile.location,
      profile.description,
      profile.email,
      profile.phone,
      profile.website,
      profile.linkedin,
      profile.experience,
      profile.latitude,
      profile.longitude,
      profile.image_url
    ]);
  }
  
  console.log('Sample profiles inserted successfully');
}