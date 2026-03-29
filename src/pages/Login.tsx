import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/src/integrations/supabase/client";
import { Input } from "@heroui/react";
import { toast } from "sonner";
import { Ripple } from "@/components/magicui/ripple";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) checkRoleAndRedirect(data.session.user.id);
    });
  }, []);

  async function checkRoleAndRedirect(userId: string) {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    navigate(data?.role === "admin" ? "/admin" : "/");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    if (data.user) { toast.success("Login berhasil!"); checkRoleAndRedirect(data.user.id); }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden px-4">
      {/* Background effect */}
      <Ripple />

      {/* Card */}
      <BlurFade delay={0.2} inView>
        <div className="relative z-10 w-96 ">
          <div className="relative rounded-2xl border border-default-200/60 bg-background/80 backdrop-blur-xl p-8 shadow-2xl">

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
               Admin Login
              </h1>
              <p className="text-default-400 text-sm mt-1">Masuk untuk mengelola portfolio</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="bordered"
                radius="lg"
                isRequired
                classNames={{
                  inputWrapper: "border-default-200/60 hover:border-primary/50 focus-within:border-primary transition-colors bg-default-50/30",
                }}
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="bordered"
                radius="lg"
                isRequired
                classNames={{
                  inputWrapper: "border-default-200/60 hover:border-primary/50 focus-within:border-primary transition-colors bg-default-50/30",
                }}
              />

              <div className="flex flex-col gap-2 mt-2">
                <ShimmerButton
                  type="submit"
                  className="w-full shadow-lg"
                  shimmerColor="violet"
                  disabled={loading}
                >
                  <span className="flex items-center justify-center gap-2 text-white font-medium">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {loading ? "Masuk..." : "Masuk"}
                  </span>
                </ShimmerButton>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center gap-1.5 text-default-400 hover:text-primary text-sm py-2 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali ke Portfolio
                </button>
              </div>
            </form>

            <BorderBeam duration={10} size={300} />
          </div>
        </div>
      </BlurFade>
    </div>
  );
}