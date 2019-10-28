$(document).ready(() => {
    const API_KEY = 'AIzaSyBipMvUUn6vzdTqA0PsvNwskMY-F7BwtP4'

    let $logo = $('#logo')

    if (Math.random() >= 0.2) {
        $.get(`https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`, data => {
            data = data.items.filter(font => font.category == 'display' || font.category == 'handwriting')
            let randomFont = data[Math.floor(Math.random() * data.length)]
            let fontFace = new FontFace(randomFont.family, `url(${randomFont.files.regular})`)
            document.fonts.add(fontFace)
            $logo.css('font-family', `"${randomFont.family}", cursive`)
        })
    }

    if (Math.random() >= 0.99) {
        $logo.text('LTF > UTF')
    }


    // Keep track of the date to implement holiday flairs.
    var today = new Date();

    // Add halloween-spirited emojis to the banner text.
    october = 09;  // 0-based indexing
    weekBeforeHalloween = 31 - 7;
    halloween = 31;
    month = today.getMonth();
    date = today.getDate();

    if (month === october && date >= weekBeforeHalloween && date <= halloween) {
        $logo.text(function(i, origText) {
            return origText + ' 🎃'  // Append the pumpkin emoji to the banner text.
        })
    }
})
