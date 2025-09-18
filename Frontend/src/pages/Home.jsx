export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Industry Management System</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora animi
        neque assumenda sint velit ipsa, a impedit sit? Vel nemo sequi sapiente
        doloremque unde aperiam quia tempora similique labore quam.
      </p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="border-1 gap-4 p-4">
          <strong>Top manufacturers</strong>
          <ul className="list">
            <li>IKEA - 500 products</li>
            <li>ELON - 340 products</li>
          </ul>
          </div>
        <div className="border-1 gap-4 p-4">
          <strong>Critical stock</strong>
        </div>
        <div className="border-1 gap-4 p-4">
          <strong>Stock value</strong>
        </div>
        <div className="border-1 gap-4 p-4">
          <strong>Stock value by manufacturer</strong>
        </div>
      </div>
    </div>
  );
}
