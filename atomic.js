const { Semaphore } = require('./utils/semaphore');

const semaphores = new Map();

const atomicRun = async (key, operation) => {
    if (!semaphores.has(key))
        semaphores.set(key, new Semaphore(1));

    let semaphore = semaphores.get(key);

    return await semaphore.with(operation);
};

module.exports = {
    atomicRun
};
