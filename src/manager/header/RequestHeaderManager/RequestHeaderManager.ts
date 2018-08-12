/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import {
    assign,
    get,
    has,
    isString,
    keys,
    toUpper,
} from 'lodash';
import { RequestMethodManager } from '../../method/RequestMethodManager';
import { IMethodHeaders } from './IMethodHeaders';

/**
 * @class RequestHeaderManager
 */
export class RequestHeaderManager {
    /**
     * @private
     * @type RequestMethodManager
     */
    private requestMethodManager: RequestMethodManager;

    /**
     * @private
     * @type {Object}
     */
    private readonly headers: IMethodHeaders = {
        DELETE: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        GET: {},
        PATCH: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        POST: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        PUT: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    };

    /**
     * Constructor of RequestHeaderManager
     * @param {RequestMethodManager} requestMethodManager : RequestMethodManager
     * @param {Object} headers : Object : The default headers
     */
    constructor(requestMethodManager: RequestMethodManager, headers: IMethodHeaders) {
        this.requestMethodManager = requestMethodManager;
        this.headers = assign(
            {},
            this.headers,
            headers,
        );
    }

    /**
     * Sets a default header
     *
     * @public
     * @param {String} key : String : Key of the header
     * @param {String} value : String : Value of the header
     * @param {String} method? : String : The method to set the header for
     * @returns {void}
     */
    public setDefaultHeader(key: string, value: string, method?: string) {
        const parsedMethod: string = toUpper(method);

        if (!isString(key)) throw new Error('The key must be a string');
        if (!isString(value)) throw new Error('The value must be a string');
        this.requestMethodManager.validateMethodAndThrowIfNotValid(parsedMethod);

        if (method) {
            this.headers[parsedMethod]![key] = value;
        } else {
            keys(this.headers).forEach((headerMethod) => {
                this.headers[headerMethod]![key] = value;
            });
        }
    }

    /**
     * Removes a default header
     *
     * @public
     * @param {String} key : String : Key of the header
     * @param {String} method : String : The method to remove the header for
     * @returns {void}
     */
    public removeDefaultHeader(key: string, method?: string) {
        const parsedMethod: string = toUpper(method);

        if (!isString(key)) throw new Error('The key must be a string');
        this.requestMethodManager.validateMethodAndThrowIfNotValid(parsedMethod);

        if (method) {
            if (has(this.headers, `${parsedMethod}.${key}`)) {
                delete this.headers[parsedMethod]![key];
            }
        } else {
            keys(this.headers).forEach((headerMethod: string) => {
                if (has(this.headers, `${headerMethod}.${key}`)) {
                    delete this.headers[headerMethod]![key];
                }
            });
        }
    }

    /**
     * Returns the default headers for the passed method
     *
     * @public
     * @param {String} method : String : The method to get the headers for
     * @param {Object} customHeaders : Object : The headers that should be assigned
     * @return {Object} : The matching headers
     */
    public getHeadersForMethod(method: string, customHeaders: object = {}): object {
        const parsedMethod: string = toUpper(method);
        this.requestMethodManager.validateMethodAndThrowIfNotValid(parsedMethod);

        return assign(
            {},
            get(this.headers, parsedMethod, {}),
            customHeaders,
        );
    }
}
