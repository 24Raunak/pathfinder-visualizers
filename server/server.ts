import express from "express";
import cors from "cors";
import db from "./db";

const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json());

/*
 * Get all saved mazes
 */
app.get("/api/mazes", (_req, res) => {
  try {
    const mazes = db
      .prepare(`
        SELECT
          id,
          name,
          rows,
          cols,
          maze_type,
          algorithm,
          speed,
          created_at,
          updated_at
        FROM mazes
        ORDER BY updated_at DESC
      `)
      .all();

    res.json(mazes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve mazes",
    });
  }
});

/*
 * Get one maze
 */
app.get("/api/mazes/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const maze = db
      .prepare(`
        SELECT *
        FROM mazes
        WHERE id = ?
      `)
      .get(id) as any;

    if (!maze) {
      return res.status(404).json({
        error: "Maze not found",
      });
    }

    res.json({
      id: maze.id,
      name: maze.name,

      rows: maze.rows,
      cols: maze.cols,

      start: {
        row: maze.start_row,
        col: maze.start_col,
      },

      end: {
        row: maze.end_row,
        col: maze.end_col,
      },

      walls: JSON.parse(maze.walls),

      mazeType: maze.maze_type,
      algorithm: maze.algorithm,
      speed: maze.speed,

      createdAt: maze.created_at,
      updatedAt: maze.updated_at,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve maze",
    });
  }
});

/*
 * Save a maze
 */
app.post("/api/mazes", (req, res) => {
  try {
    const {
      name,
      rows,
      cols,
      start,
      end,
      walls,
      mazeType,
      algorithm,
      speed,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Maze name is required",
      });
    }

    if (!start || !end) {
      return res.status(400).json({
        error: "Start and end positions are required",
      });
    }

    if (!Array.isArray(walls)) {
      return res.status(400).json({
        error: "Walls must be an array",
      });
    }

    const result = db
      .prepare(`
        INSERT INTO mazes (
          name,
          rows,
          cols,
          start_row,
          start_col,
          end_row,
          end_col,
          walls,
          maze_type,
          algorithm,
          speed
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        name,
        rows,
        cols,
        start.row,
        start.col,
        end.row,
        end.col,
        JSON.stringify(walls),
        mazeType,
        algorithm,
        speed,
      );

    res.status(201).json({
      id: result.lastInsertRowid,
      message: "Maze saved successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to save maze",
    });
  }
});

/*
 * Delete a maze
 */
app.delete("/api/mazes/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = db
      .prepare(`
        DELETE FROM mazes
        WHERE id = ?
      `)
      .run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: "Maze not found",
      });
    }

    res.json({
      message: "Maze deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete maze",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Maze API running at http://localhost:${PORT}`,
  );
});