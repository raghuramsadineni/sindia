import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getAuth } from "firebase-admin/auth";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  console.log("Sign in", request);
  const auth = getAuth(app);

  /* Get token from request headers */
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!idToken) {
    return new Response(
      "No token found",
      { status: 401 }
    );
  }

  /* Verify id token */
  try {
    await auth.verifyIdToken(idToken).then((user) => {
      if(!user.admin){
        return redirect("/en/?error=User does not have admin privileges");
      }
    });
  } catch (error) {
    return new Response(
      "Invalid token",
      { status: 401 }
    );
  }

  /* Create and set session cookie */
  const fiveDays = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: fiveDays,
  });

  cookies.set("__session", sessionCookie, {
    path: "/en/",
  });
  cookies.set("__session", sessionCookie, {
    path: "/",
  });

  return redirect("/en/dashboard?success=Signed in successfully");
};