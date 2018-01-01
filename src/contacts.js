// @flow

import './contacts.css';

let addButton: HTMLButtonElement;
let nameInput: HTMLInputElement;
let relationshipInput: HTMLInputElement;
let table: HTMLTableElement;

let document: Document;
let name: string;
let relationship: string;
const contacts = {};

function addContact(): void {
  const id = contacts.length + 1;
  const contact = {id, name, relationship};
  contacts[id] = contact;

  const tr = document.createElement('tr');
  tr.id = String(id);

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

function deleteContact(id: string): void {
  delete contacts[id];
  const tr = document.getElementById(id);
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
