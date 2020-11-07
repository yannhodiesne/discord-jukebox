class Semaphore {
    constructor(max) {
        let counter = 0;
        const waiting = [];

        const take = () => {
            if (waiting.length > 0 && counter < max) {
                counter++;
                let promise = waiting.shift();
                promise();
            }
        };

        const acquire = () => {
            if (counter < max) {
                counter++;
                return new Promise(resolve => resolve());
            }
            else
                return new Promise(resolve => waiting.push(resolve));
        };

        const release = () => {
            counter--;
            take();
        };

        this.with = async (callback) => {
            await acquire();

            try {
                return await callback();
            }
            finally {
                release();
            }
        };
    }
}

module.exports = {
    Semaphore
};
