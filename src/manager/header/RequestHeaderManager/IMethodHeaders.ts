/**
 * Created on 12.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

export interface IMethodHeaders {
    GET?: { [key: string]: string|undefined };
    POST?: { [key: string]: string|undefined };
    PATCH?: { [key: string]: string|undefined };
    PUT?: { [key: string]: string|undefined };
    DELETE?: { [key: string]: string|undefined };
    [key: string]: { [key: string]: string|undefined }|undefined;
}
