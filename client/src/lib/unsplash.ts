const UNSPLASH_ACCESS_KEY = "ZyGAWLKApaJrfuiIdaqA4PR5LktN12C7yrzNvjpNC_s";

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