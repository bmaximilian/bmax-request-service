/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { get, isObject } from 'lodash';
import {
    noop,
    Observable,
    of,
    race,
    timer,
} from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { RequestSender } from '../RequestSender';

/**
 * @class RxRequestSender
 */
export class RxRequestSender extends RequestSender {
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
    ): Observable<any> {
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
    ): Observable<any> {
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
    ): Observable<any> {
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
    ): Observable<any> {
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
    ): Observable<any> {
        return this.sendRequest('DELETE', url, {}, params, headers, options);
    }

    /**
     * Sends a post request
     *
     * @protected
     * @param {String} method : String : The method
     * @param {String} endpoint : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    protected sendRequest(
        method: string,
        endpoint: string,
        body: object = {},
        params: object = {},
        headers: object = {},
        options: object = {},
    ): Observable<any> {
        const preparedRequest = this.prepareRequest(
            method,
            endpoint,
            body,
            params,
            headers,
            options,
        );

        if (!isObject(preparedRequest)) {
            return of({});
        }

        const preparedMethod = get(preparedRequest, 'method', '');

        const requestObservable = this.createRequestObservable(preparedMethod, preparedRequest!)
        .pipe(
            map(response => this.afterReceiveMiddlewareManager.apply(response, preparedRequest!)),
        );

        return this.raceAgainstTimeout(
            requestObservable,
            get(preparedRequest, 'options.responseTimeout', this.defaultOptions.responseTimeout),
        );
    }

    /**
     * Creates a rxjs/ajax request
     *
     * @param {String} method : String : The method
     * @param {Object} parameters : Object : Parameters
     * @return {Observable<AjaxResponse>|any}: The ajax observable
     */
    protected createRequestObservable(method: string, parameters: object): Observable<AjaxResponse>|any {
        const url = get(parameters, 'url', '');
        const body = get(parameters, 'body', {});
        const headers = get(parameters, 'headers', {});

        switch (method) {
            case 'GET':
                return ajax.get(url, headers);
            case 'POST':
                return ajax.post(url, body, headers);
            case 'PUT':
                return ajax.put(url, body, headers);
            case 'PATCH':
                return ajax.patch(url, body, headers);
            case 'DELETE':
                return ajax.delete(url, headers);
            default:
                return noop();
        }
    }

    /**
     * Returns the timeout to race against
     *
     * @private
     * @param {Number} timeout : Number : The timeout in ms
     * @return {Observable}
     */
    private getTimeoutObservable(timeout: number): Observable<object>|any {
        const timeoutResponse = {
            timeout: true,
            status: 408,
        };

        return timeout
            ? timer(timeout)
            .pipe(
                map(() => timeoutResponse),
            )
            : noop();
    }

    /**
     * Cancel the observable after a certain amout of time
     *
     * @param {Observable} requestObservable : Observable : The ajax request
     * @param {Number} timeout : Number : The timeout
     * @return {Observable<any>} : The race observable
     */
    private raceAgainstTimeout(
        requestObservable: Observable<AjaxResponse>,
        timeout: number,
    ): Observable<any> {
        return race(
            requestObservable,
            this.getTimeoutObservable(timeout),
        );
    }
}
