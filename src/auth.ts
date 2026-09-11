import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' }
      },
      // admin from .env variables
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== 'string' || typeof password !== 'string') return null;
        if (email !== process.env.ADMIN_EMAIL) return null;

        const hash = process.env.ADMIN_PASSWORD_HASH;
        console.log('DEBUG hash length:', hash?.length, 'expected ~60');
        console.log('DEBUG hash exact:', JSON.stringify(hash));

        try {
          const isValid = await bcrypt.compare(password, hash!);
          console.log('DEBUG: password valid?', isValid);
          if (!isValid) return null;
          return { id: 'admin', email };
        } catch (err) {
          console.log('DEBUG: bcrypt threw:', err);
          return null;
        }
      },
    })
  ],
  pages: {
    signIn: '/admin/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === '/admin/login';
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');

      if (isAdminRoute && !isLoginPage && !isLoggedIn) return false;
      return true;
    },
  }
})