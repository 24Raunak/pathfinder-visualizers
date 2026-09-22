export type SavedMaze = {
  id: number;
  name: string;

  rows: number;
  cols: number;

  start: {
    row: number;
    col: number;
  };

  end: {
    row: number;
    col: number;
  };

  walls: [number, number][];

  mazeType: string;
  algorithm: string;
  speed: number;
};

const API_URL = "http://localhost:3001/api";

export async function saveMaze(maze: Omit<SavedMaze, "id">) {
  const response = await fetch(`${API_URL}/mazes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(maze),
  });

  if (!response.ok) {
    throw new Error("Failed to save maze");
  }

  return response.json();
}

export async function getMazes() {
  const response = await fetch(`${API_URL}/mazes`);

  if (!response.ok) {
    throw new Error("Failed to load mazes");
  }

  return response.json();
}

export async function getMaze(id: number) {
  const response = await fetch(`${API_URL}/mazes/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load maze");
  }

  return response.json();
}

export async function deleteMaze(id: number) {
  const response = await fetch(`${API_URL}/mazes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete maze");
  }

  return response.json();
}