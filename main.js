const { fs, $load, $links, $data } = require('./config/tools');

(async () => {
    try {

        await fs.writeFile('./data/out.csv', 'section,name\n')

        const $ = await $load(),
            links = $links($),
            data = await $data(links)

        for(section of data) {
            const sectionName = section.name
            for(name of section.names) {
                await fs.appendFile('./data/out.csv', `"${sectionName}","${name}"\n`)
            }
        }
        
        console.log('finish \\o/')

    } catch (e) {
        console.log(`There was an error : ${ e }`)
    }
})()