"use client";

import React from "react";
import Head from "next/head";

import Layout from "@/components/layout/Layout";
import ImageMarquee from "@/components/common/ImageMarquee";
import SectionWrapper from "@/components/common/SectionWrapper";
import ButtonOrLink from "@/components/ui/ButtonOrLink";
import VectorIcon from "@/components/icons/VectorIcon";

import CustomCookieForm from "@/components/forms/CustomCookieForm";

export default function ShopPage() {
  return (
    <>
      <Head>
        <title>Shop - Tatacookies | Custom Cookie Store Coming Soon</title>
        <meta
          name="description"
          content="Our online cookie shop is coming soon! Browse custom decorated cookies for weddings, birthdays & events. Place orders now while we build our e-commerce store."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tatacookies.com/shop" />

        {/* Open Graph for social sharing */}
        <meta
          property="og:title"
          content="Shop - Tatacookies | Custom Cookie Store Coming Soon"
        />
        <meta
          property="og:description"
          content="Our online cookie shop is coming soon! Place custom cookie orders while we prepare our e-commerce store."
        />
        <meta property="og:url" content="https://tatacookies.com/shop" />
        <meta property="og:type" content="website" />
      </Head>
      <Layout>
        <SectionWrapper className="relative overflow-hidden text-center">
          <div className="max-w-[800px] mx-auto">
            <h1 className="font-heading text-title2 text-mobTitle md:text-h1 font-semibold mb-4">
              Our Shop is Coming Soon!
            </h1>
            <p className="font-body text-button text-text mb-6 max-w-[600px] mx-auto">
              We’re baking something special! While the online shop is under
              construction, you can still place an order below.
            </p>
          </div>
          <div className="my-12">
            <ImageMarquee />
          </div>

          {/* Custom Order Form */}

          <ButtonOrLink href="/custom-order" className="bg-primary">
            Order Now <VectorIcon className="ml-2" />
          </ButtonOrLink>
        </SectionWrapper>
      </Layout>
    </>
  );
}
