import fs from "fs";
import pngToIco from "png-to-ico";

export async function convertPngToIco(input: string, output: string): Promise<void> {
    const buffer = await pngToIco(input);
    fs.writeFileSync(output, new Uint8Array(buffer));
}