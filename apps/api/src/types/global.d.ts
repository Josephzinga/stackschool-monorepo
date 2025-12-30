declare module '@auth/express' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      hasMembership?: boolean;
      profileCompleted?: boolean;
      role?: string | null;
    };
  }
}
