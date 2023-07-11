const submit = document.getElementById('submit');
const link = document.getElementById('link');
const result = document.getElementById('result');

link.oninput = function() {
    if (this.value === '') {
        this.removeAttribute('aria-invalid');
    } else if (validateInput()) {
        this.setAttribute('aria-invalid', 'false');
    } else {
        this.setAttribute('aria-invalid', 'true')
    }
}

function validateInput() {
    var match = link.value.trim().match(/^https?:\/\/(www\.)?threads\.net\/t\/(.+)$/);
    return match && match[0];
}

submit.onclick = async function() {
    submit.disabled = 'disabled';
    if (link.getAttribute('aria-invalid') !== 'false') {
        return;
    }
    try {
        result.classList.add('hidden');
        var formattedResult = '';
        var url = validateInput();
        var res = await fetch('https://api.threadsdownloader.io/load?url=' + url, {method: 'GET'});
        var json = await res.json();
        if (json.status != 'OK') {
            throw new Error(json.status);
        }
        var videoCounter = 0;
        var imageCounter = 0;
        json.media.forEach((each) => {
            if (each.type == 'image') {
                imageCounter = imageCounter + 1;
                formattedResult += `<article><h3>Image #${imageCounter}</h3><img src="${each.preview_url}" crossOrigin="anonymous"><footer><a href="${each.url}" role="button" download>Download</a></footer></article>`;
            } else if (each.type == 'video') {
                videoCounter = videoCounter + 1;
                formattedResult += `<article><h3>Video #${videoCounter}</h3><a href="${each.url}"><img src="images/play-button.png" crossOrigin="anonymous"></a><footer><a href="${each.url}" role="button" download>Download</a></footer></article>`;
            }
        });
        result.innerHTML = formattedResult;
        result.classList.remove('hidden');
    } catch (error) {
        alert(error);
    }
    submit.disabled = false;
}
