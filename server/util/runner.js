import path from 'path';
import fs from 'fs';
import getLinks from './get-link.js';
import { cleanOutputPath } from './filters.js';
import Constants from './constants.js';
import downloader from '../lib/downloader.js';
import { writeId, findId } from '../lib/cache.js';
import mergeMetadata from '../lib/metadata.js';
import { cliInputs } from '../lib/setup.js';
import {
	getTrack, getPlaylist, getArtistAlbums,
	getEpisode, getShowEpisodes, getSavedShows,
	getSavedAlbums, getSavedPlaylists, getSavedTracks, getAlbum, getLyrics
} from './get-songdata.js';
import { logSuccess, logInfo, logFailure } from './log-helper.js';
import delFile from "./del.js";
import updateTotal from './updater.js';

const {
	INPUT_TYPES,
	YOUTUBE_SEARCH: { GENERIC_IMAGE },
} = Constants;
const {
	inputs, extraSearch, searchFormat,
	exclusionFilters, output, outputOnly, downloadReport,
} = cliInputs();

const itemOutputDir = item => {
	const outputDir = path.normalize(output);
	// console.log(outputDir);
	return outputOnly ? outputDir : path.join(
		outputDir,
		cleanOutputPath(item.artists[0]),
		cleanOutputPath(item.album_name),
	);
};

const downloadList = async (list, type) => {
    // const outputPath 
    console.log("name", list.name)
    const songData = {
        "name": list.name,
        "main_name": list.main_name,
        "owner": list.owner,
        "type": type,
        "items": [],
        "image": list.image || GENERIC_IMAGE,
    };
	list.name = list.name.replace('/', '-');
	const totalItems = list.items.length;
	logInfo(`Downloading: ${list.name}`);
	logInfo(`Total Items: ${totalItems}`);
	let currentCount = 0;
	for (const nextItem of list.items) {
		currentCount++;
        // songData = nextItem;
		const itemDir = itemOutputDir(nextItem);
		const cached = findId(nextItem.id, itemOutputDir(nextItem));
		if (!cached) {
            console.log('nextItem', nextItem)
			const itemId = nextItem.id;
			const itemName = nextItem.name;
			const albumName = nextItem.album_name;
			const artistName = nextItem.artists[0];
			logInfo(
				[
					`${currentCount}/${totalItems}`,
					`Artist: ${artistName}`,
					`Album: ${albumName}`,
					`Item: ${itemName}`,
				].join('\n'),
			);
            
            const update = {
                "status": 1,
                "message": {
                    "text": `Baixando ${itemName}...`,
                    "item": itemName,
                    "current": currentCount,
                    "total": totalItems
                }
            }
            // status(update);
            // console.log('update', nextItem)

			const ytLinks = nextItem.URL ? [nextItem.URL] : await getLinks(
				{
					itemName,
					albumName,
					artistName,
					extraSearch,
					searchFormat,
					type: list.type,
					exclusionFilters,
				},
			);

			const fileNameCleaned = cleanOutputPath(itemName) || '_';

			const outputFilePath = path.resolve(
				itemDir,
				`${fileNameCleaned}.mp3`,
			);
            songData.items.push({
                "name": itemName,
                "data": nextItem,
                "path": outputFilePath
            });
			//create the dir if it doesn't exist
			fs.mkdirSync(itemDir, { recursive: true });
			const downloadSuccessful = await downloader(ytLinks, outputFilePath);
			if (downloadSuccessful) {
				const lyrics = await mergeMetadata(outputFilePath, nextItem);
				writeId(itemDir, itemId);
                // console.log(songData[currentCount - 1], 'songData[currentCount].data')
                songData.items[currentCount - 1].data.lyrics = lyrics;
			}
			nextItem.failed = !downloadSuccessful;
            // delFile(outputFilePath);
            // setTimeout(() => delFile(outputFilePath), 10000 * 3600)
		} else {
            console.log('está em cache')
			const itemId = nextItem.id;
			const itemName = nextItem.name;
			const albumName = nextItem.album_name;
			const artistName = nextItem.artists[0];
			logInfo(
				[
                    `Item ID: ${itemId} cached`,
					`${currentCount}/${totalItems}`,
					`Artist: ${artistName}`,
					`Album: ${albumName}`,
					`Item: ${itemName}`,
				].join('\n'),
			);			

			const fileNameCleaned = cleanOutputPath(itemName) || '_';

            // console.log(itemDir, 'itemDir')
			const outputFilePath = path.resolve(
				itemDir,
				`${fileNameCleaned}.mp3`,
			);

            const lyrics = await getLyrics(nextItem);
            nextItem.lyrics = lyrics;

            
            songData.items.push({
                "name": itemName,
                "data": nextItem,
                "path": outputFilePath
            });

			// const update = {
            //     "status": 1,
            //     "message": {
            //         "text": `Baixando ${itemName}...`,
            //         "item": itemName,
            //         "current": currentCount,
            //         "total": totalItems
            //     }
            // }
            // status(update);
            // delFile(outputFilePath);
		}
		nextItem.cached = true;
	}
	logInfo(`Finished processing ${list.name}!\n`);
    
	return [list, songData];
};

