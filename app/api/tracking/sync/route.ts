import { listRuns } from "@/lib/store";
import { trackingService } from "@/lib/tracking/service";
import { trackingRoute } from "@/lib/tracking/http";
export const POST = trackingRoute(async () => Response.json(await trackingService().sync(await listRuns())));
