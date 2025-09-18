import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const formSchema = z.object({
  name: z.string().min(1),
  country: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  contact_name: z.string(),
  contact_email: z.email(),
  contact_phone: z.string().optional(),
});

const defaultValues = {
  name: "",
  country: "",
  website: "",
  description: "",
  address: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
};

export default function CreateManufacturerDialog({
  isOpen,
  onClose,
  onSubmit,
  editData = null,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name || "",
        country: editData.country || "",
        website: editData.website || "",
        description: editData.description || "",
        address: editData.address || "",
        contact_name: editData.contact?.name || "",
        contact_email: editData.contact?.email || "",
        contact_phone: editData.contact?.phone || "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editData, form]);

  function handleFormSubmit(data) {
    const input = {
      name: data.name.trim(),
      country: data.country.trim(),
      website: data.website?.trim() || null,
      description: data.description?.trim() || null,
      address: data.address.trim(),
      contact: {
        name: data.contact_name.trim(),
        email: data.contact_email.trim(),
        phone: data.contact_phone.trim(),
      },
    };

    const variables = editData ? { id: editData.id, input } : { input };

    onSubmit(variables, !!editData);
    form.reset();
    onClose();
  }

  function handleClose(open) {
    if (!open) {
      form.reset();
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editData ? "Edit manufacturer" : "Create manufacturer"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Edit the manufacturer's information."
              : "Enter information for new manufacturer."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Form {...form}>
            <form
              id="manufacturer-form"
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Manufacturer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Company address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Company description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>

                <FormField
                  control={form.control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact person name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="manufacturer-form">
            {editData ? "Update manufacturer" : "Create manufacturer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
