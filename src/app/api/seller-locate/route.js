//input: request that passes location as lat and lon
//output: brandy, anty, neither
export async function POST(req) {
    body = await req.json();
    lat = body.lat
    lon = body.lon
    if ((lat >= 33.645243 && lat <= 33.64555) && (lon >= -117.839579 && lon <= -117.838759)) {
        return Response.json({ location: 'brandy' });
    } else if ((lat >= 33.650867 && lat <= 33.651618) && (lon >= -117.845871 && lon <= -117.8449)) {
        return Response.json({ location: 'anty' });
    } else {
        return Response.json({ location: 'neither' });
    }
}
