import clsx from "clsx";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "@/api/graphql";
import {Button} from "../components/ui/button";

export default function Products() {
  const { data: productsData } = useQuery(GET_PRODUCTS);
  const products = productsData?.products || [];

  const getStockStatusColor = (value) => {
    if (value < 5) return "text-red-500";
    else if (value < 10) return "text-yellow-600";
    else return "text-emerald-600";
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex gap-4 justify-between">
        <h1 className="text-4xl font-bold mb-4">Products</h1>
        <Button>+ New product</Button>
      </div>
      <p className="mb-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente odit,
        fugiat, quae maxime dolor officiis ab optio esse repellendus libero
        adipisci quasi similique et numquam beatae! In laudantium eius ex?
      </p>

      <div className="flex gap-2">
        <div className="border-1 w-full max-w-xl p-2">Search...</div>
        <Button variant="secondary">Sök</Button>
      </div>
      <div className="">
      <strong>Filter:</strong> Manufacturer | In stock (All, Low, Critical) | Category
      </div>
      <div className="">
      <strong>Sort:</strong> Alphabetically | By price | By stock
      </div>

      <div className="mt-4">[Öppna modal med produktinformation]</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-6 text-sm">
        {products.map((product) => (
          <div
            key={product.id}
            className="border-1 border-gray-200 rounded-sm p-3 flex flex-col"
          >
            <div className="font-semibold">{product.name}</div>
            <div className="text-gray-400 text-[.6rem] mb-2">{product.sku}</div>
            <div className="text-gray-700 text-[.7rem] truncate">
              {product.description}
            </div>
            <div className="flex justify-between gap-2 pt-2 mt-auto text-[.8rem] font-bold">
              <div>${product.price}</div>
              <div className={clsx("", getStockStatusColor(product.amountInStock))}>
                {product.amountInStock} in stock
              </div>
            </div>
          </div>
        ))}
      </div>

      [Pagination: Previous | Page 1 | Page 2 | Next]
    </div>
  );
}
