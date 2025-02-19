import { NextResponse } from 'next/server';

// pages/api/proxy-ip.js
async function handler(req: any, { params }: { params: any }) {
  const ip = (await params).ip;
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    // Send back the data to the client
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching data from API' },
      { status: 500 }
    );
  }
}
export { handler as GET };
