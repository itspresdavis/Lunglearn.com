import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/interactive";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <section className="section wrap schema">
      <h1>Sign in</h1>
      <AuthForm mode="sign-in" next={next} />
      <p><Link href="/sign-up">Create an account</Link></p>
    </section>
  );
}
