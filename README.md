json-clean
==========
A command line interface tool for removing characters, such as the byte order mark (BOM) from a json file.

The input file is read into memory, manipulated then the contents of the file is replaced with the cleansed JSON version, assuming
there were no errors.

**This is a destructive process**. I recommend using with files that are under source control as results could be unpredictable.
 
See help for usage instructions.



Install
-------
```
   npm install --global json-clean
```


Commands
--------

To see all the options and commands available, use help.
```
    json-clean --help
```

```
    Usage: json-clean [options] <file ...>

    -h, --help                  output usage information
    -V, --version               output the version number
    -e, --on-error-resume-next  continue whenever an error is encountered
    -r, --remove [value]        remove only these characters e.g. [0xFFFD, 0xFFFE]
    -s, --silent                suppress command line output
    -y, --encoding              file format encoding. Default = 'utf-8'
    -c, --check                 do a dry run without changing any files
```


Example
-------

Basic usage with default settings:-
```
    json-clean my-file.json
```

Example specifying the characters to remove using a glob to match multiple json files

```
    json-clean --remove "[0xFFFF, 0xFFFE, 0, 0xFFFD]" --on-error-resume-next ./json-files-dir/**/*.json
```