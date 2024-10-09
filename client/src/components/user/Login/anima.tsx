import React, { useState } from 'react';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };
 
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-400">
      <h1 className="text-4xl font-bold text-green-600">SnapCart</h1>
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-semibold">Verify OTP</h2>
        <p className="text-center mt-2">A message with a verification code of 4 digits has been sent to your email.</p>
        <div className="flex space-x-2 mt-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-12 h-12 text-center border border-gray-300 rounded"
              maxLength={1}
            />
          ))}
        </div>
        <p className="mt-2 text-gray-600">Didn’t get the OTP? Wait for 1 minute.</p>
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Verify</button>
        <p className="mt-4 text-center text-sm">
          By continuing, you agree to our <a href="/terms" className="underline">Terms of service</a> & <a href="/privacy" className="underline">Privacy policy</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;