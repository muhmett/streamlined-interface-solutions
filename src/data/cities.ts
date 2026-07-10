import type { LatLng } from "@/lib/geo";

/** Manual-location fallback when the browser blocks geolocation. */
export interface City extends LatLng {
  name: string;
}

export const CITIES: City[] = [
  { name: "الدار البيضاء", lat: 33.5731, lng: -7.5898 },
  { name: "الرباط", lat: 34.0209, lng: -6.8416 },
  { name: "مراكش", lat: 31.6295, lng: -7.9811 },
  { name: "فاس", lat: 34.0181, lng: -5.0078 },
  { name: "طنجة", lat: 35.7595, lng: -5.834 },
  { name: "أكادير", lat: 30.4278, lng: -9.5981 },
  { name: "مكناس", lat: 33.8935, lng: -5.5473 },
  { name: "وجدة", lat: 34.6814, lng: -1.9086 },
  { name: "القنيطرة", lat: 34.261, lng: -6.5802 },
  { name: "تطوان", lat: 35.5889, lng: -5.3626 },
  { name: "سلا", lat: 34.0531, lng: -6.7985 },
  { name: "الجديدة", lat: 33.2316, lng: -8.5007 },
  { name: "آسفي", lat: 32.2994, lng: -9.2372 },
  { name: "بني ملال", lat: 32.3373, lng: -6.3498 },
  { name: "الناظور", lat: 35.1681, lng: -2.9335 },
  { name: "العيون", lat: 27.1253, lng: -13.1625 },
];
