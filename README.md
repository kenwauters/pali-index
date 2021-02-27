# Pali-index

Manually curated Index of English Translations of the Pali Canon.

Premise: Siddhatta Gotoma, whom we call The Buddha, presented his teachings (Dhamma)
as structured prose that lends itself easily to a manually curated index.  The 
topics are so consistent across suttas that a machine-derived index is likely to
obscure more than it illuminates.

The indexes are:
* [List of Major Topics](output/MajorTopics.md): A major topic is one that spans multiple
  verses and is explained with specific examples in each verse.
* [List of Minor Topics](output/MinorTopics.md): A minor topic is an illustrative example, often
  in a list of other minor topics, to illustrate a major topic.
* [List of Locations](output/Locations.md)

## Sources

Majjhima Nikaya translated by Bhikkhu Nanamoli and Bikkhu Bodhi

## Contact

I created the Kenyon Wauters pseudonym to work on this project.  I am
sometimes known as Beacon Ken.  Contact me at kenwauters@protonmail.com.

## Contributions

Contributions are welcome for content and code.  

When updating the indexes with new entries, run `ts-node ./index.ts` to update
the output and include the output in the PR.  In this repo we commit output for the
benefit of non-programmers who wish to use the index.

### Input Files

Each discourse gets multiple files in `input`.  

All files allow comment lines starting with '#' and blank lines.  Every other
line is considered data and the code will try to parse it.

File names are `<volume>-<discourse>.['meta'|'minor'|'major'].csv`.

Meta files have only two meaningful lines, a "location: ..." line and a
"title: ..." line.  The title should list the Pali title, a comma, and the
English title.

Major topic files contain data lines form `<verseBegin>-<verseEnd>:<topic>`.  

Minor topic files contain simple lines of form `<verse>:<topic>`.  Minor topic
files can list multiple verses and topics on a line, which is often necessary
because minor topics are referenced several times within a discourse.  So
a minor topic file can have lines like `<verse>,<verse>:<topic>,<topic>`. 


### TODO List Content

* Majjhima Nikaya complete index
* Digha Nikaya complete index
* (Doubtful Kenyon will do it) Angutarra Nikaya
* (Doubtful Kenyon will do it) Samyutta Nikaya

### TODO List Code

* Input validation and error reporting
* Pali typeface
* Links to online version of volumes