const generateReport = async listResults => {
	if (listResults.length) {
		logInfo('Download Report:');
		listResults.forEach(result => {
			const listItems = result.items;
			const itemLength = listItems.length;
			const failedItems = listItems.filter(item => item.failed);
			const failedItemLength = failedItems.length;
			logSuccess(
				[
					'Successfully downloaded',
					`${itemLength - failedItemLength}/${itemLength}`,
					`for ${result.name} (${result.type})`,
				].join(' '),
			);
			if (failedItemLength) {
				logFailure(
					[
						'Failed items:',
						...failedItems.map(item => {
							return [
								`Item: (${item.name})`,
								`Album: ${item.album_name}`,
								`Artist: ${item.artists[0]}`,
								`ID: (${item.id})`,
							].join(' ');
						}),
					].join('\n'),
				);
			}
		});
	}
};

const run = async (inputs) => {
	const listResults = [];
    let songDataObj;
    // console.log(inputs)
	for (const input of inputs) {
		const lists = [];
		logInfo(`Starting processing of ${input.type} (${input.url})`);
		const URL = input.url;
		switch (input.type) {
			case INPUT_TYPES.SONG.SONG: {
				const track = await getTrack(URL);
				lists.push({
					items: [
						track,
					],
					name: `${track.name} - ${track.artists[0]}`,
                    main_name: `${track.name}`,
                    owner: `${track.artists[0]}`,
					type: input.type,
                    image: track.cover_url,
				});
				break;
			}
			case INPUT_TYPES.SONG.PLAYLIST: {
				const list = await getPlaylist(URL);
				list.type = input.type;
				lists.push(list);
				break;
			}
			case INPUT_TYPES.SONG.ALBUM: {
				const list = await getAlbum(URL);
				list.type = input.type;
				lists.push(list);
				break;
			}
			case INPUT_TYPES.SONG.ARTIST: {
				const artistAlbumInfos = await getArtistAlbums(URL);
				lists.push(...artistAlbumInfos.map(list => {
					list.type = input.type;
					return list;
				}));
				break;
			}
			case INPUT_TYPES.EPISODE.EPISODE: {
				const episode = await getEpisode(URL);
				if (episode) {
					lists.push({
						items: [
							episode,
						],
						name: `${episode.name} ${episode.album_name}`,
						type: input.type,
					});
				} else {
					logFailure(
						'Failed to find episode, you may need to use auth',
					);
				}

				break;
			}
			case INPUT_TYPES.EPISODE.SHOW: {
				const list = await getShowEpisodes(URL);
				list.type = input.type;
				lists.push(list);
				break;
			}
			case INPUT_TYPES.EPISODE.SAVED_SHOWS: {
				const savedShowsInfo = await getSavedShows();
				lists.push(...savedShowsInfo.map(list => {
					list.type = input.type;
					return list;
				}));
				break;
			}
			case INPUT_TYPES.SONG.SAVED_ALBUMS: {
				const savedAlbumsInfo = await getSavedAlbums();
				lists.push(...savedAlbumsInfo.map(list => {
					list.type = input.type;
					return list;
				}));
				break;
			}
			case INPUT_TYPES.SONG.SAVED_PLAYLISTS: {
				const savedPlaylistsInfo = await getSavedPlaylists();
				lists.push(...savedPlaylistsInfo.map(list => {
					list.type = input.type;
					return list;
				}));
				break;
			}
			case INPUT_TYPES.SONG.SAVED_TRACKS: {
				const list = await getSavedTracks();
				list.type = input.type;
				lists.push(list);
				break;
			}
			case INPUT_TYPES.YOUTUBE: {
				lists.push({
					items: [
						{
							name: URL,
							artists: [''],
							album_name: URL,
							release_date: null,
							//todo can we get the youtube image?
							cover_url: GENERIC_IMAGE,
							id: URL,
							URL: URL,
						},
					],
					name: URL,
					type: input.type,
				});
				break;
			}
			default: {
				throw new Error(`Invalid URL type (${input.type}), ` +
					'Please visit github and make a request to support this type');
			}
		}

		for (const [x, list] of lists.entries()) {
			logInfo(`Starting download of list ${x + 1}/${lists.length}`);
            list.items[x].URL = input.ytUrl;

			const [ downloadResult, songData ] = await downloadList(list, input.type);
            
            songDataObj = songData;
			if (downloadReport) {
				listResults.push(downloadResult);
			}
		}
	}
	await generateReport(listResults);
	logSuccess('Finished!');
    
    return songDataObj;
};

export default run;