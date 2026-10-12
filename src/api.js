export async function api(path, { method = "GET", body, token } = {}) {
  const r = await fetch("/api/auth" + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw data;
  return data;
}
export const errMsg = (e) => Object.values(e || {}).flat().join(" ") || "Something went wrong.";
