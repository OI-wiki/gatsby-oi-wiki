import React from 'react'

export enum NodeType {
  Leaf, NonLeaf
}

export interface PathListLeafNode {
  name: string;
  type: NodeType.Leaf;
  path: string;
}

export interface PathListNonLeafNode {
  name: string;
  type: NodeType.NonLeaf;
  children: Array<PathListNode>;
}

export type PathListNode = PathListLeafNode | PathListNonLeafNode

export type TypedPathList = Array<PathListNode>

export interface LeafItemProps extends PathListLeafNode {
  padding: number;
  selected: boolean;
}

export interface NonLeafItemProps extends Omit<PathListNonLeafNode, 'children'> {
  padding: number;
  childItems: React.ReactElement[];
  isOpen: boolean;
}

export type PathListType = Array<Record<string, string> | Array<NavSidebarProps>>

export interface NavSidebarProps {
  pathname: string
}
