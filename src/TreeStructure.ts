import {
  findInTree,
  findParentTree,
  walkTree,
  addToTree,
  removeFromTree,
  addNextTo,
  type Tree,
} from "./tree";

export class TreeStructure<T> {
  constructor(public tree: Tree<T>) {}

  find(id: string) {
    return findInTree(this.tree, id);
  }

  findParent(id: string) {
    return findParentTree(this.tree, id);
  }

  walk(callback: (tree: Tree<T>, path: string[]) => void | boolean) {
    walkTree(this.tree, callback);
  }

  add(addition: Tree<T>, parentId: string = this.tree.id) {
    addToTree(this.tree, parentId, addition);
  }

  remove(id: string) {
    removeFromTree(this.tree, id);
  }

  addNextTo(id: string, addition: Tree<T>, before: boolean = false) {
    addNextTo(this.tree, id, addition, before);
  }
}
