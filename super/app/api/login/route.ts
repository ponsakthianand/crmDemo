import type { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { baseUrl } from '@/global';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

const loginHandler = async (req: any, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body = await req.json();
    const Url = `/api/users/login`;

    const rest = await fetch(Url, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        email: body?.email,
        password: body?.password,
      }),
    });

    const repo = await rest.json();
    if (rest.ok) {
      return NextResponse.json(repo, { status: 200 });
    } else if (rest.status === 401) {
      return NextResponse.json(repo, { status: 401 });
    } else {
      return NextResponse.json(repo, { status: 401 });
    }
  } else {
    return NextResponse.json(null);
  }
};

export { loginHandler as GET, loginHandler as POST };
