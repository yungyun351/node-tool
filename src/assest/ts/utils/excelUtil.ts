import { Worksheet } from "exceljs";

export function autoResizeWidth(worksheet: Worksheet, minWidth: number = 10) {
    worksheet.columns.forEach(column => {
        if (!column.eachCell) return;

        let maxWidth = minWidth;
        column.eachCell(cell => {
            if (!cell.value) return;

            const columnLength = cell.value.toString().length;
            if (columnLength > maxWidth) {
                maxWidth = columnLength;
            }
        });
        column.width = maxWidth;
    });
}