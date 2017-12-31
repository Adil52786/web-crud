// @flow

import {
  contactService,
  postHandler,
  deleteAllHandler,
  deleteByIdHandler,
  getAllHandler,
  getByIdHandler,
  patchHandler
} from './contact-service';

const NOT_FOUND = 404;
const OK = 200;

describe('contact-service', () => {

  let req: express$Request, res: express$Response, result, statusCode;

  async function createContact(name: string, relationship: string): number {
    const contact = {name, relationship};
    req.body = JSON.stringify(contact);
    await postHandler(req, res);
    expect(statusCode).toBe(OK);
    const id = Number(result);
    return id;
  }

  beforeEach(async () => {
    req = {};
    res = {
      send(value) {
        result = value;
      },
      status(value) {
        statusCode = value;
        return this;
      }
    };
    await deleteAllHandler(req, res);
  });

  test('contactService', () => {
    const app: express$Application = {
      delete: jest.fn(),
      get: jest.fn(),
      patch: jest.fn(),
      post: jest.fn()
    };
    contactService(app);
    expect(app.delete).toBeCalledWith('/types/:id', deleteByIdHandler);
    expect(app.get).toBeCalledWith('/types', getAllHandler);
    expect(app.get).toBeCalledWith('/types/:id', getByIdHandler);
    expect(app.patch).toBeCalledWith('/types/:id', patchHandler);
    expect(app.post).toBeCalledWith('/types', postHandler);
  });

  test('postHandler', async () => {
    await createContact('Mark Volkmann', 'self');
    expect(statusCode).toBe(OK);
  });

  test('deleteByIdHandler', async () => {
    await createContact('Mark Volkmann', 'self');
    expect(statusCode).toBe(OK);
    const id = Number(result);

    req.params = {id};
    await deleteByIdHandler(req, res);
    expect(statusCode).toBe(OK);

    await getByIdHandler(req, res);
    expect(statusCode).toBe(NOT_FOUND);
  });

  test('getAllHandler', async () => {
    const name1 = 'Mark Volkmann';
    const relationship1 = 'self';
    await createContact(name1, relationship1);
    expect(statusCode).toBe(OK);
    const id1 = Number(result);

    const name2 = 'Tami Volkmann';
    const relationship2 = 'spouse';
    await createContact(name2, relationship2);
    expect(statusCode).toBe(OK);
    const id2 = Number(result);

    await getAllHandler(req, res);
    const contacts = JSON.parse(result);

    let contact = contacts.find(contact => contact.id === id1);
    expect(contact.name).toBe(name1);
    expect(contact.relationship).toBe(relationship1);

    contact = contacts.find(contact => contact.id === id2);
    expect(contact.name).toBe(name2);
    expect(contact.relationship).toBe(relationship2);
  });

  test('patchHandler', async () => {
    const name = 'Mark Volkmann';
    const relationship = 'self';
    await createContact(name, relationship);
    expect(statusCode).toBe(OK);
    const id = Number(result);

    req.params = {id};
    const newName = 'Richard Volkmann';
    req.body = JSON.stringify({name: newName});
    await patchHandler(req, res);
    expect(statusCode).toBe(OK);

    await getByIdHandler(req, res);
    expect(statusCode).toBe(OK);
    const contact = JSON.parse(result);
    expect(contact.name).toBe(newName);
    expect(contact.relationship).toBe(relationship);
  });
});
