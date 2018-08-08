const fs = require('fs');
const path = require('path');

function readPeople() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, './people.json'), { encoding: 'utf8' }));
}

module.exports = {
    get data() {
        return readPeople().concat(['Spiderman', `Charizard lvl ${(9 * 7)}`]);
    }
}
