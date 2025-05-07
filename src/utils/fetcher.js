export const apiFetcher = async ({
  url,
  method = "GET",
  token = "",
  body = null,
}) => {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(errorData.message || "API request failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error:", error) ;
  }
};
