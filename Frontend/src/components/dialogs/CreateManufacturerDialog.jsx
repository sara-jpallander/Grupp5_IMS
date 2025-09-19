import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DialogWrapper from "./DialogWrapper";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  name: z.string().min(1),
  country: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_email: z.email("Must be a valid email"),
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
  loading = false
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

  async function handleFormSubmit(data) {
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

    await onSubmit(variables, !!editData);
    form.reset();
    onClose();
  }

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Manufacturer" : "Create Manufacturer"}
      description="Enter manufacturer information."
      loading={loading}
      showCancelButton={true}
      footerButtons={[
        {
          label: editData ? "Update" : "Create",
          type: "submit",
          form: "manufacturer-form",
          showLoadingWhenDisabled: true,
          loadingText: "Saving...",
        },
      ]}
    >
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
    </DialogWrapper>
  );
}
