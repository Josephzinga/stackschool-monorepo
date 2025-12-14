"use client";
import Image from "next/image";
import React, { useState } from "react";

interface AvatarNameProps {
  name: string;
  url?: string | null;
  size?: number; // taille en pixels
  className?: string;
}

export function AvatarName({
  name,
  url,
  size = 40,
  className = "",
}: AvatarNameProps) {
  const [imageError, setImageError] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Génère une couleur stable à partir du nom
  const colorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const bgColor = colorFromName(name);

  const showImage = url && !imageError;

  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden text-white font-semibold select-none ${className}`}
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}>
      {showImage ? (
        <Image
          src={url}
          alt={name}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
