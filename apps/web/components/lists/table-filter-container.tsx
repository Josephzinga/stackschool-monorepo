'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import React from 'react';

export const TableFilterContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useGSAP(() => {
    gsap.fromTo(
      '.container-filter',
      {
        opacity: 0,
        duration: 0.2,
        y: -30,
        ease: 'power3.inOut',
        yoyo: true,
        zIndex: -10,
      },
      {
        opacity: 1,
        duration: 0.4,
        y: 4,
        zIndex: 0,
        ease: 'power1.out',
      },
    );
  });
  return (
    <div className="container-filter bg-card rounded-lg border">{children}</div>
  );
};
