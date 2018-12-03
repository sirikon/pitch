module.exports = {
    data(parentData) {
        return parentData.people.concat(['Spiderman', `Charizard lvl ${(9 * 7)}`]);
    }
};
