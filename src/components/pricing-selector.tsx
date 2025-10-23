"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, TrendingUp, CheckCircle, Star, Zap } from "lucide-react";

export interface PricingOption {
  type: 'daily' | 'weekly' | 'monthly';
  label: string;
  shortLabel: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  discountPercentage?: number;
  badge?: string;
  icon: React.ComponentType<any>;
  color: string;
  savings?: number;
  popular?: boolean;
  recommended?: boolean;
}

interface PricingSelectorProps {
  pricingOptions: PricingOption[];
  selectedType: 'daily' | 'weekly' | 'monthly';
  onTypeChange: (type: 'daily' | 'weekly' | 'monthly') => void;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  className?: string;
}

export default function PricingSelector({
  pricingOptions,
  selectedType,
  onTypeChange,
  quantity = 1,
  onQuantityChange,
  className = "",
}: PricingSelectorProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const getTotalPrice = (option: PricingOption) => {
    const basePrice = option.discount ? option.price : option.originalPrice || option.price;
    return basePrice * quantity;
  };

  const getSavings = (option: PricingOption) => {
    if (!option.originalPrice || !option.discount) return 0;
    return (option.originalPrice - option.price) * quantity;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header avec titre et description */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-charcoal mb-2">
          Choisissez votre durée de location
        </h3>
        <p className="text-slate">
          Plus vous louez longtemps, plus vous économisez !
        </p>
      </div>

      {/* Sélecteur de quantité */}
      {onQuantityChange && (
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm font-medium text-slate">Quantité:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              -
            </button>
            <span className="w-8 text-center font-medium text-charcoal">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Options de prix */}
      <div className="grid gap-4 md:grid-cols-3">
        {pricingOptions.map((option) => {
          const isSelected = selectedType === option.type;
          const isHovered = hoveredOption === option.type;
          const totalPrice = getTotalPrice(option);
          const savings = getSavings(option);
          const Icon = option.icon;

          return (
            <div
              key={option.type}
              onClick={() => onTypeChange(option.type)}
              onMouseEnter={() => setHoveredOption(option.type)}
              onMouseLeave={() => setHoveredOption(null)}
              className={`
                relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300
                ${isSelected 
                  ? 'border-mint bg-mint/5 shadow-lg scale-105' 
                  : isHovered 
                    ? 'border-mint/50 bg-mint/2 shadow-md scale-102' 
                    : 'border-gray-200 bg-white hover:border-mint/30'
                }
                ${option.popular ? 'ring-2 ring-mint/20' : ''}
                ${option.recommended ? 'ring-2 ring-lilac/20' : ''}
              `}
            >
              {/* Badges */}
              <div className="absolute -top-2 -right-2 flex gap-1">
                {option.popular && (
                  <div className="bg-mint text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Populaire
                  </div>
                )}
                {option.recommended && (
                  <div className="bg-lilac text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Recommandé
                  </div>
                )}
                {option.badge && (
                  <div className="bg-peach text-white text-xs font-bold px-2 py-1 rounded-full">
                    {option.badge}
                  </div>
                )}
              </div>

              {/* Icône et type */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-xl p-3 ${option.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal">{option.label}</h4>
                  <p className="text-sm text-slate">{option.shortLabel}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate mb-4">{option.description}</p>

              {/* Prix */}
              <div className="space-y-2">
                {option.discount && option.originalPrice ? (
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-mint">
                        {formatPrice(option.price)}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(option.originalPrice)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                        -{option.discountPercentage}%
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        Économisez {formatPrice(savings)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-charcoal">
                    {formatPrice(option.price)}
                  </div>
                )}

                {/* Prix total pour la quantité */}
                {quantity > 1 && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate">Total ({quantity}x):</span>
                      <span className="font-semibold text-charcoal">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Indicateur de sélection */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="rounded-full bg-mint p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              {/* Avantages */}
              <div className="mt-4 space-y-2">
                {option.type === 'daily' && (
                  <div className="flex items-center gap-2 text-xs text-slate">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Parfait pour tester</span>
                  </div>
                )}
                {option.type === 'weekly' && (
                  <div className="flex items-center gap-2 text-xs text-slate">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Meilleur rapport qualité/prix</span>
                  </div>
                )}
                {option.type === 'monthly' && (
                  <div className="flex items-center gap-2 text-xs text-slate">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Maximum d'économies</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Résumé de la sélection */}
      <div className="rounded-xl bg-gradient-to-r from-mint/10 to-lilac/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-charcoal">
              {pricingOptions.find(opt => opt.type === selectedType)?.label}
            </h4>
            <p className="text-sm text-slate">
              {quantity} {quantity > 1 ? 'jouets' : 'jouet'} sélectionné{quantity > 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-mint">
              {formatPrice(getTotalPrice(pricingOptions.find(opt => opt.type === selectedType)!))}
            </div>
            <div className="text-sm text-slate">
              {selectedType === 'daily' && 'par jour'}
              {selectedType === 'weekly' && 'par semaine'}
              {selectedType === 'monthly' && 'par mois'}
            </div>
          </div>
        </div>
      </div>

      {/* Comparaison des économies */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-charcoal mb-3">Économies par rapport au prix journalier :</h4>
        <div className="grid gap-3 sm:grid-cols-3">
          {pricingOptions.map((option) => {
            if (option.type === 'daily') return null;
            
            const dailyOption = pricingOptions.find(opt => opt.type === 'daily');
            if (!dailyOption) return null;

            const dailyTotal = dailyOption.price * (option.type === 'weekly' ? 7 : 30);
            const optionTotal = option.price;
            const savings = dailyTotal - optionTotal;
            const savingsPercentage = ((savings / dailyTotal) * 100);

            return (
              <div key={option.type} className="text-center">
                <div className="text-sm text-slate">{option.label}</div>
                <div className="text-lg font-bold text-green-600">
                  {formatPrice(savings)}
                </div>
                <div className="text-xs text-slate">
                  ({savingsPercentage.toFixed(0)}% d'économie)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
