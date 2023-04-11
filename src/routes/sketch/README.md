# Goal
Create a dx workflow that doesn't require copy + paste to the mm-media builder.

# Setup

- create symlink to `sketches` folder in `mm-media/src/sketches`
- create symlink to `lib` folder in `mm-media/src/lib`

# Usage

- sketches must be in the `src/routes/sketch/sketches` folder
- load a sketch via `http://localhost:5173/sketch/<filename>`
- the `<filename>` url parameter can receive a path with the `/` forward slash encoded as `%2F` to traverse nested folders

# Notes

- mm-media builder via `npm run build:js` requires that files end in `.sketch.js`
- `src/routes/sketch/sketches` is ignored in this repo
- `src/routes/sketch/lib` is ignored in this repo
