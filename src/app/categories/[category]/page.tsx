import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { SectionHeading } from '@/components/section-heading';
import ToyCardWithReservation from '@/components/toy-card-with-reservation';
import CategoriesSidebar from '@/components/categories-sidebar';
import { getToysByCategory, getAllCategories, getAllToys } from '@/lib/toys-data';

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);
  
  return {
    title: `${categoryName} - LOUAAB`,
    description: `Découvrez tous nos jouets de catégorie ${categoryName}. Location de jouets pour enfants au Maroc.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);
  const toys = await getToysByCategory(categoryName);
  const allCategories = await getAllCategories();
  const allToys = await getAllToys();

  return (
    <PageShell>
      {/* Header */}
      <section className="border-b border-mist/60 bg-gradient-to-br from-mint/5 to-blue-50 py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <nav className="flex items-center gap-2 text-sm text-slate mb-4">
            <Link href="/" className="hover:text-mint">Accueil</Link>
            <span>/</span>
            <Link href="/jouets" className="hover:text-mint">Jouets</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-mint">Catégories</Link>
            <span>/</span>
            <span className="text-charcoal capitalize">{categoryName}</span>
          </nav>

          <h1 className="text-4xl font-bold uppercase tracking-[0.1em] text-charcoal">
            {categoryName}
          </h1>
          <p className="mt-3 text-base text-slate">
            {toys.length} jouet{toys.length > 1 ? 's' : ''} dans cette catégorie
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          {/* Sidebar avec recherche */}
          <aside className="h-fit rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <CategoriesSidebar 
              categories={allCategories} 
              toys={allToys}
              currentCategory={categoryName.toLowerCase()}
            />
          </aside>

          {/* Main Content */}
          <div className="space-y-8">
            <SectionHeading
              title={`${toys.length} résultat${toys.length > 1 ? 's' : ''}`}
              description={`Tous les jouets de la catégorie "${categoryName}"`}
            />

            {/* Toys Grid */}
            {toys.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {toys.map((toy, index) => (
                  <ToyCardWithReservation key={toy.id} toy={toy} priority={index < 6} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl bg-gray-50 py-20">
                <div className="text-6xl">🎮</div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  Aucun jouet dans cette catégorie
                </h3>
                <p className="mt-2 text-gray-600">
                  Essayez une autre catégorie
                </p>
                <Link
                  href="/jouets"
                  className="mt-6 rounded-full bg-mint px-6 py-3 font-semibold text-white transition hover:bg-mint/90"
                >
                  Voir tous les jouets
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

