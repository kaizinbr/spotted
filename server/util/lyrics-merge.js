import NodeID3 from 'node-id3';
import { logInfo } from './log-helper.js';
/* Variables found in the following usage examples */

export default function mergeLyrics (filepath, lyrics) {

    // const filepath = 'C:/Users/lkaio/Documents/code-area/demo-spot/server/data/music/Melanie Martinez/DEATH/DEATH.mp3'

    // const tags = {
    //     title: "Tomorrow",
    //     artist: "Kevin Penkin",
    //     album: "TVアニメ「メイドインアビス」オリジナルサウンドトラック",
    //     APIC: "./example/mia_cover.jpg",
    //     TRCK: "27"
    // }
    logInfo('Juntando letra')

    // const tags = NodeID3.read(file)
    NodeID3.read(filepath, function(err, tags) {})
    /*
        tags: {
            title: "Tomorrow",
            artist: "Kevin Penkin",
            image: {
            mime: "image/jpeg",
            type: {
                id: 3,
                name: "front cover"
            },
            description: String,
            imageBuffer: Buffer
            },
            raw: {
            TIT2: "Tomorrow",
            TPE1: "Kevin Penkin",
            APIC: Object (See above)
            }
        }
    */
    const lyrtags = {
        unsynchronisedLyrics: {
            language: "eng",
            text: lyrics
        },
        // ISRC: 'USAT22220417'
    }
    // Possible options
    const options = {

        include: ['TALB', 'TIT2', 'USLT'],    // only read the specified tags (default: all)
        exclude: ['APIC'],            // don't read the specified tags (default: [])
        onlyRaw: false,               // only return raw object (default: false)
        noRaw: false                  // don't generate raw object (default: false)
    }
    NodeID3.update(lyrtags, filepath)
    // const tags2 = NodeID3.read(filepath, options)
    // console.log(tags, '/n' ,tags2)
}