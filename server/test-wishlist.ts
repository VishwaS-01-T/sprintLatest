import prisma from "./src/lib/prisma.js";

async function run() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user");
    console.log("Found user", user.id);
    const wishlist = await prisma.wishlist.findUnique({
      where: { customerId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                status: true,
              },
              include: { images: { where: { isThumbnail: true }, take: 1 } },
            },
            variant: {
              select: {
                id: true,
                sku: true,
                size: true,
                color: true,
                price: true,
              },
            },
          },
          orderBy: { addedAt: "desc" },
        },
      },
    });
    console.log(wishlist);
  } catch (err) {
    console.error(err);
  }
}
run();
