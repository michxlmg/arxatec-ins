import { useEffect, useState } from "react";

export const ThinkingAnimation = () => {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev < 4 ? prev + 1 : 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span>Trabajando{".".repeat(dots)}</span>;
};
