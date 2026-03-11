import { promises as fs } from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating cache directory:', error);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const entry: CacheEntry<T> = JSON.parse(content);
    
    const age = Date.now() - entry.timestamp;
    if (age > CACHE_DURATION) {
      await fs.unlink(filePath);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    return null;
  }
}

export async function setCache<T>(key: string, data: T): Promise<void> {
  try {
    await ensureCacheDir();
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    await fs.writeFile(filePath, JSON.stringify(entry, null, 2));
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}
