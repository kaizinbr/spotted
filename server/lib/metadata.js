import ffmetadata from 'ffmetadata';
import fs from 'fs';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import { logSuccess } from '../util/log-helper.js';
import { getLyrics } from '../util/get-songdata.js';
import lyricsMerge from '../util/lyrics-merge.js';
import Constants from '../util/constants.js';
import {
    logInfo,
} from '../util/log-helper.js';

const downloadAndSaveCover = function (uri, filename) {
    return new Promise(async (resolve, reject) => {
        const cover = await axios.default({
            method: 'GET',
            url: uri,
            responseType: 'stream',
        });
        const ffmpegCommand = ffmpeg();
        ffmpegCommand
            .on('error', e => {
                reject(e);
            })
            .on('end', () => {
                resolve();
            })
            .input(cover.data)
            .save(`${filename}`)
            .format('jpg');
    });
};

const mergeMetadata = async (output, songData) => {
    logInfo('Merging Metadata');
    // console.log(songData);
    const coverFileName = output.slice(0, output.length - 3) + 'jpg';
    let coverURL = songData.cover_url;
    if (!coverURL) {
        coverURL = Constants.YOUTUBE_SEARCH.GENERIC_IMAGE;
    }

    try {
        await downloadAndSaveCover(coverURL, coverFileName);
    } catch (_e) {
        // image is corrupt or not available try again
        logInfo('Album Thumbnail corrupt attempting again');
        try {
            await downloadAndSaveCover(coverURL, coverFileName);
        } catch (_e2) {
            // if it fails again just fallback to generic image
            logInfo(
                'Album Thumbnail corrupt for second time fallback to generic image',
            );
        }
    }

    if (!fs.existsSync(coverFileName)) {
        await downloadAndSaveCover(
            'https://i.ibb.co/PN87XDk/unknown.jpg',
            coverFileName,
        );
    }

    const lyrics = await getLyrics(songData);

    const metadata = {
        artist: songData.artists.toString(),
        album: songData.album_name,
        title: songData.name,
        date: songData.release_date,
        track: `${songData.track_number}/${songData.total_tracks}`,
        attachments: [coverFileName],
        isrc: songData.isrc,
        www: songData.www,
        uploaded_by: songData.uploaded_by,
        encoded_by: songData.encoded_by,
        comment: songData.comment,
        copyright: '© Owners',
    };
    logInfo(metadata);
    metadata.artist = metadata.artist.replace(/,/g, ', ');

    await new Promise((resolve, reject) => {
        ffmetadata
            .write(output, metadata, {},
                function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                },
            );
    });

    const tempPath = output.slice(0, output.length - 3) + 'temp.mp3';
    logInfo(output);
    await new Promise((resolve, reject) => {
        ffmpeg()
            .on('error', err => {
                reject(err);
            })
            .on('end', () => {
                resolve();
            })
            .input(output)
            .addOutputOptions(
                '-i',
                coverFileName,
                '-map',
                '0:0',
                '-map',
                '1:0',
                '-c',
                'copy',
                '-id3v2_version',
                '3',
            )
            .save(tempPath);
    });

    // Junta a letra e corrige errosno ID3v2 do ffmpeg
    await lyricsMerge(tempPath, lyrics);

    fs.unlinkSync(output);
    fs.renameSync(tempPath, output);
    fs.unlinkSync(coverFileName);
    logSuccess('Metadata Merged!\n');
    return lyrics;
};

export default mergeMetadata;
