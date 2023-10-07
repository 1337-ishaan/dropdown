export type Tree<T> = T & {
  id: string;
  children?: Tree<T>[];
};

export const findInTree = <T>(
  tree: Tree<T>,
  id: string
): { tree: Tree<T>; path: string[] } | undefined => {
  let found: { tree: Tree<T>; path: string[] } | undefined;

  walkTree(tree, (child, path) => {
    if (child.id === id) {
      found = {
        tree: child,
        path,
      };

      return true;
    }
  });

  return found;
};

export const findParentTree = <T>(
  tree: Tree<T>,
  id: string,
  path: string[] = []
): { tree: Tree<T>; path: string[] } | undefined => {
  if (!tree.children) {
    return;
  }

  if (tree.children.find(child => child.id === id)) {
    return {
      tree,
      path,
    };
  }

  for (const child of tree.children) {
    const found = findParentTree(child, id, [...path, tree.id]);

    if (found) {
      return found;
    }
  }

  return;
};

/**
 * Callback can return `true` to exit early.
 */
export const walkTree = <T>(
  tree: Tree<T>,
  callback: (tree: Tree<T>, path: string[]) => void | boolean,
  path: string[] = []
) => {
  if (callback(tree, path)) {
    return;
  }

  tree.children?.forEach(child => {
    walkTree(child, callback, [...path, tree.id]);
  });
};

export const addToTree = <T>(tree: Tree<T>, id: string, addition: Tree<T>) => {
  if (tree.id === id) {
    if (!tree.children) {
      tree.children = [];
    }

    tree.children?.push(addition);
  }

  if (!tree.children) {
    return;
  }

  for (const child of tree.children) {
    addToTree(child, id, addition);
  }
};

export const removeFromTree = <T>(tree: Tree<T>, id: string) => {
  const parent = findParentTree(tree, id);

  if (parent?.tree.children) {
    parent.tree.children = parent?.tree.children?.filter(
      child => child.id !== id
    );
  }
};

export const addNextTo = <T>(
  tree: Tree<T>,
  id: string,
  addition: Tree<T>,
  before: boolean = false
) => {
  const parent = findParentTree(tree, id);

  if (!parent?.tree.children) {
    throw new Error(`Faulty tree structure, could not add item next to ${id}`);
  }

  const indexOfId = parent.tree.children.findIndex(it => it.id === id);

  if (indexOfId < 0) {
    throw new Error(`Faulty tree structure, could not add item next to ${id}`);
  }

  if (before) {
    parent?.tree.children?.splice(indexOfId, 0, addition);
  } else {
    parent?.tree.children?.splice(indexOfId + 1, 0, addition);
  }
};
