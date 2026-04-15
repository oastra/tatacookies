import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/admin/reset-password`
        : "https://tatacookies.com/admin/reset-password";

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo }
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Forgot Password - TaTaCookies Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-[#EFF7F6]">
        <div className="w-full max-w-sm bg-white rounded-[20px] shadow-cookie p-8">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/images/LogoTataCookies.svg"
              alt="TaTaCookies logo"
              width={80}
              height={80}
            />
            <p className="text-base text-text60 mt-3">Reset Password</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-text">
                If you are registered, a password reset link has been sent to
                your email. It may take a minute to arrive.
              </p>
              <Link
                href="/admin/login"
                className="inline-block text-sm text-primary hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@tatacookies.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-[8px] text-sm text-text bg-[#EFF7F6] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-text font-medium text-button rounded-full hover:bg-secondary transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <Link
                  href="/admin/login"
                  className="text-sm text-text60 hover:text-text"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
