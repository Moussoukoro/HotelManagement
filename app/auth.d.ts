// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: 'admin' | 'manager' | 'staff';
    }
  }

  interface User {
    id: string;
    email: string;
    username?: string;
    role: 'admin' | 'manager' | 'staff';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: 'admin' | 'manager' | 'staff';
  }
}