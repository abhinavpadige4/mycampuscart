
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppContactProps {
  phoneNumber: string;
  productName: string;
  className?: string;
}

export const WhatsAppContact = ({ phoneNumber, productName, className }: WhatsAppContactProps) => {
  const handleWhatsAppClick = () => {
    const message = `Hi! I'm interested in your product: ${productName}`;
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
