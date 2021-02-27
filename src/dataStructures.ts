
export class MajorTopic {
    constructor(
        public volume: string,
        public discourse: number,
        public topic: string,
        public verseBegin: number,
        public verseEnd: number
    ) {}
}

export class MinorTopic {
    constructor(
        public volume: string,
        public discourse: number,
        public topic: string,
        public verse: number
    ) {}
}

/*
class Sutta {
    volume:string = ''
    sutta:number = 0
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
*/