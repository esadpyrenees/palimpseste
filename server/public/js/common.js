
document.body.ondblclick = function (e) {
	toggleFullScreen();
};
function toggleFullScreen(onoff) {
	// should we go FS ?
	const to_fullscreen = onoff == "on" ? true : !document.fullscreenElement;
	if (to_fullscreen) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen) {
				document.exitFullscreen();
		}
	}
}


function hideCursor(){
  setTimeout( () => {
    document.body.classList.add('nocursor')
  }, 2000);
}

document.addEventListener('mousemove', function() {
  document.body.classList.remove('nocursor');
  hideCursor()
})
hideCursor();