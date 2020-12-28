# Pali-index

Manually curated Index of English Translations of the Pali Canon.


## Contributions

Contributions are welcome for content and code.  

When updating the indexes with new entries, run index.js to update
the output and include the output in the PR.  In this repo we commit output for the
benefit of non-programmers who wish to use the index.

At present the code is in Javascript, not Typescript, because the data structures
are fairly simple.

### Sutta Files 

Each sutta gets a file in `suttas`.  File extensions are csv.
The file is named after the volume and the
sutta numbers, so Majjhima Nikaya 1 is `mn-1.csv`.

Sutta files can contain comment lines that begin with `#`.
A line not beginning with a number or `#` sign will throw an error.
Blank lines are ignored.

Each data line begins with one or more verse specifiers followed by
one or more topics.  The verse specifier may be a single verse or a range
as in `1-9` or `74-99`.

Verse zero is a magic number for the sutta title.  The Pali spelling
comes first, then the English version.

Topics are literal.  To enter a topic more than once, it must be
typed in exactly the same each time - any spelling differences will
create multiple topics.

