// timers -> pending callbacks -> idle, prepare -> poll -> check -> close callback

const fs = require("fs");
const crypto = require("crypto");

console.log("1. script start");

setTimeout(() => {
  console.log("2. settimeout 0s callback (macrotask)");
}, 0);

setTimeout(() => {
  console.log("3. settimeout 0s callback (macrotask)");
}, 0);

setImmediate(() => {
  console.log("4. setImmediate callback (check)");
});

Promise.resolve().then(() => {
  console.log("5. Promise resolved (microtask)");
});

process.nextTick(() => {
  console.log("6. process.nexttick callback (microtask)");
});

fs.readFile(__filename, () => {
  console.log("7. file read operation (I/O callback)");
});

crypto.pbkdf2("secret", "salt", 10000, 64, "sha512", (err, key) => {
  if (err) throw err;
  console.log("8. pbkdf2 operation completed (CPU intensive task)");
});

console.log("9. script ends");

/**
 * Execution Order:
 --------------------
Given the event loop phases and microtasks, the detailed execution order is:

Synchronous Code:

    1. script start
    9. script ends

Microtasks:

    6. process.nexttick callback (microtask)
    5. Promise resolved (microtask)

Timers Phase:

    2. settimeout 0s callback (macrotask)
    3. settimeout 0s callback (macrotask)

Check Phase:

    4. setImmediate callback (check)

Poll Phase:

    7. file read operation (I/O callback) (runs when file read completes)

Completion of CPU-Intensive Task:

    8. pbkdf2 operation completed (CPU intensive task) (runs when the task completes)

So, the final printed order will be:

    1. script start
    9. script ends
    6. process.nexttick callback (microtask)
    5. Promise resolved (microtask)
    2. settimeout 0s callback (macrotask)
    3. settimeout 0s callback (macrotask)
    4. setImmediate callback (check)
    7. file read operation (I/O callback)
    8. pbkdf2 operation completed (CPU intensive task)
 */
