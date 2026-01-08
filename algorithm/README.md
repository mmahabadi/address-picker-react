# Algorithm Solution

## How to Run

```bash
npm install
npm start
```

Or:
```bash
npx tsx solution.ts
```

## Output

Prints the number of paths from `you` to `out`:
```
there are 708 different paths leading from `you` to `out`.
```

## Problem

Find the number of all possible paths from device `you` to device `out` in a device network. Data only moves forward from a device to its outputs.

## Input Format

Reads from `input.txt`. Each line format:
```
device_name: output1 output2 output3 ...
```

Example:
```
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
eee: out
```

