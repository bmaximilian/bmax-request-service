/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import {
    get,
} from 'lodash';
import { Observable } from 'rxjs';
import { RequestHeaderManager } from './manager/header/RequestHeaderManager';
import { RequestMethodManager } from './manager/method/RequestMethodManager';
import { AfterReceiveMiddlewareManager } from './manager/middleware/AfterReceiveMiddlewareManager';
import { BeforeSendMiddlewareManager } from './manager/middleware/BeforeSendMiddlewareManager';
import { TMiddlewareFunction } from './manager/middleware/MiddlewareManager/TMiddlewareFunction';
import { RequestUrlManager } from './manager/url/RequestUrlManager';
import { RxRequestSender } from './sender/RxRequestSender';

/**
 * @class RequestServiceFacade
 */
export class RequestServiceFacade {
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
     * @type {RequestUrlManager}
     */
    protected requestUrlManager: RequestUrlManager;

    /**
     * @protected
     * @type {RequestMethodManager}
     */
    protected requestMethodManager: RequestMethodManager;

    /**
     * @protected
     * @type {RequestHeaderManager}
     */
    protected requestHeaderManager: RequestHeaderManager;

    /**
     * Constructor of Request
     *
     * @param {Object} config : Object : The configuration from config/request
     */
    constructor(config: object = {}) {
        const headers = get(config, 'headers', {});

        this.beforeSendMiddlewareManager = new BeforeSendMiddlewareManager();
        this.afterReceiveMiddlewareManager = new AfterReceiveMiddlewareManager();

        this.requestUrlManager = new RequestUrlManager();
        this.requestMethodManager = new RequestMethodManager();
        this.requestHeaderManager = new RequestHeaderManager(this.requestMethodManager, headers);
    }

    /**
     * Sets a base url
     *
     * @public
     * @param {String} url : String : The new base url
     * @returns {void}
     */
    public setBaseUrl(url: string): void {
        this.requestUrlManager.setBaseUrl(url);
    }

    /**
     * Adds a middleware that is executed before the request is sent
     *
     * @param {Function} middleware : Function : The middleware to add
     * @return {void}
     */
    public addBeforeSendMiddleware(middleware: TMiddlewareFunction): void {
        this.beforeSendMiddlewareManager.addMiddleware(middleware);
    }

    /**
     * Removes the given middleware that is executed before the request is sent
     *
     * @param {Function} middleware : Function : The middleware to remove
     * @return {void}
     */
    public removeBeforeSendMiddleware(middleware: TMiddlewareFunction): void {
        this.beforeSendMiddlewareManager.removeMiddleware(middleware);
    }

    /**
     * Sets a default header
     *
     * @public
     * @param {String} key : String : Key of the header
     * @param {String} value : String : Value of the header
     * @param {String} method : String : The method to set the header for
     * @returns {void}
     */
    public setDefaultHeader(key: string, value: string, method?: string): void {
        this.requestHeaderManager.setDefaultHeader(key, value, method);
    }

    /**
     * Removes a default header
     *
     * @public
     * @param {String} key : String : Key of the header
     * @param {String} method : String : The method to remove the header for
     * @returns {void}
     */
    public removeDefaultHeader(key: string, method?: string): void {
        this.requestHeaderManager.removeDefaultHeader(key, method);
    }

    /**
     * Returns the default headers for the passed method
     *
     * @public
     * @param {String} method : String : The method to get the headers for
     * @return {Object} : The matching headers
     */
    public getHeadersForMethod(method: string): object {
        return this.requestHeaderManager.getHeadersForMethod(method);
    }

    /**
     * Adds a middleware that is executed after the response is received
     *
     * @param {Function} middleware : Function : The middleware to add
     * @return {void}
     */
    public addAfterReceiveMiddleware(middleware: TMiddlewareFunction): void {
        this.afterReceiveMiddlewareManager.addMiddleware(middleware);
    }

    /**
     * Removes the given middleware that is executed after the response is received
     *
     * @param {Function} middleware : Function : The middleware to remove
     * @return {void}
     */
    public removeAfterReceiveMiddleware(middleware: TMiddlewareFunction): void {
        this.afterReceiveMiddlewareManager.removeMiddleware(middleware);
    }

    /**
     * Sends a get request
     *
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
    ): Observable<any> {
        return this.createRequestSender().get(url, params, headers, options);
    }

    /**
     * Sends a post request
     *
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
    ): Observable<any> {
        return this.createRequestSender().post(url, body, params, headers, options);
    }

    /**
     * Sends a put request
     *
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
    ): Observable<any> {
        return this.createRequestSender().put(url, body, params, headers, options);
    }

    /**
     * Sends a patch request
     *
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
    ): Observable<any> {
        return this.createRequestSender().patch(url, body, params, headers, options);
    }

    /**
     * Sends a delete request
     *
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
    ): Observable<any> {
        return this.createRequestSender().delete(url, params, headers, options);
    }

    /**
     * Creates a sender instance
     *
     * @protected
     * @return {*}
     */
    protected createRequestSender() {
        return new RxRequestSender(
            this.requestMethodManager,
            this.requestUrlManager,
            this.requestHeaderManager,
            this.beforeSendMiddlewareManager,
            this.afterReceiveMiddlewareManager,
        );
    }
}
