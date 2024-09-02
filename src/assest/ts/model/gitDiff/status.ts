enum Status {
    NONE,
    /** 新增文件 */
    ADDTION = 'A',
    /** 將文件複製到新文件中 */
    COPY = "C",
    /** 刪除文件 */
    DELETE = "D",
    /** 修改文件內容或模式 */
    MODIFY = "M",
    /** 重新命名文件 */
    RENAME = "R",
    /** 檔案類型的變更（常規檔案、符號連結或子模組） */
    TYPE_CHANGE = "T",
    /** 檔案未合併（必須先完成合併才可以提交） */
    UNMERGED = "U",
    /** “未知”更改類型（可能是錯誤） */
    UNKNOWN = "X",
}

namespace Status {
    export function toString(status?: Status): string {
        switch (status) {
            case Status.ADDTION: return '新增';
            case Status.COPY: return '複製';
            case Status.DELETE: return '刪除';
            case Status.MODIFY: return '修改';
            case Status.RENAME: return '改名';
            case Status.TYPE_CHANGE: return '檔案類型變更';
            case Status.UNMERGED: return '未合併';
            case Status.UNKNOWN: return '未知';
            case Status.NONE:
            default:
                return '無';
        }
    }
    export function parse(status: string): Status {
        if (Object.values(Status).some(value => value === status)) {
            return <Status>status;
        }
        return Status.NONE;
    }
}

export default Status;