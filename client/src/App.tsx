import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BlockPage from "@/pages/block-page";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      {/* Display only the blocking page */}
      <BlockPage />
    </TooltipProvider>
  );
}

export default App;
