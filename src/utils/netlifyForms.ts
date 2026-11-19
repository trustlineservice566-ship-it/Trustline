export function encodeNetlifyForm(
  formName: string,
  fields: Record<string, string>
): string {
  const params = new URLSearchParams();
  params.set('form-name', formName);
  for (const [key, value] of Object.entries(fields)) {
    params.set(key, value);
  }
  return params.toString();
}

export function shouldSubmitToNetlify(hostname: string): boolean {
  if (!hostname) return false;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return false;
  if (hostname.endsWith('.run.app')) return false;
  return true;
}

export async function submitToNetlifyForm(
  formName: string,
  fields: Record<string, string>
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!shouldSubmitToNetlify(window.location.hostname)) return;

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeNetlifyForm(formName, fields),
    });
  } catch {
    // Graceful client fallback if offline or blocked
  }
}
