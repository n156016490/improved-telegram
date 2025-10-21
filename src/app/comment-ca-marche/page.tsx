import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";

const steps = [
  {
    title: "Choisissez des jouets à emprunter",
    description: "+1000 jouets triés par nos experts selon l’âge et les préférences.",
  },
  {
    title: "Flexibilité totale",
    description: "Gardez-les tant qu’ils sont aimés. Pas d’engagement, pas de stress.",
  },
  {
    title: "Échangez et recommencez",
    description: "Dites-nous quand vous êtes prêts : nous collectons et nous renvoyons.",
  },
  {
    title: "Ou gardez pour toujours",
    description: "Coup de cœur ? Achetez-le à prix préférentiel directement depuis LOUAAB.",
  },
];

const whyUs = [
  {
    title: "Plus pour votre argent",
    description: "Louez des jouets d’une valeur 4 fois supérieure au montant de l’abonnement.",
  },
  {
    title: "Bon pour la planète",
    description: "Chaque location évite la production d’un nouveau jouet et réduit les déchets.",
  },
  {
    title: "Moins de désordre",
    description: "Récupérez de l’espace à la maison, tournez les jouets selon les envies.",
  },
  {
    title: "Un vaste choix",
    description: "Bibliothèque de jouets 0–8 ans, validée par des parents marocains.",
  },
  {
    title: "Sans tracas",
    description: "Livraison et retour inclus à Casablanca et Rabat à partir de 300 MAD.",
  },
  {
    title: "Tout est pris en charge",
    description: "Nettoyés, stérilisés, contrôlés. Assurance casse incluse.",
  },
];

export default function CommentCaMarchePage() {
  return (
    <PageShell>
      <section className="bg-yellow/40 py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeading
            eyebrow="Comment ça marche"
            title="Plus de jeu, moins de gaspillage"
            description="Une expérience fluide inspirée des meilleures bibliothèques de jouets : choisissez, jouez, échangez."
            align="center"
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article
                key={step.title}
                className="rounded-3xl bg-white p-6 text-center shadow-sm shadow-mist/40"
              >
                <h2 className="text-lg font-semibold text-charcoal">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm text-slate">{step.description}</p>
              </article>
            ))}
          </div>

          <section className="mt-20 grid gap-8 md:grid-cols-2">
            <article className="rounded-3xl bg-white p-6 shadow-sm shadow-mist/40">
              <h3 className="text-xl font-semibold text-charcoal">
                Parcourir par âge
              </h3>
              <p className="mt-3 text-sm text-slate">
                Des univers adaptés de 0 à 8 ans, avec recommandations mensuelles.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["0–12 mois", "12–24 mois", "2–3 ans", "3–5 ans", "5–8 ans", "Mix"].map(
                  (age) => (
                    <button
                      key={age}
                      className="rounded-2xl border border-mint px-4 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-mint/20"
                    >
                      {age}
                    </button>
                  ),
                )}
              </div>
            </article>

            <article className="rounded-3xl bg-white p-6 shadow-sm shadow-mist/40">
              <h3 className="text-xl font-semibold text-charcoal">
                Parcourir par catégorie
              </h3>
              <p className="mt-3 text-sm text-slate">
                Une bibliothèque variée : bois, STEM, livres, motricité, jeux d’imitation…
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[ "Jouets en bois", "STEM", "Livres", "Bébé & tout-petits", "Dolls & playsets", "Jeux extérieurs", "Puzzles & jeux", "Imitation" ].map((category) => (
                  <button
                    key={category}
                    className="rounded-2xl border border-mint px-4 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:bg-mint/20"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item) => (
              <details
                key={item.title}
                className="rounded-3xl bg-white p-6 shadow-sm shadow-mist/40"
              >
                <summary className="cursor-pointer text-lg font-semibold text-charcoal">
                  {item.title}
                </summary>
                <p className="mt-3 text-sm text-slate">{item.description}</p>
              </details>
            ))}
          </section>
        </div>
      </section>
    </PageShell>
  );
}

