/**
 * Created on 12.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { camelCaseToLowDash, lowDashToCamelCase } from 'bmax-utils';

/**
 * Unifies the keys of the given object
 *
 * @param {Object} object : Object : The object to unify
 * @param {String} conversionMode : String : default, camelCase or snakeCase
 * @return {*}
 */
export function parseObjectKeys(object: object, conversionMode: string): object {
    let objectWithParsedKeys = object;

    switch (conversionMode) {
        case 'camelCase':
            objectWithParsedKeys = lowDashToCamelCase(objectWithParsedKeys);
            break;
        case 'snakeCase':
            objectWithParsedKeys = camelCaseToLowDash(objectWithParsedKeys);
            break;
        default:
            break;
    }

    return objectWithParsedKeys;
}
