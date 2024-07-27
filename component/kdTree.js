class Node {
    constructor(axis, sprite) {
        this.axis = axis;
        this.sprite = sprite
        this.left = null;
        this.right = null;
    }
}

class KDTree {
    constructor() {
        this.root = null;
    }

    insert(sprite, node = this.root, depth = 0) {
        if (node === null) {
            const newNode = new Node(depth % 2, sprite);
            return newNode;
        }

        const axis = node.axis;
        if (axis == 0 ? sprite.x < node.sprite.x : sprite.y < node.sprite.y) {
            node.left = this.insert(sprite, node.left, depth + 1);
        } else {
            node.right = this.insert(sprite, node.right, depth + 1);
        }
    }

    nearest(sprite, range = Infinity, node = this.root, depth = 0, results = []) {
        if (node === null) {
            return results;
        }

        const axis = node.axis;
        const dist = distance(sprite, node.sprite);

        if (dist <= range) {
            results.push(node);
        }

        const nextBranch = axis === 0 ? (sprite.x < node.sprite.x ? node.left : node.right) : (sprite.y < node.sprite.y ? node.left : node.right);
        const otherBranch = nextBranch === node.left ? node.right : node.left;

        this.nearest(sprite, range, nextBranch, depth + 1, results);

        const axisDist = axis === 0 ? Math.abs(sprite.x - node.sprite.x) : Math.abs(sprite.y - node.sprite.y);

        if (axisDist < range) {
            this.nearest(sprite, range, otherBranch, depth + 1, results);
        }

        return results;
    }
}

