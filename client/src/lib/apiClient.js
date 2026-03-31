import useAuthStore from "../store/authStore";

const BASE_URL = "http://localhost:3000/api";

let refreshPromise = null;

const buildUrl = (endpoint) => {
  if (endpoint.startsWith("http")) return endpoint;
  return `${BASE_URL}${endpoint}`;
};

const parseJson = async (res) => {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

const makeError = (status, payload) => {
  const err = new Error(payload?.message || `Request failed (${status})`);
  err.status = status;
  err.data = payload;
  return err;
};

const doRefresh = async () => {
  const { refreshToken, logout, setTokens } = useAuthStore.getState();
  if (!refreshToken) {
    logout();
    throw new Error("Session expired. Please log in again.");
  }

  const res = await fetch(buildUrl("/user/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = await parseJson(res);
  if (!res.ok) {
    logout();
    throw makeError(res.status, payload);
  }

  const nextTokens = payload?.data || payload;
  if (!nextTokens?.accessToken || !nextTokens?.refreshToken) {
    logout();
    throw new Error("Invalid refresh response from server.");
  }

  setTokens({
    accessToken: nextTokens.accessToken,
    refreshToken: nextTokens.refreshToken,
  });

  return nextTokens.accessToken;
};

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export async function apiRequest(
  endpoint,
  { method = "GET", body, headers = {}, auth = false, retryOn401 = true } = {},
) {
  const { accessToken } = useAuthStore.getState();
  const requestHeaders = { ...headers };

  if (!(body instanceof FormData) && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth && accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(buildUrl(endpoint), {
    method,
    headers: requestHeaders,
    ...(body !== undefined
      ? {
          body:
            body instanceof FormData || typeof body === "string"
              ? body
              : JSON.stringify(body),
        }
      : {}),
  });

  const payload = await parseJson(res);

  if (res.status === 401 && auth && retryOn401) {
    try {
      const newAccessToken = await refreshAccessToken();
      return apiRequest(endpoint, {
        method,
        body,
        headers: {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
        auth: false,
        retryOn401: false,
      });
    } catch {
      throw makeError(res.status, payload);
    }
  }

  if (!res.ok) {
    throw makeError(res.status, payload);
  }

  return payload;
}

export { BASE_URL };
