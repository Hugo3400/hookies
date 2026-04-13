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
        <title>Hookies — Restaurant pirate</title>
        <meta name="description" content="Restaurant pirate Hookies : fish burgers, fruits de mer, huîtres, moules frites et boissons maison. Ouvert 7j/7 de 11h30 à 23h30. Réservation en ligne." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <Header />
        <Hero />
        <Features />
        <Menu />
        <Footer />
      </main>
    </>
  );
}
