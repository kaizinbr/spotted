const domain = new URL(window.location.href);
const button = document.querySelector('button.dl');
const url = document.querySelector('#url');
const ytUrl = document.querySelector('#ytLink');

button.addEventListener('click', async () => {
    const goOn = await checkUrl(url.value);

    if (!goOn) return;

    clean();
    const box = document.querySelector('.box');
    box.classList.remove('hidden');

    fetch(`http://${domain.host}/dl`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url.value,
            ytUrl: (ytUrl == null) ? null : ytUrl.value,
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            putLinks(data);
        })
    // break
});

async function checkUrl(URL) {
    if (URL == '') {
        message('Preencha o campo de URL');
        return false;
    } else if (!URL.includes('open.spotify.com')) {
        message('Insira um link válido!');
        return false;
    } else {
        const message = document.querySelector('.message');
        message.classList.add('hidden');
        url.classList.remove('attention');
        return true;
    }
}

function message(text) {
    const message = document.querySelector('.message');
    message.classList.remove('hidden');
    message.innerText = text;
    url.classList.add('attention');
}

function clean() {
    const mainCover = document.querySelector('.main-cover');
    const blurred = document.querySelector('.blurred');

    mainCover.src = './resources/img/placeholder.png';
    blurred.src = './resources/img/placeholder.png';

    const title = document.querySelector('.info h1#title');
    title.innerText = '';
    title.classList.add('load');
    
    const subtitle = document.getElementById('subtitle');
    subtitle.innerText = '';
    subtitle.classList.add('load');

    const boxBody = document.querySelector('.box-body');
    boxBody.innerHTML = `
    <div class="dl-bx load"></div>
    <div class="dl-bx load"></div>
    <div class="dl-bx load"></div>
    <div class="dl-bx load"></div>
    `;
}

function putLinks(songData) {
    const mainCover = document.querySelector('.main-cover');
    const blurred = document.querySelector('.blurred');
    const title = document.querySelector('.info h1#title');
    const subtitle = document.getElementById('subtitle');

    mainCover.src = songData.image;
    blurred.src = songData.image;
    
    title.innerText = songData.main_name;
    title.classList.remove('load');

    subtitle.innerText = songData.owner;
    subtitle.classList.remove('load');

    const boxBody = document.querySelector('.box-body');
    boxBody.innerHTML = '';
    
    for (const item of songData.items) {
        if (item.data == undefined) {
            

            const dlBx = `<div class="dl-bx">
            <div class="infos">
                <div class="number">
                    <h4>-</h4>
                </div>
                <div class="title info">
                    <h4 class="">${item.name}</h4>
                </div>
                <div class="artist info">
                    <h4 class="">Arquivo zip</h4>
                </div>
                <div class="track-info info">
                    <!-- <i class='bx bx-info-circle'></i><h4>Detalhes</h4> -->
                </div>
            </div>
            <div class="dl-btn">
                <a href="${item.link}" target="_blank" rel="noopener noreferrer"><i class='bx bx-down-arrow-alt'></i> Download</a>
            </div>                    
        </div>`
            boxBody.insertAdjacentHTML('beforeend', dlBx);
        } else {
            saveMetadata(item);
            var artists = item.data.artists.map(artist => artist).join(', ');
            artists = artists.replace(/&/g, '&');

            const dlBx = `<div class="dl-bx">
            <div class="infos">
                <div class="number">
                    <h4>${item.data.track_number}</h4>
                </div>
                <div class="title info">
                    <h4 class="">${item.data.name}</h4>
                </div>
                <div class="artist info">
                    <h4 class="">${artists}</h4>
                </div>
                <div class="track-info info">
                    <button onclick="constructModal('${item.data.id}')">
                    <i class='bx bx-info-circle'></i><h4>Detalhes</h4>
                    </button>
                </div>
            </div>
            <div class="dl-btn">
                <a href="${item.link}" target="_blank" rel="noopener noreferrer"><i class='bx bx-down-arrow-alt'></i> Download</a>
            </div>                    
        </div>`
            boxBody.insertAdjacentHTML('beforeend', dlBx);
        }
    }
}

async function fetchData() {

    const data = await fetch('http://localhost:3000/listener/status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            console.log("Status:", data.status);
            console.log("Message:", data.message.text);

            // const status = data.status == 0 ? true : false;
            // console.log(status, 'linha 64');
            return data;
        })

    return data;
}



async function statusCheck() {
    // let status = await checkReq();
    var intervalID = window.setInterval(await myCallback, 2000);

    async function myCallback() {
        console.log('mudou o status')
        let status = await fetchData();
        if (status.status == 2) {
            clearInterval(intervalID);
        }
        console.log(`O status atual é ${status.message.text}`);
    }

    // console.log(status);
    // do {
    //     status = await (await checkReq());
    //     console.log(status, 'status');
    // } while (status == true);

};

async function check() {
    const data = await fetch('https://spotify.link/0BTAeYtumyb', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'localhost:3000'
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data;
        })

    return data;
}

// impede que o enter dê submit no form e chame a função do btn
document.addEventListener("keydown", function(e) {
    if(e.keyCode === 13) {
        e.preventDefault();
        button.click();
    }

});

function saveMetadata(obj) {
    // console.log(obj.data)
    const id = obj.data.id;

    // // Transformar o objeto em string e salvar em localStorage
    localStorage.setItem(`${obj.data.id}`, JSON.stringify(obj));

    // // Receber a string
    let pessoaString = localStorage.getItem(obj.data.id);

    // // transformar em objeto novamente
    let pessoaObj = JSON.parse(pessoaString);

    console.log('Matadata saved!'); // Matheus
}
