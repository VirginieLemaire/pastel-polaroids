import { Link } from "@/lib/router-compat";
import { ArrowLeft, Code2, FlaskConical, Gauge, Info, ShieldCheck, Sparkles } from "lucide-react";
import BrutalCard from "@/shared/ui/components/BrutalCard";
import BrutalButton from "@/shared/ui/components/BrutalButton";

export default function AboutPage() {
  return (
    <>
      <header className="max-w-2xl mx-auto w-full px-6 pt-8 pb-5 space-y-2">
        <Link
          to="/"
          className="font-mono text-sm font-bold inline-flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Retour
        </Link>
        <h1 className="font-mono text-3xl font-bold text-center pt-4">À propos</h1>
        <p className="font-mono text-sm text-center text-muted-foreground">
          Comment fonctionne ce site, et pourquoi vous pouvez tout tester sans risque.
        </p>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 bg-background px-6 pb-12">
        <div className="max-w-2xl mx-auto space-y-5">
          <BrutalCard color="card">
            <p className="font-mono text-sm">
              <strong>Photo de Famille</strong> est un concours photo familial : on crée un
              thème, chaque membre de la famille poste ses photos, puis tout le monde vote
              avant de découvrir les gagnantes. Un seul thème est actif à la fois, et
              l'application vous accompagne à travers ses trois phases : soumission, vote,
              puis résultats.
            </p>
          </BrutalCard>

          <BrutalCard color="sky">
            <div className="flex items-start gap-3">
              <FlaskConical aria-hidden="true" className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h2 className="font-mono font-bold">Le mode démo</h2>
                <p className="font-mono text-sm">
                  Ce site est une démonstration : il n'y a pas de vrai compte à créer, pas de
                  serveur ni de base de données. Toutes les données (thèmes, photos, votes)
                  sont fictives et générées dans votre navigateur. <span className="font-bold">En tant que visiteur(euse), vous incarnez Camille et voyez le site comme si vous êtiez authentifié(e) à sa place.</span>
                </p>
                <p className="font-mono text-sm">
                  Le bouton <span className="font-bold">Mode démo</span>, en haut à droite de
                  l'écran, permet de choisir une situation à explorer : un thème vide, en
                  cours de soumission, en cours de vote, ou déjà clôturé avec ses résultats.
                  Vous pouvez changer de situation à tout moment.
                </p>
              </div>
            </div>
          </BrutalCard>

          <BrutalCard color="mint">
            <div className="flex items-start gap-3">
              <ShieldCheck aria-hidden="true" className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h2 className="font-mono font-bold">Testez sans risque</h2>
                <p className="font-mono text-sm">
                  Créez un thème, soumettez des photos, votez, consultez les résultats : vous
                  pouvez essayer toutes les fonctionnalités sans conséquence. Rien n'est
                  jamais envoyé à un serveur, aucune photo n'est réellement stockée, et aucune
                  donnée personnelle n'est collectée.
                </p>
                <p className="font-mono text-sm">
                  Seule votre préférence de situation de démo est conservée localement
                  (<code>localStorage</code>), pour que vous puissiez recharger la page sans
                  la perdre. Un simple rechargement complet réinitialise l'exemple si vous
                  voulez repartir de zéro.
                </p>
              </div>
            </div>
          </BrutalCard>

          <BrutalCard color="butter">
            <div className="flex items-start gap-3">
              <Sparkles aria-hidden="true" className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h2 className="font-mono font-bold">Et ensuite ?</h2>
                <p className="font-mono text-sm">
                  Ce projet est une démonstration. Une version en production, avec une vraie
                  base de données et une authentification, est prévue pour la suite mais
                  restera privée. Vous pouvez consulter le code sur{" "}
                  <a
                    href="https://github.com/VirginieLemaire/pastel-polaroids"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:no-underline inline-flex items-center gap-1"
                  >
                    la page GitHub de Pastel Polaroïd
                    <Code2 size={14} aria-hidden="true" />
                    <span className="sr-only">(ouvre un nouvel onglet)</span>
                  </a>
                  .
                </p>
              </div>
            </div>
          </BrutalCard>

          <BrutalCard color="peach">
            <div className="flex items-start gap-3">
              <Info aria-hidden="true" className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h2 className="font-mono font-bold">Mentions et Crédits</h2>
                <p className="font-mono text-sm">
                  Ce site étant personnel et n'ayant aucun but commercial, il ne dispose pas de
                  mentions légales.
                </p>
                <p className="font-mono text-sm">
                  Les photos utilisées sont libres de droits, issues d'
                  <a
                    href="https://unsplash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:no-underline"
                  >
                    Unsplash
                    <span className="sr-only"> (ouvre un nouvel onglet)</span>
                  </a>
                  .
                </p>
                <p className="font-mono text-sm">
                  Le site a été créé avec l'aide d'IA :{" "}
                  <a
                    href="https://lovable.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:no-underline"
                  >
                    Lovable
                    <span className="sr-only"> (ouvre un nouvel onglet)</span>
                  </a>
                  ,{" "}
                  <a
                    href="https://mistral.ai/fr/products/vibe/code/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:no-underline"
                  >
                    Mistral Vibe
                    <span className="sr-only"> (ouvre un nouvel onglet)</span>
                  </a>{" "}
                  et{" "}
                  <a
                    href="https://claude.com/fr/product/claude-code"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:no-underline"
                  >
                    Claude Code
                    <span className="sr-only"> (ouvre un nouvel onglet)</span>
                  </a>
                  . Il est hébergé sur{" "}
                  <a
                    href="https://vercel.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:no-underline"
                  >
                    Vercel
                    <span className="sr-only"> (ouvre un nouvel onglet)</span>
                  </a>
                  .
                </p>
              </div>
            </div>
          </BrutalCard>

          <BrutalCard color="lavender">
            <div className="flex items-start gap-3">
              <Gauge aria-hidden="true" className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h2 className="font-mono font-bold">Accessibilité et éco-conception</h2>
                <p className="font-mono text-sm">
                  Un test d'accessibilité basique (non approfondi) réalisé sur{" "}
                  <a
                    href="https://tabnav.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:no-underline"
                  >
                    tabnav.com
                    <span className="sr-only"> (ouvre un nouvel onglet)</span>
                  </a>{" "}
                  obtient un score de 100 %.
                </p>
                <p className="font-mono text-sm">
                  Un test d'éco-conception sur{" "}
                  <a
                    href="https://www.ecoindex.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:no-underline"
                  >
                    EcoIndex
                    <span className="sr-only"> (ouvre un nouvel onglet)</span>
                  </a>{" "}
                  obtient un score de 89/100, soit, d'après leur estimation, l'équivalent
                  d'un trajet de 5,5 km en voiture ou d'une douche de 4 minutes par mois,
                  pour 1000 visiteurs mensuels.
                </p>
              </div>
            </div>
          </BrutalCard>

          <div className="flex justify-center pt-2">
            <Link to="/">
              <BrutalButton color="mint">Retour à l'accueil</BrutalButton>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
