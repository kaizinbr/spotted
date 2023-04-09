const modal = document.querySelector('#modal');
// const modalBtn = document.querySelector('.modal-btn');
const modalClose = document.querySelector('#close');

function constructModal(id) {
    const metadata = JSON.parse(localStorage.getItem(id));

    const mainCover = document.querySelector('.modal-body .main-cover');
    const blurred = document.querySelector('.modal-body .blurred');
    
    // console.log(metadata.data.cover_url)

    mainCover.src = metadata.data.cover_url;
    blurred.src = metadata.data.cover_url;

    const info = document.querySelector('.modal-body .info');
    // console.log(metadata.data.name);

    const title = metadata.data.name;
    const artists = metadata.data.artists.map(artist => artist).join(', ');
    const album = metadata.data.album_name;
    const releaseDate = metadata.data.release_date;
    const trackNumber = metadata.data.track_number;


    const cel = `<div class="cel">
                    <span class="i">Título:</span>
                    <h4 id="artist">${title}</h4>
                </div>
                <div class="cel">
                    <span class="i">Artistas:</span>
                    <h4 id="artist">${artists}</h4>
                </div>
                <div class="cel">
                    <span class="i">Álbum:</span>
                    <h4 id="album">${album}</h4>
                </div>
                <div class="cel">
                    <span class="i">Data de lançamento:</span>
                    <h4 id="album">${releaseDate}</h4>
                </div>
                <div class="cel">
                    <span class="i">Número:</span>
                    <h4 id="album">${trackNumber}</h4>
                </div>
                <div class="cel">
                    <span class="i">Id:</span>
                    <h4 id="album">${id}</h4>
                </div>
                <div class="cel">
                    <span class="i">Codec:</span>
                    <h4 id="album">MPEG-3</h4>
                </div>
                <div class="cel">
                    <span class="i">Bitrate:</span>
                    <h4 id="album">320 kbps</h4>
                </div>                            
                <div class="cel lyrics">
                    <span class="i">Letras:</span>
                    <div class="lyrics">
                    </div>
                </div>`;
    info.innerHTML = cel; 

    const lyricsContainer = document.querySelector('.modal-body .lyrics');
    const lyrics = metadata.data.lyrics;
    renderLyrics(lyrics, lyricsContainer);

    openModal();
}

function renderLyrics(lyrics, lyricsContainer) {
    const paragraphs = lyrics.split('\n\n');
    // const lines = []

    for (let i = 0; i < paragraphs.length; i++) {
        const p = document.createElement('p');
        
        paragraphs[i].split('\n').forEach(line => {
            // console.log(line);

            const span = document.createElement('span');
            span.textContent = line;
            p.appendChild(span);
            p.appendChild(document.createElement('br'));
        });
        lyricsContainer.appendChild(p);
    }

    
}

function openModal () {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});