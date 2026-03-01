const windowMs = 60 * 1000;
const maxRequests = 10;

const requests = new Map<string, number[]>();

export function rateLimit(ip: string): { success: boolean } {
  const now = Date.now();
  const timestamps = requests.get(ip) ?? [];
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= maxRequests) {
    requests.set(ip, valid);
    return { success: false };
  }

  valid.push(now);
  requests.set(ip, valid);
  return { success: true };
}
