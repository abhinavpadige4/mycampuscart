
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppContactProps {
  phoneNumber: string;
  productName: string;
  productImage?: string;
  productNumber?: string;
  className?: string;
}

export const WhatsAppContact = ({ phoneNumber, productName, productImage, productNumber, className }: WhatsAppContactProps) => {
  const handleWhatsAppClick = () => {
    let message = `Hi! I'm interested in your product: ${productName}`;
    if (productNumber) {
      message += `\nProduct ID: ${productNumber}`;
    }
    if (productImage) {
      message += `\n\nProduct Image: ${productImage}`;
    }
    message += `\n\nPlease let me know if it's still available!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button 
      variant="gradient" 
      onClick={handleWhatsAppClick}
      className={className}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      Chat on WhatsApp
    </Button>
  );
};
