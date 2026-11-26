import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/interactive";

export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: false } };

export default function SignUpPage() {
  return (
    <section className="section wrap schema">
      <h1>Create an account</h1>
      <p>Use at least 10 characters. A new account is free until a subscription is actually paid.</p>
      <AuthForm mode="sign-up" />
      <p><Link href="/sign-in">Already have an account</Link></p>
    </section>
  );
}
