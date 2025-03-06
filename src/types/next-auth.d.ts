import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    nom: string;
    prenom: string;
    avatar?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: 'SUPER_ADMIN' | 'ADMIN';
      nom: string;
      prenom: string;
      avatar?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    nom: string;
    prenom: string;
    avatar?: string;
  }
}