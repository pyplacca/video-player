
// Global Elements
const [prog, video, btn, cur, dur, marker] = [
	".prog progress",
	"video",
	".btn",
	"#curTime",
	"#duration",
	".prog .marker",
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

// follow cursor and re-position playback marker
function moveMarker(e) {
	// show playback time at current mark
	marker.firstElementChild.innerText = formatTime(getTime(e));
	marker.style.left = e.offsetX + e.target.offsetLeft - marker.clientWidth / 2 + "px";
}

function showMarker() {
	marker.style.transform = "scale(1)";
}

// toggles play/pause icon
function toggleBtn(e) {
	e.target.previousElementSibling.id = "play";
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
	cur.innerText = formatTime(e.target.currentTime);
}

function updateProg(e) {
	prog.max = e.target.duration;
	dur.innerText = formatTime(e.target.duration);
	// update title
	document.querySelector(".title").innerText = 
		e.target.currentSrc.split("/").pop();
}

/*
// Drag and Drop Support
'drag dragstart dragend dragover dragenter dragleave drop'
	.split(' ')
	.forEach(arg => {
		document.addEventListener(arg, e => {
			// prevent file from being automatically opened by browser
			e.preventDefault()
			e.stopPropagation()
		})
	})
// accept file
// 'dragover dragenter'.split(' ').forEach(arg => {
// 	video.addEventListener(arg, e => video.style.cursor = '')
// })
reader = new FileReader()
video.ondrop = e => {
	let file = e.dataTransfer.files[0]
	console.log(file)
	reader.readAsDataURL(file)
	reader.onload = arg => {
		console.log(arg.result)
	}
}
*/
cur.innerText = formatTime(0);
// load marker
marker.style.width = marker.style.height = prog.clientHeight + "px";
marker.style.top = prog.offsetTop + "px";
// play/pause key binding
document.onkeypress = key => {
	key.code === "Space" ? togglePlay() : null
}

window.onblur = () => video.pause(); // pause video when window looses focus
window.onfocus = () => prog.value ? togglePlay() : null; // starts video when window gains focus
