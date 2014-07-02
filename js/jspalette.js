/*
 * jspalette.js
 * Created: 6/30/2014 2:50pm
 * Author: Daniel Vidmar
 */
var colorChooserCanvas;
var colorChooserContext;

var shadeChooserCanvas;
var shadeChooserContext;

var shadeColor = "#15EAE7";

var ismouseDown = false;

var mouseX = 0;
var mouseY = 0;

window.onload = function() {
	initCanvas();
	drawColorChooser();
}

function initCanvas() {
	colorChooserCanvas = document.getElementById("color-chooser");
	colorChooserContext = colorChooserCanvas.getContext("2d");
	shadeChooserCanvas = document.getElementById("shade-chooser");
	shadeChooserContext = shadeChooserCanvas.getContext("2d");
	
	addListeners();
}

function addListeners() {
	colorChooserCanvas.addEventListener("mousedown", function(event) {
		ismouseDown = true;
		changeColor(event);
	}, false);

	colorChooserCanvas.addEventListener("mouseup", function(event) {
		ismouseDown = false;
	}, false);

	colorChooserCanvas.addEventListener("mousemove", function(event) {
		if(ismouseDown) {
			changeColor(event);	
		}
	}, false);

	colorChooserCanvas.addEventListener("mouseout", function(event) {
		ismouseDown = false;
	}, false);
	
	shadeChooserCanvas.addEventListener("mousedown", function(event) {
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
	}, false);
	
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
	var backgroundGradient = colorChooserContext.createLinearGradient(0, 130, 130, 130);
    backgroundGradient.addColorStop(0.0, '#ED1212');
    backgroundGradient.addColorStop(0.2, '#E6EC13');
    backgroundGradient.addColorStop(0.3, '#17EC13');
    backgroundGradient.addColorStop(0.5, '#15EAE7');
    backgroundGradient.addColorStop(0.7, '#1F16E9');
    backgroundGradient.addColorStop(0.85, '#D817E8');
    backgroundGradient.addColorStop(1.0, '#ED1212');
	
	var overlayGradient = colorChooserContext.createLinearGradient(0, 0, 0, 155);
	overlayGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
	overlayGradient.addColorStop(0.85, 'grey');
	
	colorChooserContext.fillStyle = backgroundGradient;
	colorChooserContext.fillRect(0, 0, 130, 130);
	
	colorChooserContext.fillStyle = overlayGradient;
	colorChooserContext.fillRect(0, 0, 130, 140)
}

function drawShadeChooser() {
	var backgroundGradient = shadeChooserContext.createLinearGradient(0, 0, 12, 130);
	backgroundGradient.addColorStop(0.1, '#000');
	backgroundGradient.addColorStop(0.5, shadeColor);
	backgroundGradient.addColorStop(0.9, '#fff');
	
	shadeChooserContext.fillStyle = backgroundGradient;
	shadeChooserContext.fillRect(0, 0, 12, 130);
}

function changeColor(event) {
	var canvasX = colorChooserCanvas.offsetLeft;
	var canvasY = colorChooserCanvas.offsetTop;
	
	mouseX = event.pageX - canvasX;
	mouseY = event.pageY - canvasY;
	
	var data = colorChooserContext.getImageData(mouseX, mouseY, 1, 1).data;
	shadeColor = rgbToHex(data[0], data[1], data[2]);
	document.getElementById("picked-color").value = shadeColor;
	document.getElementById("chosen-color").style.background = shadeColor;
	drawShadeChooser();
}

function chooseShade(event) {
	var canvasX = shadeChooserCanvas.offsetLeft;
	var canvasY = shadeChooserCanvas.offsetTop;
	
	mouseX = event.pageX - canvasX;
	mouseY = event.pageY - canvasY;
		
	var data = shadeChooserContext.getImageData(mouseX, mouseY, 1, 1).data;
	var color = rgbToHex(data[0], data[1], data[2]);
	document.getElementById("picked-color").value = color;
	document.getElementById("chosen-color").style.background = color;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}