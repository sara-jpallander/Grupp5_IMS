import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Edit, Eye, Mail, Phone, Search } from "lucide-react";
import { GET_MANUFACTURERS, ADD_MANUFACTURER, UPDATE_MANUFACTURER } from "@/api/graphql";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateManufacturerDialog from "@/components/CreateManufacturerDialog";

export default function Manufacturers() {
  const { data: manufacturersData, refetch } = useQuery(GET_MANUFACTURERS);
  const manufacturers = manufacturersData?.manufacturers || [];

  const [addManufacturer, { loading: addLoading }] = useMutation(ADD_MANUFACTURER);
  const [updateManufacturer, { loading: updateLoading }] = useMutation(UPDATE_MANUFACTURER);

  const [isOpen, setIsOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState(null);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleEdit(data) {
    setEditingManufacturer(data);
    handleOpen();
  }

  function onClose() {
    setEditingManufacturer(null);
    setIsOpen(false);
  }

  async function handleCreate(data, isEdit) {
    try {
      if (isEdit) {
        console.log("Edit manufacturer:", data);
        const { data: result } = await updateManufacturer({
          variables: data,
        });
        console.log("Updated manufacturer:", result.updateManufacturer);
      } else {
        console.log("Create new manufacturer:", data);
        const { data: result } = await addManufacturer({
          variables: data,
        });
        console.log("Created manufacturer:", result.addManufacturer);
      }

      await refetch();
      onClose();
    } catch (error) {
      console.error("Error saving manifacturer:", error);
    }
  }

  return (
    <>
      <CreateManufacturerDialog
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreate}
        editData={editingManufacturer}
      />
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex gap-4 justify-between">
          <h1 className="text-4xl font-bold mb-4">Manufacturers</h1>
          <Button onClick={handleOpen}>+ New manufacturer</Button>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
          odit, fugiat, quae maxime dolor officiis ab optio esse repellendus
          libero adipisci quasi similique et numquam beatae! In laudantium eius
          ex?
        </p>

        <div className="flex items-center gap-2">
          <div className="relative my-4 flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value=""
              onChange={() => {}}
              className="pl-8"
            />
          </div>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort alphabetically" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetically">
                Sort alphabetically
              </SelectItem>
              <SelectItem value="sweden">Unique products</SelectItem>
              <SelectItem value="germany">Total stock</SelectItem>
              <SelectItem value="usa">Stock value</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              <SelectItem value="sweden">Sweden</SelectItem>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="usa">USA</SelectItem>
              <SelectItem value="japan">Japan</SelectItem>
              <SelectItem value="china">China</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-6">
          {manufacturers.map((m) => (
            <div className="border-1 p-5" key={m.id}>
              <div className="font-bold text-center pb-2 mb-4 border-b-1">
                {m.name}
              </div>
              <div className="text-sm mb-4">
                {/* Contact info */}
                <div className="font-bold">{m.contact.name}</div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4" /> {m.contact.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4" /> {m.contact.phone}
                </div>
              </div>
              {/* Action buttons */}
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => handleEdit(m)}>
                  <Edit /> Edit
                </Button>
                <Button>
                  <Eye />
                  Show details
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Pagination className="mt-8" />
      </div>
    </>
  );
}
