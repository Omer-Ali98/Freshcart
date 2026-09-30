import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
    };
  }

  interface User {
    remember?: boolean;
    token?: string;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    remember?: boolean;
    id?: string;
    token?: string;
    phone?: string;
  }
}
