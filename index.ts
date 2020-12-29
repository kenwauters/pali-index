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

class TopicVerse {
    topic: string = ''
    verse: number = 0
    
    constructor(topic:string,verse:string) {
        this.topic = topic;
        this.verse = Number(verse);
    }
}

class TopicRange {
    topic: string = ''
    verseStart: number = 0
    verseEnd: number = 0

    constructor(topic:string,range:string) {
        this.topic = topic
        let pieces = range.split('-')
        this.verseStart = Number(pieces[0])
        this.verseEnd = Number(pieces[1])
    }
}

class Sutta {
    volume:string = ''
    sutta:Number = 0
    titlePali:string = ''
    titleEnglish: string = ''
    location:string = ''
    topicsByRange: Array<TopicRange> = []
    topicsByVerse: Array<TopicVerse> = []

    constructor(sutta:string) {
        const pieces = sutta.split('-')
        this.volume = pieces[0]
        this.sutta = Number(pieces[1])
    }
}

let suttas = {}

/**
 * Process inputs and populate global-scoped list of suttas
 */
fs.readdirSync('./suttas')
    .filter(fileName=>fileName.endsWith('.csv'))
    .forEach(fileName=>{
        const suttaId:string = fileName.split('.')[0];
        if(!(suttaId in suttas)) {
            suttas[suttaId] = new Sutta(suttaId) 
        }
        let sutta = suttas[suttaId]

        fs.readFileSync(`./suttas/${fileName}`,'utf8')
            .replace(/\r/g,'')
            .split("\n")
            .forEach(line=>{
                if(!addedTitleOrLocation(sutta,line.trim()) ) {
                    processSuttaLine(sutta,line.trim())
                }
            })
})

fs.writeFileSync('./debug/suttas.json',JSON.stringify(suttas,null,4))

function addedTitleOrLocation(sutta:Sutta,line:string) {
    if(line.startsWith('!Title')) {
        const [ pali, english ] = line.replace('!Title','').split(',')
        sutta.titlePali = pali.trim()
        sutta.titleEnglish = english.trim()
        return true;
    }
    if(line.startsWith('!Location')) {
        sutta.location = line.replace('!Location','').trim();
        return true;
    }
    return false;
}

function processSuttaLine(sutta:Sutta,line:string) {
    if(line.length===0 || line.startsWith('#')) {
        return;
    }

    let verses:Array<string> = []
    let ranges:Array<string> = []
    let topics:Array<string> = []
    line.split(',').filter(item=>item.length>0).forEach(item=>{
        if(item.match(/^\d+\-\d+$/)) {
            ranges.push(item)
            return;
        }
        if(item.match(/^\d+$/)) {
            verses.push(item);
            return;
        }
        else {
            topics.push(item);
        }
    })

    topics.forEach(topic=>{
        verses.forEach(verse=>sutta.topicsByVerse.push(new TopicVerse(topic,verse)))
        ranges.forEach(range=>sutta.topicsByRange.push(new TopicRange(topic,range)))
    })
}
