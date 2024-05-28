const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const targetPath = './src/environments/environment.ts';

const envFileContent = `
export const environment = {

  map_tiler: "${ process.env['MAPTILER_KEY']}"
};

`;

mkdirSync('./src/environments', {recursive:true});

writeFileSync( targetPath, envFileContent);
