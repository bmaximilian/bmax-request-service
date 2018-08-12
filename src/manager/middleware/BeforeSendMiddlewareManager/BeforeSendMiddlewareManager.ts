/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { isFunction } from 'lodash';
import { MiddlewareManager } from '../MiddlewareManager';
import { TMiddlewareFunction } from '../MiddlewareManager/TMiddlewareFunction';

/**
 * @class BeforeSendMiddlewareManager
 */
export class BeforeSendMiddlewareManager extends MiddlewareManager {
    /**
     * Applies the before send middlewares
     *
     * @param {Object} options : Object : The request options
     * @return {boolean} : Returns if the request should be sent or not
     */
    public apply(options: object) {
        let send = true;

        this.middlewares.every((middleware: TMiddlewareFunction) => {
            if (isFunction(middleware)) {
                send = middleware(options);
            }

            return send;
        });

        return send;
    }
}
