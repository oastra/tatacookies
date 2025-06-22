// export default async function handler(req, res) {
//   const token = process.env.IG_ACCESS_TOKEN;
//   const igID = process.env.IG_BUSINESS_ID;

//   const response = await fetch(
//     `https://graph.facebook.com/v19.0/${igID}/media?fields=id,caption,media_url,permalink,media_type&access_token=${token}`
//   );

//   if (!response.ok) {
//     return res
//       .status(response.status)
//       .json({ error: "Failed to fetch Instagram posts" });
//   }

//   const data = await response.json();
//   res.status(200).json(data);
// }
