import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TestBookingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>(null);

  const handleCreateBooking = async () => {
    try {
      // Simulate booking creation
      const mockBooking = {
        id: Math.floor(Math.random() * 1000),
        totalAmount: 500000,
        userId: 1
      };
      
      setBookingData(mockBooking);
      setStep(2);
      console.log('Mock booking created:', mockBooking);
    } catch (err) {
      console.error('Error creating booking:', err);
    }
  };

  const handleMoMoPayment = async () => {
    try {
      // Simulate MoMo payment
      const mockMoMoResponse = {
        orderId: `MOMO_${Date.now()}`,
        payUrl: 'https://test-payment.momo.vn/v2/gateway/pay?token=mock_token',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=momo_payment_test'
      };
      
      console.log('MoMo payment initiated:', mockMoMoResponse);
      
      // Show QR code
      setStep(3);
    } catch (err) {
      console.error('Error initiating MoMo payment:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test Booking - {slug}
        </h1>
        
        {step === 1 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Create Booking</h2>
            <p className="text-gray-600 mb-4">Tour: {slug}</p>
            <p className="text-gray-600 mb-6">Price: 500,000 VND</p>
            
            <button
              onClick={handleCreateBooking}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Booking
            </button>
          </div>
        )}

        {step === 2 && bookingData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Booking Created!</h2>
            <p className="text-gray-600 mb-2">Booking ID: {bookingData.id}</p>
            <p className="text-gray-600 mb-2">User ID: {bookingData.userId}</p>
            <p className="text-gray-600 mb-6">Total Amount: {bookingData.totalAmount.toLocaleString()} VND</p>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Payment Options</h3>
              <button
                onClick={handleMoMoPayment}
                className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg font-semibold"
              >
                💳 Pay with MoMo
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: MoMo Payment</h2>
            <p className="text-gray-600 mb-6">Scan QR code to complete payment</p>
            
            <div className="text-center">
              <div className="bg-gray-100 p-8 rounded-lg inline-block mb-4">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=momo_payment_test" 
                  alt="MoMo QR Code"
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Amount: {bookingData?.totalAmount.toLocaleString()} VND
              </p>
              <p className="text-sm text-gray-500">
                Order ID: MOMO_{Date.now()}
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back to Start
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestBookingPage;
