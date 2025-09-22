import clsx from "clsx";
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "@/api/graphql";
import { Edit, Eye, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import LoadingText from "@/components/LoadingText";

export default function Products() {
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data: productsData, loading, refetch } = useQuery(GET_PRODUCTS, {
    variables: { page, limit },
  });

  const productsPage = productsData?.products || {};
  const products = productsPage.items || [];
  const totalCount = productsPage.totalCount || 0;
  const hasNextPage = productsPage.hasNextPage || false;

  console.log(productsData)

  const getStockStatusColor = (value) => {
    if (value < 5) return "text-red-500";
    else if (value < 10) return "text-yellow-600";
    else return "text-emerald-600";
  };

  const handleSetPage = (p) => setPage(p);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6 text-sm">
        {loading && (
          <LoadingText label="Loading products..." className=" col-span-full" />
        )}
        {!loading && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="border-1 border-gray-200 rounded-sm p-5 flex flex-col"
            >
              <div className="flex justify-between gap-1">
                <div className="font-semibold truncate">{product.name}</div>
                <Badge variant="outline" className="text-[.65rem]">
                  {product.category}
                </Badge>
              </div>
              <div className="text-gray-400 text-[.6rem] mb-2">
                {product.sku}
              </div>

              <div className="text-gray-700 text-[.7rem] truncate">
                {product.description}
              </div>
              <div className="flex justify-between gap-2 pt-4 mt-auto text-[.8rem] font-bold">
                <div>${product.price}</div>
                <div
                  className={clsx(
                    "",
                    getStockStatusColor(product.amountInStock)
                  )}
                >
                  {product.amountInStock} in stock
                </div>
              </div>
              {/* Action buttons */}
              <div className="flex justify-center gap-2 pt-3 mt-auto">
                <Button variant="outline">
                  <Edit /> Edit
                </Button>
                <Button>
                  <Eye />
                  Show details
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div>No products found.</div>
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
  );
}
