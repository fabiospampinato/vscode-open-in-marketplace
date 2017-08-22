
/* IMPORT */

import * as _ from 'lodash';
import * as absolute from 'absolute';
import * as openPath from 'open';
import * as path from 'path';
import * as vscode from 'vscode';
import Utils from './utils';

/* COMMANDS */

async function open () {

  const {rootPath} = vscode.workspace;

  if ( !rootPath ) return vscode.window.showErrorMessage ( 'You have to open a project before being able to open it in the Marketplace' );

  let projectPath = await Utils.folder.getWrapperPath ( rootPath, rootPath, 'package.json' );

  if ( !projectPath ) { // Walk upwards from the currently open file

    const {activeTextEditor} = vscode.window,
          editorPath = activeTextEditor && activeTextEditor.document.fileName,
          folderPath = editorPath && absolute ( editorPath ) && path.dirname ( editorPath );

    if ( folderPath ) {

      projectPath = await Utils.folder.getWrapperPath ( rootPath, folderPath, 'package.json' );

    }

  }

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
