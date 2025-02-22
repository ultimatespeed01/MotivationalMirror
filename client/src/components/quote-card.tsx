import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuoteCardProps {
  quote?: Quote;
  isLoading: boolean;
  onRefresh: () => void;
}

export function QuoteCard({ quote, isLoading, onRefresh }: QuoteCardProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (!quote) return;
    
    try {
      await navigator.clipboard.writeText(`"${quote.content}" - ${quote.author}`);
      toast({
        title: "Copied to clipboard",
        description: "Quote has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try again",
      });
    }
  };

  const shareQuote = async () => {
    if (!quote) return;
    
    try {
      await navigator.share({
        text: `"${quote.content}" - ${quote.author}`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to share",
        description: "Sharing is not supported on this device",
      });
    }
  };

  return (
    <Card className="backdrop-blur-lg bg-card/50 border-none shadow-xl">
      <CardContent className="p-6 space-y-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ) : quote ? (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <p className="text-2xl font-serif text-foreground">
                "{quote.content}"
              </p>
              <p className="text-lg text-muted-foreground">
                - {quote.author}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            disabled={isLoading || !quote}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={shareQuote}
            disabled={isLoading || !quote}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
