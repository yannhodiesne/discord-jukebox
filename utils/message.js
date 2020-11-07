const line = (content) => `> ${content}\n`;

const message = (icon, content) => line(`:${icon}:  ${content}`);

const info = (content) => message('information_source', content);

const error = (content) => message('x', content);

module.exports = {
    line,
    message,
    info,
    error
};
