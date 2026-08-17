// Auth, Security, and Sound Notification Services for BAARIZ IT

/**
 * Computes a SHA-256 hash using the native browser Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + '_baariz_it_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates Bangladeshi mobile number format
 * Valid prefixes: 013, 014, 015, 016, 017, 018, 019
 */
export function validateBdPhone(phone: string): { isValid: boolean; formatted: string; error?: string } {
  const cleaned = phone.replace(/[^0-9+]/g, '');
  let normalized = cleaned;

  if (normalized.startsWith('+88')) {
    normalized = normalized.slice(3);
  } else if (normalized.startsWith('88')) {
    normalized = normalized.slice(2);
  }

  const bdRegex = /^01[3-9]\d{8}$/;
  if (!bdRegex.test(normalized)) {
    return {
      isValid: false,
      formatted: phone,
      error: 'Please enter a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX or 01622615188).',
    };
  }

  return { isValid: true, formatted: normalized };
}

/**
 * Validates email address format
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  return { isValid: true };
}

export interface PasswordStrengthResult {
  score: number; // 0 to 100
  label: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  color: string;
  hasMinLength: boolean;
  hasNumber: boolean;
  hasUpperLower: boolean;
  hasSpecialChar: boolean;
  feedback: string[];
}

/**
 * Calculates password strength and provides feedback
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  const feedback: string[] = [];

  const hasMinLength = password.length >= 6;
  const hasLongLength = password.length >= 10;
  const hasNumber = /\d/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  if (hasMinLength) score += 25;
  else feedback.push('Minimum 6 characters required');

  if (hasLongLength) score += 15;

  if (hasLower && hasUpper) {
    score += 25;
  } else {
    feedback.push('Use both uppercase and lowercase letters');
  }

  if (hasNumber) {
    score += 20;
  } else {
    feedback.push('Include at least one number');
  }

  if (hasSpecialChar) {
    score += 15;
  } else {
    feedback.push('Add a special character (!@#$%^&*) for extra strength');
  }

  score = Math.min(100, Math.max(0, score));

  let label: PasswordStrengthResult['label'] = 'Very Weak';
  let color = 'bg-rose-500';

  if (score >= 85) {
    label = 'Very Strong';
    color = 'bg-emerald-400';
  } else if (score >= 65) {
    label = 'Strong';
    color = 'bg-cyan-400';
  } else if (score >= 45) {
    label = 'Moderate';
    color = 'bg-amber-400';
  } else if (score >= 25) {
    label = 'Weak';
    color = 'bg-orange-500';
  }

  return {
    score,
    label,
    color,
    hasMinLength,
    hasNumber,
    hasUpperLower: hasLower && hasUpper,
    hasSpecialChar,
    feedback,
  };
}

/**
 * Plays a pleasant synthesizer audio chime using Web Audio API
 */
export function playNotificationChime(type: 'message' | 'alert' | 'success' = 'message') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'message') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    }
  } catch {
    // Graceful fallback in environments with audio policy restrictions
  }
}
