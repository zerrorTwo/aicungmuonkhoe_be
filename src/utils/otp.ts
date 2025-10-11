/**
 * Generate a random 6-digit OTP code
 * @returns {string} 6-digit OTP code
 */
export function generateOtpCode(): string {
  // Generate random 6-digit number (100000 to 999999)
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

/**
 * Generate OTP expiry time
 * @param minutes - Minutes from now (default: 5 minutes)
 * @returns {Date} Expiry date
 */
export function generateOtpExpiry(minutes: number = 5): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
}

/**
 * Check if OTP is expired
 * @param expiryDate - OTP expiry date
 * @returns {boolean} True if expired
 */
export function isOtpExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}
