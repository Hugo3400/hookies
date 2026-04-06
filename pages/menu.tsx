import Head from 'next/head';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';
import { MENU_CONTENT } from '@/lib/config/siteContent';

export default function MenuPage() {
  return (
    <>
      <Head>
        <title>{MENU_CONTENT.pageTitle}</title>
        <meta
          name="description"
          content={MENU_CONTENT.pageDescription}
        />
      </Head>

      <main>
        <Header />
        <section className="px-4 pt-14 md:px-6 md:pt-20">
          <div className="mx-auto w-full max-w-7xl">
            <h1 className="font-pirate text-4xl text-gold md:text-5xl">{MENU_CONTENT.heading}</h1>
            <p className="mt-3 max-w-lg text-sm text-parchment/60">
              {MENU_CONTENT.intro}
            </p>
            <div className="rope-line mt-4 w-24" />
          </div>
        </section>
        <Menu />
        <Footer />
      </main>
    </>
  );
}
