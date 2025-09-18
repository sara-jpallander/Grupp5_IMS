import clsx from "clsx";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "@/api/graphql";
import { Edit, Eye, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All manufacturers</SelectItem>
            <SelectItem value="ikea">IKEA</SelectItem>
            <SelectItem value="volvo">Volvo</SelectItem>
            <SelectItem value="ericsson">Ericsson</SelectItem>
            <SelectItem value="hm">H&M</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stock status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="fine">Fine</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="fine">Clothing</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex mb-6">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort alphabetically" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alphabetically">Sort alphabetically</SelectItem>
            <SelectItem value="price">Sort by price</SelectItem>
            <SelectItem value="stock">Sort by stock</SelectItem>
          </SelectContent>
        </Select>
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
              <div
                className={clsx("", getStockStatusColor(product.amountInStock))}
              >
                {product.amountInStock} in stock
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination className="mt-8" />
    </div>
  );
}
