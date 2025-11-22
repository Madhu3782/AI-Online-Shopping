import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Product } from "@/components/ProductCard";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface Negotiation {
  active: boolean;
  product?: Product | null;
  originalPrice?: number;
  minPrice?: number;
  maxDiscountPercent?: number;
  round: number;
  lastOffer?: number;
  language?: string;
}

const ChatWidget = ({ negotiationProduct, onClearNegotiation }: { negotiationProduct?: Product | null; onClearNegotiation?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 I'm ShopMate, your shopping buddy. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [negotiation, setNegotiation] = useState<Negotiation>({ active: false, round: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Start negotiation when a product is passed from the page
  useEffect(() => {
    if (negotiationProduct) {
      // open the widget and initialize negotiation state
      setIsOpen(true);
      const maxDiscountPercent = 20;
      const originalPrice = negotiationProduct.price;
      const minPrice = Math.round(originalPrice * (1 - maxDiscountPercent / 100));

      setNegotiation({
        active: true,
        product: negotiationProduct,
        originalPrice,
        minPrice,
        maxDiscountPercent,
        round: 0,
        lastOffer: undefined,
        language: "en",
      });

      const startMsg: Message = {
        id: `bot-${Date.now()}`,
        text: `I see you're interested in ${negotiationProduct.name} priced at ₹${originalPrice}. Why would you like a discount?`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, startMsg]);
    }
  }, [negotiationProduct]);

  const detectLanguage = (text: string): string => {
    // Simple language detection based on Unicode ranges
    if (/[\u0900-\u097F]/.test(text)) return "hi"; // Devanagari (Hindi)
    if (/[\u0C80-\u0CFF]/.test(text)) return "kn"; // Kannada
    return "en"; // Default to English
  };

  const generateResponse = (userMessage: string, language: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // If a negotiation is active, handle bargaining flow first
    if (negotiation.active) {
      const acceptKeywords = ["yes", "deal", "ok", "okay", "ठीक है", "हां", "हाँ", "ಹೌದು"];
      if (acceptKeywords.some((k) => lowerMessage.includes(k))) {
        const agreed = negotiation.lastOffer ?? negotiation.originalPrice ?? 0;
        setNegotiation({ active: false, round: 0 });
        if (onClearNegotiation) onClearNegotiation();
        console.log("[negotiation] confirmed", agreed);
        if (language === "hi") return `अनुबंध पक्का! क्या मैं इसे आपकी कार्ट में जोड़ दूं? 😄`;
        if (language === "kn") return `ಸೋದು ದೃಢೀಕರಿಸಲಾಯಿತು! ಇದನ್ನು ನಿಮ್ಮ ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಬೇಕೆ? 😄`;
        return `Deal confirmed! Should I add it to your cart? 😄`;
      }

      // treat user's message as reason — make a counteroffer
      const round = negotiation.round + 1;
      const increment = 3; // percent increase per round
      const base = 5; // starting percent
      const maxP = negotiation.maxDiscountPercent ?? 20;
      const discountPercent = Math.min(base + round * increment, maxP);
      let offer = Math.round((negotiation.originalPrice ?? 0) * (1 - discountPercent / 100));
      if (negotiation.minPrice && offer < negotiation.minPrice) offer = negotiation.minPrice;

      setNegotiation((prev) => ({ ...(prev as Negotiation), round, lastOffer: offer, active: true }));
      console.log("[negotiation] counteroffer", discountPercent, offer);

      if (language === "hi") return `ठीक है — मैं आपको रु. ${offer} की पेशकश कर सकता हूँ (लगभग ${discountPercent}% छूट)। स्वीकार हैं?`;
      if (language === "kn") return `ಸರಿ — ನಾನು ನಿಮಗೆ ₹${offer} ರ ರಿಯಾಯಿತಿಯನ್ನು ನೀಡಬಹುದು (ಸುಮಾರು ${discountPercent}% ಕಡಿತ). ಒಪ್ಪುತ್ತೀರಿ?`;
      return `Alright — I can offer ₹${offer} (about ${discountPercent}% off). Do you accept?`;
    }
    
    // Navigation patterns
    if (lowerMessage.includes("cart") || lowerMessage.includes("कार्ट") || lowerMessage.includes("ಕಾರ್ಟ್")) {
      setTimeout(() => navigate("/cart"), 1000);
      if (language === "hi") return "ठीक है! आपकी कार्ट खोल रहा हूँ 🛒💛\n[ROUTE:/cart]";
      if (language === "kn") return "ಸರಿ! ನಿಮ್ಮ ಕಾರ್ಟ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ 🛒💛\n[ROUTE:/cart]";
      return "Got it! Opening your cart now 🛒💛\n[ROUTE:/cart]";
    }
    
    if (lowerMessage.includes("grocery") || lowerMessage.includes("groceries") || lowerMessage.includes("किराना") || lowerMessage.includes("ದಿನಸಿ")) {
      setTimeout(() => navigate("/grocery"), 1000);
      if (language === "hi") return "यम! किराने का सेक्शन खोल रहा हूँ 🥦✨\n[ROUTE:/grocery]";
      if (language === "kn") return "ಯಮ್! ದಿನಸಿ ವಿಭಾಗ ತೆರೆಯುತ್ತಿದ್ದೇನೆ 🥦✨\n[ROUTE:/grocery]";
      return "Yum! Let's check out the grocery section 🥦✨\n[ROUTE:/grocery]";
    }
    
    if (lowerMessage.includes("clothes") || lowerMessage.includes("clothing") || lowerMessage.includes("shirt") || lowerMessage.includes("कपड़े") || lowerMessage.includes("ಬಟ್ಟೆ")) {
      setTimeout(() => navigate("/clothes"), 1000);
      if (language === "hi") return "बढ़िया! कपड़ों का सेक्शन खोल रहा हूँ 👕✨\n[ROUTE:/clothes]";
      if (language === "kn") return "ಚೆನ್ನಾಗಿದೆ! ಬಟ್ಟೆಗಳ ವಿಭಾಗ ತೆರೆಯುತ್ತಿದ್ದೇನೆ 👕✨\n[ROUTE:/clothes]";
      return "Nice choice! Taking you to the clothes section 👕✨\n[ROUTE:/clothes]";
    }
    
    if (lowerMessage.includes("electronics") || lowerMessage.includes("phone") || lowerMessage.includes("इलेक्ट्रॉनिक") || lowerMessage.includes("ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್")) {
      setTimeout(() => navigate("/electronics"), 1000);
      if (language === "hi") return "शानदार! इलेक्ट्रॉनिक्स सेक्शन खोल रहा हूँ 📱✨\n[ROUTE:/electronics]";
      if (language === "kn") return "ಅದ್ಭುತ! ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ವಿಭಾಗ ತೆರೆಯುತ್ತಿದ್ದೇನೆ 📱✨\n[ROUTE:/electronics]";
      return "Great! Taking you to the electronics section 📱✨\n[ROUTE:/electronics]";
    }
    
    if (lowerMessage.includes("checkout") || lowerMessage.includes("pay") || lowerMessage.includes("payment") || lowerMessage.includes("भुगतान") || lowerMessage.includes("ಪಾವತಿ")) {
      setTimeout(() => navigate("/checkout"), 1000);
      if (language === "hi") return "बढ़िया! चेकआउट पेज खोल रहा हूँ 💳✨\n[ROUTE:/checkout]";
      if (language === "kn") return "ಚೆನ್ನಾಗಿದೆ! ಚೆಕ್‌ಔಟ್ ಪುಟ ತೆರೆಯುತ್ತಿದ್ದೇನೆ 💳✨\n[ROUTE:/checkout]";
      return "Awesome! Let's go to checkout 💳✨\n[ROUTE:/checkout]";
    }
    
    if (lowerMessage.includes("login") || lowerMessage.includes("signup") || lowerMessage.includes("account") || lowerMessage.includes("लॉगिन") || lowerMessage.includes("ಲಾಗಿನ್")) {
      setTimeout(() => navigate("/auth"), 1000);
      if (language === "hi") return "बिल्कुल! लॉगिन पेज खोल रहा हूँ 😊\n[ROUTE:/auth]";
      if (language === "kn") return "ಖಂಡಿತ! ಲಾಗಿನ್ ಪುಟ ತೆರೆಯುತ್ತಿದ್ದೇನೆ 😊\n[ROUTE:/auth]";
      return "Sure! Taking you to login & signup page 😊\n[ROUTE:/auth]";
    }
    
    if (lowerMessage.includes("home") || lowerMessage.includes("होम") || lowerMessage.includes("ಮನೆ")) {
      setTimeout(() => navigate("/"), 1000);
      if (language === "hi") return "होम पेज पर वापस जा रहे हैं 🏠\n[ROUTE:/]";
      if (language === "kn") return "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗುತ್ತಿದ್ದೇವೆ 🏠\n[ROUTE:/]";
      return "Going back to home 🏠\n[ROUTE:/]";
    }

    // Default responses
    if (language === "hi") {
      return "मैं आपकी मदद के लिए यहाँ हूँ! 💛 आप किराना, कपड़े, इलेक्ट्रॉनिक्स देख सकते हैं या अपनी कार्ट चेक कर सकते हैं।";
    }
    if (language === "kn") {
      return "ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ! 💛 ನೀವು ದಿನಸಿ, ಬಟ್ಟೆಗಳು, ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ನೋಡಬಹುದು ಅಥವಾ ನಿಮ್ಮ ಕಾರ್ಟ್ ಪರಿಶೀಲಿಸಬಹುದು।";
    }
    return "I'm here to help! 💛 You can browse groceries, clothes, electronics, or check your cart.";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    const language = detectLanguage(inputValue);
    const botResponse = generateResponse(inputValue, language);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-primary to-accent">
            <h3 className="font-bold text-lg text-primary-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              ShopMate Assistant
            </h3>
            <p className="text-xs text-primary-foreground/80">Your friendly shopping helper</p>
          </div>

          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;
