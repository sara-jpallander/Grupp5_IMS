import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_CRITICAL_STOCK } from "@/api/graphql";
import { Eye, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LoadingText from "@/components/LoadingText";
import ViewProductDialog from "@/components/dialogs/ViewProductDialog";
import Pagination from "@/components/Pagination";

export default function CriticalStock() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, loading } = useQuery(GET_CRITICAL_STOCK, {
    variables: { page, limit },
  });

  const productsPage = data?.criticalStockProducts || {};
  const products = productsPage.items || [];
  const totalCount = productsPage.totalCount || 0;
  const hasNextPage = productsPage.hasNextPage || false;

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

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
  return (
    <>
      <ViewProductDialog
        isOpen={isInfoOpen}
        onClose={onCloseInfo}
        data={currentProduct}
      />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Critical stock</h1>

        <p className="mb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
          odit, fugiat, quae maxime dolor officiis ab optio esse repellendus
          libero adipisci quasi similique et numquam beatae! In laudantium eius
          ex?
        </p>

        <div className="mt-8">
          {loading && (
            <LoadingText
              label="Loading products..."
              className=" col-span-full"
            />
          )}
          {!loading && products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {products.map((p) => (
                  <div
                    className="p-3 pr-3 pl-4 border-1 rounded-sm"
                    key={p.id + p.name}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-semibold flex gap-2 items-center">
                        <TriangleAlert className="size-4" /> {p.name}
                      </div>
                    </div>
                    <Separator className="mt-2" />
                    <div className="p-2 text-sm">
                      <div>
                        <strong>Manufacturer:</strong> {p.manufacturer}
                      </div>
                      <div>
                        <strong>Contact:</strong> {p.contact.name}
                      </div>
                      <div>
                        <strong>Email:</strong> {p.contact.email}
                      </div>
                      {p.contact.phone && (
                        <div>
                          <strong>Phone:</strong> {p.contact.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-600 border-red-500"
                      >
                        {p.amountInStock} in stock
                      </Badge>
                      <Button
                        variant="outline"
                        onClick={() => handleOpenInfo(p)}
                        className="!px-2 !text-[.7rem] h-6"
                      >
                        <Eye />
                        Show details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-500 text-right mt-4">
                Showing {totalCount} products
              </div>

              <Pagination
                className="mt-8"
                page={page}
                hasNextPage={hasNextPage}
                onSetPage={handleSetPage}
                totalCount={totalCount}
                limit={limit}
              />
            </>
          ) : (
            <div className="text-gray-500">
              No products with critical stock!
            </div>
          )}
        </div>
      </div>
    </>
  );
}
