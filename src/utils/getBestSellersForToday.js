import bestSellersList from "@/data/bestSellersList";

// Helper to convert MM-DD to comparable number
const parseDate = (str) => {
  const [month, day] = str.split("-").map(Number);
  return month * 100 + day;
};

const todayKey = () => {
  const now = new Date();
  return (now.getMonth() + 1) * 100 + now.getDate(); // e.g., June 19 → 619
};

export default function getBestSellersForToday() {
  const today = todayKey();

  const inSeason = bestSellersList.filter((item) => {
    const start = parseDate(item.start);
    const end = parseDate(item.end);
    if (start <= end) return today >= start && today <= end;
    return today >= start || today <= end; // wrap-around support (e.g. Dec–Jan)
  });

  const random = bestSellersList.filter(
    (item) => !inSeason.some((seasonal) => seasonal.image === item.image)
  );

  // Shuffle utility
  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

  const seasonal = shuffle(inSeason).slice(0, 3);
  const filler = shuffle(random).slice(0, inSeason.length > 0 ? 1 : 4);

  return [...seasonal, ...filler];
}
