/*here start core layout ui scripts imports*/
import coreModule from './core-modules/coreModule';
/*here finish core layout ui scripts imports*/

/*here start internal layout ui components scripts imports*/
import internalModule from './internal-modules/internalModule';
/*here finish internal layout ui components scripts imports*/

(() => {
	/*here start core layout ui scripts functions*/
    coreModule();
	/*here finish core layout ui scripts functions*/
})();

(() => {
	/*here start internal layout ui components functions*/
	internalModule();
	/*here finish internal layout ui components functions*/
})();
