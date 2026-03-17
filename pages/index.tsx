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
        <title>Hookies | Taverne Pirate Moderne</title>
        <meta name="description" content="Hookies, restaurant pirate moderne: cuisine signature, cocktails premium, reservation en ligne et experience immersive." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="text-white">
        <Header />
        <Hero />
        <Features />
        <Menu />
        <Footer />
      </main>
    </>
  );
}
