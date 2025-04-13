import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect, cookies }) => {
  cookies.delete("__session", {
    path: "/en/",
  });
  return redirect("/en/signin?message=Signed out successfully");
};