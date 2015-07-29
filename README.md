# json-schema-compose

Takes an input JSON Schema, reads in external JSON Schema ("`$ref`") references and produces a new self-contained JSON Schema with only internal references.

I built this to make the display of JSON Schema all in a single file for documentation purposes.

*Example:*

Given root schema file:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "rootExample",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "estimatedCompletionDate": {
      "$ref": "date-time.json#/definitions/dateTime"
    }
  }
}
```

And referenced file:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "date-time.json",
  "definitions": {
    "dateTime": {
      "title": "Date-Time",
      "type": "string",
      "format": "date-time"
    }
  }
}
```

`json-schema-compose` would output:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "http://devicestack.rackspace.com/schema/accepted.json",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "estimatedCompletionDate": {
      "$ref": "#/definitions/dateTime"
    }
  },
  "definitions": {
    "dateTime": {
      "title": "Date-Time",
      "type": "string",
      "format": "date-time"
    }
  }
}
```

## Caveats

This is currently kind of naive in implementation and expects that references have the following requirements (which could be though of as bugs).

1. Referenced schema should be referenced via a local directory (URL dereferencing is currently not implemented.)
2. Referenced schema should be structured with sub-schema under a `"definitions"` schema.
3. Referenced schema are imported to the definitions sub-schema of the root schema file. There is no checking to watch for naming conflicts.

## Command Line Usage

```bash
json-schema-compose [-s <schema-dir>] [--force] <root-schema> [<outfile>]
```

*ARGUMENTS*

* root-schema (required)
    - File containing the root schema for the composed output file.
    - File must contain JSON schema.
* outfile (optional)
    - File to write composed JSON Schema into.
    - Defaults to the root schema filename with "-full" appended to the base name.

*OPTIONS*

* `-s <path>`
    - Sets the path to look for additional schema files. Must be a directory.
    - Default is the directory of the `root-schema` file.
* `--force`
    - Overwrite `outfile` if it exists.

## Code Usage

```javascript
    var Schema = require('json-schema-compose').Schema;
    var schema = new Schema(require(rootSchema), schemaDir).compose();

    console.log(JSON.stringify(schema, null, '  '));
```

*Note:* the schemaDir must be a full path (as in `fs.realpath()`).
