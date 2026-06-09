import React from 'react';
export type SocialStrategy = {
    provider: 'google' | 'facebook';
    source: {
        uri: string;
    };
    useTint: boolean;
};
type SocialButtonProps = {
    strategy: SocialStrategy;
    onPress: () => Promise<void>;
    className?: string;
};
export declare function SocialButton({ strategy, onPress, className }: SocialButtonProps): React.JSX.Element;
export {};
//# sourceMappingURL=social-button.d.ts.map