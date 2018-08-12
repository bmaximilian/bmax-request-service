/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { isFunction } from 'lodash';
import { MiddlewareManager } from '../MiddlewareManager';

/**
 * @class AfterReceiveMiddlewareManager
 */
export class AfterReceiveMiddlewareManager extends MiddlewareManager {
    /**
     * Applies the after receive middlewares
     *
     * @param {Object} response : Object : The response
     * @param {Object} options : Object : The request options
     * @return {boolean} : Returns if the request should be sent or not
     */
    public apply(response: any, options: object) {
        return this.middlewares.reduce(
            (accumulated, middleware) => {
                if (isFunction(middleware)) {
                    return middleware(accumulated, options);
                }

                return accumulated;
            },
            response,
        );
    }
}
