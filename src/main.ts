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
import { MajorTopic, MinorTopic, StockPhrase, DiscourseMeta } from './dataStructures';
import { filterLines,inputType,inputVolumeDiscourse,linkInside } from './utils'


/**
 * Read all inputs and generate all output
 */
export default function main() {
    let { majorTopics, minorTopics, stockPhrases, discoursesMeta } = readAndParseEverything()

    const outDir = './output/';
    writeMajorTopics(outDir+'MajorTopics.md',majorTopics);
    writeMinorTopics(outDir+'MinorTopics.md',minorTopics);
    writeStockPhrases(outDir+'StockPhrases.md',stockPhrases)
    writeFriends(outDir+"Friends.md",discoursesMeta)
    writeLocations(outDir+'Locations.md',discoursesMeta);
}

function readAndParseEverything() {
    const dir = './input/'
    const inputs = fs.readdirSync(dir)
    const majorTopics:Array<MajorTopic> = readAndParseMajorTopics(dir,inputs);
    const minorTopics:Array<MinorTopic> = readAndParseMinorTopics(dir,inputs);
    const stockPhrases:Array<StockPhrase> = readAndParseStockPhrases(dir,inputs);
    const discoursesMeta:Array<DiscourseMeta> = readAndParseMeta(dir,inputs);

    return { majorTopics, minorTopics, stockPhrases, discoursesMeta }
}

function readAndParseMajorTopics(dir:string, inputs:Array<string>): Array<MajorTopic> {
    return inputs
        .filter(input=>inputType(input,'major'))
        .reduce((acc,input)=>{
            const [ volume, discourse ] = inputVolumeDiscourse(input)
            fs.readFileSync(dir+input,'utf8')
                .split('\n')
                .filter(filterLines)
                .forEach(line=>{
                    const [ range, topic ] = line.split(':')
                    const [ verseBegin, verseEnd ] = range.split('-')
                    acc.push(new MajorTopic(
                        volume.toUpperCase(),
                        discourse,
                        topic.trim(),
                        parseInt(verseBegin),
                        parseInt(verseEnd))
                    )
                })
            return acc;
        },[]
        )
}

function readAndParseMinorTopics(dir:string, inputs:Array<string>): Array<MinorTopic> {
    return inputs
        .filter(input=>inputType(input,'minor'))
        .reduce((acc,input)=>{
            const [ volume, discourse ] = inputVolumeDiscourse(input)
            fs.readFileSync(dir+input,'utf8')
                .split('\n')
                .filter(filterLines)
                .forEach(line=>{
                    const [ versesUnsplit, topicsUnsplit ] = line.split(':')
                    const verses = versesUnsplit.split(',')
                    const topics = topicsUnsplit.split(',')

                    verses.forEach(verse=>{
                        topics.forEach(topic=>{
                            acc.push(new MinorTopic(
                                volume.toUpperCase(),
                                discourse,
                                topic.trim(),
                                parseInt(verse)
                            ))
                        })
                    })
                })
            return acc;
        },[]
        )
}
function readAndParseStockPhrases(dir:string, inputs:Array<string>): Array<StockPhrase> {
    return inputs
        .filter(input=>inputType(input,'stock'))
        .reduce((acc,input)=>{
            const [ volume, discourse ] = inputVolumeDiscourse(input)
            fs.readFileSync(dir+input,'utf8')
                .split('\n')
                .filter(filterLines)
                .forEach(line=>{
                    const [ verse, topic ] = line.split(':')
                    acc.push(new StockPhrase(volume,discourse,topic.trim(),parseInt(verse))) 
                })
            return acc;
        },[]
        )
}

function readAndParseMeta(dir:string, inputs:Array<string>): Array<DiscourseMeta> {
    return inputs
        .filter(input=>inputType(input,'meta'))
        .reduce((acc,input)=>{
            const [ volume, discourse ] = inputVolumeDiscourse(input)
            let titleEnglish = ''
            let titlePali = ''
            let location = ''
            let friends: Array<string> = []
            fs.readFileSync(dir+input,'utf8')
                .split('\n')
                .filter(filterLines)
                .forEach(line=>{
                    const [ key, value ] = line.split(":")
                    if(key.toLowerCase()==='location') {
                        location = value.trim();
                    }
                    if(key.toLowerCase()==='title') {
                        const [ paliUntrimmed, englishUntrimmed ] = value.split(',')
                        titleEnglish = englishUntrimmed.trim();
                        titlePali = paliUntrimmed.trim();
                    }
                    if(key.toLowerCase()==='friends') {
                        friends = value.split(',').map(friend=>friend.trim())
                    }
                })
            acc.push(new DiscourseMeta(volume,discourse,location,titleEnglish,titlePali,friends))
            return acc;
        },[]
        )
}


