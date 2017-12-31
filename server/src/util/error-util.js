// @flow

const inTest = process.env.NODE_ENV === 'test';

// istanbul ignore next
function errorHandler(res: express$Response, error: string): void {
  const msg = `${error}`;
  logError(msg);
  res.status(500).send(msg);
  throw new Error(msg);
}

function logError(msg: string): void {
  // istanbul ignore next
  if (!inTest) console.trace();
  // istanbul ignore next
  if (!inTest) console.error(msg);
}

module.exports = {errorHandler, logError};
