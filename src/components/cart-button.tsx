"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { ToyData } from "@/lib/toys-data";

interface CartButtonProps {
  toy: ToyData;
  className?: string;
}

export default function CartButton({ toy, className = "" }: CartButtonProps) {
  const { items, addToCart, removeFromCart, updateQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = items.find(item => item.toy.id === toy.id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Valeurs par défaut pour l'ajout rapide
    const defaultDuration = "1"; // 1 semaine
    const defaultDate = new Date().toISOString().split('T')[0];
    const defaultTime = "14:00";
    
    addToCart(toy, defaultDuration, defaultDate, defaultTime);
    
    // Animation de confirmation
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(toy.id);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(toy.id, newQuantity);
  };

  if (!isInCart) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`flex items-center justify-center rounded-xl bg-mint px-4 py-2 text-white transition hover:bg-mint/90 disabled:opacity-50 shadow-sm hover:shadow-md ${className}`}
        title="Ajouter au panier"
      >
        {isAdding ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleRemoveFromCart}
      className={`flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600 ${className}`}
      title="Retirer du panier"
    >
      <X className="h-4 w-4" />
    </button>
  );
}
