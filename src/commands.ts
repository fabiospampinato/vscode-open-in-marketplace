
/* IMPORT */

import {alert, getPackage, openInExternal} from 'vscode-extras';
import {isObject, isString} from './utils';

/* MAIN */

const open = (): void => {

  const pkg = getPackage ()?.content;
  const isMarketplaceExtension = isObject ( pkg ) && ( 'publisher' in pkg ) && isString ( pkg.publisher ) && ( 'name' in pkg ) && isString ( pkg.name );

  if ( !isMarketplaceExtension ) return alert.error ( 'This project doesn\'t look like a Marketplace extension' );

  const url = `https://marketplace.visualstudio.com/items?itemName=${pkg.publisher}.${pkg.name}`;

  openInExternal ( url );

};

/* EXPORT */

export {open};
