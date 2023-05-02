const pathz = 'C:/Users/lkaio/Documents/code-area/demo-spot/server/data/music';

import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

// const zip = new AdmZip();

// const files = readdirSync(path);

// // for (let i = 0; i < files.length; i++) {
// //     zip.addLocalFile(`${path}/${files[i]}`);
// // }

// zip.writeZip(`${path}/music.zip`);

// console.log('done')


// const fs = require('fs');

// fs.copyFile('C:/Users/lkaio/Documents/code-area/demo-spot/server/data/music/music.zip', 'C:/Users/lkaio/Documents/code-area/demo-spot/server/data/zip-files/', (err) => {

//   if (err) throw err;

//   console.log('File copied!');

// });

// const dlPath = item => {
// 	const outputDir = path.normalize(output);
// 	// console.log(outputDir);
// 	return outputOnly ? outputDir : pathz.join(
// 		outputDir,
// 		cleanOutputPath(item.artists[0]),
// 		cleanOutputPath(item.album_name),
// 	);
// };


// dlPath(songData.items[0])

// let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '-').replace(/ /g, '-').replace(/-/g, '');


// console.log(date)
// let zipPath = path.resolve(
//     `C:/Users/lkaio/Documents/code-area/demo-spot/server/data/downloads`,
//     date,
// ); 

// fs.mkdirSync(zipPath)
// console.log(zipPath)
const str1 = '12';
console.log(str1.padStart(2, '0'));