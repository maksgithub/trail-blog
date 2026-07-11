"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<"loading" | "anon" | "authed">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      setState(data.session ? "authed" : "anon");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setState(session ? "authed" : "anon");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError("Невірний email або пароль");
  };

  if (state === "loading")
    return <p className="text-center py-16 text-gray-500">Завантаження…</p>;

  if (state === "anon")
    return (
      <form onSubmit={login} className="max-w-sm mx-auto mt-16 space-y-4">
        <h1 className="text-2xl font-bold text-center">Вхід для адміна</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[var(--forest)] text-white py-2 rounded-lg hover:bg-[var(--forest-dark)] cursor-pointer"
        >
          Увійти
        </button>
      </form>
    );

  return <>{children}</>;
}
