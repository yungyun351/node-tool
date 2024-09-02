import process from 'process';
import childProcess from 'child_process';
import fs from 'fs';
import ExcelJS, { Fill } from 'exceljs';
import { initDist } from '../assest/ts/utils/distUtil.ts';
import { autoResizeWidth } from '../assest/ts/utils/excelUtil.ts';
import { convertPatchWithRaw } from '../assest/ts/utils/gitDiffUtil.ts';
import Different from '../assest/ts/model/gitDiff/different.ts';
import Status from '../assest/ts/model/gitDiff/status.ts';
import path from 'path';
import { CeateDiffFileOption } from '../assest/ts/model/gitDiff/gitDiff.ts';

export async function createDiffFile(option: CeateDiffFileOption): Promise<void> {
    const distDir = initDist(true);
    const repoName = path.basename(option.repoDir);

    const differents = getDifferents(distDir, option);
    if (!differents) return;

    createModifyFile(distDir, differents);

    await createDiffExcel(distDir, repoName, differents);

    createDiffProject(distDir, option.repoDir, repoName, differents);
}

export function getDifferents(distDir: string, option: CeateDiffFileOption): Array<Different> | undefined {
    const DIS_PREFIX = "DIS_PREFIX/";
    const FILE_DIFF = 'diff.txt';
    const ABSTRACT_PATH_FILE_DIFF = `${distDir}/${FILE_DIFF}`;
    childProcess.execSync(
        `git diff --patch-with-raw ${option.commitBefore} ${option.commitAfter} --output=${process.cwd()}/${ABSTRACT_PATH_FILE_DIFF} --dst-prefix=${DIS_PREFIX}`,
        { cwd: option.repoDir },
    );

    let gitDiffText: string | undefined = undefined;
    try {
        const fileBuffer = fs.readFileSync(ABSTRACT_PATH_FILE_DIFF);
        gitDiffText = fileBuffer.toString();
    } catch (err) {
        console.log('失敗: ', err);
        return;
    }

    return convertPatchWithRaw(gitDiffText, DIS_PREFIX);
}


export function createModifyFile(distDir: string, differents: Array<Different>): void {
    const dir = `${distDir}/modify`;
    try {
        fs.mkdirSync(dir);
    }
    catch (err) {
        console.log('失敗: ', err);
        return;
    }

    differents.forEach(different => {
        if (different.status !== Status.MODIFY) return;
        const content = different.content;
        if (!content || content.length === 0) return;

        const fileName = different.file.replaceAll('\/', '.');
        fs.writeFileSync(`${dir}/${fileName}.doc`, content);
    });
}

export async function createDiffExcel(distDir: string, repoName: string, differents: Array<Different>): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
    sheet.columns = [
        {
            header: '差異檔案', key: 'file',
        },
        {
            header: '異動方式', key: 'status',
        }
    ];
    const row1 = sheet.getRow(1);
    row1.font = {
        bold: true
    };
    const fill: Fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'faecc6' }
    };
    row1.getCell(1).fill = fill;
    row1.getCell(2).fill = fill;
    differents.forEach(different => {
        const row = sheet.addRow({
            file: different.file,
            status: Status.toString(different.status)
        })
        if (different.status === Status.DELETE) {
            row.getCell(2).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ff5252' }
            };
        }
        row.commit();
    });

    autoResizeWidth(sheet);

    await workbook.xlsx.writeFile(`${distDir}/diff_${repoName}.xlsx`);
}

export function createDiffProject(distDir: string, repoDir: string, repoName: string, differents: Array<Different>) {
    // 在dist產生專案目錄
    const dir = `${distDir}/project/${repoName}`;
    try {
        fs.mkdirSync(dir, { recursive: true });
    }
    catch (err) {
        console.log('失敗: ', err);
        return;
    }

    differents.forEach(different => {
        if (different.status === Status.DELETE) return;

        const fileDir = `${dir}/${path.dirname(different.file)}`;
        try {
            fs.mkdirSync(fileDir, { recursive: true });
            fs.copyFileSync(`${repoDir}/${different.file}`, `${dir}/${different.file}`);
        }
        catch (err) {
            console.log(err);
        }
    });
}