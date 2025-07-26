
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
    if (!phoneNumber) {
      alert('WhatsApp number not available for this product');
      return;
    }
    
    let message = `Hi! I'm interested in your product: ${productName}`;
    if (productNumber) {
      message += `\nProduct ID: ${productNumber}`;
    }
    // Remove product image from WhatsApp message to fix broken link issue
    message += `\n\nPlease let me know if it's still available!`;
    
    const encodedMessage = encodeURIComponent(message);
    const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    if (cleanPhoneNumber.length < 10) {
      alert('Invalid phone number format');
      return;
    }
    
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button 
      variant="gradient" 
      onClick={handleWhatsAppClick}
      className={className}
      disabled={!phoneNumber}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {phoneNumber ? 'Chat on WhatsApp' : 'Contact Not Available'}
    </Button>
  );
};
