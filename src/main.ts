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
import { MajorTopic, MinorTopic } from './dataStructures';
import { filterLines,inputType,inputVolumeDiscourse,linkInside } from './utils'


/**
 * Read all inputs and generate all output
 */
export default function main() {
    let { majorTopics, minorTopics } = readAndParseEverything()

    const outDir = './output/';
    writeMajorTopics(outDir+'MajorTopics.md',majorTopics);
    writeMinorTopics(outDir+'MinorTopics.md',minorTopics);
}

function readAndParseEverything() {
    const dir = './input/'
    const inputs = fs.readdirSync(dir)
    const majorTopics:Array<MajorTopic> = readAndParseMajorTopics(dir,inputs);
    const minorTopics:Array<MinorTopic> = readAndParseMinorTopics(dir,inputs);

    return { majorTopics, minorTopics }
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
            .map(minor=>`* ${minor.volume}-${minor.discourse}: ${minor.verse}`)
            .join(`\n`)

        return textBody
    },'')

    const textComplete = '# Minor Topics\n\n' + textBody
    fs.writeFileSync(outFile,textComplete);
}
