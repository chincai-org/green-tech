class MinHeap {
    constructor() {
        this.heap = [];
        this.tileMap = new Map(); // Map tile to their indices
    }

    getElement(tile) {
        const index = this.tileMap.get(tile);
        return index !== undefined ? this.heap[index] : null;
    }

    compareElement(element1, element2) {
        if (element1.f === element2.f) {
            // If f values are equal, compare based on h values
            return element1.h - element2.h;
        }

        return element1.f - element2.f;
    }

    // Removing an element will remove the
    // top element with highest priority then
    // heapifyDown will be called
    remove() {
        if (this.heap.length === 0) {
            return null;
        }
        const node = this.heap[0];
        this.tileMap.delete(node.tile);

        if (this.heap.length === 1) {
            this.heap.pop();
        } else {
            this.heap[0] = this.heap.pop();
            this.tileMap.set(this.heap[0].tile, 0);
            this.heapifyDown(0);
        }

        return node;
    }

    add(node) {
        this.heap.push(node);
        this.tileMap.set(node.tile, this.heap.length - 1);
        this.heapifyUp(this.heap.length - 1);
    }

    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (
                this.compareElement(this.heap[parentIndex], this.heap[index]) <=
                0
            ) {
                break;
            }
            [this.heap[parentIndex], this.heap[index]] = [
                this.heap[index],
                this.heap[parentIndex]
            ];
            this.tileMap.set(this.heap[parentIndex].tile, parentIndex);
            this.tileMap.set(this.heap[index].tile, index);
            index = parentIndex;
        }
    }

    heapifyDown(index) {
        const length = this.heap.length;
        while (true) {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let smallest = index;

            if (
                left < length &&
                this.compareElement(this.heap[left], this.heap[smallest]) < 0
            ) {
                smallest = left;
            }
            if (
                right < length &&
                this.compareElement(this.heap[right], this.heap[smallest]) < 0
            ) {
                smallest = right;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [
                this.heap[smallest],
                this.heap[index]
            ];
            this.tileMap.set(this.heap[index].tile, index);
            this.tileMap.set(this.heap[smallest].tile, smallest);

            index = smallest;
        }
    }

    printHeap() {
        var heap = ` ${this.heap[0]} `;
        for (var i = 1; i < this.heap.length; i++) {
            heap += ` ${this.heap[i]} `;
        }
        console.log(heap);
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}
