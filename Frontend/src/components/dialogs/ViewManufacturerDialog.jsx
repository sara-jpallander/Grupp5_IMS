import { SquareUserRound } from "lucide-react";
import { Separator } from "../ui/separator";
import DialogWrapper from "./DialogWrapper";
import InfoTable from "../InfoTable";

export default function ViewManufacturerDialog({ isOpen, onClose, data }) {
  if (!data) return;

  const manufacturerInfo = [
    { label: "Name", value: data.name },
    { label: "Country", value: data.country },
    { label: "Website", value: data.website },
    { label: "Address", value: data.address },
    { label: "Description", value: data.description },
  ];

  const contactInfo = [
    { label: "Name", value: data.contact.name },
    { label: "Email", value: data.contact.email },
    { label: "Phone", value: data.contact.phone },
  ];

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={data.name}
      description="Detailed manufacturer information."
      showCancelButton={false}
    >
      <InfoTable data={manufacturerInfo} />

      <div className="mt-6 mb-4 font-semibold flex items-center gap-2">
        <SquareUserRound /> Contact person
      </div>
      <InfoTable data={contactInfo} />
    </DialogWrapper>
  );
}
