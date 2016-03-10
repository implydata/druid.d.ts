# TypeScript definitions for the Druid API

For people who like all their types in order.

This ambient type definition was written as part of [Plywood](https://github.com/implydata/plywood) but was extracted as it can be of use in any TypeScript based project that deals with Druid queries.

## Usage

1. Copy the file `druid/druid.d.ts` into your project.

2. Refer to it using: `/// <reference path="path/to/file/druid.d.ts" />`

3. Use the types defined within the `Druid` module.

## Note

These definitions use union and string types and thus requires TypeScript >= 1.8
