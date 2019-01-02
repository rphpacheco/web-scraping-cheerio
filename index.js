const request = require('request-promise'),
    cheerio = require('cheerio'),
    fs = require('fs-extra');

(async function() {
    try {
        await fs.writeFile('out.csv', 'section,name\n')

        const base = 'https://experts.shopify.com'
        const mainHtml = await request(base)
        const $ = cheerio.load(mainHtml)

        const links = $('.section').map((i, section) => {
            const $button = $(section).find('.marketing-button')
            return {
                link : base + $button.attr('href'),
                name : $button.text()
            }
        }).get()

        const data = await Promise.all(links.map(async expert => {
            try {
                const expertHtml = await request(expert.link)
                const $ = cheerio.load(expertHtml) 
                
                const lis = $('#ExpertsResults > li')
                const names = lis.map((i, li) => {
                    return $(li).find('h2 a').text()
                }).get()

                return {
                    name : expert.name,
                    names
                }

            } catch (e) {
                return e.message
            }
        }))

        for(section of data) {
            const sectionName = section.name
            for(name of section.names) {
                await fs.appendFile('out.csv', `"${sectionName}","${name}"\n`)
            }
        }
        
        console.log('finish \\o/')

    } catch (e) {
        console.log(`expected : ${ e }`)
    }
})()