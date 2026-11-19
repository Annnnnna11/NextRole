import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { ApplicationRecord } from "./types";
import { recordSchema } from "./schemas";

const queues = ((globalThis as { __trackingQueues?: Map<string, Promise<unknown>> }).__trackingQueues ??= new Map());
export function trackingStore(file: string) {
  async function read(): Promise<ApplicationRecord[]> {
    try {
      const value: unknown = JSON.parse(await fs.readFile(file, "utf8"));
      if (!Array.isArray(value))
        throw new Error("Invalid application records");
      return value.map(record => recordSchema.parse(record));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw new Error("申请数据无法读取，请检查数据文件；原文件未被覆盖。", { cause: error });
    }
  }
  function update<T>(fn: (records: ApplicationRecord[]) => T | Promise<T>): Promise<T> {
    const task = (queues.get(file) ?? Promise.resolve()).then(async () => {
      const records = await read();
      const before = JSON.stringify(records);
      const result = await fn(records);
      if (before !== JSON.stringify(records)) {
        await fs.mkdir(path.dirname(file), { recursive: true });
        const tmp = file + "." + randomUUID() + ".tmp";
        try {
          await fs.writeFile(tmp, JSON.stringify(records, null, 2), { flag: "wx" });
          for (let attempt = 0; ; attempt++) {
            try { await fs.rename(tmp, file); break; }
            catch (error) {
              if (attempt >= 4 || !["EPERM", "EACCES", "EBUSY"].includes((error as NodeJS.ErrnoException).code || "")) throw error;
              await new Promise(resolve => setTimeout(resolve, 40 * (attempt + 1)));
            }
          }
        } finally { await fs.rm(tmp, { force: true }).catch(() => {}); }
      }
      return result;
    });
    queues.set(file, task.catch(() => {}));
    return task;
  }
  return { read, update };
}
