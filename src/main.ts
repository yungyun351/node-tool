import { createDiffFile } from './app/gitDiff.ts';

async function main(): Promise<void> {
    await createDiffFile({
        commitBefore: '4675ca2c93f44d45d11e579f3df7bf656707c54b',
        commitAfter: '896ed0349b674a781748350e25cc22c1f2e84ced',
        repoDir: 'C:/workspace/TCB.TWNB.COBANK.BUILD/TCB.TWNB.IDV.API'
        // repoDir: 'C:/workspace/TCB.TWNB.COBANK.BUILD/TCB.TWNB.IDV.WEB'
    });
    console.log('Finish !');
}

main();