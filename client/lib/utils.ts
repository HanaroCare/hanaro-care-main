import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleReservation = () => {
  window.location.href =
    'https://m.hanabank.com/m/oqs/livingCounsel.do?coopChnl=0003';
};
