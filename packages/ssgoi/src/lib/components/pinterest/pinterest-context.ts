type Rect = {
  x: number,
  y: number,
  width: number,
  height: number
}

const store = new Map<string, {in?: Rect, out?: Rect}>()

/**
 * @type {Map<string, Rect>}
 * @todo: singleton pattern must be applied.
 */
export default store