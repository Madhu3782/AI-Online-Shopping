import { ShoppingBasket, Shirt, Smartphone } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import Header from "@/components/Header";
import ChatWidget from "@/components/ChatWidget";
import { useStore } from "@/lib/store";

const Index = () => {
  const totalItems = useStore((state) => state.getTotalItems());

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={totalItems} />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Welcome to ShopMate
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your friendly shopping companion for groceries, clothes, and electronics.
              Chat with our AI assistant for a personalized experience! 💛
            </p>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <CategoryCard
                title="Grocery"
                icon={ShoppingBasket}
                description="Fresh groceries and daily essentials"
                href="/grocery"
                iconColor="bg-gradient-to-br from-green-500 to-emerald-600"
              />
              <CategoryCard
                title="Clothes"
                icon={Shirt}
                description="Trendy fashion for everyone"
                href="/clothes"
                iconColor="bg-gradient-to-br from-primary to-accent"
              />
              <CategoryCard
                title="Electronics"
                icon={Smartphone}
                description="Latest gadgets and devices"
                href="/electronics"
                iconColor="bg-gradient-to-br from-secondary to-blue-600"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Why Shop with Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-6">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="font-bold text-xl mb-2">AI Assistant</h3>
                <p className="text-muted-foreground">Chat in English, Hindi, or Kannada for personalized help</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="font-bold text-xl mb-2">Easy Checkout</h3>
                <p className="text-muted-foreground">Quick and secure payment options</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">Get your items delivered to your doorstep</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ChatWidget />
    </div>
  );
};

export default Index;
