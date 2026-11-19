import { statusLabels, type ApplicationRecord } from "./types";
function cell(value: string) {
  const safe = /^[\s]*[=+@-]|^[\t\r\n]/.test(value) ? "'" + value : value;
  return '"' + safe.replace(/"/g, '""') + '"';
}
export function exportCsv(records: ApplicationRecord[]) {
  const rows = [["公司","岗位","地点","投递日期","状态","下次面试","面试轮次","面试地点","职位链接","备注"],
    ...records.map(r=>[r.company,r.role,r.location,r.appliedAt,statusLabels[r.status],r.interviewAt,r.interviewRound,r.interviewLocation,r.url,r.notes])];
  return "\uFEFF" + rows.map(row=>row.map(cell).join(",")).join("\r\n");
}
