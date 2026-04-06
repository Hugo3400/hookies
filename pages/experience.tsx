import Head from 'next/head';
import Header from '@/components/Header';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { EXPERIENCE_CONTENT } from '@/lib/config/siteContent';

export default function ExperiencePage() {
  return (
    <>
      <Head>
        <title>{EXPERIENCE_CONTENT.pageTitle}</title>
        <meta
          name="description"
          content={EXPERIENCE_CONTENT.pageDescription}
        />
      </Head>

      <main>
        <Header />
        <section className="px-4 pt-14 md:px-6 md:pt-20">
          <div className="mx-auto w-full max-w-7xl">
            <h1 className="font-pirate text-4xl text-gold md:text-5xl">{EXPERIENCE_CONTENT.heading}</h1>
            <p className="mt-3 max-w-lg text-sm text-parchment/60">
              {EXPERIENCE_CONTENT.intro}
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
