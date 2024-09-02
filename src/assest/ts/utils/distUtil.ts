import fs from 'fs';

export const DIST = 'dist';

export function initDist(needDateDir?: boolean): string {
    let dir = DIST;
    if (needDateDir) {
        const date = new Date();
        date.setHours(date.getHours() + 8);
        const dateText = date.toISOString();
        dir = `${DIST}/${dateText.slice(0, 4)}${dateText.slice(5, 7)}${dateText.slice(8, 10)}${dateText.slice(11, 13)}${dateText.slice(14, 16)}${dateText.slice(17, 19)}`;
    }
    try {
        fs.rmSync(dir, { force: true, recursive: true });
        fs.mkdirSync(dir);
    }
    catch (err) {
        console.log('initDist err: ', err);
        return '';
    }
    return dir;
}
