export default async function updateStatus(update) {

    fetch('http://localhost:3000/total', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({update: update})
    })
    .then(res => res.json())
    .then(data => {
        // console.log(`Status atualizado: ${data.status} - ${data.message}`);
    })
    .catch(err => console.log(err));
}