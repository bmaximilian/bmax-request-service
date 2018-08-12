/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { formatGetUrlParameters } from 'bmax-utils';
import { isString } from 'lodash';
import { parseObjectKeys } from '../../../util';

/**
 * @class RequestUrlManager
 */
export class RequestUrlManager {
    /**
     * The request base url
     * @type {string}
     */
    private baseUrl: string = '';

    /**
     * Constructor of RequestUrlManager
     */
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    /**
     * Sets a base url
     *
     * @param {String} url : String : The new base url
     * @returns {void}
     */
    public setBaseUrl(url: string): void {
        if (!isString(url)) throw new Error('The url must be a string');

        this.baseUrl = url;
    }

    /**
     * Returns a full URL with query string parameters
     *
     * @param {String} endpoint : String : The endpoint URI
     * @param {Object} parameters : Object : The parameters to format
     * @param {String} conversionMode : String : default, camelCase or snakeCase
     * @return {string} : The complete URL with parameters
     */
    public getUrlWithParameters(
        endpoint: string,
        parameters: object,
        conversionMode: string = 'default',
    ): string {
        return this.getUrlFromEndpoint(endpoint) + this.parseUrlParameters(parameters, conversionMode);
    }

    /**
     * Assigns the endpoint URI to the base URL
     *
     * @param {String} endpoint : String : The endpoint URI
     * @return {string} : The complete URL
     */
    private getUrlFromEndpoint(endpoint: string): string {
        return `${this.baseUrl}${endpoint}`;
    }

    /**
     * Formats the passed object to a query string for get parameters
     *
     * @param {Object} parameters : Object : The parameters to format
     * @param {String} conversionMode : String : default, camelCase or snakeCase
     * @return {string} : The formatted query string
     */
    private parseUrlParameters(parameters: object, conversionMode: string = 'default'): string {
        return formatGetUrlParameters(parseObjectKeys(parameters, conversionMode));
    }
}
