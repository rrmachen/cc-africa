export type Church = {
  id: string;
  name: string;
  denominationAffiliation?: string | null;
  location?: {
    country?: string | null;
    region?: string | null;
    city?: string | null;
  } | null;
  contactInformation?: {
    mainEmail?: string | null;
    mainPhone?: string | null;
  } | null;
};

export type ChurchSearchResponse = {
  docs: Church[];
};

const FALLBACK_BASE_URL = 'http://localhost:3000';

const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_PAYLOAD_URL || FALLBACK_BASE_URL;
};

export async function getPublishedChurches(): Promise<Church[]> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(
      `${baseUrl}/api/churches?limit=12&where[_status][equals]=published`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      console.error('Failed to load churches', await response.text());
      return [];
    }

    const payload = (await response.json()) as ChurchSearchResponse;
    return payload.docs || [];
  } catch (error) {
    console.error('Error loading churches', error);
    return [];
  }
}
