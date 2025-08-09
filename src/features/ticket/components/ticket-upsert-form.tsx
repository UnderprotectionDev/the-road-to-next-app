"use client";

import { Ticket } from "@prisma/client";
import { useFormState } from "react-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertTicket } from "../actions/upsert-ticket";

const ticketSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

type TicketUpsertFormProps = {
  ticket?: Ticket;
};

export const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  const [state, formAction] = useFormState(
    async (prevState: any, formData: FormData) => {
      const data = {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
      };

      try {
        ticketSchema.parse(data);
        await upsertTicket(ticket?.id, formData);
        return { errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { errors: error.flatten().fieldErrors };
        }
        return { errors: { _form: ["Something went wrong"] } };
      }
    },
    { errors: {} }
  );

  return (
    <form action={formAction} className="flex flex-col gap-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
        type="text"
        id="title"
        name="title"
        defaultValue={ticket?.title}
        aria-describedby={state.errors.title ? "title-error" : undefined}
      />
      {state.errors.title && (
        <p id="title-error" className="text-sm text-red-500">
          {state.errors.title[0]}
        </p>
      )}

      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        name="content"
        defaultValue={ticket?.content}
        aria-describedby={state.errors.content ? "content-error" : undefined}
      />
      {state.errors.content && (
        <p id="content-error" className="text-sm text-red-500">
          {state.errors.content[0]}
        </p>
      )}

      {state.errors._form && (
        <p className="text-sm text-red-500">{state.errors._form[0]}</p>
      )}

      <Button type="submit">{ticket ? "Edit" : "Create"}</Button>
    </form>
  );
};
