export function filterLines(line:string) {
    return !line.trim().startsWith('#') && line.trim().length > 0
}

export function inputType(input:string, match:string) {
    return input.split('.')[1] === match;
}

export function inputVolumeDiscourse(input): [ string, number ] {
    const [ volume, discource ] = input.split('.')[0].split('-')
    return [ volume, parseInt(discource) ]
}

export function linkInside(text:string) {
    return `[${text}](#${text.replace(/\s/g,'-')})`;
}