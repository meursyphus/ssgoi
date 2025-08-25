"use client";

import React from "react";
import { fade } from "@ssgoi/react/view-transitions";
import { BrowserMockup, DemoPage, DemoLink } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";

// Simple demo pages for fade transition
function HomePage() {
  return (
    <DemoPage
      title="Home"
      className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="space-y-4">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Welcome to our website. Experience smooth fade transitions as you
          navigate.
        </p>
        <div className="grid gap-4 mt-8">
          <DemoLink to="/about" className="text-lg">
            → About Us
          </DemoLink>
          <DemoLink to="/services" className="text-lg">
            → Our Services
          </DemoLink>
          <DemoLink to="/contact" className="text-lg">
            → Contact
          </DemoLink>
        </div>
      </div>
    </DemoPage>
  );
}

function AboutPage() {
  return (
    <DemoPage
      title="About Us"
      className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="space-y-4">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          We are a creative team passionate about building amazing web
          experiences.
        </p>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400">
            To create smooth, delightful transitions that enhance user
            experience.
          </p>
        </div>
        <DemoLink to="/" className="text-lg">
          ← Back to Home
        </DemoLink>
      </div>
    </DemoPage>
  );
}

function ServicesPage() {
  return (
    <DemoPage
      title="Services"
      className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Web Development</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Modern, responsive websites
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">UI/UX Design</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Beautiful, intuitive interfaces
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Animation</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Smooth, delightful transitions
            </p>
          </div>
        </div>
        <DemoLink to="/" className="text-lg">
          ← Back to Home
        </DemoLink>
      </div>
    </DemoPage>
  );
}

function ContactPage() {
  return (
    <DemoPage
      title="Contact"
      className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                rows={4}
                placeholder="Your message..."
              />
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Send Message
            </button>
          </div>
        </div>
        <DemoLink to="/" className="text-lg">
          ← Back to Home
        </DemoLink>
      </div>
    </DemoPage>
  );
}

// Route configuration
const fadeRoutes: RouteConfig[] = [
  { path: "/", component: HomePage, label: "Home" },
  { path: "/about", component: AboutPage, label: "About" },
  { path: "/services", component: ServicesPage, label: "Services" },
  { path: "/contact", component: ContactPage, label: "Contact" },
];

export function FadeDemo() {
  const config = {
    defaultTransition: fade(),
  };

  return (
    <BrowserMockup
      routes={fadeRoutes}
      config={config}
      showNavigation={true}
      navigationPosition="bottom"
    />
  );
}
