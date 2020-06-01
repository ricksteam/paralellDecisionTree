
export default {
    extract: function (text) {
        //https://stackoverflow.com/questions/8125709/javascript-how-to-split-newline
        let lines = text.split(/\r?\n/);
        while (lines.length > 0 && !lines[0].trim().startsWith("1")) {
            lines.shift()
        }
        let toReturn = lines.filter(i => i.trim().length > 0);
        toReturn = toReturn.map(i => i.trimEnd())
        return toReturn;
    },
    parse: function (text) {
        let lines = this.extract(text);

        let root = {
            children: [],
            value: lines[0],
            index: 0,
            stop:lines.length,
            depth:0
        }

        this.buildChildren(root, lines);

        return root;
    },
    maxDepth(root){
        if(root.children.length == 0) return 1;
        return Math.max(1+this.maxDepth(root.children[0]), 1+this.maxDepth(root.children[1]))
    },
    buildChildren(parent, lines) {
        //Get the number of whitespace characters at the beginning of the string
        //https://stackoverflow.com/questions/25823914/javascript-count-spaces-before-first-character-of-a-string
        let indent = parent.value.search(/\)|$/);
        let relevantLines = lines.slice(parent.index+1, parent.stop);
        //console.log(parent.index)
        let firstIndex = relevantLines.findIndex(i => i.search(/\)|$/) == indent + 2);
        let secondIndex = relevantLines.slice(firstIndex+1).findIndex(i => i.search(/\)|$/) == indent + 2);
         if (firstIndex != -1 && secondIndex != -1) {
            firstIndex += parent.index + 1;
            //console.log(firstIndex);

            secondIndex += firstIndex + 1;

            //console.log(secondIndex);

            let firstChild = {
                children: [],
                value: lines[firstIndex],
                index: firstIndex,
                stop:secondIndex,
                depth:parent.depth+1
            }

            let secondChild = {
                children: [],
                value: lines[secondIndex],
                index: secondIndex,
                stop: parent.stop,
                depth:parent.depth+1
            }

            parent.children.push(firstChild);
            parent.children.push(secondChild);

            this.buildChildren(firstChild, lines);
            this.buildChildren(secondChild, lines);
        }


    }

}