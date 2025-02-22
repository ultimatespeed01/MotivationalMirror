import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { QuoteCard } from "@/components/quote-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { getRandomPhoto } from "@/lib/unsplash";

export default function Home() {
  const [bgImage, setBgImage] = useState("");
  const { toast } = useToast();

  const { data: quote, refetch: refreshQuote, isLoading } = useQuery({
    queryKey: ['/api/quotes/random'],
    retry: 1,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error fetching quote",
        description: "Don't worry! Using our backup quote system."
      });
    }
  });

  useEffect(() => {
    const loadBackground = async () => {
      try {
        const imageUrl = await getRandomPhoto();
        setBgImage(imageUrl);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to load background",
          description: "Using fallback background instead",
        });
      }
    };
    loadBackground();
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 backdrop-blur-xl bg-background/50" />

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl mx-4"
      >
        <QuoteCard
          quote={quote}
          isLoading={isLoading}
          onRefresh={() => refreshQuote()}
        />
      </motion.div>
    </div>
  );
}