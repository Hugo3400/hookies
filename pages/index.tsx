import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Hookies - Restaurant Pirate</title>
        <meta name="description" content="Bienvenue au Hookies, le restaurant pirate thématique. Découvrez notre menu unique et réservez votre table." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="bg-pirate-dark text-white">
        <Header />
        <Hero />
        <Features />
        <Menu />
        <Footer />
      </main>
    </>
  );
}
