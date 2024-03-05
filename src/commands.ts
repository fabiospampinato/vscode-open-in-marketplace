
/* IMPORT */

import findUp from 'find-up-json';
import vscode from 'vscode';
import {getProjectRootPath} from 'vscode-extras';
import {isString} from './utils';

/* MAIN */

const open = (): void => {

  const repoPath = getProjectRootPath ();

  if ( !repoPath ) return void vscode.window.showErrorMessage ( 'You have to open a project before being able to open it in the Marketplace' );

  const pkg = findUp ( 'package.json', repoPath )?.content;

  if ( !pkg ) return void vscode.window.showErrorMessage ( 'This project doesn\'t look like a Marketplace extension' );

  const isMarketplaceExtension = ( 'publisher' in pkg ) && isString ( pkg.publisher ) && ( 'name' in pkg ) && isString ( pkg.name );

  if ( !isMarketplaceExtension ) return void vscode.window.showErrorMessage ( 'This project doesn\'t look like a Marketplace extension' );

  const url = `https://marketplace.visualstudio.com/items?itemName=${pkg.publisher}.${pkg.name}`

  vscode.env.openExternal ( vscode.Uri.parse ( url ) );

};

/* EXPORT */

export {open};
