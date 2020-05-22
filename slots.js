function getLabels(data) {
    let labels = [];
    labels.push("header");
    labels.push("header");
    labels.push("header");
    labels.push("variable");
    for (let inc = 4; inc < data[0].length; inc++) {
        labels.push("unknown");
    }
    //Figure out the type of each column by scanning each
    //row for non-empty cells
    //Find next &

    for (let row = 0; row < data.length && labels.includes("unknown"); row++) {
        for (let inc = 0; inc < data[row].length; inc++) {
            if (labels[inc] != "unknown") continue;

            let string = data[row][inc].trim();

            if (string == "") continue;
            if (string != "&") labels[inc] = "variable_data"
            else {
                labels[inc] = "separator";
                labels[inc + 1] = "variable";
            }
        }

    }
    return labels;
}

function getVariables(data, labels) {
    let variables = [];
    for (let col = 0; col < data[0].length; col++) {
        if (labels[col] == "variable") {
            for (let row = 0; row < data.length; row++) {
                let string = data[row][col].trim();
                if (string != "") {
                    variables.push({
                        name: string,
                        col,

                    });
                    break;
                }
            }
        }
    }

    for (let i = 0; i < variables.length - 1; i++) {
        let variable = variables[i];
        variable.stop = variables[i + 1].col - 1;
        variable.len = variable.stop - variable.col;
    }
    let last = variables.slice(-1)[0];
    last.stop = data[0].length;
    last.len = last.stop - last.col;

    for (let i = 0; i < variables.length; i++) {
        let variable = variables[i];
        variable.support = [];
        variable.rows = [];
        for (let col = variable.col + 1; col < variable.stop; col++) {
            variable.support.push([]);
        }
        for (let col = variable.col + 1; col < variable.stop; col++) {
            let index = col - (variable.col + 1);
            for (let row = 0; row < data.length; row++) {
                let string = data[row][col].trim();
                if (string != "to" && string != "is" && string != "<" && string != ">" && string != "<=" && string != ">=" && isNaN(string))
                    console.log(string);
                if (string != "") {
                    if (!variable.rows.includes(row))
                        variable.rows.push(row);
                    if (!variable.support[index].includes(string))
                        variable.support[index].push(string)
                }
            }
        }
    }

    for (let i = 0; i < variables.length; i++) {
        let variable = variables[i];
        variable.min = Number.MAX_VALUE;
        variable.max = -Number.MAX_VALUE;
        variable.allNumbers = [];
        for (let x = 1; x < variable.support.length; x += 2) {
            for (let j = 0; j < variable.support[x].length; j++) {
                let number = parseFloat(variable.support[x][j]);
                if (number < variable.min) variable.min = number;
                if (number > variable.max) variable.max = number;
                if (!variable.allNumbers.includes(number)) variable.allNumbers.push(number);
            }
        }
        variable.marginNumbers = [...variable.allNumbers];
        variable.marginNumbers.push(variable.min - 1);
        variable.marginNumbers.push(variable.max + 1);
        variable.marginMin = variable.min - 1;
        variable.marginMax = variable.max + 1;

    }
    variables.forEach(v => v.marginNumbers = v.marginNumbers.sort());

    return variables;

}

function getSlots(data, labels, variables){
    let slots = [];
    for (let v = 0; v < variables.length; v++) {
        let variable = variables[v];
        let toAdd = [];
        for (let i = 0; i < variable.marginNumbers.length - 1; i++) {
            toAdd.push(
                {
                    name: variable.name,
                    min: variable.marginNumbers[i],
                    max: variable.marginNumbers[i + 1],
                    rows: []
                });
        }
        slots.push(toAdd);

    }

    for (let r = 0; r < data.length; r++) {
        let row = data[r];
        for (let v = 0; v < variables.length; v++) {
            let variable = variables[v];
            if (!variable.rows.includes(r)) continue;
            let min = variable.marginMin;
            let max = variable.marginMax;

            let one, two;
            let baseString = row[variable.col + 1].trim();
            let first = parseFloat(row[variable.col + 2]);
            if (variable.len == 5) {
                let second = parseFloat(row[variable.col + 4]);

                if (baseString == "<") {
                    one = min;
                    two = first;
                }
                else if (baseString == ">=") {
                    one = second;
                    two = max;

                }
                else if (baseString == "is") {
                    one = first
                    two = second;
                }
                else console.error("Error in base string 5")
            }
            else if (variable.len == 3) {
                if (baseString == "<") {
                    one = min;
                    two = first;
                }
                else if (baseString == ">=") {
                    one = first;
                    two = max;
                }
                else console.error("Error in base string 3")

            }
            else console.error("Error, bad variable length.")

            //Now update the slots appropriately.
            let slot = slots[v];
            for (let i = 0; i < slot.length; i++) {
                let cell = slot[i];
                if (one <= cell.min && two >= cell.max)
                    cell.rows.push(r);
            }
        }

    }
    return slots;
}

export { getLabels, getVariables, getSlots };