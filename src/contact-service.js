// @flow

const MySqlConnection = require('mysql-easier');

const {errorHandler} = require('./util/error-util');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'web_crud'
};
const mySql = new MySqlConnection(dbConfig);

const tableName = 'contact';
const NOT_FOUND = 404;
const OK = 200;

function contactService(app: express$Application): void {
  const URL_PREFIX = '/contacts';

  app.delete(URL_PREFIX + '/:id', deleteByIdHandler);
  app.get(URL_PREFIX, getAllHandler);
  app.get(URL_PREFIX + '/:id', getByIdHandler);
  app.patch(URL_PREFIX + '/:id', patchHandler);
  app.post(URL_PREFIX, postHandler);
}

async function deleteAllHandler(
  req: express$Request,
  res: express$Response
): Promise<void> {
  try {
    await mySql.deleteAll(tableName);
    res.status(OK).send();
  } catch (e) {
    // istanbul ignore next
    errorHandler(res, e);
  }
}

async function deleteByIdHandler(
  req: express$Request,
  res: express$Response
): Promise<void> {
  const {id} = req.params;
  try {
    const {affectedRows} = await mySql.deleteById(tableName, id);
    res.status(OK).send(String(affectedRows));
  } catch (e) {
    // istanbul ignore next
    errorHandler(res, e);
  }
}

async function getAllHandler(
  req: express$Request,
  res: express$Response
): Promise<void> {
  try {
    const rows = await mySql.getAll(tableName);
    res.status(OK).send(JSON.stringify(rows));
  } catch (e) {
    // istanbul ignore next
    errorHandler(res, e);
  }
}

async function getByIdHandler(
  req: express$Request,
  res: express$Response
): Promise<void> {
  const {id} = req.params;
  try {
    const type = await mySql.getById(tableName, id);
    res.status(type ? OK : NOT_FOUND).send(JSON.stringify(type));
  } catch (e) {
    // istanbul ignore next
    errorHandler(res, e);
  }
}

async function patchHandler(
  req: express$Request,
  res: express$Response
): Promise<void> {
  const {id} = req.params;
  const changes = JSON.parse(req.body);
  try {
    const type = await mySql.getById(tableName, id);
    const newType = {...type, ...changes};
    const {changedRows} = await mySql.updateById(tableName, id, newType);
    res.status(changedRows ? 200 : 500).send(JSON.stringify(newType));
  } catch (e) {
    // istanbul ignore next
    errorHandler(res, e);
  }
}

async function postHandler(
  req: express$Request,
  res: express$Response
): Promise<void> {
  try {
    const obj = JSON.parse(req.body);
    const id = await mySql.insert(tableName, obj);
    res.set('Content-Type', 'text/plain');
    res.status(OK).send(String(id));
  } catch (e) {
    // istanbul ignore next
    errorHandler(res, e);
  }
}

// Handlers are being exported so they can be accessed from tests.
module.exports = {
  contactService,
  postHandler,
  deleteAllHandler,
  deleteByIdHandler,
  getAllHandler,
  getByIdHandler,
  patchHandler
};
