/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { isFunction } from 'lodash';
import { TMiddlewareFunction } from './TMiddlewareFunction';

/**
 * @class MiddlewareManager
 */
export class MiddlewareManager {
    protected middlewares: TMiddlewareFunction[] = [];

    /**
     * Constructor of MiddlewareManager
     * @param {TMiddlewareFunction[]} middlewares : TMiddlewareFunction[] : The initial middlewares
     */
    constructor(middlewares = []) {
        this.middlewares = middlewares;
    }

    /**
     * Adds a middleware
     *
     * @param {Function} middleware : Function : The middleware to add
     * @return {void}
     */
    public addMiddleware(middleware: TMiddlewareFunction) {
        this.validateMiddleware(middleware);
        this.middlewares.push(middleware);
    }

    /**
     * Removes a middleware
     *
     * @param {Function} middleware : Function : The middleware to add
     * @return {void}
     */
    public removeMiddleware(middleware: TMiddlewareFunction) {
        this.validateMiddleware(middleware);
        this.middlewares = this.middlewares.filter(mw => mw !== middleware);
    }

    /**
     * Applies a middleware
     *
     * @param {*} target : * : The target to apply a middleware on
     * @param {Object} options : Object : The possible options
     * @return {*} : The target after all middlewares were applied
     */
    public apply(target: any, options?: object): any {
        return this.middlewares.reduce(
            (accumulated, middleware) => {
                if (isFunction(middleware)) {
                    return middleware(accumulated);
                }

                return accumulated;
            },
            target,
        );
    }

    /**
     * Validates a middleware
     *
     * @param {Function} middleware : Function : The middleware
     * @return {void}
     * @throws Error
     */
    protected validateMiddleware(middleware: TMiddlewareFunction) {
        if (!isFunction(middleware)) {
            throw new Error('The middleware must be a function');
        }
    }
}
