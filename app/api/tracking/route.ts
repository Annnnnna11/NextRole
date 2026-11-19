import { trackingService } from "@/lib/tracking/service";
import { trackingRoute } from "@/lib/tracking/http";
export const GET = trackingRoute(async (req: Request) => {
  const { all: _all, ...result } = await trackingService().list(Object.fromEntries(new URL(req.url).searchParams));
  void _all;
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
});
export const POST = trackingRoute(async (req: Request) => Response.json({ record: await trackingService().create(await req.json()) }, { status: 201 }));
