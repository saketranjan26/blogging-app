import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@saketranjan/commonblog-app";
import { Hono } from "hono";
import { verify } from "hono/jwt";

const blogRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRoute.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";

  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);

    if (user) {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        error: "you are not logged in",
      });
    }
  } catch (e) {
    c.status(403);
    return c.json({
      error: "you are not logged in",
    });
  }
});

blogRoute.post("/", async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId");

  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      error: "enter valid input",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: Number(authorId),
      author: body.name
    },
  });

  return c.json({
    id: blog.id,
  });
});

blogRoute.put("/", async (c) => {
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      error: "enter valid input",
    });
  }

  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({
    id: blog.id,
  });
});

blogRoute.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.post.findMany();

  return c.json({
    blogs,
  });
});

blogRoute.get("/:id", async (c) => {
  //const body = await c.req.json();
  // YOU SHOULD NOT USE BODY IN GET REQUEST. WHY? WILL KNOW WHILE CONNECTING FE AND BE
  const id = c.req.param("id")
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findFirst({
      where: {
        //id: body.id,
        id: Number(id)
      },
    });

    return c.json({
      blog,
    });
  } catch (e) {
    c.status(403);
    return c.json({
      error: "error while fetching blog",
    });
  }
});

export default blogRoute;
