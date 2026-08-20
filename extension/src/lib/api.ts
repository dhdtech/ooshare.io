export const DEFAULT_API_BASE = "https://api.ooshare.io";

export interface CreateSecretResult {
  id: string;
  alias: string | null;
}

export async function createSecret(
  ciphertext: string,
  ttlHours: number,
  id: string,
  apiBase: string = DEFAULT_API_BASE,
): Promise<CreateSecretResult> {
  const res = await fetch(`${apiBase}/api/secrets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ciphertext, ttl_hours: ttlHours, id }),
  });
  if (!res.ok) throw new Error(await readServerError(res, "Failed to create secret"));
  const data = await res.json();
  return { id: data.id, alias: data.alias ?? null };
}

export interface GetSecretResult {
  ciphertext: string;
  id: string;
}

export async function getSecret(
  id: string,
  apiBase: string = DEFAULT_API_BASE,
): Promise<GetSecretResult> {
  const res = await fetch(`${apiBase}/api/secrets/${id}`);
  if (res.status === 404) throw new Error("Secret not found or already viewed");
  if (!res.ok) throw new Error(await readServerError(res, "Failed to retrieve secret"));
  const data = await res.json();
  return { ciphertext: data.ciphertext, id: data.id };
}

async function readServerError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    if (body?.error) return body.error;
  } catch {
    /* ignore non-JSON bodies */
  }
  return fallback;
}
