import { LucideIcon } from 'lucide-react';
interface UserCardProps {
    title: number | string;
    className?: string;
    description: string;
    badgeTitle: string;
    badgeClassName?: string;
    info: string;
    DescriptionIcon?: LucideIcon;
    badgeIcon?: LucideIcon;
}
export default function UserCard({ title, description, badgeTitle, badgeClassName, className, info, DescriptionIcon, badgeIcon: BadgeIcon, }: UserCardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=user-card.d.ts.map