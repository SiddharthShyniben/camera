let width = 320;    
let height = 0;     

const streaming = false;

const $ = (...args) => document.querySelector(...args);

const video = $('#video');
const canvas = $('#canvas');
const photo = $('#photo');
const startButton = $('#start-button');

function startup() {
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
		.then(stream => {
			video.srcObject = stream;
			video.play();
		})
		.catch(err => {
			console.log('An error occurred: ' + err);
		});

	video.addEventListener('canplay', () => {
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth / width);

			if (isNaN(height)) {
				height = width / (4 / 3);
			}

			video.setAttribute('width', width);
			video.setAttribute('height', height);
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);

			streaming = true;
		}
	}, false);

	startButton.addEventListener('click', ev => {
		takePicture();
		ev.preventDefault();
	}, false);

	clearPhoto();
}

function clearPhoto() {
	const context = canvas.getContext('2d');
	context.fillStyle = '#AAA';
	context.fillRect(0, 0, canvas.width, canvas.height);

	const data = canvas.toDataURL('image/png');
	photo.setAttribute('src', data);
}

function takePicture() {
	const context = canvas.getContext('2d');

	if (width && height) {
		canvas.width = width;
		canvas.height = height;
		context.drawImage(video, 0, 0, width, height);

		const data = canvas.toDataURL('image/png');
		photo.setAttribute('src', data);
	} else {
		clearPhoto();
	}
}

window.addEventListener('load', startup, false);
