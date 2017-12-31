// @flow

import React, {Component} from 'react';
import {dispatch} from 'redux-easy';

import Button from './button';

import './tree-builder.css';

import type {AddNodePayloadType, NodeMapType, NodeType} from '../types';

type PropsType = {
  editedName: string,
  editingNodeId: number,
  newNodeName: string,
  nodeMap: NodeMapType,
  rootId: number
};

const URL_PREFIX = 'http://localhost:3001/types';

function nodeCompare(node1: NodeType, node2: NodeType) {
  return node1.name.localeCompare(node2.name);
}

class TreeBuilder extends Component<PropsType> {

  addNode = async (parent: NodeType) => {
    const name = this.props.newNodeName;
    if (!name) return;

    const parentId = parent.id;
    try {
      // Add new type to database.
      const options = {
        method: 'POST',
        body: JSON.stringify({name, parentId})
      };
      const url = URL_PREFIX;
      const res = await fetch(url, options);
      const id = Number(await res.text());

      // Add new type to Redux state.
      const payload: AddNodePayloadType = {id, name, parentId};
      dispatch('addNode', payload);

      dispatch('setNewNodeName', '');
    } catch (e) {
      console.error('tree-builder.js addNode:', e.message);
    }
  };

  componentDidMount() {
    this.load();
  }

  deleteNode = async (node: NodeType) => {
    try {
      // Delete type from database.
      const options = {method: 'DELETE'};
      const url = `${URL_PREFIX}/${node.id}`;
      await fetch(url, options);

      dispatch('deleteNode', node);
    } catch (e) {
      console.error('tree-builder.js deleteNode:', e.message);
    }
  };

  editNode = (event: SyntheticInputEvent<HTMLInputElement>) =>
    dispatch('editNode', event.target.value);

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    dispatch('setNewNodeName', event.target.value);
  };

  handleEscape = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      const {editingNodeId, nodeMap} = this.props;
      const node = nodeMap[editingNodeId];
      this.toggleEditNode(node);
    }
  };

  isEditing = (node: NodeType) => node.id === this.props.editingNodeId;

  // Loads types from database.
  load = async () => {
    try {
      const url = URL_PREFIX;
      const res = await fetch(url);
      const types = await res.json();
      dispatch('setNodes', types);
    } catch (e) {
      console.error('tree-builder.js load:', e.message);
    }
  };

  moveCursor = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const {target} = event;
    const {value} = target;
    target.selectionStart = value.length;
  }

  saveChange = async () => {
    const {editedName: name, editingNodeId: id} = this.props;
    const payload = {id, name};
    try {
      // Update type name in database.
      const options = {
        method: 'PATCH',
        body: JSON.stringify({name})
      };
      const url = `${URL_PREFIX}/${id}`;
      await fetch(url, options);

      dispatch('saveNode', payload);
    } catch (e) {
      console.error('tree-builder.js saveChange:', e.message);
    }
  };

  toggleEditNode = (node: NodeType) => {
    dispatch('toggleEditNode', node);
  };

  renderNodes = (children: number[], level: number = 0) => {
    const {editedName, newNodeName, nodeMap} = this.props;

    const nodes = children.map(id => nodeMap[id]);
    nodes.sort(nodeCompare);

    return nodes.map(node => (
      <div className={'tree-node tree-level-' + level} key={node.name}>
        {this.isEditing(node) ? (
          <input
            type="text"
            autoFocus
            onBlur={this.saveChange}
            onChange={this.editNode}
            onFocus={this.moveCursor}
            onKeyDown={this.handleEscape}
            value={editedName}
          />
        ) : (
          <div
            className="tree-node-name"
            onClick={() => this.toggleEditNode(node)}
          >
            {node.name}
          </div>
        )}
        <Button
          className="addNode"
          disabled={newNodeName === ''}
          icon="plus"
          onClick={() => this.addNode(node)}
        />
        <Button
          className="deleteNode"
          icon="trash-o"
          onClick={() => this.deleteNode(node)}
        />
        <Button
          className="editNode"
          icon="pencil"
          onClick={() => this.toggleEditNode(node)}
        />
        {this.renderNodes(node.children, level + 1)}
      </div>
    ));
  };

  render() {
    const {newNodeName, nodeMap, rootId} = this.props;
    const rootNode = nodeMap[rootId];
    if (!rootNode) return null;

    return (
      <div className="tree-builder">
        <div>
          <label>New Type</label>
          <input
            type="text"
            autoFocus
            onChange={this.handleChange}
            value={newNodeName}
          />
        </div>
        <Button
          className="addNode"
          disabled={newNodeName === ''}
          icon="plus"
          onClick={() => this.addNode(rootNode)}
        />
        {this.renderNodes(rootNode.children)}
      </div>
    );
  }
}

export default TreeBuilder;
