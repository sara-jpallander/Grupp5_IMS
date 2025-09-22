import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Badge } from "@/components/ui/badge";
import LoadingText from "@/components/LoadingText";
import { GET_CRITICAL_STOCK } from "@/api/graphql";

export default function Home() {
  const { data: criticalStockData, loading } = useQuery(GET_CRITICAL_STOCK);
  const criticalStock =
    criticalStockData?.productCriticalStock.items.slice(0, 5) || [];

  const { data: stockValueData } = useQuery(gql`
    query TotalStockValue {
      stockValue
    }
  `);
  const totalStockValue = stockValueData?.stockValue || 0;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Industry Management System</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora animi
        neque assumenda sint velit ipsa, a impedit sit? Vel nemo sequi sapiente
        doloremque unde aperiam quia tempora similique labore quam.
      </p>

      <div className="border-1 p-4 my-6 rounded-sm">
        <strong>Total stock value:</strong> {totalStockValue}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="border-1 gap-4 p-4">
          <strong>Top manufacturers</strong>
          {/* <ul className="list">
            <li>IKEA - 500 products</li>
            <li>ELON - 340 products</li>
          </ul> */}
        </div>
        <div className="border-1 gap-4 p-4">
          <strong>Critical stock</strong>
          {loading && <LoadingText />}
          <div className="grid gap-1 mt-2">
            {criticalStock.map((c) => (
              <div key={c.id} className="flex justify-between border-b-1 p-1">
                <div className="text-gray-500 text-sm">{c.name}</div>
                <Badge className="bg-red-400">{c.amountInStock} in stock</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
