import { Router } from "express";
import 'dotenv/config'
import path from 'path';
import { fileURLToPath } from 'url';
import urlParser from "./util/url-parser.js";
import linkAndZip from "./util/link-generator.js";
import delFile from "./util/del.js";
import cookieParser from "cookie-parser";
// import puppeteer from 'puppeteer';
import run from './cli.js';
import cloud from './cloud-auth.js';
// import { totalTracks as total } from "./util/runner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const c = console;

let total = 0;

let status = 0;
let message = {
        "text": `Inativo`,
        "item": "",
        "current": "",
        "total": ""
    };

router.use(cookieParser());

router.get('/', async (req, res) => {
    await cloud();
});

router.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const error = req.query.error;
    
    console.log('code', code);
    res.send({code: code, state: state, error: error})
});

// router.get('/spotify/link', async (req, res) => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://spotify.app.link/ddqgnN3pkyb');
//     const pageData = await page.evaluate(() => {
        
//         return {
//         link: document.querySelector("body").innerHTML,
//         link2: document.querySelector('#seo').innerHTML,
//         };
//     });
//     // console.log(element)
    
//     await browser.close();
    
//     res.send({
//         "link": pageData.link,
//         "link2": pageData.link2,
//     })
// });

router.post('/dl', async (req, res) => {
    
    const url = req.body.url;
    const ytUrl = req.body.ytUrl || null;    
    const type = urlParser(url);
    
	const input = [
        {   type: type, 
            url: url,
            ytUrl: ytUrl,
        },
    ] // tem que conter TYPE e URL

    let songData = await run.run(input)
    console.log('song data', songData)
    const dataWithLinks = linkAndZip(songData)
    return res.send(dataWithLinks)	
	// const { id } = req.body;
});

router.post('/total', async (req, res) => {
    total = req.body.total;
    return res.send({total: total})	
})

router.get('/total', async (req, res) => {
    return res.send({total: total})
})

router.get('/song/download/:artistName/:albumName/:itemName', async (req, res) => {
    const itemName = req.params.itemName.replace(/%20/g, ' ');
    const artistName = req.params.artistName.replace(/%20/g, ' ');
    const albumName = req.params.albumName.replace(/%20/g, ' ');

	var file = path.join(__dirname, `/data/music/${artistName}/${albumName}/${itemName}`);	
	res.download(file); 
});

router.get('/:type/download/:itemName', async (req, res) => {
    const itemName = req.params.itemName.replace(/%20/g, ' ');
    const type = req.params.type;

	var file = path.join(__dirname, `/data/music/zip-files/${type}/${itemName}`);	
	res.download(file); 
});

router.get('/cwd', async (req, res) => {
    res.json(process.cwd() + '/server/data/music')
});

router.get('/del', async (req, res) => {
    delFile("C:\\Users\\lkaio\\Documents\\code-area\\demo-spot\\server\\data\\music\\Girls' Generation\\Gee - The First Mini Album\\Gee.mp3");
    res.json('deleted')
});

router.post('/listener/status', async (req, res) => {

    // status: 0 - Inativo, 1 - Ativo, 2 - Finalizado, 3 - Erro

    status = req.body.status;
    message = req.body.message;
    // res.cookie('status', status);
    // res.cookie('message', message);
    
    
    // console.log(status, message)
    res.json(req.body)
    // res.json(run.listenerStatus())
});

router.get('/listener/status', async (req, res) => {
    res.json({status, message})
});

router.get('/home', async (req, res) => {
    res.sendFile(path.join(__dirname, '/../public/index.html'));
});

router.get('/link', async (req, res) => {
    res.sendFile(path.join(__dirname, '/../public/track.html'));
});

router.use(function(req, res, next) {
    res.status(404).send("Esta rota não existe");
});
// router.use(errors());

export default router;

