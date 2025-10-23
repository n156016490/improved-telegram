/**
 * Toys Data Management
 * Handles loading and accessing toy information with images
 */

export interface ToyData {
  id: number;
  name: string;
  slug: string;
  image: string;
  thumbnail: string;
  hasImage: boolean;
  category: string;
  age: string;
  price: string;
  rating: string;
  videoUrl: string;
  hasVideo: boolean;
  description: string;
  stock: string | number;
  source: string;
  promotion?: {
    isActive: boolean;
    type: 'percentage' | 'fixed' | 'text';
    value: string;
    label: string;
    startDate?: string;
    endDate?: string;
  };
}

export interface ToysMapping {
  generatedAt: string;
  totalToys: number;
  toysWithImages: number;
  coveragePercent: number;
  toys: ToyData[];
}

let cachedData: ToysMapping | null = null;

/**
 * Load toys data from the mapping JSON file
 */
export async function loadToysData(): Promise<ToysMapping> {
  if (cachedData) {
    return cachedData;
  }

  try {
    // Server-side: read file directly
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'toys', 'toys-mapping.json');
      
      // Read file with explicit UTF-8 encoding
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Remove BOM and trim whitespace
      // BOM (Byte Order Mark) is \uFEFF in UTF-8
      const cleanContent = fileContent.replace(/^\uFEFF/, '').trim();
      
      // Parse JSON
      cachedData = JSON.parse(cleanContent);
      return cachedData!;
    }
    
    // Client-side: use fetch
    const response = await fetch('/toys/toys-mapping.json');
    if (!response.ok) {
      throw new Error('Failed to load toys data');
    }
    
    cachedData = await response.json();
    return cachedData!;
  } catch (error) {
    console.error('Error loading toys data:', error);
    return {
      generatedAt: new Date().toISOString(),
      totalToys: 0,
      toysWithImages: 0,
      coveragePercent: 0,
      toys: []
    };
  }
}

/**
 * Get all toys
 */
export async function getAllToys(): Promise<ToyData[]> {
  const data = await loadToysData();
  return data.toys;
}

/**
 * Get toy by slug
 */
export async function getToyBySlug(slug: string): Promise<ToyData | null> {
  const data = await loadToysData();
  return data.toys.find(toy => toy.slug === slug) || null;
}

/**
 * Get toys by category
 */
export async function getToysByCategory(category: string): Promise<ToyData[]> {
  const data = await loadToysData();
  return data.toys.filter(toy => 
    toy.category?.toLowerCase().includes(category.toLowerCase())
  );
}

/**
 * Get toys by age range
 */
export async function getToysByAge(ageRange: string): Promise<ToyData[]> {
  const data = await loadToysData();
  return data.toys.filter(toy => toy.age === ageRange);
}

/**
 * Search toys by name
 */
export async function searchToys(query: string): Promise<ToyData[]> {
  const data = await loadToysData();
  const lowerQuery = query.toLowerCase();
  
  return data.toys.filter(toy =>
    toy.name.toLowerCase().includes(lowerQuery) ||
    toy.description?.toLowerCase().includes(lowerQuery) ||
    toy.category?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get toys with images only
 */
export async function getToysWithImages(): Promise<ToyData[]> {
  const data = await loadToysData();
  return data.toys.filter(toy => toy.hasImage);
}

/**
 * Get random toys
 */
export async function getRandomToys(count: number = 6): Promise<ToyData[]> {
  const data = await loadToysData();
  const shuffled = [...data.toys].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get featured toys (toys with images and high ratings)
 */
export async function getFeaturedToys(count: number = 8): Promise<ToyData[]> {
  const data = await loadToysData();
  
  // Filter toys with images and sort by rating
  const featured = data.toys
    .filter(toy => toy.hasImage && toy.rating)
    .sort((a, b) => {
      const ratingA = parseRating(a.rating);
      const ratingB = parseRating(b.rating);
      return ratingB - ratingA;
    })
    .slice(0, count);
  
  return featured;
}

/**
 * Parse rating string to number
 */
function parseRating(rating: string): number {
  if (!rating) return 0;
  
  // Extract number from strings like "5 étoile", "4 étoile", etc.
  const match = rating.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const data = await loadToysData();
  const categories = new Set<string>();
  
  data.toys.forEach(toy => {
    if (toy.category) {
      // Split multiple categories (e.g., "Compétition, jeux d'adresse")
      toy.category.split(',').forEach(cat => {
        const trimmed = cat.trim();
        if (trimmed) {
          categories.add(trimmed);
        }
      });
    }
  });
  
  return Array.from(categories).sort();
}

/**
 * Get all unique age ranges
 */
export async function getAllAgeRanges(): Promise<string[]> {
  const data = await loadToysData();
  const ages = new Set<string>();
  
  data.toys.forEach(toy => {
    if (toy.age) {
      ages.add(toy.age);
    }
  });
  
  return Array.from(ages).sort();
}

/**
 * Get statistics about the toys collection
 */
export async function getToysStats() {
  const data = await loadToysData();
  
  return {
    total: data.totalToys,
    withImages: data.toysWithImages,
    withoutImages: data.totalToys - data.toysWithImages,
    coveragePercent: data.coveragePercent,
    categories: await getAllCategories(),
    ageRanges: await getAllAgeRanges(),
    lastUpdated: data.generatedAt
  };
}

