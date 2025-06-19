export default function getRandomImagesByCategory(imagesByCategory, count = 5) {
  const randomized = {};

  for (const category in imagesByCategory) {
    const images = imagesByCategory[category];
    randomized[category] = [...images]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  return randomized;
}
