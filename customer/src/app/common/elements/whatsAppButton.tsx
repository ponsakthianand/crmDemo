import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "+919962340067"; // Replace with your actual number
  const message = encodeURIComponent("Hello! I'm interested in your service.");

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center gap-2">
          <MessageCircle size={20} /> Chat
        </Button>
      </Link>
    </div>
  );
};

export default WhatsAppButton;
