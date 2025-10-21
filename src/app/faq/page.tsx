import { PageShell } from "@/components/page-shell";

const faqs = [
  {
    question: "Qu’est-ce qu’une entreprise de location de jouets ?",
    answer:
      "C’est une bibliothèque de jouets : vous louez, vos enfants jouent, puis vous échangez pour découvrir de nouvelles choses. Une démarche écologique et économique.",
  },
  {
    question: "Comment fonctionne la location ?",
    answer:
      "Parcourez notre catalogue, choisissez un pack ou des jouets à louer pour une période d’un mois, recevez-les à domicile, puis renvoyez-les gratuitement.",
  },
  {
    question: "Quels types de jouets puis-je louer ?",
    answer:
      "Jeux éducatifs Montessori, jeux de société, motricité, puzzles, livres, STEM, déguisements et plus encore.",
  },
  {
    question: "La location est-elle économique ?",
    answer:
      "Oui, vous accédez à plusieurs jouets pour le prix d’un seul achat. L’espace et le budget sont optimisés.",
  },
  {
    question: "Les jouets sont-ils propres et sûrs ?",
    answer:
      "Chaque jouet est nettoyé avec des produits non toxiques, stérilisé à la vapeur, vérifié et conforme aux normes CE.",
  },
  {
    question: "Que faire si mon enfant ne veut pas rendre un jouet ?",
    answer:
      "Vous pouvez prolonger la location si le jouet est disponible ou l’acheter à prix préférentiel.",
  },
  {
    question: "Que se passe-t-il si un jouet est endommagé ?",
    answer:
      "L’usure normale est incluse. En cas de casse importante, nous échangeons avec vous pour trouver une solution équitable.",
  },
  {
    question: "Comment se déroulent la livraison et la collecte ?",
    answer:
      "Livraison et retour gratuits à Casablanca et Rabat dès 300 MAD. Planning flexible et notifications WhatsApp.",
  },
  {
    question: "Y a-t-il des frais d’adhésion ou un engagement ?",
    answer: "Aucun frais d’adhésion, abonnement sans engagement. Vous pouvez arrêter à tout moment.",
  },
  {
    question: "Dois-je verser une caution ?",
    answer:
      "Oui, un dépôt de garantie remboursable. Il est restitué automatiquement sur le même moyen de paiement.",
  },
  {
    question: "Puis-je louer des jouets via le site ?",
    answer:
      "Oui, tout le processus se fait en ligne. Vous pouvez également nous contacter sur WhatsApp pour des demandes spécifiques.",
  },
  {
    question: "Comment poser des questions ou réserver via WhatsApp ?",
    answer: "Écrivez-nous sur WhatsApp au +212 6 65701513, nous répondons rapidement !",
  },
  {
    question: "Comment voir des images réelles des jouets ?",
    answer:
      "Suivez notre compte Instagram @louaab.ma pour des photos et stories quotidiennes.",
  },
  {
    question: "Louez-vous des jouets pour des fêtes ?",
    answer:
      "Oui, des packs spéciaux pour anniversaires et événements. Contactez-nous pour un devis personnalisé.",
  },
  {
    question: "Y a-t-il des promotions ?",
    answer:
      "Nous proposons régulièrement des offres saisonnières et des remises pour les abonnés fidèles.",
  },
];

export default function FAQPage() {
  return (
    <PageShell>
      <section className="bg-soft-white py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-[0.1em] text-charcoal">
              Vos questions, nos réponses
            </h1>
            <p className="mt-3 text-sm text-slate">
              Trouvez des informations clés sur la location de jouets LOUAAB. Pour toute autre question, notre équipe est disponible sur WhatsApp.
            </p>

            <div className="mt-8 space-y-4">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="rounded-2xl border border-mist/60 bg-white p-4 shadow-sm shadow-mist/30"
                >
                  <summary className="cursor-pointer text-sm font-semibold text-charcoal">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm text-slate">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="space-y-4 rounded-3xl bg-white p-6 shadow-sm shadow-mist/40">
            <h2 className="text-lg font-semibold text-charcoal">
              Besoin d’aide rapide ?
            </h2>
            <p className="text-sm text-slate">
              📧 sara@louaab.ma
              <br />
              📱 +212 6 65701513
              <br />
              💬 WhatsApp : Lundi–Samedi, 9h–19h
            </p>
            <a
              href="https://wa.me/212665701513"
              className="mt-4 inline-flex rounded-full bg-mint px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gradient-to-r hover:from-mint hover:to-lilac"
            >
              💬 Nous écrire sur WhatsApp
            </a>
            <div className="rounded-2xl bg-mint/20 p-4 text-sm text-charcoal">
              Suivez-nous sur Instagram @louaab.ma pour voir les jouets en action.
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

