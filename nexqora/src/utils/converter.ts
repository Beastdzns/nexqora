export default function convertArrayToNumbers(numbers:string[]) {
    var nums = numbers.map(function(str) {
    return parseInt(str); });

    return nums ?? [];
}

