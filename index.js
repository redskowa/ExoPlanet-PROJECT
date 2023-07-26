const { parse } = require('csv-parse');
// use the built into Node File System functionality to create a stream
// a stream is required for the parse function to work, it does not interact directly with the file.
const fs = require('fs')

const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_teq'] > 175 && planet['koi_teq'] < 270
        && planet['koi_prad'] < 1.6
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
}

fs.createReadStream('kepler_data.csv')
    .pipe(parse( {
        comment: '#',
        columns: true,
    }))
    .on('data', (data) => {
        if (isHabitablePlanet(data)) {
            habitablePlanets.push(data);
        }
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('end', () => {
        console.log(habitablePlanets.map((planet) => {
            return planet['kepler_name'];
        }));
        console.log(`${habitablePlanets.length} habitable planets found!`);
    });
