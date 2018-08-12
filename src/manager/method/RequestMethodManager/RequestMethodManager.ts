/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { includes, isString } from 'lodash';
import { IMethods } from './IMethods';

/**
 * @class RequestMethodManager
 */
export class RequestMethodManager {
    /**
     * @private
     * @type {string[]}
     */
    private methodsArray: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    /**
     * Returns the allowed methods
     *
     * @public
     * @return {IMethods} : The allowed methods
     */
    public get methods(): IMethods {
        const buffer: any = {};

        this.methodsArray.forEach((method: string) => {
            buffer[method] = method;
        });

        return buffer;
    }

    /**
     * Validate the passed method
     *
     * @public
     * @param {String} method : String : The method to validate
     * @returns {Boolean} : If the method is valid
     */
    public isMethodValid(method: string|null): boolean {
        return (isString(method) && includes(this.methodsArray, method));
    }

    /**
     * Validates a method
     *
     * @public
     * @param {String} method : String : The method to validate
     * @throws Error
     */
    public validateMethodAndThrowIfNotValid(method: string|null) {
        if (method && !this.isMethodValid(method)) {
            const validMethods = this.getValidMethods();
            throw new Error(`The method must be a string and one of ${validMethods.join(', ')}`);
        }
    }

    /**
     * Returns all valid methods
     *
     * @public
     * @return {string[]} : All valid methods
     */
    public getValidMethods(): string[] {
        return this.methodsArray;
    }
}
