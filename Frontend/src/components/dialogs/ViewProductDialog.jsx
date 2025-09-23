import clsx from "clsx";
import { useQuery } from "@apollo/client/react";
import DialogWrapper from "./DialogWrapper";
import InfoTable from "../InfoTable";
import { Badge } from "../ui/badge";
import { getStockStatusColor } from "@/lib/utils";
import LoadingText from "../LoadingText";
import { GET_PRODUCT_WITH_MANUFACTURER } from "@/api/graphql";

export default function ViewProductDialog({ isOpen, onClose, data }) {
  const { data: productData, loading, error } = useQuery(GET_PRODUCT_WITH_MANUFACTURER, {
    variables: { id: data?.id },
    skip: !data?.id || !isOpen,
    fetchPolicy: 'cache-and-network',
  });

  const product = productData?.product || data;

  if (!data) return null;

  const productInfo = [
    { label: "Name", value: product?.name },
    { label: "SKU", value: product?.sku },
    { label: "Price", value: `$${product?.price}` },
    { label: "Category", value: product?.category },
    { label: "Description", value: product?.description },
  ];

  const manufacturerInfo = product?.manufacturer ? [
    { label: "Manufacturer", value: product.manufacturer.name },
    { label: "Country", value: product.manufacturer.country },
    { label: "Website", value: product.manufacturer.website },
    { label: "Address", value: product.manufacturer.address },
    { label: "Contact Name", value: product.manufacturer.contact?.name },
    { label: "Contact Email", value: product.manufacturer.contact?.email },
    { label: "Contact Phone", value: product.manufacturer.contact?.phone },
  ].filter(item => item.value) : [];

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
      
      {loading && <LoadingText label="Loading product details..." />}
      {error && <div className="text-red-500 text-sm mb-4">Error loading details: {error.message}</div>}
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Product Information</h3>
          <InfoTable data={productInfo} />
        </div>
        
        {manufacturerInfo.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Manufacturer Information</h3>
            <InfoTable data={manufacturerInfo} />
          </div>
        )}
      </div>
    </DialogWrapper>
  );
}
