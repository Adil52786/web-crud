// @flow

import {addReducer} from 'redux-easy';

import type {
  AddNodePayloadType,
  ModalType,
  NodeMapType,
  NodeType,
  SaveNodePayloadType,
  StateType
} from './types';

function setTopProp(state: StateType, prop: string, value: mixed): StateType {
  return {...state, [prop]: value};
}

function setUiProp(state: StateType, prop: string, value: mixed): StateType {
  const {ui} = state;
  return {...state, ui: {...ui, [prop]: value}};
}

function setUserProp(
  state: StateType,
  prop: string,
  value: number | string
): StateType {
  const {user} = state;
  return {...state, user: {...user, [prop]: value}};
}

function validateNewName(nodeMap: NodeMapType, parentId: number, name: string) {
  if (!parentId) return; // don't need to do anything for root nodes

  if (!name) throw new Error('new nodes must have a name');

  const parentNode = nodeMap[parentId];
  if (!parentNode) return;

  const {children} = parentNode;
  if (children.find(id => nodeMap[id].name === name)) {
    throw new Error(`duplicate child name "${name}"`);
  }
}

addReducer(
  'addNode',
  (state: StateType, payload: AddNodePayloadType): StateType => {
    const {id, name, parentId} = payload;
    const {nodeMap} = state;

    validateNewName(nodeMap, parentId, name);

    // nodeMap is immutable, so make a copy that can be modified.
    const newNodeMap = {...nodeMap};

    // Create the new node.
    const newNode: NodeType = {
      id,
      children: [],
      name,
      parentId
    };

    newNodeMap[id] = newNode;
    if (parentId) {
      const parentNode = nodeMap[parentId];

      // parentNode is immutable, so make a copy that can be modified.
      const newParentNode = {...parentNode, children: [...parentNode.children]};

      newNodeMap[parentId] = newParentNode;
      newParentNode.children.push(id);
    }

    return {...state, nodeMap: newNodeMap};
  }
);

addReducer(
  'deleteNode',
  (state: StateType, targetNode: NodeType): StateType => {
    const {id, parentId} = targetNode;
    const {nodeMap} = state;

    // nodeMap is immutable, so make a copy that can be modified.
    const newNodeMap = {...nodeMap};

    delete newNodeMap[id];

    if (parentId) {
      const parentNode = nodeMap[parentId];
      // parentNode is immutable, so make a copy that can be modified.
      const {children} = parentNode;
      const newChildren = children.filter(childId => childId !== id);
      const newParentNode = {...parentNode, children: newChildren};
      newNodeMap[parentId] = newParentNode;
    }

    return {...state, nodeMap: newNodeMap};
  }
);

addReducer('editNode', (state: StateType, value: string): StateType =>
  setUiProp(state, 'editedName', value)
);

addReducer(
  'saveNode',
  (state: StateType, payload: SaveNodePayloadType): StateType => {
    const {id, name} = payload;

    // Don't allow empty node names.
    if (!name) return state;

    const {nodeMap, ui} = state;

    const node = nodeMap[id];

    if (name !== node.name) {
      // changing name
      const {parentId} = node;
      validateNewName(nodeMap, parentId, name);
    }

    // nodeMap is immutable, so make a copy that can be modified.
    const newNodeMap = {...nodeMap};
    const newNode = {...node, name};
    newNodeMap[id] = newNode;

    return {
      ...state,
      nodeMap: newNodeMap,
      ui: {
        ...ui,
        editedName: '',
        editingNodeId: 0
      }
    };
  }
);

addReducer('setConfirmEmail', (state: StateType, value: string): StateType =>
  setUserProp(state, 'confirmEmail', value)
);

addReducer('setConfirmPassword', (state: StateType, value: string): StateType =>
  setUserProp(state, 'confirmPassword', value)
);

addReducer('setEmail', (state: StateType, value: string): StateType =>
  setUserProp(state, 'email', value)
);

addReducer('setFirstName', (state: StateType, value: string): StateType =>
  setUserProp(state, 'firstName', value)
);

addReducer('setLastName', (state: StateType, value: string): StateType =>
  setUserProp(state, 'lastName', value)
);

addReducer('setModal', (state: StateType, modal: ModalType) =>
  setUiProp(state, 'modal', modal)
);

addReducer('setNewInstanceName', (state: StateType, value: string): StateType =>
  setTopProp(state, 'newInstanceName', value)
);

addReducer('setNewNodeName', (state: StateType, value: string): StateType =>
  setUiProp(state, 'newNodeName', value)
);

addReducer('setNodes', (state: StateType, nodes: NodeType[]) => {
  const nodeMap = nodes.reduce((map, node) => {
    const {id} = node;
    node.children = nodes.filter(n => n.parentId === id).map(n => n.id);
    map[id] = node;
    return map;
  }, {});
  return {...state, nodeMap};
});

addReducer('setPassword', (state: StateType, value: string): StateType =>
  setUserProp(state, 'password', value)
);

addReducer('setPhone', (state: StateType, value: string): StateType =>
  setUserProp(state, 'phone', value)
);

addReducer('toggleEditNode', (state: StateType, node: NodeType): StateType => {
  const value = node.id === state.ui.editingNodeId ? 0 : node.id;
  if (value) state = setUiProp(state, 'editedName', node.name);
  return setUiProp(state, 'editingNodeId', value);
});
