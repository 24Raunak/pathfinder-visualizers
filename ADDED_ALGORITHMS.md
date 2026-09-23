# Added pathfinding algorithms

This version adds three algorithms to the visualizer:

- **Greedy Best-First Search** — prioritizes the node with the smallest Manhattan heuristic `h(n)`.
- **Bidirectional BFS** — searches outward from both the start and end until the frontiers meet.
- **Iterative Deepening DFS (IDDFS)** — repeatedly performs depth-limited DFS with an increasing depth limit.

All three are wired into the existing algorithm selector and `runPathfindingAlgorithm` dispatcher.

Note: the current visualizer uses an unweighted 4-neighbor grid, so Dijkstra and BFS produce shortest paths under the same movement model. The new algorithms are useful for comparing search behavior and traversal patterns rather than introducing weighted-edge semantics.
