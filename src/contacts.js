// @flow

import './contacts.css';

type ContactType = {
  id?: number,
  name: string,
  relationship: string
};

const OK = 200;
const URL_PREFIX = 'http://localhost:3000/contacts';

let addButton: HTMLButtonElement;
let nameInput: HTMLInputElement;
let relationshipInput: HTMLInputElement;
let table: HTMLTableElement;

let document: Document;
let name: string;
let relationship: string;
const contacts: {[id: number]: ContactType} = {};

async function addContact(): Promise<void> {
  const contact: ContactType = {name, relationship};

  const url = URL_PREFIX;
  const options = {method: 'POST', body: JSON.stringify(contact)};
  const res = await fetch(url, options);
  if (res.status !== OK) {
    handleError(res);
    return;
  }

  const id = await Number(res.text());
  console.log('contacts.js addContact: id =', id);
  contact.id = id;
  contacts[id] = contact;

  const tr = document.createElement('tr');
  tr.id = 'contact-' + id;

  let td = document.createElement('td');
  td.textContent = name;
  tr.appendChild(td);

  td = document.createElement('td');
  td.textContent = relationship;
  tr.appendChild(td);

  td = document.createElement('td');
  const span = document.createElement('span');
  span.className = 'fa fa-trash';
  span.onclick = deleteContact.bind(null, id);
  td.appendChild(span);
  tr.appendChild(td);

  table.appendChild(tr);
}

async function deleteContact(id: number): Promise<void> {
  const url = URL_PREFIX + '/' + id;
  const options = {method: 'DELETE'};
  const res = await fetch(url, options);
  if (res.status !== OK) {
    handleError(res);
    return;
  }

  delete contacts[id];
  const tr = document.getElementById('contact-' + id);
  if (tr) {
    const parent = tr.parentNode;
    if (parent) parent.removeChild(tr);
  }
}


function getButtonElement(id) {
  return ((document.getElementById(id): any): HTMLButtonElement);
}

function getInputElement(id) {
  return ((document.getElementById(id): any): HTMLInputElement);
}

function getTableElement(id) {
  return ((document.getElementById(id): any): HTMLTableElement);
}

export function handleAdd(
  nameInput: HTMLInputElement,
  event: Event
): void {
  event.preventDefault();
  addContact();
}

export function handleInput(): void {
  name = nameInput.value;
  relationship = relationshipInput.value;
  addButton.disabled = name.length === 0 || relationship.length === 0;
}

function handleError(res) {
  console.log('contacts.js handleError: status =', res.status);
}

export function onLoad(doc: Document) {
  document = doc;

  nameInput = getInputElement('name-input');
  relationshipInput = getInputElement('relationship-input');
  addButton = getButtonElement('add-button');
  table = getTableElement('contact-table');

  if (!nameInput) throw new Error('name-input not found');
  if (!relationshipInput) throw new Error('relationship-input not found');
  if (!addButton) throw new Error('addButton not found');

  nameInput.onkeyup = handleInput;
  relationshipInput.onkeyup = handleInput;
  addButton.onclick = handleAdd.bind(null, nameInput);
}
