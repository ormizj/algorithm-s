import { cloneDeep } from "../javascriptUtil.js";
import { hasOwn } from "../objectUtil.js";

/**
 * creates props as reference
 * 
 * @param sourceProps the object received from the parent, mandatory
 * @param defaultProps how the prop object should be built, with its default value
 * @see initPropsClone creates props as non-reference
 */
export const initProps = (sourceProps, defaultProps = {}) => {
	for (const propKey in defaultProps) {
		if (!hasOwn(defaultProps, propKey)) continue;

		if (!hasOwn(sourceProps, propKey)) {
			Vue.set(sourceProps, propKey, defaultProps[propKey]);
		}
	}
}

export const initPropsClone = (sourceProps, defaultProps = {}) => {
	return { ...cloneDeep(defaultProps), ...cloneDeep(sourceProps) };
}