// @flow

import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';

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

  async function createContact(
    name: string,
    relationship: string
  ): Promise<number> {
    const req = new MockExpressRequest();
    const res = new MockExpressResponse();
    const contact = {name, relationship};
    req.body = JSON.stringify(contact);

    await postHandler(req, res);
    expect(res.statusCode).toBe(OK);

    const id = Number(res._getString());
    return id;
  }

  beforeEach(async () => {
    const req = new MockExpressRequest();
    const res = new MockExpressResponse();
    // $FlowFixMe - not properly mocking express$Response
    await deleteAllHandler(req, res);
  });

  test('contactService', () => {
    // $FlowFixMe - not correctly mocking
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

  test('deleteByIdHandler', async () => {
    const id = await createContact('Mark Volkmann', 'self');

    const req = new MockExpressRequest();
    let res = new MockExpressResponse();
    req.params = {id};
    await deleteByIdHandler(req, res);
    expect(res.statusCode).toBe(OK);

    res = new MockExpressResponse();
    await getByIdHandler(req, res);
    expect(res.statusCode).toBe(NOT_FOUND);
  });

  test('getAllHandler', async () => {
    const name1 = 'Mark Volkmann';
    const relationship1 = 'self';
    const id1 = await createContact(name1, relationship1);

    const name2 = 'Tami Volkmann';
    const relationship2 = 'spouse';
    const id2 = await createContact(name2, relationship2);

    const req = new MockExpressRequest();
    const res = new MockExpressResponse();
    await getAllHandler(req, res);
    const contacts = res._getJSON();

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
    const id = await createContact(name, relationship);

    const req = new MockExpressRequest();
    let res = new MockExpressResponse();
    req.params = {id};
    const newName = 'Richard Volkmann';
    req.body = JSON.stringify({name: newName});
    await patchHandler(req, res);
    expect(res.statusCode).toBe(OK);

    res = new MockExpressResponse();
    await getByIdHandler(req, res);
    expect(res.statusCode).toBe(OK);
    const contact = res._getJSON();
    expect(contact.name).toBe(newName);
    expect(contact.relationship).toBe(relationship);
  });

  test('postHandler', async () => {
    await createContact('Mark Volkmann', 'self');
  });
});
