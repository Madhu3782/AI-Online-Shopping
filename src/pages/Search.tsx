import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ChatWidget from "@/components/ChatWidget";
import { useStore } from "@/lib/store";
import { groceryProducts, clothesProducts, electronicsProducts } from "@/data/products";
import { toast } from "sonner";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { addToCart, getTotalItems } = useStore();

  const allProducts = [...groceryProducts, ...clothesProducts, ...electronicsProducts];
  
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={getTotalItems()} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Search Results</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} results for "{query}"
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              No products found matching "{query}"
            </p>
            <p className="text-muted-foreground">
              Try searching with different keywords
            </p>
          </div>
        )}
      </main>

      <ChatWidget />
    </div>
  );
};

export default Search;
