// Global Elements
const [prog, video, btn, played, dur, marker, light, title] = [
	".prog progress",
	"video",
	".btn",
	"#played",
	"#duration",
	".prog .marker",
	"#light",
	"#title"
].map((arg) => document.querySelector(arg));

// jump playback forwards or backwards
function adjustPlayback(e) {
	video.currentTime = getTime(e);
}

// convert seconds to HH:MM:ss time format
function formatTime(secs) {
	return new Date(secs * 1000)
		.toISOString()
		.substr(11, 8);
	// .split(':')
	// .filter((v, i) => v !== "00" || i > 0)
	// .join(":")
}

function getTime(e) {
	let percent = (e.offsetX * 100) / prog.clientWidth;
	return (percent / 100) * video.duration;
}

function hideMarker() {
	marker.style.transform = "scale(0)";
}

function listenDrag(e) {
	title.innerText = e === 'on' ? 
		'Drop it like it\'s hot 🔥' : 
			!video.name ? 'Drag a video file over here 👇' : video.name
}

// load video file when dropped
function loadDroppedFile(e) {
	let file = e.dataTransfer.files[0]
	const result = webkitURL.createObjectURL(file)

	// Array(['src', result], ['type', file.type])
	// 	.forEach( entry => video.firstElementChild.setAttribute(...entry))
 	video.firstElementChild.setAttribute('src', result)
	video.load()
	video.name = file.name
}

// follow cursor and re-position playback marker
function moveMarker(e) {
	marker.style.left = e.offsetX + e.target.offsetLeft - marker.clientWidth / 2 + "px";
	// show playback time at current mark
	marker.firstElementChild.innerText = formatTime(getTime(e));
}

function showMarker() {
	marker.style.transform = "scale(1)";
}

// toggles play/pause icon
function toggleBtn(e) {
	e.target.previousElementSibling.id = "play";
}

function toggleLight() {

	const [color, shadow, cls, tooltip] = light.className === 'on' ? 
		['#000', 'none', 'off', 'turn the lights on'] :
			['unset', '0 5px 9px var(--grey-ish)', 'on', 'turn the lights off']

	light.className = cls
	video.parentNode.style.boxShadow = shadow
	document.querySelector('body').style.backgroundColor = color
	light.setAttribute('title', tooltip)
}

// switch between pause and play states
function togglePlay() {
	if (video.paused) {
		video.play();
		btn.id = "pause";
		return
	} else {
		video.pause();
	}
}

function updatePlaybackProgress(e) {
	prog.value = e.target.currentTime;
	played.innerText = formatTime(e.target.currentTime);
}

function updateVideoAttr() {
	prog.max = video.duration;
	dur.innerText = formatTime(video.duration);
	togglePlay()
	title.innerText = video.name // update title
}

// Drag and Drop Support
// prevent file from being automatically opened by browser
'drag dragstart dragend dragover dragenter dragleave drop'
	.split(' ')
	.forEach(arg => {
		document.addEventListener(arg, e => {
			e.preventDefault()
			e.stopPropagation()
		})
	})

// default played time to 00:00:00 
played.innerText = formatTime(0);

// load marker
marker.style.width = marker.style.height = prog.clientHeight + 'px';
marker.style.top = prog.offsetTop + 'px';

// playback key bindings
document.onkeydown = key => {
	console.log(key)
	key.code === 'Space' ? togglePlay() : 
	key.code === 'ArrowRight' ? video.currentTime += (
		key.ctrlKey ? 56 : key.shiftKey && !key.ctrlKey ? 2 : 12
	) :
	key.code === 'ArrowLeft' ? video.currentTime -= (
		key.ctrlKey ? 60 : key.shiftKey && !key.ctrlKey ? 3 : 15
	) : 
	key.code === 'KeyF' ? (
		video.webkitDisplayingFullscreen ? video.webkitExitFullscreen() : video.webkitEnterFullscreen()
	) :
	null
}

window.onblur = () => video.pause(); // pauses video when window looses focus
window.onfocus = () => prog.value ? togglePlay() : null; // plays video when window gains focus
