export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated.");
  }

  // Add Authorization and Content-Type headers
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, options);

  // Check if the response is okay
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors ? errorData.errors[0].message : "An error occurred"
    );
  }

    if (response.status === 204) {
      return null;
    }
  
  return response.json();
}