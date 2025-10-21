import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";

const packs = [
  {
    name: "Pack Solo",
    audience: "1 enfant",
    toys: 5,
    price: 380,
    description: "Idéal pour un enfant de 0 à 5 ans. Nettoyage et livraison inclus.",
  },
  {
    name: "Pack Duo",
    audience: "2 enfants",
    toys: 10,
    price: 580,
    description: "Parfait pour deux enfants ou une fratrie aux âges différents.",
  },
  {
    name: "Pack Explorateur",
    audience: "Mix 0-8 ans",
    toys: 8,
    price: 480,
    description: "Sélection mixte évolutive. Sans engagement, échanges illimités.",
  },
];

const benefits = [
  {
    title: "Stimulant",
    description: "Des jouets choisis par des experts en neurosciences et psychomotricité.",
  },
  {
    title: "Écologique",
    description: "110 000 tonnes de jouets jetés chaque année : louez pour prolonger leur vie.",
  },
  {
    title: "Apaisant",
    description: "Moins de jouets à la maison, plus de créativité et de concentration.",
  },
  {
    title: "Économique",
    description: "Accédez à 5 fois plus de jouets qu’un achat classique pour le même budget.",
  },
];

const formatMAD = (value: number) =>
  new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(
    value,
  );

export default function NosPacksPage() {
  return (
    <PageShell>
      <section className="bg-yellow/30 py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeading
            eyebrow="Nos packs"
            title="L’abonnement des tout-petits pensé pour leur éveil !"
            description="5 ou 10 jouets sélectionnés chaque mois par des professionnels de l’enfance. Sans engagement, livraison et retour inclus."
            align="center"
          />

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {packs.map((pack) => (
              <article
                key={pack.name}
                className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm shadow-mist/40 transition hover:-translate-y-1 hover:shadow-hover"
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[140px] rounded-tr-3xl bg-mint/30" />
                <div className="relative space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate">
                    {pack.audience}
                  </span>
                  <h2 className="text-2xl font-semibold text-charcoal">{pack.name}</h2>
                  <p className="text-4xl font-bold text-charcoal">{formatMAD(pack.price)}</p>
                  <p className="text-sm text-slate">
                    Soit {formatMAD(Math.round(pack.price / pack.toys))} par jouet.
                  </p>
                  <p className="text-sm text-slate">{pack.description}</p>
                  <button className="rounded-full bg-mint px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gradient-to-r hover:from-mint hover:to-lilac">
                    Je m’abonne
                  </button>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-20 grid gap-6 md:grid-cols-2">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-3xl bg-white/80 p-6 shadow-sm shadow-mist/30 transition hover:-translate-y-1 hover:bg-white hover:shadow-hover"
              >
                <h3 className="text-lg font-semibold text-charcoal">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm text-slate">{benefit.description}</p>
              </article>
            ))}
          </section>

          <section className="mt-20 rounded-3xl bg-peach/30 p-10 text-center shadow-sm shadow-mist/30">
            <h3 className="text-2xl font-semibold text-charcoal">
              🎁 J’offre un cadeau – Et si mon cadeau se vivait chaque mois ?
            </h3>
            <p className="mt-3 text-sm text-slate">
              Des packs prêts à offrir, livrés chez la famille, avec un message personnalisé.
            </p>
            <Link
              href="/contact?type=cadeau"
              className="mt-6 inline-flex rounded-full bg-mint px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gradient-to-r hover:from-mint hover:to-lilac"
            >
              Je fais plaisir
            </Link>
          </section>

          <section className="mt-20 grid gap-10 md:grid-cols-3">
            <article className="rounded-3xl bg-white p-6 shadow-sm shadow-mist/40">
              <h3 className="text-lg font-semibold text-charcoal">
                Comment ça marche ?
              </h3>
              <ol className="mt-4 space-y-3 text-sm text-slate">
                <li>1️⃣ Je découvre les 5 jouets sélectionnés par les pros.</li>
                <li>2️⃣ Place au jeu et à l’aventure avec ma famille.</li>
                <li>3️⃣ Au bout de 30 jours, je renvoie et je reçois de nouvelles découvertes.</li>
              </ol>
            </article>
            <article className="rounded-3xl bg-white p-6 shadow-sm shadow-mist/40">
              <h3 className="text-lg font-semibold text-charcoal">
                Ce qu’il y a dans une box
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate">
                <li>• 5 ou 10 jouets soigneusement sélectionnés</li>
                <li>• Pochons de rangement en coton recyclé</li>
                <li>• Emballage durable et réutilisable</li>
              </ul>
            </article>
            <article className="rounded-3xl bg-white p-6 shadow-sm shadow-mist/40">
              <h3 className="text-lg font-semibold text-charcoal">
                On vous accompagne
              </h3>
              <p className="mt-4 text-sm text-slate">
                Support WhatsApp réactif, assurance casse incluse, conseils d’experts pour maximiser l’éveil de vos enfants.
              </p>
            </article>
          </section>
        </div>
      </section>
    </PageShell>
  );
}

