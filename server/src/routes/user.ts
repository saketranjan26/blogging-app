import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { use } from "hono/jsx";
import { signinInput, signupInput } from "@saketranjan/commonblog-app";

const userRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };

  // here we declared the type of dburl beacuse on 17 line, type error was coming
  // for DATABASE_URl
}>();

userRoute.post("/signup", async (c) => {
  // initializing prisma

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // we will need to initialize prisma everytime we need in any route beacause we cannot declare prisma globally
  // why so? because declaration uses DATABASE_URL variable which is present in .env file and we cannot directly inject .env in our index.js
  // and since "c" have access to .env varaible, we have to declare prisma inside every route which need it OR we can setup a middleware for it

  const body = await c.req.json();
  console.log(body)
  
  const { success } = signupInput.safeParse(body);
  const parsedBody = signinInput.safeParse(body)
  //console.log(parsedBody.error)
  if (!success) {
    c.status(411);
    return c.json({
      error: "enter valid input",
    });
  }

  const users = await prisma.user.findFirst({
    where: {
      username: body.username,
    },
  });

  if (users) {
    c.status(404);
    return c.json({ error: "user already exists" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name:body.name,
        username: body.username,
        password: body.password,
      },
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
});

userRoute.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const {success} = signinInput.safeParse(body);

  if(!success){
    c.status(411)
    return c.json({
      error:"wrong eamil or password"
    })
  }
  const user = await prisma.user.findFirst({
    where: {
      username: body.username,
    },
  });

  if (!user) {
    c.status(404);
    return c.json({ error: "user not found" });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
});

export default userRoute;


/*

why do i need to write "c.req.json" when i need to get data from req header and "c.json" 
NOT "c.res.json" when i need to send data?

ANSWER: https://chat.openai.com/share/808c0ff8-0472-4a58-a2f1-487335f4126f
quick ans: c.req.json is used to parse JSON data from the incoming request.
           c.json is used to set the JSON response body in the outgoing response.

*/