/**
 * Reviews / Ratings
 * -----------------
 * Ratings from top third-party review platforms, shown in the homepage
 * Reviews section. Press mentions are shown as a secondary "as featured in" row.
 *
 * NOTE: scores/links are sensible defaults — confirm the real ratings, review
 * counts and profile URLs with the client before launch.
 */

export interface ReviewRating {
  firm: string;
  score: string;   // out of 5
  reviews: string;  // short volume label
  href: string;
  logo: string;
}

export const reviewRatings: ReviewRating[] = [
  { firm: "Clutch", score: "4.9", reviews: "30+ reviews", href: "https://clutch.co/", logo: "/assets/logos/clutch.png" },
  { firm: "GoodFirms", score: "5.0", reviews: "20+ reviews", href: "https://www.goodfirms.co/", logo: "/assets/logos/goodfirms.png" },
  { firm: "Trustpilot", score: "4.8", reviews: "40+ reviews", href: "https://www.trustpilot.com/", logo: "/assets/logos/trustpilot.png" },
  { firm: "Yelp", score: "5.0", reviews: "15+ reviews", href: "https://www.yelp.com/", logo: "/assets/logos/yelp.png" },
  { firm: "DesignRush", score: "4.9", reviews: "Top agency", href: "https://www.designrush.com/", logo: "/assets/logos/designrush.png" },
  { firm: "TopDevelopers", score: "5.0", reviews: "Verified", href: "https://www.topdevelopers.co/", logo: "/assets/logos/topdevelopers.png" },
];

/** Press / media mentions shown in the "as featured in" row. */
export const pressMentions: string[] = ["Forbes", "Fast Company", "TechMullion", "SoftwareWorld"];
