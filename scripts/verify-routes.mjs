// Render all routed pages without a browser or listening HTTP server.
import { build } from 'vite';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const directory=await mkdtemp(join(process.cwd(),'.route-check-'));
try {
 await build({configFile:false,logLevel:'error',define:{'import.meta.env.BASE_URL':JSON.stringify('/COUNTRY-CLUB-LONGCHAMPS-/')},build:{ssr:'scripts/route-content.tsx',outDir:directory,emptyOutDir:true,minify:false,rollupOptions:{output:{entryFileNames:'routes.mjs'}}},ssr:{noExternal:['react-router-dom','react-router']},esbuild:{jsx:'automatic'}});
 const {verify}=await import(pathToFileURL(join(directory,'routes.mjs')).href);
 verify();
} finally {await rm(directory,{recursive:true,force:true})}
