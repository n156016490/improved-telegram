"use client";

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/favorites-context';
import { ToyData } from '@/lib/toys-data';

interface FavoriteButtonProps {
  toy: ToyData;
  className?: string;
}

export default function FavoriteButton({ toy, className = "" }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    toggleFavorite(String(toy.id));
    
    // Animation feedback
    setTimeout(() => setIsAnimating(false), 300);
  };

  const isFav = isFavorite(String(toy.id));

  return (
    <button
      onClick={handleToggleFavorite}
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal shadow-lg transition hover:bg-mint hover:text-white ${className} ${
        isAnimating ? 'animate-pulse' : ''
      }`}
      title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart 
        className={`h-4 w-4 transition-colors ${
          isFav ? 'fill-red-500 text-red-500' : 'text-charcoal'
        }`} 
      />
    </button>
  );
}
