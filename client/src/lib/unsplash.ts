const UNSPLASH_ACCESS_KEY = "your-unsplash-access-key"; // Add this to env vars in production

export async function getRandomPhoto(): Promise<string> {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?query=nature,landscape,inspiration&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch photo");
  }

  const data = await response.json();
  return data.urls.regular;
}
