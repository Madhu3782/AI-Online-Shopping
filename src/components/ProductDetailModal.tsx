import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/components/ProductCard";

interface Props {
  product: Product;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBargain: (product: Product) => void;
}

const ProductDetailModal = ({ product, open, onClose, onAddToCart, onBargain }: Props) => {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <Card className="w-11/12 max-w-3xl shadow-2xl z-10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-square bg-muted">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <CardContent>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-xl font-semibold text-primary mb-4">₹{product.price}</p>
            {product.description && <p className="text-muted-foreground mb-4">{product.description}</p>}
            <div className="flex gap-2">
              <Button onClick={() => { onAddToCart(product); onClose(); }} className="flex-1">Add to Cart</Button>
              <Button variant="outline" onClick={() => onBargain(product)} className="flex-1">Bargain</Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailModal;
