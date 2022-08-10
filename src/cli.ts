import {Command} from "commander";
import {translate} from "./main";

const program = new Command();

program
  .version("0.0.1")
  .name("rendition")
  .usage("<English>")
  .arguments("<English>")
  .action(function (english) {
    console.log(english);
    translate(english);
  });
program.parse(process.argv);