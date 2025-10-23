import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { SectionHeading } from '@/components/section-heading';
import ToyCardWithReservation from '@/components/toy-card-with-reservation';
import AgesSidebar from '@/components/ages-sidebar';
import { getToysByAge, getAllAgeRanges } from '@/lib/toys-data';

export async function generateStaticParams() {
  const ages = await getAllAgeRanges();
  return ages.map((age) => ({
    age: age,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ age: string }> }) {
  const { age } = await params;
  const ageName = decodeURIComponent(age);
  
  return {
    title: `Jouets ${ageName} - LOUAAB`,
    description: `Découvrez tous nos jouets adaptés pour ${ageName}. Location de jouets pour enfants au Maroc.`,
  };
}

export default async function AgePage({ params }: { params: Promise<{ age: string }> }) {
  const { age } = await params;
  const ageName = decodeURIComponent(age);
  const toys = await getToysByAge(ageName);
  const allAges = await getAllAgeRanges();

  return (
    <PageShell>
      {/* Header */}
      <section className="border-b border-mist/60 bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <nav className="flex items-center gap-2 text-sm text-slate mb-4">
            <Link href="/" className="hover:text-mint">Accueil</Link>
            <span>/</span>
            <Link href="/jouets" className="hover:text-mint">Jouets</Link>
            <span>/</span>
            <Link href="/ages" className="hover:text-mint">Âges</Link>
            <span>/</span>
            <span className="text-charcoal">{ageName}</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-6xl">👶</div>
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-[0.1em] text-charcoal">
                {ageName}
              </h1>
              <p className="mt-3 text-base text-slate">
                {toys.length} jouet{toys.length > 1 ? 's' : ''} adapté{toys.length > 1 ? 's' : ''} à cet âge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[200px,1fr]">
          {/* Sidebar Compacte */}
          <AgesSidebar allAges={allAges} currentAge={ageName} />

          {/* Main Content */}
          <div className="space-y-8">
            <SectionHeading
              title={`${toys.length} résultat${toys.length > 1 ? 's' : ''}`}
              description={`Tous les jouets adaptés pour ${ageName}`}
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
                  Aucun jouet pour cet âge
                </h3>
                <p className="mt-2 text-gray-600">
                  Essayez une autre tranche d'âge
                </p>
                <Link
                  href="/jouets"
                  className="mt-6 rounded-full bg-purple-500 px-6 py-3 font-semibold text-white transition hover:bg-purple-600"
                >
                  Voir tous les jouets
                </Link>
              </div>
            )}

            {/* CTA Section */}
            {toys.length > 0 && (
              <div className="mt-12 rounded-3xl bg-gradient-to-r from-mint/10 to-purple-500/10 p-8 text-center">
                <h3 className="text-2xl font-bold text-charcoal mb-4">
                  Prêt à réserver un jouet ?
                </h3>
                <p className="text-slate mb-6 max-w-2xl mx-auto">
                  Choisissez votre jouet préféré et réservez-le en quelques clics. 
                  Notre équipe vous contactera pour finaliser votre réservation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/jouets"
                    className="rounded-full border-2 border-mint px-8 py-4 font-semibold text-mint transition hover:bg-mint hover:text-white"
                  >
                    Voir tous les jouets
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-full bg-gradient-to-r from-mint to-purple-500 px-8 py-4 font-semibold text-white transition hover:from-mint/90 hover:to-purple-500/90"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

