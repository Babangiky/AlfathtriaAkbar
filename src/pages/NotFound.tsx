import { Link } from "react-router-dom";
import { Ripple } from "@/components/magicui/ripple";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Home } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden">
      <Ripple />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <BlurFade delay={0.2} inView>
          <h1 className="text-[10rem] drop-shadow-2xl sm:text-[14rem] lg:text-[18rem] font-black tracking-tighter leading-none select-none">
          404
          </h1>
        </BlurFade>

        <BlurFade delay={0.4} inView>
          <p className="text-default-500 text-base sm:text-lg mt-2 mb-8">
           Ups! Halaman yang Anda cari tidak tersedia
          </p>
        </BlurFade>

        <BlurFade delay={0.5} inView>
          <Link to="/">
            <ShimmerButton className="shadow-xl px-8" shimmerColor="violet">
              <span className="flex items-center gap-2 text-white font-medium">
                <Home className="w-4 h-4" />
                Back to Home
              </span>
                 <BorderBeam duration={8} size={400} />
            </ShimmerButton>
          </Link>
        </BlurFade>
      </div>
    </div>
  );
}