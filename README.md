# Pali-index

Manually curated Index of English Translations of the Pali Canon.

The indexes are:
* [Comprehensive topical index](output/topics.txt)
* [Summary by Sutta](output/summary-by-sutta.txt)
* [List of Locations](output/list-of-locations.txt)
* [List of Major Topics](output/list-topics-major.txt)
* [List of Minor Topics](output/list-topics-minor.txt)

## Sources

Majjhima Nikaya translated by Bhikkhu Nanamoli and Bikkhu Bodhi

## Contact

I created the Kenyon Wauters pseudonym to work on this project.  I am
sometimes known as Beacon Ken.  Contact me at kenwauters@protonmail.com.

## Contributions

Contributions are welcome for content and code.  

When updating the indexes with new entries, run index.ts to update
the output and include the output in the PR.  In this repo we commit output for the
benefit of non-programmers who wish to use the index.

### Sutta Files 

Each sutta gets a file in `suttas`.  File extensions are csv.
The file is named after the volume and the
sutta numbers, so Majjhima Nikaya 1 is `mn-1.csv`.

See Sutta file `mn-1.csv` for comments on how to structure the files.

### TODO List Content

* Majjhima Nikaya complete index
* Digha Nikaya complete index
* (Doubtful Kenyon will do it) Angutarra Nikaya
* (Doubtful Kenyon will do it) Samyutta Nikaya

### TODO List Code

* Input validation and error reporting
* Pali typeface
* Pretty output with links between topics
* Links to online version of volumes
* The usual code refactoring and normalization
