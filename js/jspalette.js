/*
 * jspalette.js
 * Created: 6/30/2014 2:50pm
 * Author: Daniel Vidmar
 */
var colorChooserCanvas, colorChooserContext, shadeChooserCanvas, shadeChooserContext, chooserIcon, shadeColor, ismouseDown, showControls, sizeFactor, colorChooserSize, shadeChooserWidth, chooserColors, paletteHTML, canvasX, canvasY, shadeCanvasX, shadeCanvasY, mouseX, mouseY;

shadeColor = "#15EAE7";

ismouseDown = false;

showControls = false;

sizeFactor = 1;

colorChooserSize = 130 * sizeFactor;

shadeChooserWidth = 12 * sizeFactor;

chooserColors = ['#ED1212', '#E6EC13', '#17EC13', '#15EAE7', '#1F16E9', '#D817E8', '#ED1212'];

paletteHTML = '<div id="color-container"><div id="color-outcome"><div id="chosen-color"></div><input type="text" id="picked-color" value="' + shadeColor + '"></div><div id="chooser-background"><div id="chooser-icon"></div><canvas id="color-chooser" width="' + colorChooserSize + '" height="' + colorChooserSize + '"></canvas></div><div id="shade-background"><div id="shader-slider"></div><canvas id="shade-chooser" width="' + shadeChooserWidth + '" height="' + colorChooserSize + '"></canvas></div></div>';

canvasX, canvasY, shadeCanvasX, shadeCanvasY, mouseX, mouseY = 0;

window.onload = function() {
	initJSPalette();
}

function initJSPalette(












) {
	if(showControls) {
		paletteHTML += '<div id="palette-controls"><button id="jspalette-close" class="jspalette-control" style="float: left;">Close</button><button id="jspalette-choose" class="jspalette-control" style="float: right;">Choose</button></div>';	
	}
	document.getElementById("jspalette").innerHTML = paletteHTML;
	initCanvas();
	drawColorChooser();
	getCanvasCoords();
}

function initCanvas() {
	colorChooserCanvas = document.getElementById("color-chooser");
	colorChooserContext = colorChooserCanvas.getContext("2d");
	shadeChooserCanvas = document.getElementById("shade-chooser");
	shadeChooserContext = shadeChooserCanvas.getContext("2d");
	chooserIcon = document.getElementById('chooser-icon');
	
	addListeners();
}

function addListeners() {
	
	window.addEventListener("mousedown", function(event) {
		if(inCanvas(event)) {
			ismouseDown = true;
			moveChooserIcon(event);
			changeColor(event);	
		} else if(inShadeCanvas(event)) {
			ismouseDown = true;
			chooseShade(event);
		}
	}, false);

	window.addEventListener("mouseup", function(event) {
		ismouseDown = false;
	}, false);

	window.addEventListener("mousemove", function(event) {
		if(inCanvas(event) && ismouseDown) {
			moveChooserIcon(event);
			changeColor(event);
			return;
		} else if(inShadeCanvas(event) && ismouseDown) {
			chooseShade(event);
			return;
		}
		ismouseDown = false;
	}, false);
	
	/*shadeChooserCanvas.addEventListener("mousedown", function(event) {
		ismouseDown = true;
		chooseShade(event);
	}, false);

	shadeChooserCanvas.addEventListener("mouseup", function(event) {
		ismouseDown = false;
	}, false);

	shadeChooserCanvas.addEventListener("mousemove", function(event) {
		if(ismouseDown) {
			chooseShade(event);	
		}
	}, false);

	shadeChooserCanvas.addEventListener("mouseout", function(event) {
		ismouseDown = false;
	}, false);*/
	
	document.getElementById("picked-color").addEventListener("change", function(event) {
		var input = document.getElementById("picked-color").value;
		
		shadeColor = (input.substr(0, 1) == '#') ? input : '#' + input;
		document.getElementById("picked-color").value = shadeColor;
		document.getElementById("chosen-color").style.background = shadeColor;
		drawShadeChooser();
	}, false);
}

function drawColorChooser() {
	drawMainChooser();
	drawShadeChooser();
}

