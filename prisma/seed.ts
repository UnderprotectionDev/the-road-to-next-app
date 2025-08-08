import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const tickets = [
  {
    title: "Ticket 1",
    content: "First ticket from DB.",
    status: "DONE" as const,
  },
  {
    title: "Ticket 2",
    content: "Second ticket from DB.",
    status: "OPEN" as const,
  },
  {
    title: "Ticket 3",
    content: "Third ticket from DB.",
    status: "IN_PROGRESS" as const,
  },
];

async function main() {
  console.log("DB Seed: Started ...");

  await prisma.ticket.deleteMany();
  await prisma.ticket.createMany({ data: tickets });

  console.log("DB Seed: Finished");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
