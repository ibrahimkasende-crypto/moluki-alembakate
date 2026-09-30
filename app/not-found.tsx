import Link from "next/link"

export default function NotFound() {
  return (
    <main id="contenu" className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-serif text-6xl text-wine-deep">404</p>
        <h1 className="mt-4 font-serif text-4xl">Cette page n&apos;est pas dans la maison.</h1>
        <Link href="/" className="mt-8 inline-block text-[11px] uppercase tracking-[0.2em] underline underline-offset-4">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  )
}
