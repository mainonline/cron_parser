/* Cron Expression Parser (primitive solution) */
/* before compiling this program please read README.txt file */

const argsMap = [
    {
        title: "minute",
        range: [0, 59],
    },
    {
        title: "hour",
        range: [0, 23],
    },
    {
        title: "day of month",
        range: [1, 31],
    },
    {
        title: "month",
        range: [1, 12],
    },
    {
        title: "day of week",
        range: [1, 7],
    },
    {
        title: "command"
    }
];

// takes start, end, range, and step values of argument and returns array of integers
const helper = (start, end, range = [], step = 1) => {
    start = Number(start);
    end = Number(end);
    step = Number(step);
    if (start > end) throw new Error(`Non standard cron argument range!`);
    const [min, max] = range;
    const helperResult = [];
    let current = start;
    while (current <= end) {
        if ((min != null && current < min) ||
            (max != null && current > max)) {
            throw new Error(`Invalid range!`);
        }
        helperResult.push(current);
        current += step;
    }
    return helperResult;
};

// takes each part of argument and returns array of integers
const parser = (argIndex, arg) => {
    const exportValue = [];
    const elValue = Number(arg);
    if (arg.includes('-') && arg.includes('/'))
    {
        const [left, step] = arg.split('/');
        const [start, end] = left.split('-');
        const tempStep = Number(step);
        exportValue.push(...helper(start, end, argsMap[argIndex].range, tempStep));
    }
    else if (arg.includes('-'))
    {
        const [start, end] = arg.split('-');
        exportValue.push(...helper(start, end, argsMap[argIndex].range));
    }
    else if (arg.includes('/'))
    {
        const [left, step] = arg.split('/');
        if (left === '*') {
            const [start, end] = argsMap[argIndex].range;
            exportValue.push(...helper(start, end, argsMap[argIndex].range, step));
        } else {
            const [, end] = argsMap[argIndex].range;
            exportValue.push(...helper(left, end, argsMap[argIndex].range, step));
        }
    }
    else if (arg === '*')
    {
        const [start, end] = argsMap[argIndex].range;
        exportValue.push(...helper(start, end));
    }
    else if (!isNaN(elValue))
    {
        const [min, max] = argsMap[argIndex].range;
        if (elValue < min || elValue > max) {
            throw new Error(`${argsMap[argIndex].title}: ${arg} out of range value!`);
        }
        exportValue.push(elValue);
    }
    else if (argsMap[argIndex].title === 'day of month' && arg === '?' ||
            argsMap[argIndex].title === 'day of week' && arg === '?')
    {
        return [];
    }
    else
    {
        throw new Error(`Cron arguments not valid!`);
    }
    return exportValue;
}

// if argument includes comma character then divide it into parts and call parser for each of them
const parseController = (argIdx, str) => {
    let tempResult = [];
    if (str.includes(','))
    {
        const parts = str.split(',');
        for (let i = 0; i < parts.length; i++) {
            tempResult.push(...parser(argIdx, parts[i]));
        }
    } else {
        tempResult.push(...parser(argIdx, str));
    }
    const sortedResult = tempResult.sort((a, b) => a - b);
    return sortedResult.filter((x, y) => sortedResult.indexOf(x) === y);
}

// calls parsing controller function for each cron argument separately and push into result array
const callParser = (arr) => {
    if (arr.length === 6) {
        let result = [];
        const command = arr.pop();
        for (let i = 0; i < arr.length; i++) {
            result.push(`${argsMap[i].title} ${parseController(i, arr[i])}`);
        }
        result.push(`${argsMap[5].title} ${command}`);
        return result.join('\n');
    } else {
        throw new Error(`Invalid number of arguments!`);
    }
}


const tempArgsStr = process.argv.slice(2).join();
const tempArguments = tempArgsStr.split(' ');

// when calling test file, default cron arguments must be provided
const cronArgSample = ['5','11-22', '10-28', '1-9', '*/2', '/usr/bin/find'];
const expression = process.argv.slice(2).length > 0
    ? callParser(tempArguments)
    : callParser(cronArgSample);
console.log(expression)

// export functions
module.exports = {helper, parser, parseController, callParser };