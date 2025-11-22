import React from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ChatWidget from "@/components/ChatWidget";
import ProductDetailModal from "@/components/ProductDetailModal";
import { useStore } from "@/lib/store";
import { clothesProducts } from "@/data/products";
import { toast } from "sonner";

const Clothes = () => {
  const { addToCart, getTotalItems } = useStore();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const [modalProduct, setModalProduct] = React.useState<any | null>(null);
  const [negotiationProduct, setNegotiationProduct] = React.useState<any | null>(null);

  const handleViewProduct = (product: any) => {
    setModalProduct(product);
  };

  const handleBargain = (product: any) => {
    // close modal and start negotiation via ChatWidget prop
    setModalProduct(null);
    setNegotiationProduct(product);
  };

  const clearNegotiation = () => setNegotiationProduct(null);

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={getTotalItems()} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Clothes</h1>
          <p className="text-muted-foreground">Trendy fashion for everyone</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clothesProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
                onAddToCart={handleAddToCart}
                onViewProduct={handleViewProduct}
            />
          ))}
        </div>
      </main>

      <ProductDetailModal
        product={modalProduct}
        open={!!modalProduct}
        onClose={() => setModalProduct(null)}
        onAddToCart={(p) => handleAddToCart(p)}
        onBargain={(p) => handleBargain(p)}
      />

      <ChatWidget negotiationProduct={negotiationProduct} onClearNegotiation={clearNegotiation} />
    </div>
  );
};

export default Clothes;
