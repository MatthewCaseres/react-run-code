// https://leetcode.com/problems/course-schedule-ii/discuss/146326/JavaScript-DFS
const TopoSort = function(ranFile: number, deps: number[][]) {
  const res: number[] = [];
  const seeing = new Set<number>();
  const seen = new Set<number>();
  if (!dfs(ranFile)) {
    return [];
  }
  return res;

  function dfs(v: number) {
    if (seen.has(v)) {
      return true;
    }
    if (seeing.has(v)) {
      return false;
    }
    seeing.add(v);
    for (let nv of deps[v]) {
      if (!dfs(nv)) {
        return false;
      }
    }
    seeing.delete(v);
    seen.add(v);
    res.push(v);
    return true;
  }
};

export default TopoSort;