function writeMajorTopics(outFile:string, majorTopics:Array<MajorTopic>) {
    // Sort by topic, volume, discourse
    majorTopics.sort((a,b)=>{
        if(a.topic > b.topic) return 1
        if(a.topic < b.topic) return -1
        if(a.volume > b.volume) return 1
        if(a.volume < b.volume) return -1
        if(a.discourse > b.discourse) return 1
        if(a.discourse < b.discourse) return -1
    })

    // get unique list of topics
    const topics:Array<string> = majorTopics.reduce((acc,major)=>{
        if(!acc.includes(major.topic)) {
            acc.push(major.topic)
        }
        return acc
    },[])

    // build text output
    const textBody:string = topics.reduce((textBody,topic)=>{
        textBody+=`\n## ${topic}\n`
        textBody+= majorTopics
            .filter(major=>major.topic===topic)
            .map(topicToString)
            .join(`\n`)

        return textBody
    },'')

    const textComplete = '# Major Topics\n\n' + textBody
    fs.writeFileSync(outFile,textComplete);

    function topicToString(m:MajorTopic) {
        // WARNING: This will perform very badly as data increases and will
        //          require an index on volume,discourse,range
        const otherTopics = majorTopics.filter(major=>
            major.volume === m.volume &&
            major.discourse === m.discourse &&
            major.verseBegin === m.verseBegin &&
            major.verseEnd === m.verseEnd &&
            major.topic !== m.topic
        ).map(major=>linkInside(major.topic))
        const others = otherTopics.length === 0 ? ''
            : ` \(With: ${otherTopics.join(', ')}\)`;

        return `* ${m.volume}-${m.discourse}: ${m.verseBegin} - ${m.verseEnd} ${others} `
    }
}

function writeMinorTopics(outFile:string, minorTopics:Array<MinorTopic>) {
    // Sort by topic, volume, discourse
    minorTopics.sort((a,b)=>{
        if(a.topic > b.topic) return 1
        if(a.topic < b.topic) return -1
        if(a.volume > b.volume) return 1
        if(a.volume < b.volume) return -1
        if(a.discourse > b.discourse) return 1
        if(a.discourse < b.discourse) return -1
    })

    // get unique list of topics
    const topics:Array<string> = minorTopics.reduce((acc,minor)=>{
        if(!acc.includes(minor.topic)) {
            acc.push(minor.topic)
        }
        return acc
    },[])

    // build text output
    const textBody:string = topics.reduce((textBody,topic)=>{
        textBody+=`\n## ${topic}\n`
        textBody+= minorTopics
            .filter(minor=>minor.topic===topic)
            .map(minor=>`* ${minor.volume.toUpperCase()}-${minor.discourse}: ${minor.verse}`)
            .join(`\n`)

        return textBody
    },'')

    const textComplete = '# Minor Topics\n\n' + textBody
    fs.writeFileSync(outFile,textComplete);
}

function writeStockPhrases(outFile:string, stockPhrases:Array<MinorTopic>) {
    // Sort by topic, volume, discourse
    stockPhrases.sort((a,b)=>{
        if(a.topic > b.topic) return 1
        if(a.topic < b.topic) return -1
        if(a.volume > b.volume) return 1
        if(a.volume < b.volume) return -1
        if(a.discourse > b.discourse) return 1
        if(a.discourse < b.discourse) return -1
    })

    // get unique list of topics
    const topics:Array<string> = stockPhrases.reduce((acc,stock)=>{
        if(!acc.includes(stock.topic)) {
            acc.push(stock.topic)
        }
        return acc
    },[])

    // build text output
    const textBody:string = topics.reduce((textBody,topic)=>{
        textBody+=`\n## ${topic}\n`
        textBody+= stockPhrases
            .filter(phrase=>phrase.topic===topic)
            .map(phrase=>`* ${phrase.volume.toUpperCase()}-${phrase.discourse}: ${phrase.verse}`)
            .join(`\n`)

        return textBody
    },'')

    const textComplete = '# Stock Phrases\n\n' + textBody
    fs.writeFileSync(outFile,textComplete);
}


function writeLocations(outFile:string, discoursesMeta:Array<DiscourseMeta>) {
    discoursesMeta.sort((a,b)=>{
        if(a.location > b.location) return 1
        if(a.location < b.location) return -1
        if(a.volume > b.volume) return 1
        if(a.volume < b.volume) return -1
        if(a.discourse > b.discourse) return 1
        if(a.discourse < b.discourse) return -1
        return 0
    })

    // extract unique list of locations
    const locations = discoursesMeta.reduce((acc,discourse)=>{
        if(!acc.includes(discourse.location)) {
            acc.push(discourse.location)
        }
        return acc
    },[])

    // build text output
    const textBody:string = locations.reduce((textBody,location)=>{
        textBody+=`\n## ${location}\n`
        textBody+= discoursesMeta
            .filter(meta=>meta.location===location)
            .map(meta=>`* ${meta.volume.toUpperCase()}-${meta.discourse}`)
            .join(`\n`)

        return textBody
    },'')

    const textComplete = '# Locations\n\n' + textBody
    fs.writeFileSync(outFile,textComplete);
}

function writeFriends(outFile:string,discoursesMeta:Array<DiscourseMeta>) {
    // Transpose to flat list of friends to volumes
    const flat = discoursesMeta.reduce((acc,dm)=>{
        dm.friends.forEach(friend=>acc.push({
            volume: dm.volume,
            discourse: dm.discourse,
            friend: friend
        }))
        return acc
    },[])

    // extract and sort list of friends
    const friends = flat.reduce((acc,flatItem)=>{
        if(!acc.includes(flatItem.friend)) {
            acc.push(flatItem.friend)
        } 
        return acc
    },[]).sort()

    // build text body
    const textBody:string = friends.reduce((textBody,friend)=>{
        textBody+=`\n## ${friend}\n`
        textBody+= discoursesMeta
            .filter(meta=>meta.friends.includes(friend))
            .map(meta=>`* ${meta.volume.toUpperCase()}-${meta.discourse}`)
            .join(`\n`)

        return textBody
    },'')

    const textComplete = '# Friends\n\n' + textBody
    fs.writeFileSync(outFile,textComplete);
}