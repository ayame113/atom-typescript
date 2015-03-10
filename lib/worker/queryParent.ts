/// Functions that the parent allows the child to query

var resolve: typeof Promise.resolve = Promise.resolve.bind(Promise);

// safe imports
import tsconfig = require('../main/tsconfig/tsconfig');
import project = require('../main/lang/project');

// UI Imports
import _atomUtils = require('../main/atom/atomUtils');
var atomUtils: typeof _atomUtils;
import _errorView = require('../main/atom/errorView');
var errorView: typeof _errorView;

try {
    require('atom');
    // We are in a safe context:
    atomUtils = require('../main/atom/atomUtils');
    errorView = require('../main/atom/errorView');
}
catch (ex) {
    // We just need to type information for this context
}

export function echoNumWithModification(query: { num: number }): Promise<{ num: number }> {
    return Promise.resolve({ num: query.num + 10 });
}

export function getUpdatedTextForUnsavedEditors(query: {}): Promise<{ editors: { filePath: string; text: string }[] }> {
    var editors = atomUtils.getTypeScriptEditorsWithPaths().filter(editor => editor.isModified());
    return resolve({
        editors: editors.map(e=> {
            return { filePath: e.getPath(), text: e.getText() }
        })
    });
}

export function setConfigurationError(query: { projectFilePath: string; error: { message: string; details: any } }): Promise<{}> {
    var errors: project.TSError[] = [];
    if (query.error) {
        if (query.error.message == tsconfig.errors.GET_PROJECT_JSON_PARSE_FAILED) {
            let details: tsconfig.GET_PROJECT_JSON_PARSE_FAILED_Details = query.error.details;
            errors = [
                {
                    filePath: details.projectFilePath,
                    startPos: { line: 0, ch: 0 },
                    endPos: { line: 0, ch: 0 },
                    message: "The project file contains invalid JSON",
                    preview: details.projectFilePath,
                }
            ]
        }
        if (query.error.message == tsconfig.errors.GET_PROJECT_PROJECT_FILE_INVALID_OPTIONS) {
            let details: tsconfig.GET_PROJECT_PROJECT_FILE_INVALID_OPTIONS_Details = query.error.details;
            errors = [
                {
                    filePath: details.projectFilePath,
                    startPos: { line: 0, ch: 0 },
                    endPos: { line: 0, ch: 0 },
                    message: "The project file contains invalid options",
                    preview: details.errorMessage,
                }
            ]
        }
    }

    errorView.setErrors(query.projectFilePath, errors);
    return resolve({});
}

export interface Test { }
