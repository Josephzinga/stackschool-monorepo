import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AttendanceProfile } from '@/types/attendance';
import { Profile } from '@stackschool/ui';
import Link from 'next/link';
import type { UrlObject } from 'url';
type Url = string | UrlObject;

type ProfileCellProps = {
  profile: Omit<Profile, 'id' | 'gender' | 'address'> & { email?: string };
  href?: Url;
};

export function ProfileCell({ profile, href }: ProfileCellProps) {
  const ProfileView = () => (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={profile?.photo ?? undefined}
          alt={`${profile?.firstname} ${profile?.lastname}`}
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {profile?.firstname?.[0]}
          {profile?.lastname?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {profile?.firstname} {profile?.lastname}
        </span>
        <span className="text-muted-foreground text-xs">{profile?.email}</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <ProfileView />
      </Link>
    );
  }
  return <ProfileView />;
}
