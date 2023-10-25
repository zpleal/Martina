#!/usr/bin/env /usr/local/bin/node

const fs   = require('fs');
const path = require('path');

const charMap = {
    '╞': 'ã',
    'в': 'ó',
}

function recode(text) {
    for(let c in charMap)
	text = text.replace(new RegExp(c,'g'),charMap[c]);

    return text;
}

function getName(pathname) {
    const base = path.basename(pathname);
    const ext  = path.extname(pathname);

    if(ext === "")
        return recode( base );
    else {
        const pos = base.indexOf(ext);

	const label = recode( pos < 0 ? base : base.substring(0,pos) );

	const found = label.match(/[^_]*_([^_]*_[^_]*_[^_]*)/);

	return found ? found[1].replace('_',' '): label;
    }
}


function list(parent) {
    const conf = {};

    fs.readdirSync(parent).forEach( (pathname) => {
        const full = parent+"/"+pathname;
        const stat = fs.lstatSync(full);
        const name = getName(pathname);

        if(stat.isDirectory()) {
            conf[name] = list(full);
        } else if(stat.isFile()) {
            conf[name] = full;
        } else {
            // ignore
        }
    });
    return conf;
}

console.log('Content-type: application/json');
console.log('');
console.log(JSON.stringify(list('panels')));
