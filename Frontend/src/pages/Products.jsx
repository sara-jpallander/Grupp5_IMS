import clsx from "clsx";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_PRODUCTS, ADD_PRODUCT, UPDATE_PRODUCT } from "@/api/graphql";
import { ArrowDown10, ArrowDownAZ, ArrowUp01, BanknoteArrowDown, BanknoteArrowUp, CircleDollarSign, Edit, Eye, Search } from "lucide-react";
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
import CreateProductDialog from "@/components/dialogs/CreateProductDialog";
import ViewProductDialog from "@/components/dialogs/ViewProductDialog";
import LoadingText from "@/components/LoadingText";
import { getStockStatusColor } from "@/lib/utils";

export default function Products() {
  const [page, setPage] = useState(1);
  const limit = 15;
  const [sortBy, setSortBy] = useState("NAME_ASC");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: productsData, loading, refetch } = useQuery(GET_PRODUCTS, {
    variables: { page, limit, sortBy, search: debouncedSearch },
  });

  const productsPage = productsData?.products || {};
  const products = productsPage.items || [];
  const totalCount = productsPage.totalCount || 0;
  const hasNextPage = productsPage.hasNextPage || false;

  const [addProduct, { loading: addLoading }] = useMutation(ADD_PRODUCT);
  const [updateProduct, { loading: updateLoading }] =
    useMutation(UPDATE_PRODUCT);

  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Create/Edit modal
  const handleOpen = () => setIsOpen(true);

  const onClose = () => {
    setCurrentProduct(null);
    setIsOpen(false);
  };

  const handleEdit = (data) => {
    setCurrentProduct(data);
    handleOpen();
  };

  const handleCreate = async (data, isEdit) => {
    try {
      if (isEdit) {
        console.log("Edit product:", data);
        const { data: result } = await updateProduct({
          variables: data,
          refetchQueries: [{ query: GET_PRODUCTS, variables: { page, limit, sortBy } }],
        });
        console.log("Updated product:", result.updateProduct);
      } else {
        console.log("Create new product:", data);
        const { data: result } = await addProduct({
          variables: data,
          refetchQueries: [{ query: GET_PRODUCTS, variables: { page, limit, sortBy } }],
        });
        console.log("Created product:", result.addProduct);
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // View details modal
  const handleOpenInfo = (m) => {
    setCurrentProduct(m);
    setIsInfoOpen(true);
  };

  const onCloseInfo = () => {
    setCurrentProduct(null);
    setIsInfoOpen(false);
  };

  const handleSetPage = (p) => setPage(p);

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1); // Reset to first page on sort change
    refetch({ page: 1, limit, sortBy: value, search });
  };

  // Handle search change
  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);
    return () => clearTimeout(handler);
  }, [search]);

  return (
    <>
      <CreateProductDialog
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreate}
        editData={currentProduct}
        loading={addLoading || updateLoading}
      />
      <ViewProductDialog
        isOpen={isInfoOpen}
        onClose={onCloseInfo}
        data={currentProduct}
      />

      <div className="max-w-4xl mx-auto p-8">
        <div className="flex gap-4 justify-between">
          <h1 className="text-4xl font-bold mb-4">Products</h1>
          <Button onClick={handleOpen}>+ New product</Button>
        </div>
        <p className="mb-4">
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
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NAME_ASC"><ArrowDownAZ /> Sort alphabetically</SelectItem>
              <SelectItem value="PRICE_ASC"><BanknoteArrowUp /> Price: Low to High</SelectItem>
              <SelectItem value="PRICE_DESC"><BanknoteArrowDown /> Price: High to Low</SelectItem>
              <SelectItem value="STOCK_ASC"><ArrowUp01 /> Stock: Low to High</SelectItem>
              <SelectItem value="STOCK_DESC"><ArrowDown10 /> Stock: High to Low</SelectItem>
            </SelectContent>
          </Select>
          {/* <Select>
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
          </Select> */}
          {/* <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="fine">Clothing</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6 text-sm">
          {loading && (
            <LoadingText
              label="Loading products..."
              className=" col-span-full"
            />
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
                <div className="text-gray-400 text-[.6rem] mb-1">
                  {product.sku}
                </div>
                {product.manufacturer?.name && (
                  <div className="text-gray-500 text-[.6rem] mb-2">
                    by {product.manufacturer.name}
                  </div>
                )}

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
                  <Button variant="outline" onClick={() => handleEdit(product)}>
                    <Edit /> Edit
                  </Button>
                  <Button onClick={() => handleOpenInfo(product)}>
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

        <div className="text-sm text-gray-500 text-right mt-4">Showing {totalCount} products</div>

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
