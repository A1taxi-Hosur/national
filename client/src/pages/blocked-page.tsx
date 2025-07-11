import { Lock, AlertTriangle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-200 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800">
              WEBSITE BLOCKED
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 font-semibold">
                  DUE TO PAYMENT
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                This website has been temporarily blocked due to outstanding payment issues. 
                Please contact the website owner to resolve this matter.
              </p>
            </div>

            <div className="border-t border-red-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Contact Information:
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-700">
                    +91 96636 28302
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-700">
                    info@nationalfurniture.in
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
              
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => window.open('tel:+919663628302', '_self')}
              >
                Call Now
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-xs text-red-600/70">
            Error Code: PAYMENT_BLOCKED_001
          </p>
        </div>
      </div>
    </div>
  );
}