import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCode from "qrcode";

export default function QRCheckinPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedGym, setSelectedGym] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const { data: gymsData, isLoading } = useQuery({
    queryKey: ["/api/gyms"],
  });

  const generateQRCode = async (gymId: string) => {
    try {
      const url = await QRCode.toDataURL(`ratfit://checkin/${gymId}`);
      setQrCodeUrl(url);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleGymSelect = (gym: any) => {
    setSelectedGym(gym);
    generateQRCode(gym.id);
  };

  const handleQRScan = () => {
    setShowSuccessModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">Loading gyms...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">QR Check-in</h1>
          <p className="text-muted-foreground">Scan the gym's QR code to check in</p>
        </div>

        {/* QR Code Display */}
        {selectedGym && (
          <Card>
            <CardContent className="pt-8">
              <div className="text-center space-y-6">
                <div className="mx-auto w-48 h-48 border border-border rounded-lg flex items-center justify-center bg-white">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-full h-full object-contain p-4"
                      data-testid="qr-code-image"
                    />
                  ) : (
                    <div className="text-muted-foreground">Generating QR code...</div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedGym.name}
                  </h3>
                  <p className="text-muted-foreground">Point your camera at this QR code</p>
                </div>
                <Button
                  onClick={handleQRScan}
                  className="floating-action"
                  data-testid="button-scan-qr"
                >
                  Scan QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Gyms */}
        <Card>
          <CardHeader>
            <CardTitle>Available Gyms</CardTitle>
            <CardDescription>Select a gym to generate its QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {gymsData?.gyms?.map((gym: any) => (
                <div
                  key={gym.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedGym?.id === gym.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => handleGymSelect(gym)}
                  data-testid={`gym-card-${gym.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {gym.name.split(' ').map((word: string) => word[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{gym.name}</h4>
                      <p className="text-sm text-muted-foreground">{gym.location}</p>
                    </div>
                  </div>
                  {gym.isRatFitAssured && (
                    <div className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
                      RatFit Assured
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="text-center" data-testid="success-modal">
            <DialogHeader>
              <div className="text-6xl mb-4">✅</div>
              <DialogTitle className="text-xl">Check-in Successful!</DialogTitle>
              <DialogDescription>
                Welcome to {selectedGym?.name}
              </DialogDescription>
            </DialogHeader>
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="mt-4"
              data-testid="button-close-modal"
            >
              Great!
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
