"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageShell } from "@/components/page-shell";
import { ProductCard } from "@/components/product-card";
import { ChevronDown, Sparkles, Shield, Package } from "lucide-react";

const ageFilters = [
  { label: "0–12 mois", href: "/ages/0-12-mois" },
  { label: "12–24 mois", href: "/ages/12-24-mois" },
  { label: "2–3 ans", href: "/ages/2-3-ans" },
  { label: "3–5 ans", href: "/ages/3-5-ans" },
  { label: "5–8 ans", href: "/ages/5-8-ans" },
];

const proofPoints = [
  { label: "+500 jouets", sublabel: "responsables", icon: Sparkles },
  { label: "Nettoyés", sublabel: "& contrôlés", icon: Shield },
  { label: "Livraison", sublabel: "incluse", icon: Package },
];

const featuredProducts = [
  {
    name: "Kit Montessori sensoriel",
    category: "Jeux éducatifs",
    price: 120,
    originalPrice: 160,
    badge: "-25%",
    imageUrl: "https://images.unsplash.com/photo-1604882351679-01aabfd9009c?q=80&w=600",
  },
  {
    name: "Circuit voitures en bois",
    category: "Jouets en bois",
    price: 95,
    badge: "Best-seller",
    imageUrl: "https://images.unsplash.com/photo-1566577721828-964bbb061ad1?q=80&w=600",
  },
  {
    name: "Jeu de société coopératif",
    category: "Jeux de société",
    price: 70,
    imageUrl: "https://images.unsplash.com/photo-1511715280173-1dee18c9d412?q=80&w=600",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    } 
  },
};

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 0.7]);

  return (
    <PageShell>
      {/* Hero Section with Video Background */}
      <section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden bg-charcoal">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="/video/child_playing_toy.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>

        {/* Dark Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-charcoal/75 via-charcoal/65 to-transparent"
          style={{ zIndex: 1 }}
        />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={item} className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-xl">
              <Sparkles size={16} className="text-mint" />
              Premier service marocain
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-bold uppercase leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            🎈 On loue, on joue !
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl"
          >
            LOUAAB est le premier service marocain de location de jouets et jeux de société pour enfants, adolescents et adultes. Découvrez, jouez, échangez… sans jamais vous encombrer !
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={item} className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/jouets"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-mint to-mint/90 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-mint/30 transition-all hover:shadow-xl hover:shadow-mint/40"
            >
              🎁 Découvrir nos jouets
              <span className="absolute inset-0 translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
            </Link>
            <Link
              href="/comment-ca-marche"
              className="group relative overflow-hidden rounded-full border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:border-mint hover:text-mint"
            >
              💡 Comment ça marche ?
              <span className="absolute inset-0 translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
            </Link>
          </motion.div>

          {/* Age Filter Pills */}
          <motion.div variants={item} className="mt-12 flex flex-wrap justify-center gap-3">
            {ageFilters.map((age) => (
              <Link
                key={age.label}
                href={age.href}
                className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {age.label}
              </Link>
            ))}
          </motion.div>

          <motion.div variants={item} className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <ChevronDown size={32} className="animate-bounce text-white" />
          </motion.div>
        </motion.div>
      </section>

      {/* Proof Points Bar */}
      <section className="relative z-20 -mt-20 overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4">
          <motion.div
            className="grid gap-6 rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl shadow-charcoal/10 backdrop-blur-xl md:grid-cols-3"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {proofPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.label}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mint/20 to-lilac/20">
                    <Icon size={28} className="text-mint" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-charcoal">{point.label}</p>
                    <p className="text-sm text-slate">{point.sublabel}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-24">
        <div className="mx-auto w-full max-w-7xl px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="bg-gradient-to-r from-charcoal to-slate bg-clip-text text-4xl font-bold uppercase tracking-tight text-transparent md:text-5xl">
              Nos jouets populaires
            </h2>
            <p className="mt-4 text-lg text-slate">
              Découvrez une sélection de jouets appréciés par les familles marocaines
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.name} variants={item}>
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              href="/jouets"
              className="inline-flex items-center gap-2 rounded-full border-2 border-mint px-10 py-4 text-base font-bold uppercase tracking-wide text-charcoal transition-all hover:border-lilac hover:bg-lilac/10 hover:text-lilac"
            >
              Voir tous les jouets
              <ChevronDown size={20} className="rotate-[-90deg]" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="relative overflow-hidden bg-gradient-to-br from-mint/10 via-soft-white to-peach/10 py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 lg:grid-cols-2">
          <motion.article
            className="group space-y-6 rounded-[40px] bg-white/80 p-12 shadow-xl shadow-mist/50 backdrop-blur-sm transition-all hover:-translate-y-2 hover:shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="bg-gradient-to-r from-charcoal to-slate bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Louer, c&apos;est moins cher que d&apos;acheter !
            </h2>
            <p className="text-lg text-slate">
              Les enfants se lassent vite des jouets, et les adultes manquent souvent de place. Avec LOUAAB, profitez de centaines de jouets adaptés :
            </p>
            <ul className="space-y-4 text-slate">
              {[
                "🧠 Jeux éducatifs et Montessori",
                "🎲 Jeux de société pour petits et grands",
                "🚗 Jouets d&apos;extérieur et de motricité",
                "🧩 Jeux de construction, puzzles et plus",
              ].map((item) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-base"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
            <p className="text-lg font-bold text-charcoal">
              Simple, économique et éco-responsable ♻️
            </p>
          </motion.article>

          <motion.article
            className="group space-y-6 rounded-[40px] bg-white/80 p-12 shadow-xl shadow-mist/50 backdrop-blur-sm transition-all hover:-translate-y-2 hover:shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="bg-gradient-to-r from-charcoal to-slate bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Jouer autrement, c&apos;est notre mission
            </h2>
            <ul className="space-y-5 text-slate">
              {[
                "🌍 L&apos;économie circulaire : un jouet qui sert plusieurs familles vit plus longtemps",
                "👨‍👩‍👧 Le partage : apprendre à consommer autrement dès le plus jeune âge",
                "💫 La qualité : chaque jouet est testé, nettoyé et validé",
              ].map((item) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-base"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.article>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-white py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 md:grid-cols-3">
          {[
            {
              title: "Des jouets propres & sûrs",
              items: [
                "🧴 Nettoyés avec produits non toxiques",
                "🔍 Inspectés et réparés",
                "📦 Emballés individuellement",
                "✅ Conformes normes CE",
              ],
            },
            {
              title: "Ils ont testé, ils adorent ❤️",
              items: [
                "\"Mes enfants adorent !\" — Nadia, Casa",
                "\"Économique et écolo\" — Karim, Rabat",
                "\"Parfait pour nos soirées\" — Siham",
              ],
            },
            {
              title: "Contactez-nous",
              items: [
                "📧 sara@louaab.ma",
                "📱 +212 6 65701513",
                "💬 WhatsApp : 9h–19h",
              ],
            },
          ].map((section, index) => (
            <motion.article
              key={section.title}
              className="space-y-5 rounded-[32px] bg-gradient-to-br from-soft-white to-mint/5 p-10 shadow-lg shadow-mist/40 transition-all hover:-translate-y-2 hover:shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <h3 className="text-2xl font-bold text-charcoal">{section.title}</h3>
              <ul className="space-y-3 text-sm text-slate">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {index === 2 ? (
                <Link
                  href="https://wa.me/212665701513"
                  className="mt-4 inline-flex items-center gap-2 font-semibold text-mint transition hover:text-lilac"
                >
                  💬 WhatsApp
                </Link>
              ) : null}
            </motion.article>
          ))}
    </div>
      </section>
    </PageShell>
  );
}

