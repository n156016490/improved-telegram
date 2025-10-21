import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";

const categories = [
  {
    title: "Jouets en bois",
    description:
      "Durables et sensoriels, parfaits pour une approche Montessori et responsable.",
  },
  {
    title: "STEM & éducatifs",
    description:
      "Expériences scientifiques et jeux logiques pour nourrir la curiosité.",
  },
  {
    title: "Jeux d’imagination",
    description:
      "Cuisines, poupées, déguisements et univers qui encouragent le jeu symbolique.",
  },
  {
    title: "Jeux de société",
    description:
      "Moments en famille, coopération et stratégie adaptés à chaque âge.",
  },
  {
    title: "Motricité & plein air",
    description:
      "Trottinettes, draisiennes, parcours sensoriels pour bouger en toute sécurité.",
  },
  {
    title: "Premières lectures",
    description:
      "Albums cartonnés, livres interactifs et contes pour éveiller l’amour des histoires.",
  },
];

export default function CategoriesPage() {
  return (
    <PageShell>
      <section className="bg-soft-white py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeading
            eyebrow="Catégories"
            title="Explorez par univers"
            description="Une bibliothèque de jouets classée pour aider chaque famille à trouver rapidement ce qui fera briller les yeux des enfants."
            align="center"
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {categories.map((category) => (
              <article
                key={category.title}
                className="rounded-3xl bg-white p-8 shadow-sm shadow-mist/40 transition hover:-translate-y-1 hover:shadow-hover"
              >
                <h2 className="text-xl font-semibold text-charcoal">
                  {category.title}
                </h2>
                <p className="mt-4 text-sm text-slate">{category.description}</p>
                <div className="mt-6 flex gap-3">
                  <button className="rounded-full bg-mint px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gradient-to-r hover:from-mint hover:to-lilac">
                    Voir les jouets
                  </button>
                  <button className="rounded-full border border-mint px-5 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:border-lilac hover:text-lilac">
                    Ajouter au pack
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

