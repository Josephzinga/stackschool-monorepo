'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarNameProps {
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
  };
  className?: string;
  href: string;
}

export function AvatarProfile({
  profile: { firstName, lastName, avatarUrl },
  className,
  href,
}: AvatarNameProps) {
  const colorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const color = colorFromName(`${firstName} ${lastName}`);

  return (
    <Link href={href} className="block max-w-80 md:max-w-100 h-full group">
      <div className="flex gap-3 items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback className={cn(`bg-[${color}] text-primary text-xs`)}>
            {firstName?.[0]}
            {lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold text-sm text-foreground font-poppins group-hover:underline group-hover:underline-offset-2 group-hover:text-primary">
          {firstName} {lastName}
        </p>
      </div>
    </Link>
  );
}
