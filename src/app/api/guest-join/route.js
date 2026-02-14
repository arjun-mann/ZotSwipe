import { guestQueue, sellerCurrent } from "@/lib/matchStore"

export async function POST(req) {
    try {
        body = await req.json();
        const { guestId } = body;
        if (!guestId) return Response.json({ ok: false, error: "guestID needed", status: 400 });
        const isCurrentlyOffered = Array.from(sellerCurrent.values()).includes(guestId);
        if (guestQueue.includes(guestId) || isCurrentlyOffered) return Response.json({ ok: true, message: "Already in queue", position: guestQueue.indexOf(guestId) ? guestQueue.indexOf(guestId) + 1 : null });
        guestQueue.push(guestId);
        return Response.json({ ok: true, position: guestQueue.length });
    } catch (err) {
        return Response.json({ ok: false, error: "Invalid request body", status: 400 });
    }
}