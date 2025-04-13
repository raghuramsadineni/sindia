import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";

export const POST: APIRoute = async ({ request, redirect }) => {
    const auth = getAuth(app);

    /* Get token from request headers */
    const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
    if (!idToken) {
        return new Response(
            "No token found",
            { status: 401 }
        );
    }

    /* Get form data */
    const formData = await request.formData();
    const uid = formData.get("uid")?.toString();

    const resp = await auth.verifyIdToken(idToken).then(async (user) => {
        if (!user.admin) {
            return redirect("/?error=User does not have admin privileges");
        }
        await auth.setCustomUserClaims(uid, { admin: true })
    });

    return new Response(JSON.stringify(resp));
};