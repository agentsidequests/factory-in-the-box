const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
const root=path.resolve(__dirname,'..');
esbuild.buildSync({entryPoints:[path.join(root,'src/renderer.js')],bundle:true,format:'iife',globalName:'Pod3D',target:['es2020'],minify:true,legalComments:'eof',outfile:path.join(root,'public/scene.js')});
const license=fs.readFileSync(path.join(root,'node_modules/three/LICENSE'),'utf8');
fs.writeFileSync(path.join(root,'public/third-party-licenses.txt'),'The factory in the box\nOriginal conceptual illustrations, text and teaching models by Paul Wishall.\n\nThree.js 0.186.1\n'+license+'\nBuild tool: esbuild 0.28.2 (MIT). No external asset, font or runtime service is required.\n');
console.log('Scene bundled. Three.js license preserved.');
