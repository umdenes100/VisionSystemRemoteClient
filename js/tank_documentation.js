$(document).ready(function () {
	$.get('https://raw.githubusercontent.com/umdenes100/TankArduinoLibrary/master/README.md', function (data) {
		let converter = new showdown.Converter();
		$('#tank-documentation').html(converter.makeHtml(data));
	});
});