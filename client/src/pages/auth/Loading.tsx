import { Loader2 } from "lucide-react";
import * as COMP from "@/components/ui/card";
import { Background } from "@/components/Background";

export default function LoadingScreen() {
  return (
    <Background className="flex items-center justify-center">
      <COMP.Card className="w-full max-w-md border-0 shadow-2xl">
        <COMP.CardHeader className="space-y-4 text-center">
          <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin" />
          <COMP.CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Loading, Please Wait...
          </COMP.CardTitle>
        </COMP.CardHeader>
        <COMP.CardContent className="text-center text-gray-700 dark:text-gray-300">
          We're processing your request. This may take a few seconds.
        </COMP.CardContent>
      </COMP.Card>
    </Background>
  );
}
