
let DATA=[];let filtered=[];const $=id=>document.getElementById(id);const MONTHS=['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogos','Sep','Okt','Nov','Dis'];const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const fmt=d=>d?new Date(d+'T00:00:00').toLocaleDateString('ms-MY',{day:'2-digit',month:'short',year:'numeric'}):'—';const count=(a,key)=>a.reduce((o,r)=>(o[r[key]]=(o[r[key]]||0)+1,o),{});const bar=(name,n,max)=>`<div class="barrow"><span title="${esc(name)}">${esc(name)}</span><div class="bartrack"><div class="barfill" style="width:${max?n/max*100:0}%"></div></div><b>${n}</b></div>`;const badge=s=>`<span class="pill ${s==='Ditolak'?'reject':s==='Tarik diri'?'withdraw':'wait'}">${esc(s)}</span>`;const detailBtn=r=>`<button class="link" data-case="${r.bil}">LR/2026/${String(r.bil).padStart(3,'0')}</button>`;const table=(heads,rows)=>`<div class="tablewrap"><table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')||`<tr><td colspan="${heads.length}" class="empty">Tiada rekod untuk penapis ini</td></tr>`}</tbody></table></div>`;
function render(){let m=$('month').value,p=$('pbt').value,j=$('jenis').value;filtered=DATA.filter(r=>(!m||r.tarikhRayuan.slice(5,7)===m)&&(!p||r.pbt===p)&&(!j||r.jenis===j));let done=filtered.filter(r=>r.status!=='Belum ada keputusan');$('total').textContent=filtered.length;$('done').textContent=done.length;$('pending').textContent=filtered.length-done.length;$('hearing').textContent=filtered.filter(r=>r.pendengaran.length).length;let durations=done.filter(r=>r.keputusanTarikh.length&&r.tarikhRayuan).map(r=>(new Date(r.keputusanTarikh[0])-new Date(r.tarikhRayuan))/86400000).filter(n=>n>=0);$('duration').textContent=durations.length?Math.round(durations.reduce((a,b)=>a+b,0)/durations.length)+' hari':'—';$('timePanel').innerHTML=durations.length?`<div class="bigstat">${$('duration').textContent}</div><p class="subtle">Purata dari tarikh rayuan hingga tarikh keputusan untuk ${durations.length} rekod lengkap.</p>`:'<p class="empty">Tiada tarikh lengkap untuk pengiraan</p>';
const received=Array.from({length:12},(_,i)=>filtered.filter(r=>+r.tarikhRayuan.slice(5,7)===i+1).length),resolved=Array.from({length:12},(_,i)=>done.filter(r=>r.keputusanTarikh.some(d=>+d.slice(5,7)===i+1)).length);let max=Math.max(1,...received,...resolved),W=620,H=230,top=22,bottom=195,left=40,right=610,plotHeight=bottom-top,step=(right-left)/12,barWidth=step*.3;let py=n=>bottom-n/max*plotHeight;let ticks=Array.from({length:max+1},(_,n)=>n).map(n=>`<line x1="${left}" x2="${right}" y1="${py(n)}" y2="${py(n)}" stroke="#e1e8ef"/><text x="29" y="${py(n)+4}" font-size="11" fill="#68798e" text-anchor="end">${n}</text>`).join('');let bars=received.map((n,i)=>{let center=left+step*(i+.5),x=center-barWidth-2,y=py(n);return `<rect x="${x}" y="${y}" width="${barWidth}" height="${bottom-y}" rx="2" fill="#cf1437"><title>${MONTHS[i]}: ${n} diterima</title></rect>`}).join('')+resolved.map((n,i)=>{let center=left+step*(i+.5),x=center+2,y=py(n);return `<rect x="${x}" y="${y}" width="${barWidth}" height="${bottom-y}" rx="2" fill="#19a56e"><title>${MONTHS[i]}: ${n} ada keputusan</title></rect>`}).join('');$('trend').innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Carta bar jumlah rayuan diterima dan keputusan mengikut bulan">${ticks}${bars}${MONTHS.map((v,i)=>`<text x="${left+step*(i+.5)}" y="216" font-size="11" fill="#65748b" text-anchor="middle">${v}</text>`).join('')}</svg>`;
let groups=count(filtered,'status'),d=groups['Ditolak']||0,t=groups['Tarik diri']||0,b=groups['Belum ada keputusan']||0,total=filtered.length||1,deg=x=>x/total*360;$('donut').innerHTML=`<div class="donut" style="background:conic-gradient(#d52e49 0deg ${deg(d)}deg,#3985d3 ${deg(d)}deg ${deg(d+t)}deg,#f1b63d ${deg(d+t)}deg 360deg)"><div class="donut-inner">${filtered.length}<small>Jumlah kes</small></div></div><div class="legend-list">🔴 Ditolak: <b>${d}</b><br>🔵 Tarik diri: <b>${t}</b><br>🟡 Belum ada keputusan: <b>${b}</b></div>`;let types=count(filtered,'jenis');$('types').innerHTML=Object.entries(types).sort((a,b)=>b[1]-a[1]).map(([k,v])=>bar(k,v,filtered.length)).join('')||'<p class="empty">Tiada rekod</p>';let pbts=count(filtered,'pbt');const pbtPalette=['#e03f4b','#ef803c','#e5b735','#81ba68','#4eaa90','#4c99af','#5b82c9','#7968b7','#a36ab5','#cb6b9a','#e18a5e','#6baaa0'];const pbtColors={'MBSJ':pbtPalette[0],'MDSB':pbtPalette[1],'MBDK':pbtPalette[2],'MPKS':pbtPalette[3],'MPKL':pbtPalette[4],'MPKJ':pbtPalette[5],'MPSEPANG':pbtPalette[6],'MBPJ':pbtPalette[7],'MBSA':pbtPalette[8],'MPAJ':pbtPalette[9],'MPS':pbtPalette[10],'MPHS':pbtPalette[11]};const pbtMax=Math.max(1,...Object.values(pbts));$('pbts').innerHTML=Object.entries(pbts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>'<div class="barrow pbt-color-row"><span title="'+esc(k)+'">'+esc(k)+'</span><div class="bartrack"><div class="barfill pbt-color-fill" style="width:'+(v/pbtMax*100)+'%;--pbt-bar-color:'+(pbtColors[k]||'#7686a6')+'"></div></div><b>'+v+'</b></div>').join('')||'<p class="empty">Tiada rekod</p>';
let hearings=filtered.flatMap(r=>(r.pendengaran||[]).map(date=>({...r,date}))).sort((a,b)=>a.date.localeCompare(b.date));let hr=r=>`<tr><td>${fmt(r.date)}</td><td>${detailBtn(r)}</td><td>${esc(r.pbt)}</td><td>${esc(r.jenis)}</td><td>${badge(r.status)}</td></tr>`;$('upcoming').innerHTML=table(['Tarikh','No. Rayuan','PBT','Jenis','Status'],hearings.slice(0,5).map(hr));$('hearingTable').innerHTML=table(['Tarikh','No. Rayuan','PBT','Jenis','Status'],hearings.map(hr));let decisions=filtered.filter(r=>r.status!=='Belum ada keputusan');$('decisionTable').innerHTML=table(['No. Rayuan','PBT','Keputusan','Tarikh keputusan'],decisions.map(r=>`<tr><td>${detailBtn(r)}</td><td>${esc(r.pbt)}</td><td>${badge(r.status)}</td><td>${r.keputusanTarikh.map(fmt).join(', ')||'—'}</td></tr>`));let cats=[['Ditolak',d],['Tarik diri',t],['Belum ada keputusan',b]],highest=Math.max(1,...cats.map(x=>x[1]));$('decisionBars').innerHTML=`<div class="decisionbox">${cats.map(([k,v])=>`<div class="decisioncol"><b>${v}</b><div style="height:${Math.max(4,v/highest*125)}px"></div>${k}</div>`).join('')}</div>`;renderCases();renderOfficialMap();}
function renderCases(){let q=$('search').value.toLocaleLowerCase();let a=filtered.filter(r=>[r.bil,r.pbt,r.jenis,r.status].join(' ').toLocaleLowerCase().includes(q));$('caseTable').innerHTML=table(['No. Rayuan','Tarikh Rayuan','Jenis Rayuan','PBT','Kategori','Status'],a.map(r=>`<tr><td>${detailBtn(r)}</td><td>${fmt(r.tarikhRayuan)}</td><td>${esc(r.jenis)}</td><td>${esc(r.pbt)}</td><td>${esc(r.jenis)}</td><td>${badge(r.status)}</td></tr>`));}
function showCase(bil){let r=DATA.find(r=>r.bil===+bil);if(!r)return;let fields=[['Tarikh Rayuan',fmt(r.tarikhRayuan)],['Pihak Berkuasa Tempatan',r.pbt],['Jenis Rayuan',r.jenis],['Status',r.status],['Tarikh Pendengaran',(r.pendengaran||[]).map(fmt).join(', ')||'—'],['Tarikh Keputusan',(r.keputusanTarikh||[]).map(fmt).join(', ')||'—']];$('detailBody').innerHTML=`<h2>LR/2026/${String(r.bil).padStart(3,'0')}</h2>${fields.map(([k,v])=>`<div class="detail-row"><b>${esc(k)}</b>${esc(v||'—')}</div>`).join('')}`;$('detail').showModal();}
function nav(page){document.querySelectorAll('.page').forEach(e=>e.classList.toggle('hidden',e.id!==page));document.querySelectorAll('.nav').forEach(e=>e.classList.toggle('active',e.dataset.page===page));window.scrollTo(0,0)}
function exportCsv(){let fields=['bil','tarikhRayuan','pbt','jenis','status'];let csv='﻿'+[fields.join(','),...filtered.map(r=>fields.map(k=>'"'+String(r[k]||'').replace(/"/g,'""')+'"').join(','))].join('\r\n');let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='rayuan-selangor-2026.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
fetch('data.json').then(r=>{if(!r.ok)throw Error('Gagal membaca data');return r.json()}).then(data=>{DATA=data;let ps=[...new Set(DATA.map(r=>r.pbt))].sort();ps.forEach(p=>$('pbt').add(new Option(p,p)));[...new Set(DATA.map(r=>r.jenis))].sort().forEach(j=>$('jenis').add(new Option(j,j)));MONTHS.forEach((m,i)=>$('month').add(new Option(m,String(i+1).padStart(2,'0'))));render();}).catch(e=>{$('overview').insertAdjacentHTML('afterbegin',`<p class="empty">${esc(e.message)}. Jalankan melalui pelayan web / GitHub Pages, bukan membuka fail HTML terus.</p>`)});document.querySelectorAll('.filters select').forEach(e=>e.addEventListener('change',()=>{if(e.target.id==='pbt')render()}));$('reset').onclick=()=>{['month','pbt','jenis'].forEach(k=>$(k).value='');$('search').value='';render()};$('search').addEventListener('input',renderCases);document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>nav(b.dataset.page));document.addEventListener('click',e=>{let b=e.target.closest('[data-case]');if(b)showCase(b.dataset.case);let n=e.target.closest('[data-goto]');if(n)nav(n.dataset.goto)});$('close').onclick=()=>$('detail').close();$('csv').onclick=exportCsv;




const OFFICIAL_PBT_CODES={
 'Majlis Daerah Sabak Bernam':'MDSB','Majlis Perbandaran Kuala Selangor':'MPKS',
 'Majlis Bandaraya Subang Jaya':'MBSJ','Majlis Bandaraya Petaling Jaya':'MBPJ',
 'Majlis Perbandaran Kuala Langat':'MPKL','Majlis Perbandaran Hulu Selangor':'MPHS',
 'Majlis Perbandaran Sepang':'MPSEPANG','Majlis Perbandaran Kajang':'MPKJ',
 'Majlis Perbandaran Ampang Jaya':'MPAJ','Majlis Perbandaran Selayang':'MPS',
 'Majlis Bandaraya Shah Alam':'MBSA','Majlis Bandaraya Diraja Klang':'MBDK'
};
let OFFICIAL_GEOJSON=null,DISTRICT_GEOJSON=null,OFFICIAL_MAP=null,OFFICIAL_LAYER=null,DISTRICT_LAYER=null,GOOGLE_MAP=null,GOOGLE_LAYERS=[],GOOGLE_DISTRICT_LAYERS=[],BASEMAP_CONTROL=null;
function renderOfficialMap(){
 const host=$('officialPbtMap'),info=$('officialMapInfo');if(!host||!info)return;
 if(!OFFICIAL_GEOJSON){host.textContent='Memuatkan sempadan PBT…';return}
 if(window.google?.maps&&window.GOOGLE_MAPS_API_KEY){renderGooglePbtMap();return}
 if(!window.L){host.textContent='Pustaka peta tidak tersedia.';return}
 const chosen=$('pbt').value,month=$('month').value,jenis=$('jenis').value;
 const comparison=DATA.filter(r=>(!month||r.tarikhRayuan.slice(5,7)===month)&&(!jenis||r.jenis===jenis));
 const counts=count(comparison,'pbt'),max=Math.max(1,...Object.values(counts));
 if(!OFFICIAL_MAP){
   OFFICIAL_MAP=L.map(host,{zoomControl:true,scrollWheelZoom:true,preferCanvas:true});
   // Street basemap is the reliable default. Satellite is an optional layer.
   const street=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'});
   const light=L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors © CARTO'});
   const satellite=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Imagery © Esri and contributors'});
   const basemaps={'Peta Jalan':street,'Peta Cerah':light,'Satelit (Esri)':satellite};
   street.addTo(OFFICIAL_MAP);
   BASEMAP_CONTROL=L.control.layers(basemaps,null,{position:'topright',collapsed:true}).addTo(OFFICIAL_MAP);
   // Keep a working street map when satellite imagery fails to load.
   let satelliteErrors=0;
   satellite.on('tileerror',()=>{if(++satelliteErrors>=3&&OFFICIAL_MAP.hasLayer(satellite)){OFFICIAL_MAP.removeLayer(satellite);street.addTo(OFFICIAL_MAP);satelliteErrors=0}});
   OFFICIAL_MAP.on('baselayerchange',e=>{if(e.layer!==satellite)satelliteErrors=0});

   OFFICIAL_LAYER=L.geoJSON(OFFICIAL_GEOJSON,{
     style:()=>({color:'#fff',weight:1.5,fillColor:'#b4c3d4',fillOpacity:.75}),
     onEachFeature:(f,layer)=>{
       const name=f.properties.NAMA_PBT,code=OFFICIAL_PBT_CODES[name];
       layer.on('click',()=>{$('pbt').value=code;render()});
       layer.on('mouseover',()=>layer.setStyle({weight:3,color:'#e9b33b'}));
       layer.on('mouseout',()=>OFFICIAL_LAYER.resetStyle(layer));
     }
   }).addTo(OFFICIAL_MAP);
   if(DISTRICT_GEOJSON){DISTRICT_LAYER=L.geoJSON(DISTRICT_GEOJSON,{style:{color:'#f8bc33',weight:2.2,fillOpacity:0,opacity:.95},interactive:false}).addTo(OFFICIAL_MAP)}
   OFFICIAL_MAP.fitBounds(OFFICIAL_LAYER.getBounds(),{padding:[20,20]});
 }
 if(DISTRICT_GEOJSON&&!DISTRICT_LAYER){DISTRICT_LAYER=L.geoJSON(DISTRICT_GEOJSON,{style:{color:'#f8bc33',weight:2.2,fillOpacity:0,opacity:.95},interactive:false}).addTo(OFFICIAL_MAP)}
 if(DISTRICT_LAYER){const enabled=$('showDistrictBoundary').checked;if(enabled&&!OFFICIAL_MAP.hasLayer(DISTRICT_LAYER))DISTRICT_LAYER.addTo(OFFICIAL_MAP);if(!enabled&&OFFICIAL_MAP.hasLayer(DISTRICT_LAYER))OFFICIAL_MAP.removeLayer(DISTRICT_LAYER)}
 if(OFFICIAL_LAYER){const enabled=$('showPbtBoundary').checked;if(enabled&&!OFFICIAL_MAP.hasLayer(OFFICIAL_LAYER))OFFICIAL_LAYER.addTo(OFFICIAL_MAP);if(!enabled&&OFFICIAL_MAP.hasLayer(OFFICIAL_LAYER))OFFICIAL_MAP.removeLayer(OFFICIAL_LAYER)}
 addLeafletPbtLogos();
 OFFICIAL_LAYER.eachLayer(layer=>{
   const name=layer.feature.properties.NAMA_PBT,code=OFFICIAL_PBT_CODES[name],n=counts[code]||0;
   layer.setStyle({fillColor:n===0?'#cbd5e1':n/max>=.7?'#ac1739':n/max>=.4?'#e85a72':'#f3a5b0',fillOpacity:code===chosen?.9:.76,color:code===chosen?'#e9b33b':'#fff',weight:code===chosen?4:1.5});
   layer.bindTooltip(esc(name)+' — '+n+' rayuan',{sticky:true});
 });
 const f=OFFICIAL_GEOJSON.features.find(f=>OFFICIAL_PBT_CODES[f.properties.NAMA_PBT]===chosen);
 const selectedRows=chosen?comparison.filter(r=>r.pbt===chosen):comparison;
 const statuses=count(selectedRows,'status'),types=count(selectedRows,'jenis');
 const rows=obj=>Object.entries(obj).map(([k,v])=>'<div class="official-map-row"><span>'+esc(k)+'</span><strong>'+v+'</strong></div>').join('');
 info.innerHTML='<h3>'+(f?esc(f.properties.NAMA_PBT):'Seluruh Negeri Selangor')+'</h3><div class="official-map-number">'+selectedRows.length+' <small>jumlah rayuan</small></div><h4>Status keputusan</h4>'+(rows(statuses)||'<p>Tiada rekod</p>')+'<h4>Jenis rayuan</h4>'+(rows(types)||'<p>Tiada rekod</p>')+'<button class="smallbutton" id="officialMapReset">Papar semua PBT</button><p class="muted">Sempadan daripada fail GeoJSON dibekalkan; jumlah kes daripada data Excel dashboard.</p>';
 $('officialMapReset').onclick=()=>{$('pbt').value='';render();OFFICIAL_MAP.fitBounds(OFFICIAL_LAYER.getBounds(),{padding:[20,20]})};
 setTimeout(()=>OFFICIAL_MAP.invalidateSize(),0);
}
function renderGooglePbtMap(){
 const host=$('officialPbtMap'),info=$('officialMapInfo');if(!host||!OFFICIAL_GEOJSON||!window.google?.maps)return;
 if(!GOOGLE_MAP){
   if(OFFICIAL_MAP){OFFICIAL_MAP.remove();OFFICIAL_MAP=null;OFFICIAL_LAYER=null;}
   host.textContent='';GOOGLE_MAP=new google.maps.Map(host,{center:{lat:3.18,lng:101.5},zoom:9,mapTypeId:'roadmap',mapTypeControl:true,streetViewControl:false});
   const bounds=new google.maps.LatLngBounds();
   OFFICIAL_GEOJSON.features.forEach(f=>{
     const coords=f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates];
     coords.forEach(poly=>{
       const paths=poly.map(ring=>ring.map(([lng,lat])=>({lat,lng})));
       paths.forEach(path=>path.forEach(p=>bounds.extend(p)));
       const polygon=new google.maps.Polygon({paths,map:GOOGLE_MAP,strokeColor:'#ffffff',strokeWeight:1.5,fillColor:'#b4c3d4',fillOpacity:.65});
       polygon.pbtName=f.properties.NAMA_PBT;polygon.addListener('click',()=>{$('pbt').value=OFFICIAL_PBT_CODES[polygon.pbtName]||'';render()});
       GOOGLE_LAYERS.push(polygon);
     });
   });
   GOOGLE_MAP.fitBounds(bounds);
 }
 const chosen=$('pbt').value,month=$('month').value,jenis=$('jenis').value;
 const comparison=DATA.filter(r=>(!month||r.tarikhRayuan.slice(5,7)===month)&&(!jenis||r.jenis===jenis));
 const counts=count(comparison,'pbt'),max=Math.max(1,...Object.values(counts));
 if(DISTRICT_GEOJSON&&!GOOGLE_DISTRICT_LAYERS.length){DISTRICT_GEOJSON.features.forEach(f=>{const polys=f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates];polys.forEach(poly=>{const paths=poly.map(ring=>ring.map(([lng,lat])=>({lat,lng})));GOOGLE_DISTRICT_LAYERS.push(new google.maps.Polygon({paths,map:GOOGLE_MAP,strokeColor:'#f8bc33',strokeWeight:2.2,strokeOpacity:.95,fillOpacity:0,clickable:false,zIndex:3}))})})}
 addGooglePbtLogos();
 GOOGLE_DISTRICT_LAYERS.forEach(p=>p.setMap($('showDistrictBoundary').checked?GOOGLE_MAP:null));
 GOOGLE_LAYERS.forEach(p=>{p.setMap($('showPbtBoundary').checked?GOOGLE_MAP:null);const code=OFFICIAL_PBT_CODES[p.pbtName],n=counts[code]||0;p.setOptions({fillColor:n===0?'#cbd5e1':n/max>=.7?'#ac1739':n/max>=.4?'#e85a72':'#f3a5b0',fillOpacity:code===chosen?.85:.58,strokeColor:code===chosen?'#f3b72d':'#ffffff',strokeWeight:code===chosen?4:1.5})});
 const f=OFFICIAL_GEOJSON.features.find(f=>OFFICIAL_PBT_CODES[f.properties.NAMA_PBT]===chosen),selectedRows=chosen?comparison.filter(r=>r.pbt===chosen):comparison;
 const rows=obj=>Object.entries(obj).map(([k,v])=>'<div class="official-map-row"><span>'+esc(k)+'</span><strong>'+v+'</strong></div>').join('');
 info.innerHTML='<h3>'+(f?esc(f.properties.NAMA_PBT):'Seluruh Negeri Selangor')+'</h3><div class="official-map-number">'+selectedRows.length+' <small>jumlah rayuan</small></div><h4>Status keputusan</h4>'+(rows(count(selectedRows,'status'))||'<p>Tiada rekod</p>')+'<h4>Jenis rayuan</h4>'+(rows(count(selectedRows,'jenis'))||'<p>Tiada rekod</p>')+'<button class="smallbutton" id="officialMapReset">Papar semua PBT</button>';
 $('officialMapReset').onclick=()=>{$('pbt').value='';render()};
}
function loadGoogleMapsIfConfigured(){
 const key=window.GOOGLE_MAPS_API_KEY;
 if(typeof key!=='string'||!key.trim())return;
 const script=document.createElement('script');
 script.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(key)+'&callback=googleMapsReady&loading=async';
 script.async=true;script.onerror=()=>console.warn('Google Maps tidak dapat dimuatkan; peta sempadan sandaran dikekalkan.');
 window.googleMapsReady=()=>renderOfficialMap();document.head.appendChild(script);
}
loadGoogleMapsIfConfigured();
fetch('sempadan-pbt-selangor.geojson').then(r=>{if(!r.ok)throw Error('Fail sempadan tidak ditemui');return r.json()}).then(g=>{OFFICIAL_GEOJSON=g;renderOfficialMap()}).catch(e=>{const h=$('officialPbtMap');if(h)h.textContent='Gagal memuatkan peta: '+e.message});

fetch('sempadan-daerah-selangor.geojson').then(r=>{if(!r.ok)throw Error('Fail daerah tidak ditemui');return r.json()}).then(g=>{DISTRICT_GEOJSON=g;renderOfficialMap()}).catch(e=>console.warn('Sempadan daerah:',e.message));
['showPbtBoundary','showDistrictBoundary'].forEach(id=>$(id)?.addEventListener('change',renderOfficialMap));


/* PBT crest markers: same GeoJSON boundary positions, unaffected by map filters. */
const PBT_LOGO_ORDER=['MBSA','MBPJ','MDSB','MBDK','MPKL','MPKJ','MBSJ','MPAJ','MPS','MPHS','MPKS','MPSEPANG'];
const PBT_LOGO_INDEX=Object.fromEntries(PBT_LOGO_ORDER.map((code,i)=>[code,i]));
let PBT_LOGO_LAYER=null,GOOGLE_PBT_LOGOS=[];
function pbtLogoPosition(f){
 const rings=f.geometry.type==='MultiPolygon'?f.geometry.coordinates.flatMap(p=>p):f.geometry.coordinates;
 const outer=rings.reduce((a,b)=>b.length>a.length?b:a,[]);
 if(!outer.length)return null;
 // Polygon area-weighted centroid, with bounds fallback for degenerate rings.
 let twice=0,lng=0,lat=0;
 for(let i=0;i<outer.length;i++){const a=outer[i],b=outer[(i+1)%outer.length],cross=a[0]*b[1]-b[0]*a[1];twice+=cross;lng+=(a[0]+b[0])*cross;lat+=(a[1]+b[1])*cross;}
 if(Math.abs(twice)>1e-10)return [lat/(3*twice),lng/(3*twice)];
 return [(Math.min(...outer.map(p=>p[1]))+Math.max(...outer.map(p=>p[1])))/2,(Math.min(...outer.map(p=>p[0]))+Math.max(...outer.map(p=>p[0])))/2];
}
function pbtLogoHtml(code){const i=PBT_LOGO_INDEX[code];return '<span class="pbt-logo-sprite" style="background-position:-'+(i%4*50)+'px -'+(Math.floor(i/4)*50)+'px" aria-label="Logo '+esc(code)+'"></span>'}
function addLeafletPbtLogos(){
 if(!OFFICIAL_MAP||!OFFICIAL_GEOJSON||PBT_LOGO_LAYER)return;
 PBT_LOGO_LAYER=L.layerGroup();
 OFFICIAL_GEOJSON.features.forEach(f=>{const code=OFFICIAL_PBT_CODES[f.properties.NAMA_PBT],pos=pbtLogoPosition(f);if(!(code in PBT_LOGO_INDEX)||!pos)return;
 const icon=L.divIcon({className:'pbt-crest-marker',html:pbtLogoHtml(code),iconSize:[50,50],iconAnchor:[25,25]});
 L.marker(pos,{icon,keyboard:true,alt:'Logo '+code,zIndexOffset:2000,title:f.properties.NAMA_PBT}).on('click',()=>{$('pbt').value=code;render()}).addTo(PBT_LOGO_LAYER);
 });
 PBT_LOGO_LAYER.addTo(OFFICIAL_MAP);
}
function addGooglePbtLogos(){
 if(!GOOGLE_MAP||!OFFICIAL_GEOJSON||GOOGLE_PBT_LOGOS.length)return;
 OFFICIAL_GEOJSON.features.forEach(f=>{const code=OFFICIAL_PBT_CODES[f.properties.NAMA_PBT],pos=pbtLogoPosition(f),i=PBT_LOGO_INDEX[code];if(i===undefined||!pos)return;
 const marker=new google.maps.Marker({map:GOOGLE_MAP,position:{lat:pos[0],lng:pos[1]},title:f.properties.NAMA_PBT,icon:{url:'pbt-logo-sprite.png',size:new google.maps.Size(50,50),origin:new google.maps.Point(i%4*50,Math.floor(i/4)*50),anchor:new google.maps.Point(25,25)},zIndex:1000});
 marker.addListener('click',()=>{$('pbt').value=code;render()});GOOGLE_PBT_LOGOS.push(marker);
 });
}
