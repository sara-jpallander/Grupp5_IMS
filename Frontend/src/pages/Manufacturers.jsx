import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Edit, Eye, Mail, Phone, Search } from "lucide-react";
import {
  GET_MANUFACTURERS,
  ADD_MANUFACTURER,
  UPDATE_MANUFACTURER,
} from "@/api/graphql";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateManufacturerDialog from "@/components/dialogs/CreateManufacturerDialog";
import ViewManufacturerDialog from "@/components/dialogs/ViewManufacturerDialog";
import LoadingText from "@/components/LoadingText";

export default function Manufacturers() {
  const [page, setPage] = useState(1);
  const limit = 9;
  
  const {
    data: manufacturersData,
    loading,
    refetch,
  } = useQuery(GET_MANUFACTURERS, {
    variables: { page, limit },
  });

  const manufacturersPage = manufacturersData?.manufacturers || {};
  const manufacturers = manufacturersPage.items || [];
  const totalCount = manufacturersPage.totalCount || 0;
  const hasNextPage = manufacturersPage.hasNextPage || false;

  const [addManufacturer, { loading: addLoading }] =
    useMutation(ADD_MANUFACTURER);
  const [updateManufacturer, { loading: updateLoading }] =
    useMutation(UPDATE_MANUFACTURER);

  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [currentManufacturer, setCurrentManufacturer] = useState(null);

  // Create/Edit modal
  const handleOpen = () => setIsOpen(true);

  const onClose = () => {
    setCurrentManufacturer(null);
    setIsOpen(false);
  };

  const handleEdit = (data) => {
    setCurrentManufacturer(data);
    handleOpen();
  };

  const normalizeUrl = (url) => {
    if (!url) return "";
    // If the URL already starts with http:// or https://, return as is
    if (/^https?:\/\//i.test(url)) return url;
    // Otherwise, prepend https://
    return "https://" + url;
  }

  const handleCreate = async (data, isEdit) => {
    try {
        const input = {
        ...data.input,
        website: normalizeUrl(data.input?.website?.trim()),
      };

      if (isEdit) {
        console.log("Edit manufacturer:", data);
        const { data: result } = await updateManufacturer({
          variables: { id: data.id, input },
        });
        console.log("Updated manufacturer:", result.updateManufacturer);
      } else {
        console.log("Create new manufacturer:", data);
        const { data: result } = await addManufacturer({
          variables: { input },
        });
        console.log("Created manufacturer:", result.addManufacturer);
      }

      await refetch();
      onClose();
    } catch (error) {
      console.error("Error saving manifacturer:", error);
    }
  };

  // View details modal
  const handleOpenInfo = (m) => {
    setCurrentManufacturer(m);
    setIsInfoOpen(true);
  };

  const onCloseInfo = () => {
    setCurrentManufacturer(null);
    setIsInfoOpen(false);
  };

  const handleSetPage = (p) => setPage(p);

  return (
    <>
      <CreateManufacturerDialog
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreate}
        editData={currentManufacturer}
        loading={addLoading || updateLoading}
      />
      <ViewManufacturerDialog
        isOpen={isInfoOpen}
        onClose={onCloseInfo}
        data={currentManufacturer}
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

        <div className="flex items-center gap-2 mt-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
          {loading && (
            <LoadingText
              label="Loading manufacturers..."
              className=" col-span-full"
            />
          )}
          {!loading && manufacturers.length > 0 ? (
            manufacturers.map((m) => (
              <div className="border-1 p-5 flex flex-col rounded-sm" key={m.id}>
                <div className="font-bold text-center pb-2 mb-4 border-b-1">
                  {m.name}
                </div>
                <div className="text-sm mb-4">
                  {/* Contact info */}
                  <div className="font-bold">{m.contact.name}</div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4" /> {m.contact.email}
                  </div>
                  {m.contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-4" /> {m.contact.phone}
                    </div>
                  )}
                </div>
                {/* Action buttons */}
                <div className="flex justify-center gap-2 mt-auto">
                  <Button variant="outline" onClick={() => handleEdit(m)}>
                    <Edit /> Edit
                  </Button>
                  <Button onClick={() => handleOpenInfo(m)}>
                    <Eye />
                    Show details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div>No manufacturers found.</div>
          )}
        </div>

        <Pagination
          className="mt-8"
          page={page}
          hasNextPage={hasNextPage}
          onSetPage={handleSetPage}
          totalCount={totalCount}
          limit={limit}
        />
      </div>
    </>
  );
}
