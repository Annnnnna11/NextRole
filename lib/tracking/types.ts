export const statuses = ["saved", "applied", "interviewing", "offer", "rejected", "withdrawn"] as const;
export type ApplicationStatus = typeof statuses[number];
export const statusLabels: Record<ApplicationStatus, string> = {
  saved: "待投递", applied: "已投递", interviewing: "面试中", offer: "已获 Offer", rejected: "未通过", withdrawn: "已撤回",
};
export type ApplicationEvent = {
  id: string; at: string; source: "manual" | "agent"; label: string;
  fromStatus?: ApplicationStatus; toStatus?: ApplicationStatus; runId?: string;
};
export type ApplicationRecord = {
  id: string; jobId?: string; company: string; role: string; location: string; url: string;
  status: ApplicationStatus; source: "manual" | "agent"; appliedAt: string;
  everApplied: boolean; everOffer: boolean; resumeVersionId: string; runIds: string[];
  interviewAt: string; interviewRound: string; interviewLocation: string; notes: string;
  revision: number; archivedAt: string | null; createdAt: string; updatedAt: string;
  history: ApplicationEvent[];
};
