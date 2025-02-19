import { decode, getToken } from 'next-auth/jwt';

// Base URL API
export const baseUrl = 'https://api-v1.rxtn.in';

// Check authendication
export const isAuthenticated = false;

//date converted to local time
export const dateToLocalDateYear = (value: string) => {
  const event = new Date(value);
  return event.toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

//date converted to local time
export const dateToLocalTimeDateYear = (value: string) => {
  const event = new Date(value);
  const dateYear = event.toLocaleString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const hourMinutes = event.toLocaleTimeString('en-US');
  return `${dateYear} ${hourMinutes}`;
};

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const stripHtmlTags = (html: any) => {
  return html?.replace(/<[^>]*>/g, '');
};

export function rgbaColor(rgb: any, alpha: any) {
  // Extract numbers from rgb format
  const match = rgb.match(/\d+/g);
  if (!match) return rgb; // Fallback to original if parsing fails

  const [r, g, b] = match.map(Number);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function hexToRgba(hex: any, alpha: any) {
  // Remove "#" if present
  hex = hex.replace(/^#/, '');

  // Convert shorthand hex (#000) to full form (#000000)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char: any) => char + char)
      .join('');
  }

  // Parse the r, g, b values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
