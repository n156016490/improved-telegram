import Image from "next/image";
import { Heart, Eye, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  imageUrl: string;
}

const formatMAD = (value: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(value);

export function ProductCard({
  name,
  category,
  price,
  originalPrice,
  badge,
  imageUrl,
}: ProductCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[24px] bg-white shadow-sm shadow-mist/40 transition hover:-translate-y-1 hover:shadow-hover">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-peach px-3 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal">
            {badge}
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-4 flex translate-y-8 justify-center gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {[Heart, Eye, ShoppingCart].map((Icon, index) => (
            <button
              key={Icon.displayName ?? index}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal shadow-sm transition hover:bg-mint hover:text-white"
              aria-label="Action rapide"
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate">
          {category}
        </span>
        <h3 className="text-lg font-semibold text-charcoal">{name}</h3>

        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-charcoal">
            {formatMAD(price)}
          </span>
          {originalPrice ? (
            <span className="text-sm text-slate line-through">
              {formatMAD(originalPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

