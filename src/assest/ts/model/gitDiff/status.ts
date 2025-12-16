/** 狀態 */
export const Status = {
    NONE: 'NONE',
    /** 新增文件 */
    ADDTION: 'A',
    /** 將文件複製到新文件中 */
    COPY: "C",
    /** 刪除文件 */
    DELETE: "D",
    /** 修改文件內容或模式 */
    MODIFY: "M",
    /** 重新命名文件 */
    RENAME: "R",
    /** 檔案類型的變更（常規檔案、符號連結或子模組） */
    TYPE_CHANGE: "T",
    /** 檔案未合併（必須先完成合併才可以提交） */
    UNMERGED: "U",
    /** “未知”更改類型（可能是錯誤） */
    UNKNOWN: "X",
}
export type Status = typeof Status[keyof typeof Status];

/** 中文對照 */
const StatusNameMap: Record<Status, string> = {
    [Status.NONE]: "無",
    [Status.ADDTION]: "新增",
    [Status.COPY]: "複製",
    [Status.DELETE]: "刪除",
    [Status.MODIFY]: "修改",
    [Status.RENAME]: "改名",
    [Status.TYPE_CHANGE]: "檔案類型變更",
    [Status.UNMERGED]: "未合併",
    [Status.UNKNOWN]: "未知",
};

export function statusToString(status?: Status): string {
    if (!status) return "無";
    return StatusNameMap[status] ?? "無";
}

export function parseStatus(value: string): Status {
    // 如果值存在於 Status 物件的值中就回傳，否則回 NONE
    const statusValues = Object.values(Status) as string[];
    return statusValues.includes(value) ? (value as Status) : Status.NONE;
}