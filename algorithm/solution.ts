import * as fs from "fs";

const input = fs.readFileSync("input.txt", "utf8");

const lines = input.split("\n");
const nodes = new Map<string, string[]>();

for (const line of lines) {
  const [device, outputsString] = line.split(":");
  const connectedNodes = outputsString.trim().split(" ").filter((node) => !!node.trim());
  nodes.set(device, connectedNodes);
}

/**
 * use this function to find all paths from a node to the "out" node
 * @returns an array of paths
 */
function findPaths(currentNode: string, currentPath: string[]): string[] {
  if (currentNode === "out") {
    return [currentPath.join(" -> ")];
  }
  const paths: string[] = [];
  const connectedNodes = nodes.get(currentNode) || [];

  for (const connectedNode of connectedNodes) {
    const childrenPaths = findPaths(connectedNode, [...currentPath, connectedNode]);
    paths.push(...childrenPaths);
  }

  return paths;
}

/**
 * use this function to count the number of paths from a node to the "out" node
 * @returns the number of paths
 */
function countPaths(currentNode: string): number {
  if (currentNode === "out") return 1;

  let count = 0;
  const connectedNodes = nodes.get(currentNode) || [];

  for (const connectedNode of connectedNodes) {
    count += countPaths(connectedNode);
  }

  return count;
}

const pathCount = countPaths("you");
console.log(
  `there are ${pathCount} different paths leading from \`you\` to \`out\`.`
);
