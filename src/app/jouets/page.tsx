import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";

const products = [
  {
    name: "Kit Montessori sensoriel",
    category: "Jeux éducatifs",
    price: 120,
    originalPrice: 160,
    badge: "-25%",
    imageUrl:
      "https://images.unsplash.com/photo-1604882351679-01aabfd9009c?q=80&w=600",
  },
  {
    name: "Circuit voitures en bois",
    category: "Jouets en bois",
    price: 95,
    originalPrice: 120,
    badge: "Best-seller",
    imageUrl:
      "https://images.unsplash.com/photo-1566577721828-964bbb061ad1?q=80&w=600",
  },
  {
    name: "Jeu de société coopératif",
    category: "Jeux de société",
    price: 70,
    imageUrl:
      "https://images.unsplash.com/photo-1511715280173-1dee18c9d412?q=80&w=600",
  },
  {
    name: "Tapis d’éveil musical",
    category: "Bébé 0-12 mois",
    price: 110,
    originalPrice: 140,
    badge: "Nouveau",
    imageUrl:
      "https://images.unsplash.com/photo-1596468138839-4139e72de2e5?q=80&w=600",
  },
  {
    name: "Set STEM aimants",
    category: "STEM & science",
    price: 135,
    originalPrice: 150,
    badge: "-10%",
    imageUrl:
      "https://images.unsplash.com/photo-1690723351460-b38b3514bb51?q=80&w=600",
  },
  {
    name: "Cuisine en bois",
    category: "Jeu d’imitation",
    price: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?q=80&w=600",
  },
];

const categories = [
  "Baby",
  "Garçons",
  "Filles",
  "Créatif",
  "Outdoor",
  "Jouets en bois",
];

const ages = [
  "0–12 mois",
  "12–24 mois",
  "2–3 ans",
  "3–5 ans",
  "5–8 ans",
];

export default function ShopPage() {
  return (
    <PageShell>
      <section className="border-b border-mist/60 bg-white py-12">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4">
          <div>
            <p className="text-sm text-slate">Accueil / Jouets</p>
            <h1 className="mt-2 text-3xl font-bold uppercase tracking-[0.1em] text-charcoal">
              Shop
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate">
              Découvrez, jouez, échangez… sans jamais vous encombrer !
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
          <aside className="space-y-8 rounded-3xl bg-white p-6 shadow-sm shadow-mist/40">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-charcoal">Catégories</h2>
              <ul className="space-y-3 text-sm text-slate">
                {categories.map((item) => (
                  <li key={item}>
                    <Link
                      href={`?category=${encodeURIComponent(item.toLowerCase())}`}
                      className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-mint/20 hover:text-charcoal"
                    >
                      <span>{item}</span>
                      <span className="text-xs text-slate/70">12</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-charcoal">Prix (MAD)</h2>
              <div className="space-y-3">
                <div className="h-1 rounded-full bg-mist">
                  <div className="h-full w-2/3 rounded-full bg-mint" />
                </div>
                <div className="flex items-center justify-between text-sm text-slate">
                  <span>60 MAD</span>
                  <span>250 MAD</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-charcoal">Âge</h2>
              <div className="flex flex-wrap gap-2">
                {ages.map((age) => (
                  <button
                    key={age}
                    className="rounded-full border border-mint px-4 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-mint/20"
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full rounded-full border border-mint px-4 py-3 text-sm font-semibold text-charcoal transition hover:bg-mint hover:text-white">
              Réinitialiser
            </button>
          </aside>

          <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <SectionHeading
                title="Jouets populaires"
                description="Sélectionnés et nettoyés avec soin par l’équipe LOUAAB."
              />
              <div className="flex items-center gap-3">
                <button className="rounded-full border border-mint px-4 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-mint hover:text-white">
                  Grille
                </button>
                <button className="rounded-full border border-mist px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate transition hover:border-mint hover:text-mint">
                  Liste
                </button>
                <select className="rounded-full border border-mist px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate focus:border-mint focus:outline-none">
                  <option>Par défaut</option>
                  <option>Prix croissant</option>
                  <option>Popularité</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.name} {...product} />
              ))}
            </div>

            <div className="flex justify-center">
              <button className="rounded-full border border-mint px-6 py-3 text-sm font-semibold uppercase tracking-wide text-charcoal transition hover:bg-mint hover:text-white">
                Charger plus
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

