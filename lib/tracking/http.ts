import { z } from "zod";
import { TrackingError } from "./service";
export function trackingRoute<A extends unknown[]>(handler: (...args: A) => Promise<Response>) {
  return async (...args: A) => {
    try { return await handler(...args); }
    catch (error) {
      if (error instanceof z.ZodError) return Response.json({ error: error.issues.map(i=>i.path.join(".")+": "+i.message).join("；") }, { status: 400 });
      if (error instanceof SyntaxError) return Response.json({ error: "请求格式不正确" }, { status: 400 });
      if (error instanceof TrackingError) return Response.json({ error: error.message }, { status: error.status });
      console.error("[tracking]", error);
      return Response.json({ error: "申请数据读写失败，请重试或检查本地数据文件。" }, { status: 500 });
    }
  };
}
