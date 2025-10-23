"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
} from "lucide-react";
import CartIcon from "./cart-icon";

const NAV_LINKS = [
  { href: "/jouets", label: "Jouets" },
  { href: "/ages", label: "Âges" },
  { href: "/categories", label: "Catégories" },
  { href: "/nos-packs", label: "Nos packs" },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/95 backdrop-blur-xl shadow-sm">
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
              alt="LOUAAB - On loue, on joue"
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
          {/* Search Button / Bar */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un jouet..."
                className="w-64 rounded-l-xl border-2 border-mint px-4 py-2 text-sm focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-r-xl bg-mint px-4 py-2 text-white transition hover:bg-mint/90"
              >
                <Search size={18} />
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-2 rounded-xl border border-mist px-3 py-2 text-slate transition hover:border-mint"
              >
                <X size={18} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-mist text-charcoal transition hover:border-mint hover:bg-mint/10"
              aria-label="Rechercher"
            >
              <Search size={18} />
            </button>
          )}

          {/* Mobile Search */}
          <Link
            href="/recherche"
            className="md:hidden relative flex h-10 w-10 items-center justify-center rounded-xl border border-mist text-charcoal transition hover:border-mint hover:bg-mint/10"
            aria-label="Rechercher"
          >
            <Search size={18} />
          </Link>


          <button
            className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-mist text-charcoal transition hover:border-mint hover:bg-mint/10"
            aria-label="Favoris"
          >
            <Heart size={18} />
          </button>

          <CartIcon />
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
