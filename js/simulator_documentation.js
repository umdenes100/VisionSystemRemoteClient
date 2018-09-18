$(document).ready(function () {
	$.get('https://raw.githubusercontent.com/umdenes100/SimulatorArduinoLibrary/master/README.md', function (data) {
		let converter = new showdown.Converter();
		$('#simulator-documentation').html(converter.makeHtml(data));
	});
});