export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const googleRes = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask":
            "placePredictions.displayName.text,placePredictions.placeId",
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await googleRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Autocomplete error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
