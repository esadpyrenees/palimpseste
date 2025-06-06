
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

  
// Affiche le compteur dès que la page est chargée
window.addEventListener("load", () => {
	let printCount = parseInt(localStorage.getItem("printCount")) || 0;

	// Crée un élément pour afficher le compteur si il n'existe pas
	let counterDisplay = document.getElementById("print-counter");
	if (!counterDisplay) {
		counterDisplay = document.createElement("div");
		counterDisplay.id = "print-counter";
		document.body.appendChild(counterDisplay);
	}
	counterDisplay.textContent = `[FRAGMENT NUMÉRO ] ${printCount}`;
});

// Augmente le compteur à chaque impression et l'affiche
window.addEventListener("beforeprint", () => {
	let printCount = parseInt(localStorage.getItem("printCount")) || 0;

	// Incrémente le compteur
	printCount++;

	// Sauvegarde le nouveau compteur
	localStorage.setItem("printCount", printCount);

	// Met à jour l'affichage du compteur
	let counterDisplay = document.getElementById("print-counter");
	counterDisplay.textContent = `[FRAGMENT NUMÉRO ] ${printCount}`;
});

document.addEventListener('mousemove', function() {
  document.body.classList.remove('nocursor');
  //hideCursor()
})
//hideCursor();