const axios = require('axios')

const tree = ( async () => {
    const { data } = await axios.get('https://raw.githubusercontent.com/jdolan/quetoo/master/src/cgame/default/ui/settings/SystemViewController.json')
    return data
})().then((tree) => {
    process.stdout.write('Hello Cantina. Please type your selector here:  ')
        process.stdin.on('data', (data) => {
            const selector = data.toString().trim()
            const output = selectFromTree(tree, selector)
            process.stdout.write(`Found ${output.length} matching nodes:\n${output.map((o, i) => `${i + 1}: {${o.join(', ')}}\n`).join('\n')}`)
            process.stdout.write('\nHello Cantina. Please type your selector here:  ')
            })
})


const selectFromTree = (tree, selector) => {
    let matches = []
    const types = {'.': 'classNames', '#': 'identifier'}
    const sel = selector[0]
    const attribute = sel === '.' || sel === '#' ? types[sel] : 'class'
    let searchWord = attribute === 'class' ? selector : selector.slice(1)
    let keysArray = Object.keys(tree)
    if (tree[attribute]  === searchWord || (Array.isArray(tree[attribute]) && tree[attribute].includes(searchWord))){
        matches.push(foundMatch(tree))
    }
    for (let i = 0; i < keysArray.length; i++){
        if (Array.isArray(tree[keysArray[i]])){
            for (let j = 0; j < tree[keysArray[i]].length; j++){
                matches = matches.concat(selectFromTree(tree[keysArray[i]][j], selector))
            } 
        }
        else if (typeof tree[keysArray[i]] === 'object'){
            matches = matches.concat(selectFromTree(tree[keysArray[i]], selector))
        }
    }
    return matches
}


const foundMatch = (node) => {
    const keys = Object.keys(node)
        return keys.map((key, i)=> {
            return `${key}: ${node[key]}`
        })
}

