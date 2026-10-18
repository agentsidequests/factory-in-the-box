import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// An original conceptual miniature. No proprietary CAD, real dimensions or manufacturing recipe.
export function mount(host,onSelect){
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0xf0f2eb,0);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  host.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','A simplified 3D manufacturing pod. Use the buttons to choose a station or change the camera view.');renderer.domElement.setAttribute('role','img');
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-12,12,8,-8,.1,150);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,2,0);controls.enabled=false;controls.enableZoom=false;controls.enablePan=false;controls.minPolarAngle=.001;controls.maxPolarAngle=1.32;
  const light=new THREE.DirectionalLight(0xffffff,2.7);light.position.set(-4,13,8);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-14,right:14,top:12,bottom:-12,near:.5,far:40});light.shadow.bias=-.0006;light.shadow.normalBias=.035;scene.add(light,new THREE.AmbientLight(0xffffff,.8),new THREE.HemisphereLight(0xf4fbff,0xa4b4a1,1.3));
  const materials={white:new THREE.MeshStandardMaterial({color:0xf7f6ef,roughness:.68}),edge:new THREE.MeshStandardMaterial({color:0xadbdbb,metalness:.35,roughness:.35}),teal:new THREE.MeshStandardMaterial({color:0x28796b,roughness:.6}),steel:new THREE.MeshStandardMaterial({color:0xa8b6b5,metalness:.65,roughness:.3}),dark:new THREE.MeshStandardMaterial({color:0x344e51,roughness:.65}),yellow:new THREE.MeshStandardMaterial({color:0xe6aa42,metalness:.18,roughness:.4}),glass:new THREE.MeshStandardMaterial({color:0x90c8c1,transparent:true,opacity:.2,roughness:.1,depthWrite:false}),blue:new THREE.MeshStandardMaterial({color:0x5e90ad,roughness:.5})};
  const root=new THREE.Group();scene.add(root);const groups=Array.from({length:5},()=>new THREE.Group());groups.forEach(g=>root.add(g));
  function box(parent,x,y,z,w,h,d,mat=materials.white,zone){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(zone!==undefined)m.userData.zone=zone;parent.add(m);return m;}
  function cyl(parent,x,y,z,r,h,mat=materials.steel,zone){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,24),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(zone!==undefined)m.userData.zone=zone;parent.add(m);return m;}
  function segment(parent,a,b,r,mat,zone){const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b),m=cyl(parent,...p.clone().add(q).multiplyScalar(.5).toArray(),r,p.distanceTo(q),mat,zone);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),q.sub(p).normalize());return m;}
  box(root,0,-.15,0,13.7,.35,4.9,materials.edge);box(root,0,.08,0,13.3,.14,4.5,materials.white);
  const zoneFloors=[];for(let i=1;i<5;i++){const m=new THREE.MeshStandardMaterial({color:[0,0xd8e4d2,0xb8d8cb,0xc3ded9,0xd5e0e4][i],roughness:.9});const f=box(groups[i],-5.1+(i-1)*3.35,.18,0,3.2,.06,4.2,m,i);zoneFloors.push(f);}
  // Back boundary and frames remain visible when the removable explanatory shell is lifted.
  box(root,0,1.5,-2.25,13.4,2.9,.12,materials.white);for(const x of [-6.65,-3.3,0,3.3,6.65])box(root,x,1.52,-2.13,.08,2.8,.1,materials.edge);
  for(const x of [-3.45,3.35]){box(root,x,1.42,-1.25,.08,2.5,1.8,materials.glass);box(root,x,2.7,-1.2,.1,.08,2.1,materials.edge);}
  // Transfer and materials area.
  for(let i=0;i<3;i++){box(groups[1],-5.5,.57+i*.42,-1.35,1.1,.35,.8,materials.edge,1);box(groups[1],-5.5,.79+i*.42,-1.35,.7,.05,.65,materials.white,1);}
  box(groups[1],-4.6,.7,.6,1.75,1,.85,materials.white,1);box(groups[1],-4.6,1.25,.6,1.85,.12,.95,materials.steel,1);box(groups[1],-6.35,1.35,.3,.18,2.2,1.7,materials.glass,1);
  // A generic contained process station. No chemistry or operating parameters.
  for(const x of [-2.4,-1.2]){cyl(groups[2],x,1.05,-.7,.43,1.5,materials.steel,2);cyl(groups[2],x,1.84,-.7,.47,.1,materials.white,2);segment(groups[2],[x,1.9,-.7],[x,2.25,-.7],.055,materials.edge,2);}
  box(groups[2],-1.9,.65,.9,2.1,.8,.8,materials.white,2);box(groups[2],-1.9,1.1,.9,2.15,.1,.9,materials.steel,2);box(groups[2],-1.8,1.55,-2,1.4,.6,.08,materials.teal,2);
  // One coherent fixed robot arm and filling table inside an abstract enclosure.
  box(groups[3],1.5,.65,-.1,1.05,.85,.9,materials.white,3);cyl(groups[3],1.5,1.14,-.1,.28,.2,materials.dark,3);
  const joints=[[1.5,1.2,-.1],[1.45,2.05,-.1],[2.35,2.35,.05],[2.85,1.7,.5]];
  for(let i=0;i<joints.length-1;i++)segment(groups[3],joints[i],joints[i+1],i===0?.15:.12,materials.yellow,3);
  for(const p of joints){const joint=new THREE.Mesh(new THREE.SphereGeometry(.18,16,12),materials.dark);joint.position.set(...p);joint.userData.zone=3;groups[3].add(joint);}
  for(const dx of [-.1,.1])box(groups[3],2.85+dx,1.53,.5,.05,.3,.08,materials.steel,3);
  box(groups[3],1.9,.82,1.05,2.2,.16,.8,materials.steel,3);for(const x of [1,2.8])for(const z of [.8,1.3])box(groups[3],x,.5,z,.08,.64,.08,materials.edge,3);
  const vials=new THREE.InstancedMesh(new THREE.CylinderGeometry(.075,.075,.24,10),new THREE.MeshStandardMaterial({color:0xd6ebe4,metalness:.1,roughness:.2}),24),caps=new THREE.InstancedMesh(new THREE.CylinderGeometry(.082,.082,.04,10),materials.blue,24),matrix=new THREE.Matrix4();
  for(let i=0;i<24;i++){const x=1.05+(i%8)*.23,z=.85+Math.floor(i/8)*.19;matrix.makeTranslation(x,1.02,z);vials.setMatrixAt(i,matrix);matrix.makeTranslation(x,1.16,z);caps.setMatrixAt(i,matrix);}vials.userData.zone=3;caps.userData.zone=3;groups[3].add(vials,caps);
  box(groups[3],1.9,1.78,-.25,2.8,2.05,.07,materials.glass,3);box(groups[3],3.18,1.78,.65,.07,2.05,1.8,materials.glass,3);box(groups[3],1.9,2.82,.65,2.8,.1,1.8,materials.glass,3);
  // Monitoring and a symbolic quality desk. Not all lab/release work fits in the pod.
  box(groups[4],5,.75,-.5,2.2,1.1,1,materials.white,4);box(groups[4],5,1.34,-.5,2.3,.1,1.1,materials.steel,4);box(groups[4],4.9,1.7,-.8,.85,.55,.09,materials.dark,4);box(groups[4],4.9,1.7,-.74,.71,.4,.015,materials.teal,4);box(groups[4],5.7,1.55,-.3,.2,.35,.3,materials.edge,4);box(groups[4],4.7,.58,1.4,.75,.9,.5,materials.blue,4);
  const shell=new THREE.Group();root.add(shell);box(shell,0,3.12,0,13.8,.26,4.9);box(shell,0,1.6,2.3,13.5,2.8,.09,materials.glass);for(const x of [-6.7,6.7]){box(shell,x,1.65,0,.11,2.9,4.6,materials.white);box(shell,x,1.65,1.6,.15,2.7,.12,materials.edge);}
  for(let i=0;i<4;i++){box(shell,-4.7+i*3.1,3.33,-.45,2.1,.22,2.6,materials.white);for(let j=0;j<6;j++)box(shell,-5.5+i*3.1+j*.28,3.46,-.45,.06,.035,2.2,materials.edge);}
  // Service skid is outside the controlled envelope, visually linked but not a complete utility plant.
  box(root,-4.4,.38,4.1,2.7,.7,1.2,materials.edge);box(root,-4.4,.95,4.1,2.2,.5,1,materials.white);segment(root,[-4.4,.75,3.6],[-4.4,.75,2.4],.075,materials.teal);box(root,-4.4,1.24,4.1,1.1,.06,.5,materials.dark);
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.ShadowMaterial({color:0x526b64,opacity:.18}));plane.rotation.x=-Math.PI/2;plane.position.y=-.35;plane.receiveShadow=true;scene.add(plane);
  const grid=new THREE.GridHelper(48,48,0xb8cbc2,0xd8e1d7);grid.position.y=-.34;grid.material.transparent=true;grid.material.opacity=.28;scene.add(grid);
  let angle=.78,view='isometric',selected=0,lift=.68;
  const hotspotPositions=[new THREE.Vector3(-5,1.4,.7),new THREE.Vector3(-1.8,2.1,0),new THREE.Vector3(2,2.7,.7),new THREE.Vector3(5,1.9,.5)];
  function fit(){
    root.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(root),center=bounds.getCenter(new THREE.Vector3()),offset=camera.position.clone().sub(controls.target);
    controls.target.copy(center);camera.position.copy(center).add(offset);camera.lookAt(center);camera.updateMatrixWorld(true);
    let maxX=0,maxY=0;for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const p=new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);maxX=Math.max(maxX,Math.abs(p.x));maxY=Math.max(maxY,Math.abs(p.y));}
    const aspect=Math.max(.1,host.clientWidth/Math.max(1,host.clientHeight)),half=Math.max(maxY,maxX/aspect)*1.12;
    camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();
  }
  function render(){fit();renderer.render(scene,camera);for(let i=0;i<4;i++){const p=hotspotPositions[i].clone().project(camera),button=host.querySelector(`[data-hotspot="${i+1}"]`);if(button){button.style.left=(p.x*.5+.5)*100+'%';button.style.top=(-p.y*.5+.5)*100+'%';}}}
  function place(){
    shell.visible=view!=='top';
    root.updateMatrixWorld(true);const center=new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3()),r=21;
    controls.target.copy(center);
    if(view==='top'){camera.position.copy(center).add(new THREE.Vector3(0,28,.01));camera.up.set(0,0,-1);}
    else{camera.up.set(0,1,0);camera.position.copy(center).add(view==='front'?new THREE.Vector3(0,5,r):new THREE.Vector3(Math.sin(angle)*r,15,Math.cos(angle)*r));}
    camera.lookAt(center);controls.update();render();
  }
  function resize(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);const h=host.clientWidth<600?7.2:6.8;camera.left=-h*width/height;camera.right=h*width/height;camera.top=h;camera.bottom=-h;camera.updateProjectionMatrix();place();}
  function setShell(value){lift=Number(value);shell.position.y=lift*4.3;render();}
  function select(index){selected=index;zoneFloors.forEach((f,i)=>{f.material.emissive.setHex(i+1===selected?0x2a7359:0);f.material.emissiveIntensity=.32;});host.querySelectorAll('[data-hotspot]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.hotspot)===index)));render();}
  controls.addEventListener('change',render);const observer=new ResizeObserver(resize);observer.observe(host);
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down;
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
  renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(root.children,true).find(h=>h.object.userData.zone);if(hit)onSelect(hit.object.userData.zone);});
  setShell(lift);resize();host.classList.add('gpu-ready');
  return {setShell,select,view(name){view=name;place();},rotate(delta){view='isometric';angle+=delta;place();},drag(enabled){controls.enabled=enabled;renderer.domElement.style.touchAction=enabled?'none':'pan-y';},reset(){view='isometric';angle=.78;camera.zoom=1;camera.updateProjectionMatrix();place();},destroy(){observer.disconnect();controls.dispose();renderer.dispose();}};
}
