
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

export class DiscourseMeta {
    constructor(
        public volume: string,
        public discourse: number,
        public location: string,
        public titleEnglish: string,
        public titlePali: string
    ){}
}

export class StockPhrase {
    constructor(
        public volume: string,
        public discourse: number,
        public topic: string,
        public verse: number
    ) {}
}