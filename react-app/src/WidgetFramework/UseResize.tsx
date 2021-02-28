import * as React from "react"
import { useState, useEffect } from "react"

// Used for creating a ReactContext for accessing the width and Height of the Webpart DomElemet
// Render adjusted to the different WebpartZones
export const ResizeContext = React.createContext({ width: 0, height: 0 });

/**
 * a React-Hook which updates the width and height delayed 
 *
 * @param {HTMLElement} element the HTML-Element from which to retrieve the size
 * @returns the width and height of the element
 */
const useResize = (element: HTMLElement) => {
  const [width, setWidth] = useState(element.clientWidth)
  const [height, setHeight] = useState(element.clientHeight)
  useEffect(() => {
    const handleResize = () => {
      setWidth(element.clientWidth);
      setHeight(element.clientHeight);
    }
    
    window.addEventListener('resize', handleResize);
    element.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      element.removeEventListener('resize', handleResize);
    }
  }, [element]);

  return ({ width, height });
}

/**
 * The properties of the Rezize component
 *
 * @export
 * @interface IReSizeProps
 */
export interface IReSizeHostProps {
  /**
   * the HTML-Element to detect change of the dimensions 
   *
   * @type {HTMLElement}
   * @memberof IReSizeHostProps
   */
  element: HTMLElement;
  /**
   * the components in which the dimensions wants to get used
   *
   * @type {React.ReactNode}
   * @memberof IReSizeHostProps
   */
  children?: React.ReactNode;
}

/**
 * The rezize component
 *
 * @export
 * @param {IReSizeHostProps} props the properties for the component
 * @returns the rendered ReSizeContext Provider
 */
export function ResizeProvider(props: IReSizeHostProps) {
  const { width, height } = useResize(props.element);
  return (
    <ResizeContext.Provider value={{ width, height }}>
      {props.children}
    </ResizeContext.Provider>
  );
}

