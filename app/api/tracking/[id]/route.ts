import { trackingService } from "@/lib/tracking/service";
import { trackingRoute } from "@/lib/tracking/http";
import { listRuns } from "@/lib/store";
type Context = { params: Promise<{ id: string }> };
export const GET = trackingRoute(async (_req: Request, ctx: Context) => {
  const record = await trackingService().get((await ctx.params).id);
  const runs = (await listRuns()).filter(r=>record.runIds.includes(r.id) || Boolean(record.jobId && r.jobId===record.jobId));
  return Response.json({ record, runs }, { headers: { "Cache-Control": "no-store" } });
});
export const PATCH = trackingRoute(async (req: Request, ctx: Context) =>
  Response.json({ record: await trackingService().patch((await ctx.params).id, await req.json()) }));
