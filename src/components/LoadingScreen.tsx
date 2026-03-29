import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      
      {/* Lottie Animation */}
      <div className="w-40 h-40 mb-6">
        <DotLottieReact
          src="https://lottie.host/594dad51-5868-453d-b235-751507f8cfc8/RQmzzhgUzZ.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}