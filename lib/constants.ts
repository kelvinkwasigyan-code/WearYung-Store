export const STORE_LOCATION = {
  name: 'WEAR YUNG Flagship Store',
  lat: 6.094673,
  lng: -0.260387,
  coordinatesRaw: `6°05'40.8"N 0°15'37.4"W`,
  mapsUrl: 'https://www.google.com/maps?q=6.094673,-0.260387',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=6.094673,-0.260387',
};

export const ADMIN_EMAILS: string[] = [
  'wearyungworldwide@gmail.com',
  'admin@wearyung.com',
  ...(process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL.toLowerCase()] : []),
  ...(process.env.ADMIN_NOTIFICATION_EMAIL ? [process.env.ADMIN_NOTIFICATION_EMAIL.toLowerCase()] : []),
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.some((e) => e.toLowerCase() === email.trim().toLowerCase());
}
