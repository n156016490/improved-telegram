import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { getAllAgeRanges, getAllToys } from '@/lib/toys-data';

export const metadata = {
  title: 'Jouets par âge - LOUAAB',
  description: 'Trouvez des jouets adaptés à l\'âge de votre enfant',
};

export default async function AgesPage() {
  const ages = await getAllAgeRanges();
  const toys = await getAllToys();

  // Count toys per age
  const agesWithCount = ages.map(age => ({
    name: age,
    count: toys.filter(toy => toy.age === age).length,
  })).sort((a, b) => b.count - a.count);

  // Emoji mapping for age ranges
  const getAgeEmoji = (age: string) => {
    if (age.includes('0-') || age.includes('12')) return '👶';
    if (age.includes('3-') || age.includes('2-')) return '🧒';
    if (age.includes('6-') || age.includes('5-')) return '👧';
    if (age.includes('12+') || age.includes('14+')) return '🧑';
    return '🎮';
  };

  return (
    <PageShell>
      {/* Header */}
      <section className="border-b border-mist/60 bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="mx-auto w-full max-w-6xl px-4 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-slate mb-4">
            <Link href="/" className="hover:text-mint">Accueil</Link>
            <span>/</span>
            <Link href="/jouets" className="hover:text-mint">Jouets</Link>
            <span>/</span>
            <span className="text-charcoal">Âges</span>
          </nav>

          <h1 className="text-4xl font-bold uppercase tracking-[0.1em] text-charcoal">
            Jouets par âge
          </h1>
          <p className="mt-3 text-base text-slate">
            Trouvez le jouet parfait adapté à l'âge de votre enfant
          </p>
        </div>
      </section>

      {/* Ages Grid */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agesWithCount.map((age) => (
            <Link
              key={age.name}
              href={`/ages/${encodeURIComponent(age.name)}`}
              className="group flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 transition hover:shadow-lg hover:ring-purple-500"
            >
              <div className="text-5xl mb-4">{getAgeEmoji(age.name)}</div>
              <h3 className="font-bold text-charcoal group-hover:text-purple-600">
                {age.name}
              </h3>
              <p className="mt-2 text-sm text-slate">
                {age.count} jouet{age.count > 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
