"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { loadToysData, ToyData } from "@/lib/toys-data";
import ToyCardWithReservation from "@/components/toy-card-with-reservation";
import SearchBar from "@/components/search-bar";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Heart,
  Eye,
  ShoppingCart,
  X,
} from "lucide-react";

const categories = [
  "Tous",
  "Jeux éducatifs",
  "Jeux de société",
  "Jeux d'adresse",
  "Véhicules",
  "Jeux créatifs",
  "Arcade",
];

const ageRanges = [
  { label: "Tous", value: "all" },
  { label: "0-12 mois", value: "0-1" },
  { label: "1-3 ans", value: "1-3" },
  { label: "3-6 ans", value: "3-6" },
  { label: "6-12 ans", value: "6-12" },
  { label: "12+ ans", value: "12+" },
];

const mockToys = [
  {
    id: "1",
    name: "Robo Kombat Balloon Puncher",
    category: "Jeux d'adresse",
    price: 60,
    depositPrice: 150,
    ageRange: "6-12 ans",
    rating: 4,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=600",
    badge: "Populaire",
  },
  {
    id: "2",
    name: "Avion télécommandé F16",
    category: "Véhicules",
    price: 100,
    depositPrice: 500,
    ageRange: "12+ ans",
    rating: 5,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=600",
    badge: "Nouveau",
  },
  {
    id: "3",
    name: "Battle Shooter",
    category: "Jeux de tirs",
    price: 70,
    depositPrice: 360,
    ageRange: "6-12 ans",
    rating: 5,
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=600",
  },
  {
    id: "4",
    name: "MarioKart Skee Ball",
    category: "Jeux d'adresse",
    price: 80,
    depositPrice: 570,
    ageRange: "3-6 ans",
    rating: 4,
    image: "https://images.unsplash.com/photo-1580234820596-0876d136e6d5?q=80&w=600",
    badge: "Best-seller",
  },
  {
    id: "5",
    name: "Docteur Maboul",
    category: "Jeux de société",
    price: 45,
    depositPrice: 450,
    ageRange: "6-12 ans",
    rating: 5,
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=600",
  },
  {
    id: "6",
    name: "Circuit Carrera GO",
    category: "Véhicules",
    price: 120,
    depositPrice: 1390,
    ageRange: "6-12 ans",
    rating: 5,
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=600",
    badge: "Premium",
  },
];

export default function JouetsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedAge, setSelectedAge] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [toys, setToys] = useState<ToyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Charger les données des jouets
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadToysData();
        setToys(data.toys);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des jouets:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredToys = toys.filter((toy) => {
    const matchesCategory =
      selectedCategory === "Tous" || toy.category?.includes(selectedCategory);
    const matchesSearch =
      toy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      toy.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      toy.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = selectedAge === "all" || toy.age?.includes(selectedAge);
    // Note: Prix en string dans nos données, conversion nécessaire
    const toyPrice = parseFloat(toy.price?.replace(/[^\d.]/g, '') || '0');
    const matchesPrice = toyPrice >= priceRange[0] && toyPrice <= priceRange[1];
    return matchesCategory && matchesSearch && matchesAge && matchesPrice;
  });

  return (
    <PageShell>
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-mint/10 via-peach/10 to-lilac/10 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-charcoal md:text-5xl">
              🎁 Catalogue de Jouets
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate">
              Découvrez notre sélection de plus de 500 jouets responsables,
              nettoyés et prêts à louer
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar
                toys={toys}
                onSearchChange={setSearchQuery}
                placeholder="Rechercher un jouet..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Category Pills */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-mint text-white shadow-lg shadow-mint/30"
                  : "bg-white text-slate hover:bg-mint/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="sticky top-24 space-y-6">
              {/* Mobile Close Button */}
              <div className="flex items-center justify-between lg:hidden">
                <h3 className="text-lg font-bold text-charcoal">Filtres</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="rounded-full p-2 hover:bg-mist"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Age Filter */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-charcoal">
                  Âge
                </h3>
                <div className="space-y-2">
                  {ageRanges.map((age) => (
                    <label
                      key={age.value}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="radio"
                        name="age"
                        value={age.value}
                        checked={selectedAge === age.value}
                        onChange={() => setSelectedAge(age.value)}
                        className="h-4 w-4 text-mint focus:ring-mint"
                      />
                      <span className="text-sm text-slate">{age.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-charcoal">
                  Prix (MAD/mois)
                </h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full accent-mint"
                  />
                  <div className="flex items-center justify-between text-sm text-slate">
                    <span>{priceRange[0]} MAD</span>
                    <span>{priceRange[1]} MAD</span>
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <button className="w-full rounded-xl border border-mist py-3 text-sm font-medium text-charcoal transition hover:border-mint hover:bg-mint/10">
                Réinitialiser les filtres
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate">
                <span className="font-semibold text-charcoal">
                  {filteredToys.length}
                </span>{" "}
                jouet{filteredToys.length > 1 ? "s" : ""} trouvé
                {filteredToys.length > 1 ? "s" : ""}
              </p>

              <div className="flex gap-2">
                {/* Search Button */}
                <button
                  onClick={() => setShowSearchBar(!showSearchBar)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-mist text-charcoal transition hover:border-mint hover:bg-mint/10"
                  aria-label="Rechercher"
                >
                  <Search size={18} />
                </button>

                {/* Mobile Filters Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 rounded-xl border border-mist px-4 py-2 text-sm font-medium text-charcoal transition hover:border-mint hover:bg-mint/10 lg:hidden"
                >
                  <SlidersHorizontal size={18} />
                  Filtres
                </button>

                {/* View Mode */}
                <div className="flex rounded-xl border border-mist bg-white">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-l-xl px-3 py-2 transition ${
                      viewMode === "grid"
                        ? "bg-mint text-white"
                        : "text-slate hover:bg-mist"
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-r-xl px-3 py-2 transition ${
                      viewMode === "list"
                        ? "bg-mint text-white"
                        : "text-slate hover:bg-mist"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Sort */}
                <select className="rounded-xl border border-mist px-4 py-2 text-sm font-medium text-charcoal focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/20">
                  <option>Plus récents</option>
                  <option>Prix croissant</option>
                  <option>Prix décroissant</option>
                  <option>Plus populaires</option>
                </select>
              </div>
            </div>

            {/* Search Bar (when activated) */}
            {showSearchBar && (
              <div className="mb-6">
                <SearchBar
                  toys={toys}
                  onSearchChange={setSearchQuery}
                  placeholder="Rechercher un jouet..."
                  className="w-full max-w-md"
                />
              </div>
            )}

            {/* Products Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  : "space-y-6"
              }
            >
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-mint border-t-transparent"></div>
                    <p className="mt-4 text-slate">Chargement des jouets...</p>
                  </div>
                </div>
              ) : (
                filteredToys.map((toy) => (
                  <ToyCardWithReservation key={toy.id} toy={toy} />
                ))
              )}
            </div>

            {/* Empty State */}
            {filteredToys.length === 0 && (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mist/50">
                  <Search size={32} className="text-slate" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-charcoal">
                  Aucun jouet trouvé
                </h3>
                <p className="mt-2 text-slate">
                  Essayez d'ajuster vos filtres ou votre recherche
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
