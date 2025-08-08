import { initialTickets } from "@/data";
import { Ticket } from "../ticket/types";

export const getTickets = async (): Promise<Ticket[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return initialTickets;
};
