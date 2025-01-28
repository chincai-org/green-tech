class PathFindClient {
    static requests = [];
    /**
     * @param {number} range - Radius for search
     * @param {...BaseSprite} targetClasses - Classes to target
     */
    constructor(sprite, range, ...targetClasses) {
        this.sprite = sprite;
        this.range = range;
        this.targetClasses = targetClasses;
        this.invalid = false;
        this.pathResult = [];
        this.success = false;
        this.resolved = true;
    }

    /**
     * @param {BaseSprite} sprite - The instance of the sprite to start from
     * @param {...Class} targetClasses  - The class that you wish to find, example: Tree
     * @returns {Array<Tile>}
     */
    pathFind() {
        const maxIterations = (4 * this.range) / tileSize;

        const targets = this.sprite.findRangedTargetsSorted(
            this.range,
            ...this.targetClasses
        );
        let path = [];

        for (const target of targets) {
            path = astar(
                this.sprite,
                target,
                maxIterations,
                this.sprite.tile,
                target.tile
            );
            if (path.length > 0) {
                return path;
            }
        }
        return path;
    }

    request() {
        if (this.resolved) {
            this.resolved = false;
            PathFindClient.requests.push(this);
        }
    }

    /**
     * Resolves a number of pathfinding tasks
     * @param {number} amount - Number of tasks to resolve
     */
    static resolve(amount) {
        let resolvedCount = 0;

        while (resolvedCount < amount && PathFindClient.requests.length > 0) {
            let client = PathFindClient.requests.pop();

            // Client is deleted
            if (client.invalid) {
                continue;
            }

            client.pathResult = client.pathFind();
            client.resolved = true;

            client.success = client.pathResult.length >= 2;

            resolvedCount++;
        }
    }
}

function astar(sprite, target, maxIterations, start, end) {
    let closedSet = new Set();
    let heap = new MinHeap();
    heap.add({ tile: start, g: 0 });

    let iteration = 0;
    while (!heap.isEmpty() && iteration < maxIterations) {
        let current = heap.remove();
        closedSet.add(current.tile);

        let currentCenter = current.tile.center();
        if (sprite.overlap(target, currentCenter.x, currentCenter.y)) {
            // Path found, reconstruct and return path
            const path = [];
            let temp = current;
            while (temp) {
                path.push(temp.tile);
                temp = temp.parent;
            }
            return path.reverse();
        }

        const neighbourTiles = current.tile.neighbour();
        for (const neighbourTile of neighbourTiles) {
            if (closedSet.has(neighbourTile)) {
                continue;
            }
            const tentativeG = current.g + 1; // Assuming each step costs 1

            let neighbour = heap.getElement(neighbourTile);
            // if not in heap yet means not processsed
            if (!neighbour) {
                const tileCenter = neighbourTile.center();
                if (
                    sprite.isCollidingUsingTileExcluding(
                        tileCenter.x,
                        tileCenter.y,
                        target
                    )
                ) {
                    continue;
                } else {
                    // diaonal check ajacent tile
                    const dy = neighbourTile.y - neighbourTile.y;
                    const dx = neighbourTile.x - neighbourTile.x;
                    if (abs(dy) + abs(dx) === 2) {
                        // reuse variable tileCenter and colliding
                        const adjCenter1 =
                            tileGrid[current.tile.y][neighbourTile.x].center();
                        const adjCenter2 =
                            tileGrid[neighbourTile.y][current.tile.x].center();

                        if (
                            sprite.isCollidingUsingTileExcluding(
                                adjCenter1.x,
                                adjCenter1.y,
                                target
                            ) ||
                            sprite.isCollidingUsingTileExcluding(
                                adjCenter2.x,
                                adjCenter2.y,
                                target
                            )
                        ) {
                            continue;
                        }
                    }
                }

                const h = heuristic(neighbourTile, end);
                const f = tentativeG + h;
                heap.add({
                    tile: neighbourTile,
                    parent: current,
                    g: tentativeG,
                    h: h,
                    f: f
                });
            } else if (tentativeG < neighbour.g) {
                neighbour.parent = current;
                neighbour.g = tentativeG;
                neighbour.f = tentativeG + neighbour.h;

                // Heapify up to maintain the heap property
                heap.heapifyUp(heap.tileMap.get(neighbour.tile));
            }
        }

        iteration++;
    }
    // No path found
    return [];
}

// Chebyshev distance heuristic
function heuristic(node, end) {
    const dx = Math.abs(node.x - end.x);
    const dy = Math.abs(node.y - end.y);
    return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy);
}
