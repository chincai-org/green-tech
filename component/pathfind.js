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
        this.pathResult = [];
        this.sucess = false;
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
            if (path != 0) {
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
        for (let i = 0; i < amount && PathFindClient.requests.length > 0; i++) {
            const client = PathFindClient.requests.shift();
            client.pathResult = client.pathFind();
            client.resolved = true;
            if (client.pathResult.length >= 2) {
                client.sucess = true;
            } else {
                client.sucess = false;
            }
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
                path.unshift(temp.tile);
                temp = temp.parent;
            }
            return path;
        }

        const neighbourTiles = current.tile.neighbour();
        for (const neighbourTile of neighbourTiles) {
            let neighbour = heap.getElement(neighbourTile.x, neighbourTile.y);
            // if not in heap yet means not processsed
            if (neighbour === null) {
                neighbour = { tile: neighbourTile };
            }

            if (closedSet.has(neighbour.tile)) {
                continue;
            }

            const tentativeG = current.g + 1; // Assuming each step costs 1

            if (!isChecked(heap.heap, neighbour.tile)) {
                let tileCenter = neighbour.tile.center();

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
                    let dy = neighbour.tile.y - current.tile.y;
                    let dx = neighbour.tile.x - current.tile.x;
                    if (abs(dy) + abs(dx) == 2) {
                        // reuse variable tileCenter and colliding
                        tileCenter =
                            tileGrid[current.tile.y][neighbour.tile.x].center();
                        let tileCenter2 =
                            tileGrid[neighbour.tile.y][current.tile.x].center();

                        if (
                            sprite.isCollidingUsingTileExcluding(
                                tileCenter2.x,
                                tileCenter2.y,
                                target
                            ) ||
                            sprite.isCollidingUsingTileExcluding(
                                tileCenter.x,
                                tileCenter.y,
                                target
                            )
                        ) {
                            continue;
                        }
                    }
                }

                let heuristicVal = heuristic(neighbour.tile, end);
                heap.add({
                    tile: neighbour.tile,
                    parent: current,
                    g: tentativeG,
                    h: heuristicVal,
                    f: tentativeG + heuristicVal
                });
            } else if (tentativeG < neighbour.g) {
                let heuristicVal = heuristic(neighbour.tile, end);
                neighbour.parent = current;
                neighbour.g = tentativeG;
                neighbour.h = heuristicVal;
                neighbour.f = tentativeG + heuristicVal;

                // Heapify up to maintain the heap property
                heap.heapifyUp();
            }
        }

        iteration++;
    }
    // No path found
    return [];
}

/**
 * check if tile is in array
 * @param {array} - an array containing tile
 */
function isChecked(array, tile) {
    for (const element of array) {
        if (element.tile == tile) {
            return true;
        }
    }
    return false;
}

function heuristic(node, end) {
    // Manhattan distance heuristic
    return 2 * (Math.abs(node.x - end.x) + Math.abs(node.y - end.y));
}
