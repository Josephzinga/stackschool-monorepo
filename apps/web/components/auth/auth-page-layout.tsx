import {ReactNode} from 'react';
import {cn} from '@/lib/utils';
import StackSchoolLogo from "@/components/ui/StackSchoolLogo";
import {AuthImageSlider} from "@/components/ui/auth-image-slider";

interface AuthPageLayoutProps {
    children: ReactNode;
    slides: Array<{ src: string; title: string; description: string }>;
    className?: string;
    showLogo?: boolean;
    showFooter?: boolean;
}

export function AuthPageLayout({
                                   children,
                                   slides,
                                   className,
                                   showLogo = true,
                                   showFooter = true,
                               }: AuthPageLayoutProps) {
    return (
        <div className="grid min-h-dvh lg:grid-cols-2">
            {/* Colonne gauche - Formulaire */}
            <div className="flex flex-col items-center justify-center px-6 py-8 sm:px-10">
                <div className="w-full max-w-md">
                    {showLogo && (
                        <div className="flex justify-center mb-6">
                            <StackSchoolLogo className="h-14 w-auto" />
                        </div>
                    )}
                    <div className={cn('w-full', className)}>{children}</div>
                    {showFooter && (
                        <p className="mt-6 text-center text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} StackSchool. Tous droits réservés.
                        </p>
                    )}
                </div>
            </div>

            {/* Colonne droite - Slider */}
            <div className="relative hidden lg:block bg-muted/50">
                <AuthImageSlider slides={slides} interval={5000} />
            </div>
        </div>
    );
}
