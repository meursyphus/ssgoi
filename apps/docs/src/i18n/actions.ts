"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SUPPORTED_LANGUAGES } from "./supported-languages";

const LANGUAGE_COOKIE_NAME = "preferred-language";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function setLanguagePreference(locale: string, currentPath: string) {
  // Validate the locale
  if (!SUPPORTED_LANGUAGES.includes(locale)) {
    throw new Error(`Unsupported language: ${locale}`);
  }

  // Set the cookie
  const cookieStore = await cookies();
  cookieStore.set(LANGUAGE_COOKIE_NAME, locale, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  // Update the path with the new locale
  const pathSegments = currentPath.split("/");
  pathSegments[1] = locale;
  const newPath = pathSegments.join("/");

  // Redirect to the new path
  redirect(newPath);
}

export async function getLanguagePreference(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(LANGUAGE_COOKIE_NAME);
  return cookie?.value || null;
}