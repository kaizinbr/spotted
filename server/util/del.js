import fs from 'fs';

function formatPath (path) {
    const fullPath =  path.split(/\\/g);
    const newPath = fullPath.slice(6);
    const newPath2 = newPath.slice(0, newPath.length - 1)
    const newPath3 = './' + newPath2.join('/');
    return newPath3;
}
 function del (fullPath){
    const path = formatPath(fullPath);
        fs.rm(path, { recursive: true }, (err) => {
            if (err) {
                console.error(err)
                return
            }
            console.log("file deleted")
        })
}
// só funciona se o servidor nao for modificado nesse período
export default async function delFile(fullPath) {
    console.log('vai deletar');
    // console.log(fullPath)
    setTimeout(() => del(fullPath), 60000 * 3600) //10000) <-- 10s pra teste
};

// await delFile('C:\\Users\\lkaio\\Documents\\code-area\\demo-spot\\server\\data\\music\\Ciipher\\I Like you\\I like you.mp3')