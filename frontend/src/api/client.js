const productionApiUrl = "https://import2profit-api.onrender.com/api";
const localApiUrl = "http://localhost:5000/api";

function getDefaultApiUrl() {
  if (typeof window !== "undefined" && window.location.hostname.includes("netlify.app")) {
    return productionApiUrl;
  }

  return localApiUrl;
}

const API_URL = import.meta.env.VITE_API_URL || getDefaultApiUrl();

export function getAssetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL.replace("/api", "")}${path}`;
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("import2profit_token");
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Não foi possível concluir o pedido.");
  }

  return payload;
}
