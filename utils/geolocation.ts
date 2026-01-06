
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
