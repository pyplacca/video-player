
// Global Elements
const [prog, video, btn, cur, dur, marker] = [
	".prog progress",
	"video",
	".btn",
	"#curTime",
	"#duration",
	".prog .marker",
].map((arg) => document.querySelector(arg));

function updateProg(e) {
	prog.max = e.target.duration;
	dur.innerText = formatTime(e.target.duration);
	// update title
	document.querySelector(".title").innerText = 
		e.target.currentSrc
			.split("/")
			.pop();
}

function updatePlaybackProgress(e) {
	prog.value = e.target.currentTime;
	cur.innerText = formatTime(e.target.currentTime);
}

function getTime(e) {
	let percent = (e.offsetX * 100) / prog.clientWidth;
	return (percent / 100) * video.duration;
}

function adjustPlayback(e) {
	// jump playback forwards or backwards
	video.currentTime = getTime(e);
}

function showMarker() {
	const mark_time = marker.firstElementChild;
	mark_time.style.left = -mark_time.clientWidth + "px";
	marker.style.transform = "scale(1)";
}

function moveMarker(e) {
	// show playback time at marker position
	marker.firstElementChild.innerText = formatTime(getTime(e));
	// re-position playback marker
	marker.style.left =
		e.offsetX + 
		e.target.offsetLeft - 
		marker.clientWidth / 2 + 
		"px";
}

function hideMarker() {
	marker.style.transform = "scale(0)";
}

function formatTime(secs) {
	// convert seconds to HH:MM:ss time format
	return new Date(secs * 1000)
		.toISOString()
		.substr(11, 8);
	// .split(':')
	// .filter((v, i) => v !== "00" || i > 0)
	// .join(":")
}

function togglePlay(e) {
	// switch between pause and play
	if (video.paused) {
		video.play();
		btn.id = "pause";
	} else {
		video.pause();
	}
}

function toggleBtn(e) {
	// toggles play/pause icon
	e.target.previousElementSibling.id = "play";
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
document.onkeypress = (key) => {
	key.code === "Space" ? togglePlay() : null
}

window.onblur = () => video.pause(); // pause video when window looses focus
window.onfocus = () => prog.value ? togglePlay() : null; // starts video when window gains focus
