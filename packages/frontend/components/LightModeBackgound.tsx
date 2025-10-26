"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export const ToggleBackgroundImage = () => {
  const { theme } = useTheme();

  return (
    <div>
      <Image
        src={`/bg-${theme}.jpg`}
        alt=""
        width={1000}
        height={1000}
        className="absolute inset-0 w-full h-screen mask-r-from-80% -z-30"
      />
    </div>
  );
};
