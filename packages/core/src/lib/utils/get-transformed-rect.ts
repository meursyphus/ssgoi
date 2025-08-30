/**
 * Get the actual bounding rect of an element considering CSS transforms
 * This is useful for elements that are transformed in 3D space
 */
export function getTransformedBoundingRect(element: HTMLElement): DOMRect {
  // Get the computed transform matrix
  const style = window.getComputedStyle(element);
  const transform = style.transform;
  
  // If no transform, return regular bounding rect
  if (transform === 'none') {
    return element.getBoundingClientRect();
  }
  
  // Get original rect
  const rect = element.getBoundingClientRect();
  
  // Parse transform matrix
  const matrix = new DOMMatrix(transform);
  
  // Get corners of the element
  const corners = [
    { x: rect.left, y: rect.top },           // top-left
    { x: rect.right, y: rect.top },          // top-right
    { x: rect.left, y: rect.bottom },        // bottom-left
    { x: rect.right, y: rect.bottom }        // bottom-right
  ];
  
  // Transform each corner
  const transformedCorners = corners.map(corner => {
    const point = new DOMPoint(corner.x, corner.y);
    const transformedPoint = matrix.transformPoint(point);
    return { x: transformedPoint.x, y: transformedPoint.y };
  });
  
  // Find the bounding box of transformed corners
  const xs = transformedCorners.map(c => c.x);
  const ys = transformedCorners.map(c => c.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  // Create a DOMRect-like object
  return new DOMRect(
    minX,
    minY,
    maxX - minX,
    maxY - minY
  );
}

/**
 * Alternative approach using visual viewport and element transforms
 * More accurate for complex 3D transforms
 */
export function getVisualBoundingRect(element: HTMLElement): DOMRect {
  // Get transformed rect directly
  const transformedRect = element.getBoundingClientRect();
  
  // If element has perspective or 3D transforms, we need to account for that
  const parent = element.parentElement;
  if (parent) {
    const parentStyle = window.getComputedStyle(parent);
    const perspective = parentStyle.perspective;
    
    if (perspective && perspective !== 'none') {
      // Handle perspective transforms
      // This is a simplified calculation - full 3D projection would be more complex
      const perspectiveValue = parseFloat(perspective);
      const translateZ = getTranslateZ(element);
      
      if (translateZ !== 0) {
        const scale = perspectiveValue / (perspectiveValue - translateZ);
        const width = transformedRect.width * scale;
        const height = transformedRect.height * scale;
        const centerX = transformedRect.left + transformedRect.width / 2;
        const centerY = transformedRect.top + transformedRect.height / 2;
        
        return new DOMRect(
          centerX - width / 2,
          centerY - height / 2,
          width,
          height
        );
      }
    }
  }
  
  return transformedRect;
}

/**
 * Helper to extract translateZ value from transform
 */
function getTranslateZ(element: HTMLElement): number {
  const transform = window.getComputedStyle(element).transform;
  if (transform === 'none') return 0;
  
  const matrix = new DOMMatrix(transform);
  return matrix.m43; // translateZ is in the 4th row, 3rd column
}

/**
 * Main utility function that chooses the best method
 */
export function getAccurateBoundingRect(element: HTMLElement): DOMRect {
  // Check if element or any parent has 3D transforms
  let current: HTMLElement | null = element;
  let has3DTransform = false;
  
  while (current) {
    const style = window.getComputedStyle(current);
    const transform = style.transform;
    const transformStyle = style.transformStyle;
    
    if (transform !== 'none' || transformStyle === 'preserve-3d') {
      has3DTransform = true;
      break;
    }
    
    current = current.parentElement;
  }
  
  // Use appropriate method based on transform type
  if (has3DTransform) {
    return getVisualBoundingRect(element);
  }
  
  return element.getBoundingClientRect();
}