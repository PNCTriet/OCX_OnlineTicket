import { useRef, useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function FlameLottie({ className = "", style = {} }: { className?: string, style?: React.CSSProperties }) {
  const lottieRef = useRef(null);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/lottie/flame.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  if (!animationData) return null;

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop
      autoplay
      className={className}
      style={style}
    />
  );
} 