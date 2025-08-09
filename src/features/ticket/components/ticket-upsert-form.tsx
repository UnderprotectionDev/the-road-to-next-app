"use client";

import { Ticket } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertTicket } from "../actions/upsert-ticket";
import { z } from "zod";
import { useState } from "react";

const ticketSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  content: z.string().min(1, "Content is required").max(1000, "Content must be less than 1000 characters"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

type TicketUpsertFormProps = {
  ticket?: Ticket;
};

export const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (formData: FormData) => {
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    };

    try {
      const validatedData = ticketSchema.parse(data);
      setErrors({});
      await upsertTicket(ticket?.id, formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-y-2"
    >
      <Label htmlFor="title">Title</Label>
      <Input 
        type="text" 
        name="title" 
        id="title"
        defaultValue={ticket?.title} 
        aria-invalid={!!errors.title}
        aria-describedby={errors.title ? "title-error" : undefined}
      />
      {errors.title && (
        <span id="title-error" className="text-sm text-red-500">
          {errors.title}
        </span>
      )}

      <Label htmlFor="content">Content</Label>
      <Textarea 
        name="content" 
        id="content"
        defaultValue={ticket?.content} 
        aria-invalid={!!errors.content}
        aria-describedby={errors.content ? "content-error" : undefined}
      />
      {errors.content && (
        <span id="content-error" className="text-sm text-red-500">
          {errors.content}
        </span>
      )}

      <Button type="submit">{ticket ? "Edit" : "Create"}</Button>
    </form>
  );
};
