/**
 * ENVIRONMENTS
 */
const env = require('../.env')

/**
 * LIBRARIES
 */
const request = require('request-promise'),
    cheerio = require('cheerio'),
    fs = require('fs-extra');

/**
 * @description LOAD PAGE THAT WE WILL EXTRACT THE DATA
 */
const $load = async () => {
    const mainHtml = await request(env.URL),
        $ = cheerio.load(mainHtml)
    return await $
}

/**
 * @description get link of pages and fiels names of these pages
 * @param { function } $ same as the selector used in jquery
 * @returns { object } link of pages and name of field
 */
const $links = $ => { 
    return $('.section').map((i, section) => {
        const $button = $(section).find('.marketing-button')
        return {
            link : env.URL + $button.attr('href'),
            name : $button.text()
        }
    }).get()
}

/**
 * @description extract data of fields
 * @param { object } links link of page and name fields
 * @returns { object } data of extraction
 */
const $data = async links => {

    return await Promise.all(links.map(async expert => {
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

}

module.exports = {
    fs,
    $load,
    $links,
    $data
}