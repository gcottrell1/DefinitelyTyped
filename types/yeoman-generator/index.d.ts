// Type definitions for yeoman-generator 2.0
// Project: https://github.com/yeoman/generator
// Definitions by: Kentaro Okuno <https://github.com/armorik83>
//                 Jay Anslow <https://github.com/janslow>
//                 Ika <https://github.com/ikatyang>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.2

import { EventEmitter } from 'events';
import * as inquirer from 'inquirer';

type Callback = (err: any) => void;

declare namespace Base {
    interface Question extends inquirer.Question {
        /**
         * whether to store the user's previous answer
         */
        store?: boolean;
    }
    type Questions = Question | Question[] | Rx.Observable<Question>;
    type Answers = inquirer.Answers;

    class Storage {
        constructor(name: string, fs: MemFsEditor, configPath: string);

        defaults(defaults: {}): {};
        delete(key: string): void;
        get(key: string): any;
        getAll(): { [key: string]: any };
        save(): void;
        set(key: string, value: any): any;
    }
    interface InstallOptions {
        /**
         * whether to run `npm install` or can be options to pass to `dargs` as arguments
         */
        npm?: boolean | object;
        /**
         * whether to run `bower install` or can be options to pass to `dargs` as arguments
         */
        bower?: boolean | object;
        /**
         * whether to run `yarn install` or can be options to pass to `dargs` as arguments
         */
        yarn?: boolean | object;
        /**
         * whether to log the used commands
         */
        skipMessage?: boolean;
    }
    interface ArgumentConfig {
        description?: string;
        required?: boolean;
        optional?: boolean;
        type?: typeof String|typeof Number|typeof Array|typeof Object;
        default?: any;
    }
    interface OptionConfig {
        alias?: string;
        default?: any;
        description?: string;
        hide?: boolean;
        type?: typeof Boolean|typeof String|typeof Number;
    }
    interface MemFsEditor {
        read(filepath: string, options?: {}): string;
        readJSON(filepath: string, defaults?: {}): any;
        write(filepath: string, contents: string): void;
        writeJSON(filepath: string, contents: {}, replacer?: (key: string, value: any) => any, space?: number): void;
        extendJSON(filepath: string, contents: {}, replacer?: (key: string, value: any) => any, space?: number): void;
        delete(filepath: string, options?: {}): void;
        copy(from: string, to: string, options?: {}): void;
        copyTpl(from: string, to: string, context: {}, templateOptions?: {}, copyOptions?: {}): void;
        move(from: string, to: string, options?: {}): void;
        exists(filepath: string): boolean;
        commit(callback: Callback): void;
        commit(filters: any[], callback: Callback): void;
    }
}

declare class Base extends EventEmitter {
    constructor(args: string|string[], options: {});

    env: {
        error(...e: Error[]): void
    };
    args: {};
    resolved: string;
    description: string;
    appname: string;
    config: Base.Storage;
    fs: Base.MemFsEditor;
    options: {};
    log(message?: string, context?: any): void;

    argument(name: string, config: Base.ArgumentConfig): this;
    composeWith(namespace: string, options: { [name: string]: any }, settings?: { local: string, link: 'weak'|'strong' }): this;
    destinationPath(...path: string[]): string;
    destinationRoot(rootPath?: string): string;
    determineAppname(): string;
    option(name: string, config: Base.OptionConfig): this;
    prompt(questions: Base.Questions): Promise<Base.Answers>;
    registerTransformStream(stream: {}|Array<{}>): this;
    rootGeneratorName(): string;
    rootGeneratorVersion(): string;
    run(cb?: Callback): this;
    sourceRoot(rootPath?: string): string;
    templatePath(...path: string[]): string;

    // actions/help mixin
    argumentsHelp(): string;
    desc(description: string): this;
    help(): string;
    optionsHelp(): string;
    usage(): string;

    // actions/spawn_command mixin
    spawnCommand(command: string, args: string[], opt?: {}): any;
    spawnCommandSync(command: string, args: string[], opt?: {}): any;

    // actions/install mixin
    /**
     * Receives a list of `components` and an `options` object to install through bower.
     *
     * The installation will automatically run during the run loop `install` phase.
     *
     * @param component Components to install
     * @param options Options to pass to `dargs` as arguments
     * @param spawnOptions Options to pass `child_process.spawn`.
     * @return Resolved if install successful, rejected otherwise
     */
    bowerInstall(component?: string|string[], options?: object, spawnOptions?: object): Promise<void>;
    /**
     * Runs `npm` and `bower`, in sequence, in the generated directory and prints a
     * message to let the user know.
     *
     * @example
     * this.installDependencies({
     *   bower: true,
     *   npm: true
     * }).then(() => console.log('Everything is ready!'));
     *
     * @example
     * this.installDependencies({
     *   yarn: {force: true},
     *   npm: false
     * }).then(() => console.log('Everything is ready!'));
     *
     * @return Resolved if install successful, rejected otherwise
     */
    installDependencies(options?: Base.InstallOptions): Promise<void>;
    /**
     * Receives a list of `packages` and an `options` object to install through npm.
     *
     * The installation will automatically run during the run loop `install` phase.
     *
     * @param pkgs Packages to install
     * @param options Options to pass to `dargs` as arguments
     * @param spawnOptions Options to pass `child_process.spawn`.
     * @return Resolved if install successful, rejected otherwise
     */
    npmInstall(pkgs?: string|string[], options?: object, spawnOptions?: object): Promise<void>;
    /**
     * Combine package manager cmd line arguments and run the `install` command.
     *
     * During the `install` step, every command will be scheduled to run once, on the
     * run loop. This means you can use `Promise.then` to log information, but don't
     * return it or mix it with `this.async` as it'll dead lock the process.
     *
     * @param installer Which package manager to use
     * @param paths Packages to install. Use an empty string for `npm install`
     * @param options Options to pass to `dargs` as arguments
     * @param spawnOptions Options to pass `child_process.spawn`. ref
     *                     https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
     * @return Resolved if install successful, rejected otherwise
     */
    runInstall(installer: string, paths?: string|string[], options?: object, spawnOptions?: object): Promise<void>;
    /**
     * Receives a list of `packages` and an `options` object to install through npm.
     *
     * The installation will automatically run during the run loop `install` phase.
     *
     * @param pkgs Packages to install
     * @param options Options to pass to `dargs` as arguments
     * @param spawnOptions Options to pass `child_process.spawn`.
     * @return Resolved if install successful, rejected otherwise
     */
    yarnInstall(pkgs?: string|string[], options?: object, spawnOptions?: object): Promise<void>;

    // actions/user mixin
    readonly user: {
        readonly git: {
            /**
             * Retrieves user's email from Git in the global scope or the project scope
             * (it'll take what Git will use in the current context)
             * @return configured git email or undefined
             */
            email(): string;
            /**
             * Retrieves user's name from Git in the global scope or the project scope
             * (it'll take what Git will use in the current context)
             * @return configured git name or undefined
             */
            name(): string;
        };
        readonly github: {
            /**
             * Retrieves GitHub's username from the GitHub API
             * @return Resolved with the GitHub username or rejected if unable to
             *         get the information
             */
            username(): Promise<string>;
        }
    };
}
export = Base;
