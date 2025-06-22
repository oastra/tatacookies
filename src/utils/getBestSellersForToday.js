import bestSellersList from "@/data/bestSellersList";

// Helper to convert MM-DD to comparable number
const parseDate = (str) => {
  const [month, day] = str.split("-").map(Number);
  return month * 100 + day;
};

const todayKey = () => {
  const now = new Date();
  return (now.getMonth() + 1) * 100 + now.getDate(); // e.g., June 22 → 622
};

export default function getBestSellersForToday() {
  const today = todayKey();

  const inSeason = bestSellersList.filter((item) => {
    const start = parseDate(item.start);
    const end = parseDate(item.end);
    if (start <= end) return today >= start && today <= end;
    return today >= start || today <= end;
  });

  // 👇 Only use the "Random (fallbacks)" group for random picks
  const fallbackRandoms = bestSellersList.filter(
    (item) => item.start === "05-05" && item.end === "05-25"
  );

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  if (inSeason.length >= 3) {
    const seasonal = shuffle(inSeason).slice(0, 3);
    const oneRandom = shuffle(fallbackRandoms).slice(0, 1);
    return [...seasonal, ...oneRandom];
  } else {
    return shuffle(fallbackRandoms).slice(0, 4);
  }
}
