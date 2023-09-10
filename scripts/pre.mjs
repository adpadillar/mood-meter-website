import fs from "fs";

var files = fs.readdirSync("public").filter((file) => {
  return file.endsWith(".mp3");
});

const json = JSON.stringify({ files: files });

// create src/songs/songs.json if it doesn't exist

if (!fs.existsSync("src/songs")) {
  fs.mkdirSync("src/songs");
}

fs.writeFileSync("src/songs/songs.json", json);
