import Different from "../model/gitDiff/different.ts";
import Status from "../model/gitDiff/status.ts";
import { removeEmptyField } from "./objectUtil.ts";

export function convertPatchWithRaw(text: string, disPrefix: string): Array<Different> {
    const separateIdx = text.indexOf('diff --git');
    const differents1 = convertRaw(text.substring(0, separateIdx));
    const differents2 = convertPatch(text.substring(separateIdx), disPrefix);
    return combineDifferentsInfo(differents1, differents2);
}

export function convertRaw(text: string): Array<Different> {
    const differents: Array<Different> = [];
    text.split('\n').forEach(lineText => {
        if (lineText.length === 0) return;

        const statusFile = lineText.substring(lineText.indexOf('\t') - 1).split('\t');
        if(!statusFile) return;
        differents.push(new Different(statusFile[1], Status.parse(statusFile[0])));
    });
    return differents;
}

export function convertPatch(text: string, disPrefix: string): Array<Different> {
    const differents: Array<Different> = [];
    text.split('diff --git').forEach(contentText => {
        const fileNameSep = contentText.substring(contentText.indexOf(disPrefix) + disPrefix.length);
        const fileName = fileNameSep.substring(0, fileNameSep.indexOf('\n'));
        if(!fileName) return;
        const contentStartIdx = contentText.indexOf('@@');
        const content = (contentStartIdx !== -1) ? contentText.substring(contentStartIdx) : undefined;
        differents.push(new Different(fileName, undefined, content));
    });
    return differents;
}

export function combineDifferentsInfo(...diffInfos: Array<Array<Different>>) {
    const differents: Array<Different> = [];
    diffInfos.forEach(diffInfo => {
        diffInfo.forEach(diff => {
            const file = diff.file;
            const existDifferent = differents.find(different => different.file == file);
            if (existDifferent) {
                Object.assign(existDifferent, removeEmptyField(diff));
            } else {
                differents.push(diff);
            }
        })
    });
    return differents;
}