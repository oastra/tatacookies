"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import SectionWrapper from "@/components/common/SectionWrapper";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <SectionWrapper>
        <div className="max-w-3xl px-6 py-10 mx-auto text-text leading-6">
          {/* Privacy Policy */}
          <h1 id="privacy" className="h1 mb-6">
            Privacy Policy
          </h1>
          <p className="mb-6">
            Tatacookies respects your privacy and is committed to protecting
            your personal information. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your data when you visit our
            website <strong>tatacookies.com</strong> and engage with our
            services.
          </p>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Personal info: name, email, phone, delivery address</li>
            <li>
              Order info: event theme, quantity, delivery method, budget, notes
            </li>
            <li>Uploaded inspiration files</li>
            <li>Technical data like IP address and browser (via cookies)</li>
          </ul>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 mb-6">
            <li>To fulfil and manage cookie orders</li>
            <li>To respond to inquiries and send confirmations</li>
            <li>To improve our site and user experience</li>
            <li>To send updates or marketing emails (if opted in)</li>
            <li>To meet legal obligations</li>
          </ul>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            3. Sharing Your Information
          </h2>
          <ul className="list-disc pl-6 mb-6">
            <li>We never sell your personal data</li>
            <li>
              We share data only with trusted providers like email, payments, or
              delivery services
            </li>
            <li>We may disclose info when legally required</li>
          </ul>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            4. Data Storage & Security
          </h2>
          <p className="mb-6">
            We store your information securely and use modern safeguards to
            prevent unauthorized access or misuse.
          </p>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            5. Cookies & Analytics
          </h2>
          <p className="mb-6">
            We use cookies and tools like Google Analytics to understand visitor
            behavior and improve our site. You can control cookies via your
            browser settings.
          </p>

          <h2 className="text-h2 text-text60 mt-8 mb-4">6. Your Rights</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Access your data or request changes</li>
            <li>Request deletion of your personal info</li>
            <li>Opt out of marketing at any time</li>
          </ul>

          <p className="mb-6">
            To make a request, contact us at{" "}
            <a
              href="mailto:info@tatacookies.com"
              className="text-title underline"
            >
              info@tatacookies.com
            </a>
          </p>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            7. Children’s Privacy
          </h2>
          <p className="mb-6">
            Our website is not intended for children under 13. We do not
            knowingly collect data from children.
          </p>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            8. Changes to This Policy
          </h2>
          <p className="mb-6">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page.
          </p>

          <hr className="my-12 border-text20" />

          {/* Terms of Service */}
          <h1 id="terms" className="h1 mb-6">
            Terms of Service
          </h1>
          <p className="mb-6">
            These Terms of Use govern your access to and use of the Tatacookies
            website. By using our site or placing an order, you agree to be
            bound by these terms.
          </p>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            1. Orders & Customisation
          </h2>
          <ul className="list-disc pl-6 mb-6">
            <li>
              All cookies are handmade and may vary slightly from inspiration
              images.
            </li>
            <li>
              Orders must be placed at least 7 days in advance (subject to
              availability). We guarantee your order will be ready for your
              event if it&apos;s placed at least 14 days in advance.
            </li>

            <li>
              Once confirmed, custom orders cannot be refunded or changed.
            </li>
          </ul>

          <h2 className="text-h2 text-text60 mt-8 mb-4">2. Payments</h2>
          <p className="mb-6">
            All prices are in AUD. Full payment is required before production
            begins. We use secure third-party payment providers such as Stripe.
          </p>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            3. Allergies Disclaimer
          </h2>
          <p className="mb-6">
            While we do our best to avoid allergens, our cookies may contain or
            come into contact with wheat, nuts, soy, eggs, or dairy.
          </p>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            4. Intellectual Property
          </h2>
          <p className="mb-6">
            All content on this site—including images, text, logos, and product
            designs—is the property of Tatacookies and may not be copied or
            reused without written permission.
          </p>

          <h2 className="text-h2 text-text60 mt-8 mb-4">
            5. Limitation of Liability
          </h2>
          <p className="mb-6">
            We are not liable for any damages arising from the use of our
            website or the consumption of our products, to the extent permitted
            by Australian law.
          </p>

          <h2 className="text-h2 text-text60 mt-8 mb-4">6. Governing Law</h2>
          <p className="mb-6">
            These terms are governed by the laws of New South Wales, Australia.
          </p>
        </div>
      </SectionWrapper>
    </Layout>
  );
};

export default PrivacyPolicy;
