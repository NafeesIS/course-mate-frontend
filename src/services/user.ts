export async function getUserInfo() {
  const res = await fetch("http://localhost:4000/auth/me", {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
}
