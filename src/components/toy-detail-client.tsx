"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Plus, Minus, ShoppingCart, X, TrendingUp } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { ToyData } from "@/lib/toys-data";
import PricingSelector, { PricingOption } from "./pricing-selector";

interface ToyDetailClientProps {
  toy: ToyData;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export default function ToyDetailClient({ toy }: ToyDetailClientProps) {
  const { items, addToCart, removeFromCart, updateQuantity } = useCart();
  const [selectedPricingType, setSelectedPricingType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState("14:00");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = items.find(item => item.toy.id === toy.id);
  const isInCart = !!cartItem;

  // Créer les options de prix basées sur les données du jouet
  const pricingOptions: PricingOption[] = [
    {
      type: 'daily',
      label: 'Location Journalière',
      shortLabel: 'Par jour',
      description: 'Parfait pour tester le jouet',
      price: parseFloat(toy.price?.replace(/[^\d.]/g, '') || '25'),
      icon: Clock,
      color: 'bg-sky-blue',
      popular: false,
    },
    {
      type: 'weekly',
      label: 'Location Hebdomadaire',
      shortLabel: 'Par semaine',
      description: 'Meilleur rapport qualité/prix',
      price: parseFloat(toy.price?.replace(/[^\d.]/g, '') || '25') * 4.8, // 20% de réduction
      originalPrice: parseFloat(toy.price?.replace(/[^\d.]/g, '') || '25') * 7,
      discount: parseFloat(toy.price?.replace(/[^\d.]/g, '') || '25') * 2.2,
      discountPercentage: 31,
      icon: Calendar,
      color: 'bg-mint',
      popular: true,
    },
    {
      type: 'monthly',
      label: 'Location Mensuelle',
      shortLabel: 'Par mois',
      description: 'Maximum d\'économies pour une longue durée',
      price: parseFloat(toy.price?.replace(/[^\d.]/g, '') || '25') * 15, // 50% de réduction
      originalPrice: parseFloat(toy.price?.replace(/[^\d.]/g, '') || '25') * 30,
      discount: parseFloat(toy.price?.replace(/[^\d.]/g, '') || '25') * 15,
      discountPercentage: 50,
      icon: TrendingUp,
      color: 'bg-lilac',
      recommended: true,
    },
  ];

  const calculatePrice = () => {
    const selectedOption = pricingOptions.find(opt => opt.type === selectedPricingType);
    if (!selectedOption) return 0;
    
    let totalPrice = selectedOption.price * quantity;
    
    // Appliquer la promotion si active
    if (toy.promotion?.isActive) {
      if (toy.promotion.type === 'percentage') {
        const discount = totalPrice * (parseFloat(toy.promotion.value) / 100);
        totalPrice = totalPrice - discount;
      } else if (toy.promotion.type === 'fixed') {
        totalPrice = totalPrice - parseFloat(toy.promotion.value);
      }
    }
    
    return Math.max(0, totalPrice);
  };

  const getOriginalPrice = () => {
    const selectedOption = pricingOptions.find(opt => opt.type === selectedPricingType);
    if (!selectedOption) return 0;
    return selectedOption.originalPrice ? selectedOption.originalPrice * quantity : selectedOption.price * quantity;
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Ajouter au panier avec les paramètres sélectionnés
    addToCart(toy, selectedPricingType, startDate, startTime);
    
    // Animation de confirmation
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(toy.id);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (isInCart) {
      updateQuantity(toy.id, newQuantity);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de prix moderne */}
      <PricingSelector
        pricingOptions={pricingOptions}
        selectedType={selectedPricingType}
        onTypeChange={setSelectedPricingType}
        quantity={quantity}
        onQuantityChange={setQuantity}
      />

      {/* Configuration Section */}
      <div className="rounded-2xl bg-gradient-to-br from-mint/5 to-purple-50 p-6">
        <h3 className="text-lg font-semibold text-charcoal mb-4">
          Configurez votre location
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate mb-2">
              Date de début
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-mint focus:outline-none"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* Heure */}
          <div>
            <label className="block text-sm font-medium text-slate mb-2">
              Heure
            </label>
            <div className="relative">
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-mint focus:outline-none"
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

        </div>

        {/* Résumé du prix */}
        <div className="mt-4 rounded-lg bg-white p-4">
          {toy.promotion?.isActive ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate">Prix total</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-green-600">
                      {calculatePrice().toFixed(0)} MAD
                    </div>
                    <div className="text-lg text-gray-500 line-through">
                      {getOriginalPrice().toFixed(0)} MAD
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {toy.promotion.label || 'Promotion'}
                  </div>
                </div>
              </div>
              <div className="text-xs text-green-600 font-semibold">
                {toy.promotion.type === 'percentage' 
                  ? `${toy.promotion.value}% de réduction`
                  : toy.promotion.type === 'fixed'
                  ? `-${toy.promotion.value} MAD`
                  : toy.promotion.value
                }
              </div>
              <div className="text-sm text-slate">
                {pricingOptions.find(opt => opt.type === selectedPricingType)?.label}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate">Prix total</div>
                <div className="text-2xl font-bold text-mint">
                  {calculatePrice().toFixed(0)} MAD
                </div>
              </div>
              <div className="text-right text-sm text-slate">
                {pricingOptions.find(opt => opt.type === selectedPricingType)?.label}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {!isInCart ? (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex items-center justify-center rounded-xl bg-mint px-6 py-3 text-white transition hover:bg-mint/90 disabled:opacity-50 shadow-sm hover:shadow-md"
            title="Ajouter au panier"
          >
            {isAdding ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
          </button>
        ) : (
          <button
            onClick={handleRemoveFromCart}
            className="flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 text-white transition hover:bg-red-600"
            title="Retirer du panier"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-mint px-6 py-3 text-sm font-semibold text-mint transition hover:bg-mint/5"
        >
          <ShoppingCart className="h-4 w-4" />
          Voir le panier
        </Link>
      </div>
    </div>
  );
}
