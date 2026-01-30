
export const COVERAGE_POLYGON = [
    { lat: 4.836, lng: -74.200 }, // Norte
    { lat: 4.836, lng: -73.980 }, // Oriente
    { lat: 4.490, lng: -73.980 }, // Sur
    { lat: 4.490, lng: -74.200 }  // Occidente
];

export interface Coordinates {
    lat: number;
    lng: number;
}

export function isPointInPolygon(point: Coordinates, polygon: Coordinates[]): boolean {
    let x = point.lat, y = point.lng;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].lat, yi = polygon[i].lng;
        let xj = polygon[j].lat, yj = polygon[j].lng;

        let intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Mock geocoding service for now
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (address.toLowerCase().includes('bogota') || address.toLowerCase().includes('soacha')) {
        return { lat: 4.6097, lng: -74.0817 }; // Central Bogota
    }

    return null;
}

// Haversine formula to calculate distance between two points in km
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
