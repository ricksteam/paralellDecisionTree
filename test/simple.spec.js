import chai from "chai";
const expect = chai.expect;
import fs from "fs";

import simple from "../simple.js";

let testFileText = fs.readFileSync("./test/test.txt", "utf8");

describe("Parsing data", function () {
    this.timeout(0);
    let extracted = simple.extract(testFileText);
    describe("Extracting lines from the output of r", function () {

        it("Removes the header information", function () {
            expect(extracted).to.be.an('array');
        });
        it("Trims tailing whitespace", function () {
            expect(extracted[0]).to.equal(" 1) root 32 1126.047000 20.09062");
        });
        it("Removes lines that are only whitespace", function () {
            expect(extracted[extracted.length - 1]).to.equal("     7) qsec>=19.185 2    1.125000 33.15000 *");
        })
    })
    describe("It builds a tree object", function () {
        it("Has a root with the correct values", function () {
            let root = simple.parse(testFileText);
            expect(root.index).to.equal(0);
            expect(root.value).to.equal(" 1) root 32 1126.047000 20.09062")
            
        })
        it("Has a root with two children", function () {
            let root = simple.parse(testFileText);
            expect(root.children.length).to.equal(2);
            expect(root.children[0].index).to.equal(1);
            expect(root.children[1].index).to.equal(12);
            expect(root.children[0].value).to.equal("   2) wt>=2.26 26  346.566500 17.78846");
            expect(root.children[1].value).to.equal("   3) wt< 2.26 6   44.553330 30.06667");


        })
        it("Descends correctly", function () {
            let root = simple.parse(testFileText);
            expect(root.children[0].children.length).to.equal(2);//2
            expect(root.children[0].children[0].children.length).to.equal(2);//4
            expect(root.children[0].children[0].children[0].children.length).to.equal(0);//8
            expect(root.children[0].children[0].children[1].children.length).to.equal(2);//9
            expect(root.children[0].children[0].children[1].children[0].children.length).to.equal(0);//18
            expect(root.children[0].children[0].children[1].children[1].children.length).to.equal(2);//19
            expect(root.children[0].children[0].children[1].children[1].children[0].children.length).to.equal(0);//38
            expect(root.children[0].children[0].children[1].children[1].children[1].children.length).to.equal(0);//39            
            expect(root.children[0].children[1].children.length).to.equal(2);//5
            expect(root.children[0].children[1].children[0].children.length).to.equal(0);//10
            expect(root.children[0].children[1].children[1].children.length).to.equal(0);//11
            expect(root.children[1].children.length).to.equal(2);//3
            expect(root.children[1].children[0].children.length).to.equal(0);//6
            expect(root.children[1].children[1].children.length).to.equal(0);//7

        })
        it("Calculates depth correctly", function () {
            let root = simple.parse(testFileText);
            expect(root.depth).to.equal(0);
            expect(root.children[0].depth).to.equal(1);//2
            expect(root.children[0].children[0].depth).to.equal(2);//4
            expect(root.children[0].children[0].children[0].depth).to.equal(3);//8
            expect(root.children[0].children[0].children[1].depth).to.equal(3);//9
            expect(root.children[0].children[0].children[1].children[0].depth).to.equal(4);//18
            expect(root.children[0].children[0].children[1].children[1].depth).to.equal(4);//19
            expect(root.children[0].children[0].children[1].children[1].children[0].depth).to.equal(5);//38
            expect(root.children[0].children[0].children[1].children[1].children[1].depth).to.equal(5);//39            
            expect(root.children[0].children[1].depth).to.equal(2);//5
            expect(root.children[0].children[1].children[0].depth).to.equal(3);//10
            expect(root.children[0].children[1].children[1].depth).to.equal(3);//11
            expect(root.children[1].depth).to.equal(1);//3
            expect(root.children[1].children[0].depth).to.equal(2);//6
            expect(root.children[1].children[1].depth).to.equal(2);//7

        })
        it("Calculates a max depth", function(){
            let root = simple.parse(testFileText);
            let maxDepth = simple.maxDepth(root);
            expect(maxDepth).to.equal(6);
        })
    })

})
