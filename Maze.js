import {
  dx,
  dy,
  opposite,
} from "./directions.js";
// import solve from "./solve.js"

class Maze {
  constructor(mazeSettings) {
    this.prng = mazeSettings.prng ?? Math;
    this.width = mazeSettings.width ??
      (mazeSettings.xSize ?? (mazeSettings.height ?? 30));
    this.height = mazeSettings.height ?? (mazeSettings.ySize ?? this.width);
    this.width = Math.min(this.width, 100);
    this.height = Math.min(this.height, 100);
    this.start = mazeSettings.start ?? "top left";
    this.finish = mazeSettings.finish ?? (mazeSettings.end ?? "bottom right");
    this.startXY = this.getXYPosition(this.start);
    this.finishXY = this.getXYPosition(this.finish);
    this.finishedGenerating = false;
    this.seed = mazeSettings.seed ?? Math.floor(Math.random() * 10e8);
    // this.removeWallsAtEntranceAndExit = mazeSettings.removeWallsAtEntranceAndExit ?? true;
    this.algorithm = mazeSettings.algorithm;
    this.algorithmId = mazeSettings.algorithmId;

    if (
      this.algorithmId === "sidewinder" ||
      this.algorithmId === "binarytree" ||
      this.algorithmId === "ellers"
    ) {
      this.startGenerationFrom = "top left";
    } else {
      this.startGenerationFrom = mazeSettings.startGenerationFrom ?? "random";
    }

    this.prng.shuffle = (arr) => {
      const isView = ArrayBuffer && ArrayBuffer.isView &&
        ArrayBuffer.isView(arr);
      arr = isView ? arr : arr.slice();

      let rnd,
        tmp,
        idx = arr.length;
      while (idx > 1) {
        rnd = (this.prng.random() * idx) | 0;

        tmp = arr[--idx];
        arr[idx] = arr[rnd];
        arr[rnd] = tmp;
      }

      return arr;
    };

    this.reset();
  }

  static create(settings = {}) {
    settings.algorithmId = settings.algorithm
      ? settings.algorithm.replace(/[^a-zA-Z]/g, "")
      : "recursivebacktracker";
    settings.algorithmId = settings.algorithmId.toLowerCase();
    if (settings.algorithmId === "random") {
      settings.algorithmId = Object.keys(
        this.algorithms,
      )[Math.floor(Math.random() * Object.keys(this.algorithms).length)];
    } else if (!this.algorithms[settings.algorithmId]) {
      console.warn(
        `maze.algorithms[${settings.algorithmId}] is not defined, defaulting to recursive backtracker`,
      );
      settings.algorithm = "recursive backtracker";
      settings.algorithmId = "recursivebacktracker";
    }
    return new this.algorithms[settings.algorithmId](settings);
  }

  reset() {
    //random seed would go here

    this.startCell = this.getXYPosition(this.startGenerationFrom);

    this.currentCell = {
      x: this.startCell.x,
      y: this.startCell.y,
    };

    this.finishedGenerating = false;

    this.solution = [];

    this.walls = [];
    for (let y = 0; y < this.height; y++) {
      this.walls[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.walls[y][x] = {
          N: true,
          S: true,
          E: true,
          W: true,
        };
      }
    }

    if (this.resetVariables) this.resetVariables();
  }

  generate() {
    let timerName = `Generating ${this.algorithm} maze in`;
    console.time(timerName);

    let i = 0;
    while (!this.finishedGenerating && ++i < 1000000) {
      this.step();
    }

    console.timeEnd(timerName);
    if (this.finishedGenerating) {
      console.log(`%cMaze completed in ${i} steps`, `color: #1094B3`);
    } else {
      console.log(
        `%cMaze not completed, gave up after ${i} steps`,
        `color: #F3220D`,
      );
    }

    return this;
  }

  removeWall(cell, direction) {
    if (this.cellIsInMaze(cell)) {
      this.walls[cell.y][cell.x][direction] = false;
      let cell2 = {
        x: cell.x + dx[direction],
        y: cell.y + dy[direction],
      };

      if (this.cellIsInMaze(cell2)) {
        this.walls[cell2.y][cell2.x][opposite[direction]] = false;

        return true;
      }
    }
    return false;
  }

