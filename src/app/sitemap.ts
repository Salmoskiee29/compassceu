import type { MetadataRoute } from "next";
import { courses } from "@/lib/courses";
import { comingSoon } from "@/lib/site";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  if (comingSoon) return [{ url: BASE_URL }];
  const pages = ["", "/courses", "/about", "/contact", "/verify"].map((p) => ({
    url: `${BASE_URL}${p}`,
  }));
  const coursePages = courses.map((c) => ({ url: `${BASE_URL}/courses/${c.slug}` }));
  return [...pages, ...coursePages];
}
