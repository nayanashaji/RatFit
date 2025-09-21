import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
      <div className="page-container">
        <div className="content-container">
          <div className="loading">Loading gyms...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="text-center mb-16">
          <h1 style={{ fontSize: '32px', fontWeight: '400', color: '#202124', marginBottom: '8px' }}>
            QR Check-in
          </h1>
          <p style={{ fontSize: '16px', color: '#5f6368' }}>
            Scan the gym's QR code to check in
          </p>
        </div>

        {/* QR Code Display */}
        {selectedGym && (
          <div className="card google-card text-center" style={{ marginBottom: '24px' }}>
            <div className="qr-container">
              <div className="qr-code">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="qr-code img"
                    data-testid="qr-code-image"
                  />
                ) : (
                  <div style={{ color: '#5f6368' }}>Generating QR code...</div>
                )}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#202124', marginBottom: '8px' }}>
                  {selectedGym.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '24px' }}>
                  Point your camera at this QR code
                </p>
              </div>
              <button
                onClick={handleQRScan}
                className="google-button"
                data-testid="button-scan-qr"
              >
                Scan QR Code
              </button>
            </div>
          </div>
        )}

        {/* Available Gyms */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Available Gyms</h2>
            <p className="card-subtitle">Select a gym to generate its QR code</p>
          </div>
          <div className="card-content">
            <div className="grid">
              {gymsData?.gyms?.map((gym: any) => (
                <div
                  key={gym.id}
                  className={`gym-card ${selectedGym?.id === gym.id ? 'selected' : ''}`}
                  onClick={() => handleGymSelect(gym)}
                  data-testid={`gym-card-${gym.id}`}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: selectedGym?.id === gym.id ? '2px solid #4285f4' : '1px solid #dadce0',
                    background: selectedGym?.id === gym.id ? '#f8f9ff' : 'white'
                  }}
                >
                  <div className="gym-header">
                    <div 
                      className="gym-icon"
                      style={{
                        background: '#4285f4',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '700'
                      }}
                    >
                      {gym.name.split(' ').map((word: string) => word[0]).join('').substring(0, 2)}
                    </div>
                    <div className="gym-info">
                      <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#202124', marginBottom: '4px' }}>
                        {gym.name}
                      </h4>
                      <p style={{ fontSize: '14px', color: '#5f6368', margin: '0' }}>
                        {gym.location}
                      </p>
                    </div>
                  </div>
                  {gym.isRatFitAssured && (
                    <div className="badge badge-assured" style={{ marginTop: '12px' }}>
                      RatFit Assured
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal-overlay" data-testid="success-modal">
            <div className="modal-content">
              <div className="modal-icon">✅</div>
              <h2 className="modal-title">Check-in Successful!</h2>
              <p className="modal-description">
                Welcome to {selectedGym?.name}
              </p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="google-button"
                data-testid="button-close-modal"
              >
                Great!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}