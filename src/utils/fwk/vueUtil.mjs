import { deepClone } from "../jsUtil.mjs";

/**
 * creates props as reference
 * 
 * @param sourceProps the object received from the parent, mandatory
 * @param defaultProps how the prop object should be built, with its default value
 * @see initPropsClone creates props as non-reference
 */
export const initProps = (sourceProps, defaultProps = {}) => {
	for (const propKey in defaultProps) {
		if (!defaultProps.hasOwnProperty(propKey)) continue;

		if (!sourceProps.hasOwnProperty(propKey)) {
			Vue.set(sourceProps, propKey, defaultProps[propKey]);
		}
	}
}

export const initPropsClone = (sourceProps, defaultProps = {}) => {
	return { ...deepClone(defaultProps), ...deepClone(sourceProps) };
}