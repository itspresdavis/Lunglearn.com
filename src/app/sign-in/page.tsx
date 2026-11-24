import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/interactive";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function SignInPage() {
  return (
    <section className="section wrap">
      <h1>Sign in</h1>
      <AuthForm mode="sign-in" />
      <p><Link href="/sign-up">Create an account</Link></p>
    </section>
  );
}
