const { atomicRun } = require('./atomic');

const queue = new Map();

const getQueue = async (key) => await atomicRun(key, () => queue.get(key));

const setQueue = async (key, value) => await atomicRun(key, () => queue.set(key, value));

const deleteQueue = async (key) => await atomicRun(key, () => queue.delete(key));

module.exports = {
    getQueue,
    setQueue,
    deleteQueue
};
