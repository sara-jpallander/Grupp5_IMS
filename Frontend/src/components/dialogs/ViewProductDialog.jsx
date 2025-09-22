import clsx from "clsx";
import DialogWrapper from "./DialogWrapper";
import InfoTable from "../InfoTable";
import { Badge } from "../ui/badge";
import { getStockStatusColor } from "@/lib/utils";

export default function ViewProductDialog({ isOpen, onClose, data }) {
  if (!data) return;

  const productInfo = [
    { label: "Name", value: data.name },
    { label: "SKU", value: data.sku },
    { label: "price", value: `$${data.price}` },
    { label: "Category", value: data.category },
    { label: "Description", value: data.description },
  ];

  return (
    <DialogWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={data.name}
      description=""
      showCancelButton={false}
    >
      <div className="flex mb-4 justify-between">
        <div className="font-bold text-2xl">${data.price}</div>
        <Badge variant="outline" className={clsx("", getStockStatusColor(data.amountInStock))}>
          {data.amountInStock} in stock
        </Badge>
      </div>
      <InfoTable data={productInfo} />
    </DialogWrapper>
  );
}