function drawMainChooser() {
	var backgroundGradient = colorChooserContext.createLinearGradient(0, colorChooserSize, colorChooserSize, colorChooserSize);
    backgroundGradient.addColorStop(0.0, chooserColors[0]);
    backgroundGradient.addColorStop(0.2, chooserColors[1]);
    backgroundGradient.addColorStop(0.3, chooserColors[2]);
    backgroundGradient.addColorStop(0.5, chooserColors[3]);
    backgroundGradient.addColorStop(0.7, chooserColors[4]);
    backgroundGradient.addColorStop(0.85, chooserColors[5]);
    backgroundGradient.addColorStop(1.0, chooserColors[6]);
	
	var overlayGradient = colorChooserContext.createLinearGradient(0, 0, 0, colorChooserSize);
	overlayGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
	overlayGradient.addColorStop(0.97, '#797979');
	
	colorChooserContext.fillStyle = backgroundGradient;
	colorChooserContext.fillRect(0, 0, colorChooserSize, colorChooserSize);
	
	colorChooserContext.fillStyle = overlayGradient;
	colorChooserContext.fillRect(0, 0, colorChooserSize, colorChooserSize)
}

function drawShadeChooser() {
	var backgroundGradient = shadeChooserContext.createLinearGradient(0, 0, shadeChooserWidth, colorChooserSize);
	backgroundGradient.addColorStop(0.1, '#000');
	backgroundGradient.addColorStop(0.5, shadeColor);
	backgroundGradient.addColorStop(0.9, '#fff');
	
	shadeChooserContext.fillStyle = backgroundGradient;
	shadeChooserContext.fillRect(0, 0, shadeChooserWidth, colorChooserSize);
}

function changeColor(event) {
	getCanvasCoords();
	inCanvas(event);
	
	mouseX = event.pageX - canvasX;
	mouseY = event.pageY - canvasY;
	
	var data = colorChooserContext.getImageData(mouseX, mouseY, 1, 1).data;
	shadeColor = rgbToHex(data[0], data[1], data[2]);
	document.getElementById("picked-color").value = shadeColor;
	document.getElementById("chosen-color").style.background = shadeColor;
	drawShadeChooser();
	/*console.log(data[0] + ',' + data[1] + ',' + data[2]);*/
}

function chooseShade(event) {
	getShadeCoords();
	
	mouseX = event.pageX - shadeCanvasX;
	mouseY = event.pageY - shadeCanvasY;
		
	var data = shadeChooserContext.getImageData(mouseX, mouseY, 1, 1).data;
	var color = rgbToHex(data[0], data[1], data[2]);
	document.getElementById("picked-color").value = color;
	document.getElementById("chosen-color").style.background = color;
}

function moveChooserIcon(event) {
	getCanvasCoords();
	mouseX = event.pageX - canvasX;
	mouseY = event.pageY - canvasY;
	if(mouseX >= 0 && mouseX <= (colorChooserSize - 1)) {
		chooserIcon.style.marginLeft = (mouseX - 5) + 'px';
	}
	if(mouseY >= 0 && mouseY <= (colorChooserSize - 1)) {
		chooserIcon.style.marginTop = (mouseY - 5) + 'px';
	}
}

function getCanvasCoords() {
	var viewportOffset = colorChooserCanvas.getBoundingClientRect();
	var top = viewportOffset.top;
	var left = viewportOffset.left;
	var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	canvasX = scrollLeft + left;
	canvasY = scrollTop + top;
}

function getShadeCoords() {
	var viewportOffset = shadeChooserCanvas.getBoundingClientRect();
	var top = viewportOffset.top;
	var left = viewportOffset.left;
	var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	shadeCanvasX = scrollLeft + left;
	shadeCanvasY = scrollTop + top;
}

function inCanvas(event) {
	getCanvasCoords();
	mouseX = event.clientX;
	mouseY = event.clientY;
	if(canvasX <= mouseX && mouseX <= (canvasX + (colorChooserSize - 1)) && canvasY <= mouseY && mouseY <= (canvasY + (colorChooserSize - 1))) {
		return true;
	}
	return false;
}

function inShadeCanvas(event) {
	getShadeCoords();
	mouseX = event.clientX;
	mouseY = event.clientY;
	if(shadeCanvasX <= mouseX && mouseX <= (shadeCanvasX + (shadeChooserWidth - 1)) && shadeCanvasY <= mouseY && mouseY <= (shadeCanvasY + (colorChooserSize - 1))) {
		return true;
	}
	return false;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}