import NextAuth from 'next-auth';
import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from './prisma';
import { getServerSession } from 'next-auth';

declare module 'next-auth' {
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

  interface User {
    id: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    nom: string;
    prenom: string;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'SUPER_ADMIN' | 'ADMIN';
    email: string;
    nom: string;
    prenom: string;
    avatar?: string;
  }
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email }
        });

        if (!admin) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, admin.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          nom: admin.nom,
          prenom: admin.prenom,
          avatar: admin.avatar || undefined
        };
      }
    })
  ],
  pages: {
    signIn: '/admin',
    error: '/admin/error',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.nom = user.nom;
        token.prenom = user.prenom;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.nom = token.nom;
        session.user.prenom = token.prenom;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

export const auth = () => getServerSession(authConfig);

const handler = NextAuth(authConfig);
export const { signIn, signOut } = handler;

export { handler as GET, handler as POST };