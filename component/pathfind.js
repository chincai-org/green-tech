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
        let resolvedCount = 0;

        while (resolvedCount < amount && PathFindClient.requests.length > 0) {
            let client = PathFindClient.requests.shift();

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
                path.unshift(temp.tile);
                temp = temp.parent;
            }
            return path;
        }

        const neighbourTiles = current.tile.neighbour();
        for (const neighbourTile of neighbourTiles) {
            if (closedSet.has(neighbourTile)) {
                continue;
            }
            const tentativeG = current.g + 1; // Assuming each step costs 1

            let neighbour = heap.getElement(neighbourTile);
            // if not in heap yet means not processsed
            if (neighbour === null) {
                neighbour = { tile: neighbourTile };

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

function heuristic(node, end) {
    // Manhattan distance heuristic
    return 2 * (Math.abs(node.x - end.x) + Math.abs(node.y - end.y));
}
