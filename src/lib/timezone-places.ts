/**
 * Approximate coordinates for a time zone.
 *
 * The browser will not hand over a location without asking permission, and
 * several will not even ask unless the reader clicks something first. That
 * leaves a page which shows nothing until it is prodded, which is a poor way
 * to meet someone who typed "prayer times" into a search box.
 *
 * The time zone is different: Intl reports it with no permission, no prompt
 * and no network request at all. "Asia/Dhaka" is not a street address, but it
 * is a city, and a city is enough to be right within a couple of minutes —
 * far closer than showing nothing.
 *
 * So the page opens with times, says plainly which city it assumed, and
 * offers the exact location for anyone who wants the last two minutes. The
 * privacy promise holds either way: this table ships in the bundle and
 * nothing is looked up.
 *
 * Coordinates are the city centre, rounded to four decimals. Where a zone
 * spans a large country the largest Muslim population centre is used, which
 * is the useful choice rather than the geographic one.
 */

export interface Place {
  city: string;
  country: string;
  lat: number;
  lng: number;
  /** Which convention that region generally follows. */
  method: string;
}

export const TIMEZONE_PLACES: Record<string, Place> = {
  // --- South Asia ---
  "Asia/Dhaka": { city: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125, method: "karachi" },
  "Asia/Karachi": { city: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, method: "karachi" },
  "Asia/Kolkata": { city: "Delhi", country: "India", lat: 28.6139, lng: 77.209, method: "karachi" },
  "Asia/Calcutta": { city: "Delhi", country: "India", lat: 28.6139, lng: 77.209, method: "karachi" },
  "Asia/Kathmandu": { city: "Kathmandu", country: "Nepal", lat: 27.7172, lng: 85.324, method: "karachi" },
  "Asia/Colombo": { city: "Colombo", country: "Sri Lanka", lat: 6.9271, lng: 79.8612, method: "karachi" },
  "Asia/Kabul": { city: "Kabul", country: "Afghanistan", lat: 34.5553, lng: 69.2075, method: "karachi" },

  // --- The Gulf and the Middle East ---
  "Asia/Riyadh": { city: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, method: "makkah" },
  "Asia/Dubai": { city: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708, method: "makkah" },
  "Asia/Qatar": { city: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531, method: "makkah" },
  "Asia/Kuwait": { city: "Kuwait City", country: "Kuwait", lat: 29.3759, lng: 47.9774, method: "makkah" },
  "Asia/Bahrain": { city: "Manama", country: "Bahrain", lat: 26.2285, lng: 50.586, method: "makkah" },
  "Asia/Muscat": { city: "Muscat", country: "Oman", lat: 23.588, lng: 58.3829, method: "makkah" },
  "Asia/Baghdad": { city: "Baghdad", country: "Iraq", lat: 33.3152, lng: 44.3661, method: "egypt" },
  "Asia/Tehran": { city: "Tehran", country: "Iran", lat: 35.6892, lng: 51.389, method: "tehran" },
  "Asia/Amman": { city: "Amman", country: "Jordan", lat: 31.9539, lng: 35.9106, method: "egypt" },
  "Asia/Beirut": { city: "Beirut", country: "Lebanon", lat: 33.8938, lng: 35.5018, method: "egypt" },
  "Asia/Damascus": { city: "Damascus", country: "Syria", lat: 33.5138, lng: 36.2765, method: "egypt" },
  "Asia/Jerusalem": { city: "Jerusalem", country: "Palestine", lat: 31.7683, lng: 35.2137, method: "egypt" },
  "Asia/Hebron": { city: "Hebron", country: "Palestine", lat: 31.5326, lng: 35.0998, method: "egypt" },
  "Asia/Gaza": { city: "Gaza", country: "Palestine", lat: 31.5017, lng: 34.4668, method: "egypt" },
  "Europe/Istanbul": { city: "Istanbul", country: "Türkiye", lat: 41.0082, lng: 28.9784, method: "mwl" },
  "Asia/Istanbul": { city: "Istanbul", country: "Türkiye", lat: 41.0082, lng: 28.9784, method: "mwl" },

  // --- South-East Asia ---
  "Asia/Jakarta": { city: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456, method: "egypt" },
  "Asia/Kuala_Lumpur": { city: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869, method: "egypt" },
  "Asia/Singapore": { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, method: "egypt" },
  "Asia/Brunei": { city: "Bandar Seri Begawan", country: "Brunei", lat: 4.9031, lng: 114.9398, method: "egypt" },
  "Asia/Manila": { city: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842, method: "egypt" },
  "Asia/Bangkok": { city: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, method: "egypt" },

  // --- Africa ---
  "Africa/Cairo": { city: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, method: "egypt" },
  "Africa/Lagos": { city: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, method: "mwl" },
  "Africa/Kano": { city: "Kano", country: "Nigeria", lat: 12.0022, lng: 8.592, method: "mwl" },
  "Africa/Casablanca": { city: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898, method: "mwl" },
  "Africa/Algiers": { city: "Algiers", country: "Algeria", lat: 36.7538, lng: 3.0588, method: "mwl" },
  "Africa/Tunis": { city: "Tunis", country: "Tunisia", lat: 36.8065, lng: 10.1815, method: "mwl" },
  "Africa/Tripoli": { city: "Tripoli", country: "Libya", lat: 32.8872, lng: 13.1913, method: "mwl" },
  "Africa/Khartoum": { city: "Khartoum", country: "Sudan", lat: 15.5007, lng: 32.5599, method: "egypt" },
  "Africa/Nairobi": { city: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, method: "mwl" },
  "Africa/Mogadishu": { city: "Mogadishu", country: "Somalia", lat: 2.0469, lng: 45.3182, method: "mwl" },
  "Africa/Dakar": { city: "Dakar", country: "Senegal", lat: 14.7167, lng: -17.4677, method: "mwl" },
  "Africa/Johannesburg": { city: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473, method: "mwl" },
  "Africa/Addis_Ababa": { city: "Addis Ababa", country: "Ethiopia", lat: 9.0192, lng: 38.7525, method: "mwl" },

  // --- Europe ---
  "Europe/London": { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, method: "mwl" },
  "Europe/Dublin": { city: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603, method: "mwl" },
  "Europe/Paris": { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, method: "mwl" },
  "Europe/Berlin": { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, method: "mwl" },
  "Europe/Madrid": { city: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, method: "mwl" },
  "Europe/Rome": { city: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, method: "mwl" },
  "Europe/Amsterdam": { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, method: "mwl" },
  "Europe/Brussels": { city: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517, method: "mwl" },
  "Europe/Stockholm": { city: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686, method: "mwl" },
  "Europe/Oslo": { city: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522, method: "mwl" },
  "Europe/Copenhagen": { city: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683, method: "mwl" },
  "Europe/Vienna": { city: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738, method: "mwl" },
  "Europe/Zurich": { city: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417, method: "mwl" },
  "Europe/Moscow": { city: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173, method: "mwl" },
  "Europe/Warsaw": { city: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122, method: "mwl" },
  "Europe/Sarajevo": { city: "Sarajevo", country: "Bosnia", lat: 43.8563, lng: 18.4131, method: "mwl" },
  "Europe/Lisbon": { city: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393, method: "mwl" },

  // --- The Americas ---
  "America/New_York": { city: "New York", country: "United States", lat: 40.7128, lng: -74.006, method: "isna" },
  "America/Detroit": { city: "Detroit", country: "United States", lat: 42.3314, lng: -83.0458, method: "isna" },
  "America/Chicago": { city: "Chicago", country: "United States", lat: 41.8781, lng: -87.6298, method: "isna" },
  "America/Denver": { city: "Denver", country: "United States", lat: 39.7392, lng: -104.9903, method: "isna" },
  "America/Phoenix": { city: "Phoenix", country: "United States", lat: 33.4484, lng: -112.074, method: "isna" },
  "America/Los_Angeles": { city: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437, method: "isna" },
  "America/Toronto": { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, method: "isna" },
  "America/Vancouver": { city: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207, method: "isna" },
  "America/Edmonton": { city: "Edmonton", country: "Canada", lat: 53.5461, lng: -113.4938, method: "isna" },
  "America/Mexico_City": { city: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332, method: "isna" },
  "America/Sao_Paulo": { city: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, method: "mwl" },

  // --- Oceania and Central Asia ---
  "Australia/Sydney": { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, method: "mwl" },
  "Australia/Melbourne": { city: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631, method: "mwl" },
  "Australia/Perth": { city: "Perth", country: "Australia", lat: -31.9505, lng: 115.8605, method: "mwl" },
  "Pacific/Auckland": { city: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633, method: "mwl" },
  "Asia/Tashkent": { city: "Tashkent", country: "Uzbekistan", lat: 41.2995, lng: 69.2401, method: "mwl" },
  "Asia/Almaty": { city: "Almaty", country: "Kazakhstan", lat: 43.222, lng: 76.8512, method: "mwl" },
  "Asia/Baku": { city: "Baku", country: "Azerbaijan", lat: 40.4093, lng: 49.8671, method: "mwl" },
  "Asia/Shanghai": { city: "Ürümqi", country: "China", lat: 43.8256, lng: 87.6168, method: "mwl" },
};

/**
 * The reader's time zone, and the place it stands for.
 *
 * Falls back to Mecca when the zone is not in the table, which is a defensible
 * default for a prayer page and is labelled as a guess either way — the point
 * is never to show a time without saying where it is a time for.
 */
export function placeFromTimezone(): { place: Place; zone: string; known: boolean } {
  let zone = "";
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    // Ancient browser, or a locked-down one. The fallback covers it.
  }
  const place = TIMEZONE_PLACES[zone];
  if (place) return { place, zone, known: true };
  return {
    place: { city: "Mecca", country: "Saudi Arabia", lat: 21.4225, lng: 39.8262, method: "makkah" },
    zone,
    known: false,
  };
}
