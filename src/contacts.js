// @flow

import './contacts.css';

type ContactType = {
  id: number,
  name: string,
  relationship: string
};

const OK = 200;
const URL_PREFIX = 'http://localhost:3000/contacts';
const contacts: {[id: number]: ContactType} = {};

let addButton: HTMLButtonElement;
let nameInput: HTMLInputElement;
let relationshipInput: HTMLInputElement;
let table: HTMLTableElement;

let document: Document;
let name: string;
let relationship: string;

function addContact(contact: ContactType): void {
  if (!contact.id) return;

  const tr = document.createElement('tr');
  tr.id = `contact-${contact.id}`;

  let td = document.createElement('td');
  td.textContent = contact.name;
  tr.appendChild(td);

  td = document.createElement('td');
  td.textContent = contact.relationship;
  tr.appendChild(td);

  td = document.createElement('td');
  const span = document.createElement('span');
  span.className = 'fa fa-trash';
  span.onclick = deleteContact.bind(null, contact.id);
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

export async function handleAdd(
  nameInput: HTMLInputElement,
  event: Event
): Promise<void> {
  event.preventDefault();
  const contact = await saveContact();
  if (contact) {
    addContact(contact);
    nameInput.value = '';
    relationshipInput.value = '';
    nameInput.focus();
  }
}

export function handleInput(): void {
  name = nameInput.value;
  relationship = relationshipInput.value;
  addButton.disabled = name.length === 0 || relationship.length === 0;
}

async function handleError(res) {
  //TODO: Add better error handling that displays message in UI.
  const msg = await res.text();
  console.error('contacts.js handleError:', msg);
}

async function loadContacts() {
  const url = URL_PREFIX;
  const res = await fetch(url);
  const contactArr = await res.json();

  contactArr.sort((c1, c2) => c1.name.localeCompare(c2.name));

  for (const contact of contactArr) {
    contacts[contact.id] = contact;
    addContact(contact);
  }
}

export async function onLoad(doc: Document) {
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

  nameInput.focus();
  await loadContacts();
}

async function saveContact(): Promise<?ContactType> {
  const options = {method: 'post', body: JSON.stringify({name, relationship})};
  const res = await fetch(URL_PREFIX, options);
  if (res.status !== OK) {
    handleError(res);
    return null;
  }

  const text = await res.text();
  const id = Number(text);
  const contact: ContactType = {id, name, relationship};
  contacts[id] = contact;
  return contact;
}
