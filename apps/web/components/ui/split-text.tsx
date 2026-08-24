import {useRef} from "react";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export function SplitText({ text, className = "", delay = 0 }: SplitTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const chars = containerRef.current?.querySelectorAll(".char");
            if (!chars) return;

            gsap.from(chars, {
                y: 30,
                opacity: 0,
                stagger: 0.03,
                duration: 0.6,
                ease: "power3.out",
                delay: delay,
            });
        },
        { scope: containerRef }
    );

    return (
        <div ref={containerRef} className={`inline-block ${className}`}>
            {text.split("").map((char, index) => (
                <span key={index} className="char inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
            ))}
        </div>
    );
}
