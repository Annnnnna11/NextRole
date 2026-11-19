import { trackingService } from "@/lib/tracking/service";
import { trackingRoute } from "@/lib/tracking/http";
import { exportCsv } from "@/lib/tracking/export";
export const GET = trackingRoute(async (req: Request) => new Response(
  exportCsv((await trackingService().list(Object.fromEntries(new URL(req.url).searchParams))).all),
  { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="applications.csv"', "Cache-Control": "no-store" } },
));
