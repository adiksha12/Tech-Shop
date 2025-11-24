// Deterministic dummy review generator for products
// Returns an array of review objects: { id, name, rating, text, date }

const reviewTemplates = [
  "Excellent build and sound quality — highly recommend.",
  "Very comfortable, battery life is impressive.",
  "Good value for the price, but bass could be better.",
  "Average performance, expected slightly better clarity.",
  "Fantastic noise cancellation and crisp mids/highs.",
  "Not ideal for calls — microphone pickup is weak.",
  "Lightweight and perfect for long sessions.",
  "Solid headphones but a bit overpriced compared to rivals.",
  "Great connectivity and stable Bluetooth range.",
  "Easy setup and pairing. Loved the mobile app features."
];

function seededRandom(seed) {
  // simple LCG
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getReviewsForProduct(productId) {
  const rand = seededRandom(productId + 12345);
  // produce between 2 and 5 reviews
  const count = 2 + Math.floor(rand() * 4);
  const names = ['Asha', 'Vikram', 'Priya', 'Ravi', 'Sana', 'Arjun', 'Meera', 'Karan', 'Nisha', 'Amit'];
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(rand() * 5) + 1; // 1..5
    const name = names[Math.floor(rand() * names.length)];
    const tpl = reviewTemplates[Math.floor(rand() * reviewTemplates.length)];
    // vary text slightly by appending a short suffix
    const suffixes = ['', ' Works as expected.', ' Would buy again.', ' Minor issues with fit.', ' Good for daily use.'];
    const text = tpl + suffixes[Math.floor(rand() * suffixes.length)];
    // deterministic date in last 365 days
    const daysAgo = Math.floor(rand() * 365);
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0,10);
    reviews.push({ id: `${productId}-${i+1}`, name, rating: r, text, date });
  }
  return reviews;
}

export default getReviewsForProduct;