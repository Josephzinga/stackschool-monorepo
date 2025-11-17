import { Button } from "./ui/button";

export const ButtonSocial = ({
  provider,
  icon,
}: {
  provider: string;
  icon: React.JSX.Element;
}) => {
  return (
    <>
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/${provider}`}
        className="w-full">
        <Button variant="outline" type="button" className="w-full">
          {icon}
          Connectez vous avec{" "}
          {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </Button>
      </a>
    </>
  );
};
