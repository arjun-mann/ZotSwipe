import { guestQueue, sellerCurrent } from "@/lib/matchStore";
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");
    if (!sellerId) return Response.json({ ok: false, error: "sellerId required" }, { status: 400 });
    const existing = sellerCurrent.get(sellerId);
    if (existing) return Response.json({ ok: true, guestId: existing })
    const nextGuest = guestQueue.shift();
    if (!nextGuest) return Response.json({ ok: true, guestId: null, message: "no guests waiting" });
    sellerCurrent.set(sellerId, nextGuest);
    return Response.json({ ok: true, guestId: nextGuest });
}