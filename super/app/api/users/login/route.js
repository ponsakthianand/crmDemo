import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import SysInfo from '@/app/lib/sysInfo';


const handler = async (req, res) => {
  const { method } = req;
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('users');
  const body = await req.json();
  const userInfo = await SysInfo();

  const verifyPassword = (inputPassword, storedHash, storedSalt) => {
    const inputHash = crypto.createHmac("sha256", storedSalt).update(inputPassword).digest("hex");
    return inputHash === storedHash;
  };

  if (method === "POST") {
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    try {

      // Find the user by email
      const user = await collection.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }
      if (user?.active === false) {
        return NextResponse.json({ error: "User deactivated please contact admin." }, { status: 404 });
      }
      // Verify the password
      const isValidPassword = verifyPassword(password, user.password, user.salt);

      if (!isValidPassword) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      // Generate JWT for access
      const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role, // Or another role based on your app logic
        permission: user.permission, // Or another permission based on your app logic
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h", // Token expiration time
      });

      await db.collection('admin_user_login_activity').insertOne({ ...payload, login_time: new Date(), ...userInfo });


      return NextResponse.json({
        status: "success",
        access_token: token,
      }, { status: 200 });
    } catch (error) {
      console.error("Error during login:", error);
      return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: `Method ${method} not allowed.` }, { status: 405 });
  }
};

export { handler as POST };
