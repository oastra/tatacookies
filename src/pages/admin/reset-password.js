import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase sends the user back with a hash fragment containing the
    // access_token and refresh_token. The JS client picks these up
    // automatically via onAuthStateChange. We listen for PASSWORD_RECOVERY
    // to know the session is ready.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Also check if user already has a session (e.g. page reload)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.replace("/admin"), 2000);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Set New Password - TaTaCookies Admin</title>
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
            <p className="text-base text-text60 mt-3">Set New Password</p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-green-600 font-medium">
                Password updated successfully!
              </p>
              <p className="text-sm text-text60">
                Redirecting to dashboard...
              </p>
            </div>
          ) : !ready ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-text60">
                Verifying your reset link...
              </p>
              <p className="text-sm text-text60">
                If this takes too long, your link may have expired.
              </p>
              <Link
                href="/admin/forgot-password"
                className="inline-block text-sm text-primary hover:underline"
              >
                Request a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-[8px] text-sm text-text bg-[#EFF7F6] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-primary transition"
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                        <circle cx="10" cy="10" r="2.5" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                        <circle cx="10" cy="10" r="2.5" />
                        <path d="M3 3l14 14" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-[8px] text-sm text-text bg-[#EFF7F6] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-text font-medium text-button rounded-full hover:bg-secondary transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
