import simple from "./simple.js"
import fs from "fs"

let text = fs.readFileSync("./simple.txt", "utf8");

simple.parse(text);