  addWall(cell, direction) {
    if (this.cellIsInMaze(cell)) {
      this.walls[cell.y][cell.x][direction] = true;
      let cell2 = {
        x: cell.x + dx[direction],
        y: cell.y + dy[direction],
      };

      if (this.cellIsInMaze(cell2)) {
        this.walls[cell2.y][cell2.x][opposite[direction]] = true;
        return true;
      }
    }
    return false;
  }

  cellIsInMaze(cell) {
    let validX = cell.x >= 0 && cell.x < this.width;
    let validY = cell.y >= 0 && cell.y < this.height;
    return validX && validY;
  }

  //convert a string into an x-y position, as well as the location of any outer walls relative to the cell
  getXYPosition(position) {
    if (typeof position === "object") {
      return {
        ...position,
      };
    }

    let XYPosition = {};
    position = position.toLowerCase();

    switch (position) {
      case "top left":
      case "north west":
        XYPosition = {
          x: 0,
          y: 0,
        };
        break;
      case "bottom left":
      case "south west":
        XYPosition = {
          x: 0,
          y: this.height - 1,
        };
        break;
      case "top right":
      case "north east":
        XYPosition = {
          x: this.width - 1,
          y: 0,
        };
        break;
      case "bottom right":
      case "south east":
        XYPosition = {
          x: this.width - 1,
          y: this.height - 1,
        };
        break;
      case "center":
      case "middle":
        XYPosition = {
          x: Math.floor(this.width / 2),
          y: Math.floor(this.height / 2),
        };
        break;
      case "top middle":
      case "north middle":
        XYPosition = {
          x: Math.floor(this.width / 2),
          y: 0,
        };
        break;
      case "bottom middle":
      case "south middle":
        XYPosition = {
          x: Math.floor(this.width / 2),
          y: this.height - 1,
        };
        break;
      case "right middle":
      case "east middle":
        XYPosition = {
          x: this.width - 1,
          y: Math.floor(this.height / 2),
        };
        break;
      case "left middle":
      case "west middle":
        XYPosition = {
          x: 0,
          y: Math.floor(this.width / 2),
        };
        break;
      case "random":
        XYPosition = {
          x: Math.floor(this.prng.random() * this.width),
          y: Math.floor(this.prng.random() * this.height),
        };
        break;
      default:
        console.warn(
          "Invalid position name. Defaulting to (0,0) (top left corner)",
        );
        XYPosition = {
          x: 0,
          y: 0,
        };
        break;
    }

    let possibleDirections = [];
    if (XYPosition.y <= 0) possibleDirections.push("N");
    if (XYPosition.y >= this.height - 1) possibleDirections.push("S");
    if (XYPosition.x >= this.width - 1) possibleDirections.push("E");
    if (XYPosition.x <= 0) possibleDirections.push("W");

    XYPosition.direction = possibleDirections[0];
    return XYPosition;
  }

  calculateDistances() {
    let startPoint = this.startXY; //this.getMouseCell();
    startPoint = !this.cellIsInMaze(startPoint) ? this.startCell : startPoint;
    let Q = []; //queue

    let discovered = []; //keeps track of which points have been discovered so far so it doesn't loop back on itself
    this.distances = [];
    for (let y = 0; y < this.height; y++) {
      discovered[y] = [];
      this.distances[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.distances[y][x] = 0;
        discovered[y][x] = false;
      }
    }
    discovered[startPoint.y][startPoint.x] = true;

    //enqueue
    Q.unshift(startPoint);

    //don't want it to be 0 otherwise we might be dividing by zero
    this.maxDistance = 1;

    while (Q.length > 0) {
      //dequeue
      let v = Q.pop();

      for (let direction in this.walls[v.y][v.x]) {
        //there's not a wall here so we can go this way
        if (!this.walls[v.y][v.x][direction]) {
          let x = v.x + dx[direction];
          let y = v.y + dy[direction];

          //valid cell to move to
          if (discovered[y] !== undefined && discovered[y][x] !== undefined) {
            //hasn't already been visited (discovered)
            if (!discovered[y][x]) {
              discovered[y][x] = true;
              this.distances[y][x] = this.distances[v.y][v.x] + 1;
              //enqueue
              Q.unshift({
                x: x,
                y: y,
                parent: v,
              });
            }
          }
        }
      }
      this.maxDistance = this.distances[v.y][v.x] + 1;
    }
  }
}

export default Maze;
