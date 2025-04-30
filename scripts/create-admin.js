import { db } from '../server/db.js';
import { users } from '../shared/schema.js';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
    const hashedPassword = await hashPassword('admin123');
    
    // Check if admin already exists
    const adminCheck = await db.select().from(users).where(eb => eb.eq(users.username, 'admin'));
    
    if (adminCheck.length > 0) {
      console.log('Admin user already exists!');
      return;
    }
    
    // Create admin user
    const [user] = await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      isAdmin: true
    }).returning();
    
    console.log('Admin user created successfully!', user);
  } catch (error) {
    console.error('Failed to create admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();