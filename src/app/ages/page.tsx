import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";

const ageGroups = [
  {
    slug: "0-12-mois",
    title: "0–12 mois",
    description:
      "Éveiller les sens avec des textures douces, lumières apaisantes et sons attentifs.",
  },
  {
    slug: "12-24-mois",
    title: "12–24 mois",
    description:
      "Accompagner les premiers pas avec des jouets de motricité et d’exploration.",
  },
  {
    slug: "2-3-ans",
    title: "2–3 ans",
    description:
      "Développer langage et coordination grâce aux jeux d’imitation et puzzles simples.",
  },
  {
    slug: "3-5-ans",
    title: "3–5 ans",
    description:
      "Stimuler l’imagination avec des univers créatifs, STEM et jeux collaboratifs.",
  },
  {
    slug: "5-8-ans",
    title: "5–8 ans",
    description:
      "Encourager les défis, la logique et les jeux de société en famille.",
  },
];

export default function AgesPage() {
  return (
    <PageShell>
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeading
            eyebrow="Âges"
            title="Choisissez l’univers adapté"
            description="Chaque palier propose des jouets sélectionnés par nos experts en développement et validés par des parents marocains."
            align="center"
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ageGroups.map((group) => (
              <article
                key={group.slug}
                className="rounded-3xl bg-soft-white p-6 shadow-sm shadow-mist/40 transition hover:-translate-y-1 hover:bg-white hover:shadow-hover"
              >
                <h2 className="text-xl font-semibold text-charcoal">
                  {group.title}
                </h2>
                <p className="mt-3 text-sm text-slate">{group.description}</p>
                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/ages/${group.slug}`}
                    className="rounded-full bg-mint px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gradient-to-r hover:from-mint hover:to-lilac"
                  >
                    Voir nos jouets
                  </Link>
                  <Link
                    href={`/nos-packs?age=${group.slug}`}
                    className="rounded-full border border-mint px-5 py-2 text-xs font-semibold uppercase tracking-wide text-charcoal transition hover:border-lilac hover:text-lilac"
                  >
                    Découvrir le pack
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

