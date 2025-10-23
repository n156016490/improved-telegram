import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import CategoriesSidebar from '@/components/categories-sidebar';
import { getAllCategories, getAllToys } from '@/lib/toys-data';

export const metadata = {
  title: 'Toutes les catégories - LOUAAB',
  description: 'Explorez toutes nos catégories de jouets disponibles à la location',
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  const toys = await getAllToys();

  // Count toys per category
  const categoriesWithCount = categories.map(category => ({
    name: category,
    count: toys.filter(toy => toy.category?.includes(category)).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <PageShell>
      {/* Header */}
      <section className="border-b border-mist/60 bg-gradient-to-br from-mint/5 to-blue-50 py-16">
        <div className="mx-auto w-full max-w-6xl px-4 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-slate mb-4">
            <Link href="/" className="hover:text-mint">Accueil</Link>
            <span>/</span>
            <Link href="/jouets" className="hover:text-mint">Jouets</Link>
            <span>/</span>
            <span className="text-charcoal">Catégories</span>
          </nav>

          <h1 className="text-4xl font-bold uppercase tracking-[0.1em] text-charcoal">
            Toutes les catégories
          </h1>
          <p className="mt-3 text-base text-slate">
            {categories.length} catégories de jouets disponibles
          </p>
        </div>
      </section>

      {/* Content with Sidebar */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          {/* Sidebar avec recherche */}
          <aside className="h-fit rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <CategoriesSidebar 
              categories={categories} 
              toys={toys}
            />
          </aside>

          {/* Grille des catégories */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-charcoal">
                Toutes les catégories
              </h2>
              <div className="text-sm text-slate">
                {categoriesWithCount.length} catégorie{categoriesWithCount.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {categoriesWithCount.map((category) => (
                <Link
                  key={category.name}
                  href={`/categories/${encodeURIComponent(category.name.toLowerCase())}`}
                  className="group flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-lg hover:ring-mint"
                >
                  <div>
                    <h3 className="font-bold text-charcoal group-hover:text-mint">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate">
                      {category.count} jouet{category.count > 1 ? 's' : ''}
                    </p>
                  </div>
                  <svg
                    className="h-6 w-6 text-gray-400 group-hover:text-mint"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
