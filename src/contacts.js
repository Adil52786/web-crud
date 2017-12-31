// @flow

let addButton: HTMLButtonElement;
let nameInput: HTMLInputElement;
let relationshipInput: HTMLInputElement;
let table: HTMLTableElement;

let document: Document;

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
  //messageDiv.textContent = getGreeting(nameInput.value);
}

export function handleInput(): void {
  const name = nameInput.value;
  const relationship = relationshipInput.value;
  addButton.disabled = name.length === 0 || relationship.length === 0;
}

export function onLoad(doc: Document) {
  document = doc;

  nameInput = getInputElement('name-input');
  relationshipInput = getInputElement('relationship-input');
  addButton = getButtonElement('add-button');
  table = getTableElement('contact-table');
  console.log('contacts.js onLoad: table =', table);

  if (!nameInput) throw new Error('name-input not found');
  if (!relationshipInput) throw new Error('relationship-input not found');
  if (!addButton) throw new Error('addButton not found');

  nameInput.onkeyup = handleInput();
  relationshipInput.onkeyup = handleInput();
  addButton.onclick = handleAdd.bind(null, nameInput);
}
