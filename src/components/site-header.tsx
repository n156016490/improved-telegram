"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  X,
  Search,
  User,
  Heart,
  ShoppingBag,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/jouets", label: "Jouets" },
  { href: "/ages", label: "Âges" },
  { href: "/categories", label: "Catégories" },
  { href: "/nos-packs", label: "Nos packs" },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const ACTION_ICONS = [
  { icon: Search, label: "Rechercher" },
  { icon: User, label: "Mon compte" },
  { icon: Heart, label: "Favoris" },
  { icon: ShoppingBag, label: "Panier" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-8">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-mist text-charcoal transition hover:border-mint hover:bg-mint/10 lg:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/" className="relative flex items-center">
            <Image
              src="/logo.png"
              alt="LOUAAB"
              width={180}
              height={60}
              className="h-auto w-32 lg:w-40"
              priority
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate transition hover:bg-mint/10 hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {ACTION_ICONS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-mist text-charcoal transition hover:border-mint hover:bg-mint/10"
              aria-label={label}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-mist/50 bg-white px-4 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl bg-soft-white px-4 py-3 text-sm font-medium text-charcoal transition hover:bg-mint/10"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

