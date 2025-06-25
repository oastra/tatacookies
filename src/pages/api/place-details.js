export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const googleRes = await fetch(
      "https://places.googleapis.com/v1/places/" +
        encodeURIComponent(req.body.placeId),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask":
            "id,formattedAddress,location.latitude,location.longitude,addressComponents",
        },
      }
    );

    const data = await googleRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Place details error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
