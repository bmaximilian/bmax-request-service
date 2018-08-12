/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import {
    assign,
    get,
    toUpper,
} from 'lodash';
import { Observable } from 'rxjs';
import { RequestHeaderManager } from '../../manager/header/RequestHeaderManager';
import { RequestMethodManager } from '../../manager/method/RequestMethodManager';
import { AfterReceiveMiddlewareManager } from '../../manager/middleware/AfterReceiveMiddlewareManager';
import { BeforeSendMiddlewareManager } from '../../manager/middleware/BeforeSendMiddlewareManager';
import { RequestUrlManager } from '../../manager/url/RequestUrlManager';
import { parseObjectKeys } from '../../util';
import { IRequestSenderOptions } from './IRequestSenderOptions';

/**
 * @class RequestSender
 */
export abstract class RequestSender {
    /**
     * @protected
     * @type {RequestMethodManager}
     */
    protected requestMethodManager: RequestMethodManager;

    /**
     * @protected
     * @type {RequestUrlManager}
     */
    protected requestUrlManager: RequestUrlManager;

    /**
     * @protected
     * @type {RequestHeaderManager}
     */
    protected requestHeaderManager: RequestHeaderManager;

    /**
     * @protected
     * @type {BeforeSendMiddlewareManager}
     */
    protected beforeSendMiddlewareManager: BeforeSendMiddlewareManager;

    /**
     * @protected
     * @type {AfterReceiveMiddlewareManager}
     */
    protected afterReceiveMiddlewareManager: AfterReceiveMiddlewareManager;

    /**
     * @protected
     * @type {Object}
     */
    protected defaultOptions: IRequestSenderOptions = {
        afterReceiveConversionMode: 'default',
        beforeSendConversionMode: 'default',
        responseTimeout: 5000,
    };

    /**
     * Constructor of RequestSender
     */
    constructor(
        requestMethodManager: RequestMethodManager,
        requestUrlManager: RequestUrlManager,
        requestHeaderManager: RequestHeaderManager,
        beforeSendMiddlewareManager: BeforeSendMiddlewareManager,
        afterReceiveMiddlewareManager: AfterReceiveMiddlewareManager,
        defaultOptions: IRequestSenderOptions = {},
    ) {
        this.requestMethodManager = requestMethodManager;
        this.requestUrlManager = requestUrlManager;
        this.requestHeaderManager = requestHeaderManager;
        this.beforeSendMiddlewareManager = beforeSendMiddlewareManager;
        this.afterReceiveMiddlewareManager = afterReceiveMiddlewareManager;
        this.defaultOptions = assign({}, this.defaultOptions, defaultOptions);
    }

    /**
     * Sends a get request
     *
     * @public
     * @param {String} url : String : The route to the request
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    public get(
        url: string,
        params: object = {},
        headers: object = {},
        options: object = {},
    ): Promise<any> | Observable<any> {
        return this.sendRequest('GET', url, {}, params, headers, options);
    }

    /**
     * Sends a post request
     *
     * @public
     * @param {String} url : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    public post(
        url: string,
        body: object = {},
        params: object = {},
        headers: object = {},
        options: object = {},
    ): Promise<any> | Observable<any> {
        return this.sendRequest('POST', url, body, params, headers, options);
    }

    /**
     * Sends a put request
     *
     * @public
     * @param {String} url : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    public put(
        url: string,
        body: object = {},
        params: object = {},
        headers: object = {},
        options: object = {},
    ): Promise<any> | Observable<any> {
        return this.sendRequest('PUT', url, body, params, headers, options);
    }

    /**
     * Sends a patch request
     *
     * @public
     * @param {String} url : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    public patch(
        url: string,
        body: object = {},
        params: object = {},
        headers: object = {},
        options: object = {},
    ): Promise<any> | Observable<any> {
        return this.sendRequest('PATCH', url, body, params, headers, options);
    }

    /**
     * Sends a delete request
     *
     * @public
     * @param {String} url : String : The route to the request
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    public delete(
        url: string,
        params: object = {},
        headers: object = {},
        options: object = {},
    ): Promise<any> | Observable<any> {
        return this.sendRequest('DELETE', url, {}, params, headers, options);
    }

    /**
     * Returns the request parameters based on the passed method
     *
     * @protected
     * @param {String} method : String : The method
     * @param {String} endpoint : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @return {Array} : The parsed method, the middleware options and the request parameters
     */
    protected getRequestParameters(
        method: string,
        endpoint: string,
        body: object,
        params: object,
        headers: object,
        options: object,
    ): object {
        const beforeSendConversionMode = get(options, 'beforeSendConversionMode', 'default');

        return {
            url: this.requestUrlManager.getUrlWithParameters(endpoint, params, beforeSendConversionMode),
            body: parseObjectKeys(body, beforeSendConversionMode),
            headers: this.requestHeaderManager.getHeadersForMethod(method, headers),
        };
    }

    /**
     * Prepares the request
     *
     * @protected
     * @param {String} method : String : The method
     * @param {String} endpoint : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @return {object|null} : The parsed method, the middleware options and the request parameters
     */
    protected prepareRequest(
        method: string,
        endpoint: string,
        body: object = {},
        params: object = {},
        headers: object = {},
        options: object = {},
    ): object | null {
        const parsedMethod = toUpper(method);
        this.requestMethodManager.validateMethodAndThrowIfNotValid(parsedMethod);

        const combinedOptions = assign({}, this.defaultOptions, options);

        const parameters = this.getRequestParameters(
            method,
            endpoint,
            body,
            params,
            headers,
            combinedOptions,
        );

        const middlewareOptions = {
            endpoint,
            method: parsedMethod,
            headers: get(parameters, 'headers', {}),
            body: get(parameters, 'body', {}),
            url: get(parameters, 'url', ''),
            options: combinedOptions,
            rawParameters: params,
            rawMethod: method,
            rawBody: body,
        };

        if (!this.beforeSendMiddlewareManager.apply(middlewareOptions)) {
            return null;
        }

        return middlewareOptions;
    }

    /**
     * Sends a request
     *
     * @protected
     * @param {String} method : String : The method
     * @param {String} endpoint : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {*} : Returns the request
     */
    protected abstract sendRequest(
        method: string,
        endpoint: string,
        body?: object,
        params?: object,
        headers?: object,
        options?: object,
    ): Promise<any> | Observable<any>;
}
