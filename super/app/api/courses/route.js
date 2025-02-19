import client from "@/app/lib/mongodbConfig";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { parseJwt } from "@/global";

const coursesHandler = async (req, res) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get("token");
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db("rxtn");

  switch (method) {
    case "POST": {
      const body = await req.json();
      console.log("user", user);

      if (user?.role === "org-admin") {

        const desireSlug = body?.slug ? body?.slug : body?.title;

        const baseSlug = desireSlug
          ?.replace(/[^a-zA-Z0-9 ]/g, "") // Remove special characters
          ?.replaceAll(" ", "-") // Replace spaces with dashes
          ?.toLowerCase();

        const coursesList = await db
          .collection("courses")
          .find()
          .toArray();

        // Check for existing slugs and increment if necessary
        let slug = baseSlug;
        let count = 1;
        while (coursesList.some((event) => event.slug === slug)) {
          slug = `${baseSlug}-${count}`;
          count++;
        }

        let slugId;
        let isSlugIdUnique = false;

        while (!isSlugIdUnique) {
          slugId = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Random 10-digit number
          isSlugIdUnique = !coursesList.some((course) => course.slugId === slugId);
        }

        const updatedData = {
          ...body,
          admin_id: user?.id,
          creator_role: user?.role,
          created_by: user?.name,
          created_at: new Date(),
          slug,
          slugId,
        };

        try {
          const product = await db.collection("courses").insertOne(updatedData);
          return NextResponse.json(product);
        } catch (e) {
          console.error(e);
          return NextResponse.json({ error: "Failed to create event" });
        }
      } else {
        return NextResponse.json({ message: "You are not allowed" });
      }
    }
    case "GET": {
      if (user) {
        const coursesList = await db
          .collection("courses")
          .find()
          .sort({ order: 1, created_at: -1 })
          .toArray();
        return NextResponse.json(coursesList);
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    }
    default:
      return NextResponse.json({ message: "Invalid method" });
  }
};

export { coursesHandler as GET, coursesHandler as POST };
