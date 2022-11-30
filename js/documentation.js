function get_library_information(library, path) {
    $.get(`https://raw.githubusercontent.com/umdenes100/${library}/${path}`, data => {
        let converter = new showdown.Converter({tables: true})
        $('.documentation').html(converter.makeHtml(data))

        if(library === "VisionSystemSimulatorWeb") {
            $('#d_button').remove()
        }

        $.each($('.documentation p a'), (index, value) => {
        if (value.href.includes('youtube')) {
                console.log(value.href)
                let embed_url = value.href.replace('watch?v=', 'embed/')
                $(value).replaceWith(`<iframe width="560" height="315" src="${embed_url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
            }
        })
    })
}

