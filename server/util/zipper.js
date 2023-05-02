import fs from "fs";
import AdmZip from "adm-zip";
import { logInfo, logSuccess } from "./log-helper.js";

export function linkAndZip (songData) {
    if (songData.type != 'song' && songData.items.length > 1) {
        const zip = new AdmZip();
        const zipPath = `C:/Users/lkaio/Documents/code-area/demo-spot/server/data/zip-files/${songData.type}/${songData.name}.zip`;

        for (let i = 0; i < songData.items.length; i++) {
            // adiciona os links para download
            const path = songData.items[i].path.split(`\\`);
            // const folderPath = path.slice(0, path.length - 1).join('\\');
            // console.log('FOLDER', folderPath)
            const name = path[path.length - 1];
            const artist = path[path.length - 3];
            const album = path[path.length - 2];
            songData.items[i].link = `/song/download/${artist}/${album}/${name}`;

            // cria o zip da playlist/album/artista na pasta data/music
            // zip.addLocalFile(songData.items[i].path)
        };

        zip.addLocalFolder(songData.zipPath);
        zip.writeZip(zipPath);

        songData.items.unshift({ 
            "link": `/${songData.type}/download/${songData.name}.zip`, 
            "name": `${songData.name}.zip`
        });
        logSuccess(`Created ${zipPath} successfully`);

        fs.rmSync(songData.zipPath, { recursive: true });
    } else {        
        for (let i = 0; i < songData.items.length; i++) {
            // adiciona os links para download
            const path = songData.items[i].path.split(`\\`);
            const name = path[path.length - 1];
            const artist = path[path.length - 3];
            const album = path[path.length - 2];
            songData.items[i].link = `/song/download/${artist}/${album}/${name}`;
        };
    }

    return songData;
};