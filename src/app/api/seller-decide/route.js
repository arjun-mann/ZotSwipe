import { guestQueue, sellerCurrent } from "@/lib/matchStore";

export async function POST(req) {
    try {
        const body = await req.json();
        const { sellerId, decision } = body;
        if (!sellerId || !decision || (decision !== 'yes' || decision !== 'no')) {
            return Response.json({ ok: false, message: "invalid sellerId and decision" }, { status: 400 });
        }
        const guest = sellerCurrent.get(sellerId);
        if (!guest) {
            return Response.json({ ok: false, message: "guest to decide on does not exist" }, { status: 400 });
        }
        if (decision === "yes") {
            sellerCurrent.delete(sellerId);
            return Response.json({ ok: true, match: { sellerId, guestId: guest } });
        }
        sellerCurrent.delete(sellerId);
        guestQueue.push(guest)
        return Response.json({ ok: true });
    } catch {
        return Response.json({ ok: false, message: "invalid body" }, { status: 400 });
    }
}