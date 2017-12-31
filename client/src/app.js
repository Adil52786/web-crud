// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';

import TreeBuilder from './tree-builder/tree-builder';

import type {NodeMapType, StateType} from './types';

import './app.css';

type PropsType = {
  editedName: string,
  editingNodeId: number,
  newNodeName: string,
  nodeMap: NodeMapType,
  typeRootId: number
};

class App extends Component<PropsType> {
  render() {
    const {
      editedName,
      editingNodeId,
      newNodeName,
      nodeMap,
      typeRootId
    } = this.props;
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">SmartDevice</h1>
        </header>
        <TreeBuilder
          editedName={editedName}
          editingNodeId={editingNodeId}
          newNodeName={newNodeName}
          nodeMap={nodeMap}
          rootId={typeRootId}
        />
      </div>
    );
  }
}

const mapState = (state: StateType): Object => {
  const {
    nodeMap,
    typeRootId,
    ui: {editedName, editingNodeId, newNodeName}
  } = state;
  return {editedName, editingNodeId, newNodeName, nodeMap, typeRootId};
};

export default connect(mapState)(App);
