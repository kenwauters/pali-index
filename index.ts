/**
    (C) Copyright 2020, 2021 by Kenyon Wauters

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as fs from 'fs';

let byVerse = {}
let byTopic = {}

// Get list of input files
fs.readdirSync('./suttas').forEach(fileName=>{
    const sutta = fileName.split('.')[0]

    // Filter out 
    fs.readFileSync(`./suttas/${fileName}`,'utf8')
        .split("\n")
        .forEach(line=>{
            processSuttaLine(sutta,line.trim())
    })
})

printByVerse();
printByTopic();
console.log(byVerse)
process.exit(0);
// ------------------------


function processSuttaLine(sutta,line) {
    let verses = []
    let topics = []
    line.split(',').filter(item=>item.length>0).forEach(item=>{
        if(item.match(/^[1-9]+\-[1-9]+$/)) {
            verses.push(...expandVerseRange(item))
        }
        else if(item.match(/^[1-9]/)) {
            verses.push(Number(item));
        }
        else {
            topics.push(item);
        }
    })

    verses.forEach(verse=>{
        topics.forEach(topic=>{
            const combination = `${sutta}:${verse}`
            addByTopic(combination,topic)
            addByVerse(combination,topic) 
        })
    })
}

function expandVerseRange(item) {
    let verses = []
    const [ start, end ] = item.split('-')
    let idx = Number(start)
    // FIXME: Bad data will create an endless loop here
    while(idx <= Number(end)) {
        console.log(start,end,idx)
        verses.push(idx)
        idx++
    }
    return verses;
}

function addByTopic(combination,topic) {
    if(!(topic in byTopic)) {
        byTopic[topic] = []
    }
    byTopic[topic].push(combination)
}

function addByVerse(combination,topic) {
    if(!(combination in byVerse)) {
        byVerse[combination] = []
    }
    byVerse[combination].push(topic)
}

function printByTopic() {
    let text = []
    Object.keys(byTopic)
        .sort((a,b)=>a>b ? 1 : -1)
        .forEach(topic=>{
            text.push(topic);
            text.push(...byTopic[topic].map(verse=>'   '+verse))
            text.push()
        })

    fs.writeFileSync('./output/byTopic.txt',text.join("\n"))
}

function printByVerse() {
    let text = []
    Object.keys(byVerse)
        .sort((a,b)=>{
            const aN = Number(a.split(':')[1]);
            const bN = Number(b.split(':')[1]);
            return aN>bN ? 1 : -1
        })
        .forEach(verse=>{
            text.push(verse);
            text.push(...byVerse[verse].sort().map(topic=>'   '+topic))
            text.push('');
        })
    fs.writeFileSync('./output/byVerse.txt',text.join("\n"))
}