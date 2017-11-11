
/* IMPORT */

import * as _ from 'lodash';
import * as openPath from 'open';
import * as path from 'path';
import * as vscode from 'vscode';
import Utils from './utils';

/* COMMANDS */

async function open () {

  const {activeTextEditor} = vscode.window,
        editorPath = activeTextEditor && activeTextEditor.document.uri.fsPath,
        rootPath = Utils.folder.getRootPath ( editorPath );

  if ( !rootPath ) return vscode.window.showErrorMessage ( 'You have to open a project before being able to open it in the Marketplace' );

  const projectPath = await Utils.folder.getWrapperPathOf ( rootPath, editorPath || rootPath, 'package.json' );

  if ( projectPath ) {

    const packagePath = path.join ( projectPath, 'package.json' ),
          packageContent = await Utils.file.read ( packagePath ),
          packageObj = _.attempt ( JSON.parse, packageContent ),
          isMarketplaceExtension = !_.isError ( packageObj ) && _.isPlainObject ( packageObj.engines ) && packageObj.engines.vscode && packageObj.publisher && packageObj.name;

    if ( isMarketplaceExtension ) {

      return openPath ( `https://marketplace.visualstudio.com/items?itemName=${packageObj.publisher}.${packageObj.name}` );

    }

  }

  vscode.window.showErrorMessage ( 'This project doesn\'t look like a Marketplace extension' );

}

/* EXPORT */

export {open};
