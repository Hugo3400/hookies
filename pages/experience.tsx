import Head from 'next/head';
import Header from '@/components/Header';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function ExperiencePage() {
  return (
    <>
      <Head>
        <title>L'Aventure | Hookies</title>
        <meta
          name="description"
          content="Découvrez l'univers Hookies : grill au feu de bois, décor de taverne, rhums arrangés et soirées pirates."
        />
      </Head>

      <main>
        <Header />
        <section className="px-4 pt-14 md:px-6 md:pt-20">
          <div className="mx-auto w-full max-w-7xl">
            <h1 className="font-pirate text-4xl text-gold md:text-5xl">L'Aventure Hookies</h1>
            <p className="mt-3 max-w-lg text-sm text-parchment/60">
              Décor de taverne, cuisine visible et soirées pirates. Voilà ce qui nous attend.
            </p>
            <div className="rope-line mt-4 w-24" />
          </div>
        </section>
        <Features />
        <Footer />
      </main>
    </>
  );
}
