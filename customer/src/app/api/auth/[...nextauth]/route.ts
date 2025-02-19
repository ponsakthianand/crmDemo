import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await axios({
          method: 'POST',
          url: `${process.env.NEXTAUTH_URL}/api/users/login`,
          data: credentials,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const user = await res.data;

        if (res.status === 200 && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: JWT_SECRET,
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
