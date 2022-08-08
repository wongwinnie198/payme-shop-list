// import prisma from "../lib/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  links();
}
const links = await prisma.links.create({
  data: {
    shop_name: "shop B",
    shop_url: "www.shopa.com",
    createdAt: new Date(),
  },
});

main();
