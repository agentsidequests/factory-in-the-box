const assert=require('node:assert/strict'),M=require('../public/model.js');
assert.equal(M.scale().output,200);assert.equal(M.scale({pods:4}).output,240);assert.equal(M.scale({pods:4,quality:600}).output,400);
assert.equal(M.scale({pods:6,utilities:false}).output,0);assert.equal(M.scale({pods:1,outage:true}).output,0);
assert.equal(M.scale({pods:4,quality:600,outage:true}).output,300);assert.equal(M.scale({pods:4,quality:0}).output,0);
assert.equal(M.scale({pods:6,quality:600}).bottleneck,'balanced');assert.equal(M.scale({pods:4,quality:600}).bottleneck,'production');
for(let pods=1;pods<=6;pods++)for(let quality=0;quality<=600;quality+=20)for(const outage of [false,true])for(const utilities of [false,true]){
 const s=M.scale({pods,quality,outage,utilities});assert.equal(s.active,pods-(outage?1:0));assert.equal(s.output,utilities?Math.min(s.active*100,quality):0);assert.ok(s.output>=0&&s.output<=600);assert.equal(M.curve({quality,outage,utilities})[pods-1].output,s.output);
}
assert.equal(M.ZONES.length,5);
assert.deepEqual(M.WALKTHROUGH.map(s=>M.scale(s.input).output),[200,240,400,300,0]);
assert.deepEqual(M.WALKTHROUGH.map(s=>M.compare(s.reference,s.input).percent),[0,20,100,-25,-100]);
assert.deepEqual(M.WALKTHROUGH.map(s=>M.compare(s.reference,s.input).before),[200,200,200,400,400]);
assert.ok(Object.isFrozen(M.WALKTHROUGH)&&M.WALKTHROUGH.every(s=>Object.isFrozen(s)&&Object.isFrozen(s.input)&&Object.isFrozen(s.reference)));
assert.deepEqual(M.compare({quality:0},{pods:4,quality:400}),{before:0,after:400,delta:400,percent:null});
assert.equal(M.compare({utilities:false},{utilities:false}).percent,null);
for(const step of M.WALKTHROUGH){const c=M.compare(step.reference,step.input);assert.equal(c.after,M.scale(step.input).output);assert.equal(c.delta,c.after-c.before);}
console.log('744 capacity combinations, boundary cases, five immutable experiment states, reference comparisons and zero-reference behavior passed.');
