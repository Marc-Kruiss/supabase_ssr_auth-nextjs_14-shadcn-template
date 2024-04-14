import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const supabase = createClient();

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    console.log("SEARCH PARAMS");
    console.log(searchParams);
    redirectTo.searchParams.delete("token_hash");
    redirectTo.searchParams.delete("type");
    redirectTo.searchParams.delete("next");

    if (!error) {
      switch (type) {
        case "signup":
          redirectTo.pathname = "/protected";
        case "invite":
          redirectTo.pathname = "/password-reset";
          break;
        case "magiclink":
          redirectTo.pathname = "/protected";
          break;
        case "recovery":
          redirectTo.pathname = "/password-reset";
        case "email_change":
          redirectTo.pathname = "/login";
          break;
        case "email":
          redirectTo.pathname = "/protected";
          break;
        default:
          break;
      }
      return NextResponse.redirect(redirectTo);
    } else {
      // return the user to an error page with some instructions
      redirectTo.searchParams.set("message", error.message);
      redirectTo.pathname = `/auth/unauthorized`;
      return NextResponse.redirect(redirectTo);
    }
  } else {
    redirectTo.pathname = "/";
    return NextResponse.redirect(redirectTo);
  }
}
