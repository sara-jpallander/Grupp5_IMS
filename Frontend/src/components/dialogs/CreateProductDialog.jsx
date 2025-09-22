import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLazyQuery } from "@apollo/client/react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { GET_MANUFACTURERS } from "@/api/graphql";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  price: z.number().optional(),
  category: z.string().optional(),
  amountInStock: z.int().optional(),
  manufacturer: z.string().min(1, "Manufacturer is required"),
});

const defaultValues = {
  name: "",
  sku: "",
  description: "",
  price: 0,
  category: "",
  amountInStock: 0,
  manufacturer: "",
};

export default function CreateProductDialog({
  isOpen,
  onClose,
  onSubmit,
  editData = null,
  loading = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [allManufacturers, setAllManufacturers] = useState([]);

  const [getManufacturers, { loading: _loadingManufacturers }] =
    useLazyQuery(GET_MANUFACTURERS, {
      variables: { limit: 1000 }, // Get a large number to cover all manufacturers
      fetchPolicy: 'network-only', // Always fetch fresh data
      onCompleted: (data) => {
        setAllManufacturers(data.manufacturers?.items || []);
      },
      onError: (error) => {
        console.error("Error loading manufacturers:", error);
        setAllManufacturers([]);
      }
    });

  // Filter manufacturers based on search input
  const manufacturerOptions = allManufacturers.filter((manufacturer) =>
    manufacturer.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    if (isOpen && allManufacturers.length === 0) {
      // Load manufacturers when dialog opens (only if not already loaded)
      getManufacturers()
        .then((result) => {
          // Manually set the data if onCompleted didn't fire
          if (result?.data?.manufacturers?.items) {
            setAllManufacturers(result.data.manufacturers.items);
          }
        })
        .catch((error) => {
          console.error("Error loading manufacturers:", error);
        });
      setSearch("");
    }
  }, [isOpen, allManufacturers.length, getManufacturers]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name || "",
        sku: editData.sku || "",
        description: editData.description || "",
        price: editData.price || 0,
        category: editData.category || "",
        amountInStock: editData.amountInStock || "",
        manufacturer: editData.manufacturer || "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editData, form]);

  async function handleFormSubmit(data) {
    const input = {
      name: data.name.trim(),
      sku: data.sku.trim(),
      description: data.description?.trim() ? data.description.trim() : undefined,
      price: data.price,
      category: data.category?.trim(),
      amountInStock: data.amountInStock,
      manufacturer: data.manufacturer,
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
      title={editData ? "Edit Product" : "Create Product"}
      description="Enter product information."
      loading={loading}
      showCancelButton={true}
      footerButtons={[
        {
          label: editData ? "Update" : "Create",
          type: "submit",
          form: "product-form",
          showLoadingWhenDisabled: true,
          loadingText: "Saving...",
        },
      ]}
    >
      <Form {...form}>
        <form
          id="product-form"
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
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU *</FormLabel>
                <FormControl>
                  <Input placeholder="SKU" {...field} />
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
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer *</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? allManufacturers.find(
                                (m) => m.id === field.value
                              )?.name
                            : "Select manufacturer..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search manufacturer..."
                            className="h-9"
                            value={search}
                            onValueChange={handleSearch}
                          />
                          <CommandList>
                            <CommandEmpty>No manufacturer found.</CommandEmpty>
                            <CommandGroup>
                              {manufacturerOptions.map((m) => (
                                <CommandItem
                                  key={m.id}
                                  value={m.id}
                                  onSelect={(currentValue) => {
                                    field.onChange(
                                      currentValue === field.value
                                        ? ""
                                        : currentValue
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  {m.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === m.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Furniture, Electronics, Clothing..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amountInStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount in Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                    />
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
