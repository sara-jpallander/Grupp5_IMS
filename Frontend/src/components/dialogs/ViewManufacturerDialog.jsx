import { SquareUserRound } from "lucide-react";
import { Separator } from "../ui/separator";
import DialogWrapper from "./DialogWrapper";

function InfoTable({ data }) {
  return (
    <div className="space-y-0 border-1 rounded-sm px-3 py-1 text-sm">
      {data.map(
        (item, index) =>
          item.value && (
            <div key={item.label}>
              <div className="grid grid-cols-[100px_1fr] gap-2 py-[.4rem] px-1">
                <div className="font-medium text-muted-foreground">
                  {item.label}
                </div>
                <div className="break-words">{item.value}</div>
              </div>
              {index < data.filter((f) => f.value).length - 1 && <Separator />}
            </div>
          )
      )}
    </div>
  );
}

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
