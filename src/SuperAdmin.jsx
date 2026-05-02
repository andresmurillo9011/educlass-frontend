// SuperAdmin.jsx — Panel completo de administración
// Agregar en App.js: import SuperAdmin from './SuperAdmin';
// Y agregar la vista en el router

import { useState, useEffect, useCallback } from "react";

const API = "https://educlass-backend-production-92e6.up.railway.app";

const C = {
  fondo:"#0e1420", panel:"#0a1128", tarjeta:"#111827", borde:"#1e2d45",
  azul:"#2563EB", azulC:"#60A5FA", verde:"#059669", verdeC:"#34D399",
  texto:"#F1F5F9", textoS:"#64748B", err:"#F87171", ok:"#4ADE80",
  naranja:"#F59E0B", morado:"#7C3AED", rojo:"#DC2626",
};

const S = {
  fondo:{minHeight:"100vh",background:C.fondo,display:"flex",fontFamily:"'Segoe UI',Arial,sans-serif",color:C.texto},
  sidebar:{width:220,background:C.panel,borderRight:`1px solid ${C.borde}`,display:"flex",flexDirection:"column",padding:"20px 0",flexShrink:0,position:"sticky",top:0,height:"100vh"},
  sLogo:{padding:"0 20px 20px",borderBottom:`1px solid ${C.borde}`,marginBottom:8},
  sItem:(activo)=>({padding:"10px 20px",cursor:"pointer",background:activo?"#0f2a47":"transparent",borderLeft:activo?`3px solid ${C.azul}`:"3px solid transparent",color:activo?C.azulC:C.textoS,fontSize:13,fontWeight:activo?"600":"400",transition:"all 0.15s",display:"flex",alignItems:"center",gap:8}),
  main:{flex:1,padding:24,overflowY:"auto"},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},
  titulo:{fontSize:20,fontWeight:"bold",margin:0,color:C.texto},
  card:{background:C.tarjeta,border:`1px solid ${C.borde}`,borderRadius:12,padding:20,marginBottom:14},
  grid4:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20},
  statCard:(c)=>({background:C.tarjeta,border:`1px solid ${C.borde}`,borderRadius:10,padding:"16px 20px",textAlign:"center",borderTop:`3px solid ${c}`}),
  inp:{padding:"9px 12px",borderRadius:7,border:`1px solid ${C.borde}`,background:"#0a1128",color:C.texto,fontSize:13,width:"100%",boxSizing:"border-box",outline:"none"},
  sel:{padding:"9px 12px",borderRadius:7,border:`1px solid ${C.borde}`,background:"#0a1128",color:C.texto,fontSize:13,outline:"none",width:"100%"},
  btnA:{padding:"9px 16px",borderRadius:7,border:"none",background:C.azul,color:"#fff",fontWeight:"600",fontSize:13,cursor:"pointer"},
  btnV:{padding:"9px 16px",borderRadius:7,border:"none",background:C.verde,color:"#fff",fontWeight:"600",fontSize:13,cursor:"pointer"},
  btnR:{padding:"9px 16px",borderRadius:7,border:"none",background:C.rojo,color:"#fff",fontWeight:"600",fontSize:13,cursor:"pointer"},
  btnN:{padding:"9px 16px",borderRadius:7,border:"none",background:C.naranja,color:"#fff",fontWeight:"600",fontSize:13,cursor:"pointer"},
  btnSm:{padding:"4px 10px",borderRadius:5,border:`1px solid ${C.borde}`,background:"transparent",color:C.textoS,cursor:"pointer",fontSize:11},
  btnG:{padding:"9px 16px",borderRadius:7,border:`1px solid ${C.borde}`,background:"transparent",color:C.textoS,fontSize:13,cursor:"pointer"},
  fila:{display:"flex",gap:10},
  lbl:{color:C.textoS,fontSize:12,marginBottom:4,fontWeight:"500"},
  err:{color:C.err,fontSize:12,margin:"6px 0 0"},
  ok_msg:{color:C.ok,fontSize:12,margin:"6px 0 0"},
  tag:(c)=>({background:c+"22",border:`1px solid ${c}`,color:c,fontSize:10,padding:"2px 7px",borderRadius:20,display:"inline-block",margin:"1px 2px"}),
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16},
  modal:{background:C.tarjeta,borderRadius:14,border:`1px solid ${C.borde}`,width:"100%",maxWidth:560,maxHeight:"85vh",display:"flex",flexDirection:"column"},
  mHead:{padding:"18px 22px 14px",borderBottom:`1px solid ${C.borde}`,display:"flex",justifyContent:"space-between",alignItems:"center"},
  mBody:{padding:"18px 22px",overflowY:"auto",flex:1,display:"flex",flexDirection:"column",gap:12},
  mFoot:{padding:"14px 22px",borderTop:`1px solid ${C.borde}`,display:"flex",gap:8,justifyContent:"flex-end"},
};

const GRADOS = ["Transición","1°","2°","3°","4°","5°","6°","7°","8°","9°","10°","11°"];

const authH = () => ({ "Content-Type":"application/json", "Authorization":`Bearer ${localStorage.getItem("edutoken")||""}` });

// ── Modal Crear/Editar Estudiante ─────────────────────
function ModalEstudiante({ estudiante, instituciones, docentes, onCerrar, onGuardado }) {
  const editando = !!estudiante;
  const [nombre, setNombre] = useState(estudiante?.name || "");
  const [usuario, setUsuario] = useState(estudiante?.username || "");
  const [password, setPassword] = useState("");
  const [grado, setGrado] = useState(estudiante?.grade || "");
  const [instId, setInstId] = useState(estudiante?.institutionId || "");
  const [docsSelIds, setDocsSelIds] = useState(estudiante?.docentes?.map(d=>d.id) || []);
  const [guardando, setGuardando] = useState(false);
  const [err, setErr] = useState("");

  const toggleDoc = id => setDocsSelIds(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);

  const guardar = async () => {
    if (!nombre || !usuario || (!editando && !password) || !instId) {
      setErr("Completa nombre, usuario, contraseña e institución"); return;
    }
    setGuardando(true); setErr("");
    try {
      const url = editando ? `${API}/superadmin/students/${estudiante.id}` : `${API}/superadmin/students`;
      const method = editando ? "PUT" : "POST";
      const body = { nombre, usuario, grado, institutionId: instId, teacherIds: docsSelIds };
      if (password) body.password = password;

      const r = await fetch(url, { method, headers: authH(), body: JSON.stringify(body) });
      const d = await r.json();
      if (r.ok) onGuardado(d.estudiante, d.mensaje);
      else setErr(d.mensaje || "Error");
    } catch { setErr("Error de conexión"); }
    setGuardando(false);
  };

  const docsInst = docentes.filter(d => d.institutionId === instId);

  return (
    <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&onCerrar()}>
      <div style={S.modal}>
        <div style={S.mHead}>
          <h3 style={{color:C.azulC,margin:0,fontSize:16}}>{editando?"✏️ Editar estudiante":"➕ Crear estudiante"}</h3>
          <button style={{...S.btnSm,fontSize:16}} onClick={onCerrar}>✕</button>
        </div>
        <div style={S.mBody}>
          <div><p style={S.lbl}>Nombre completo *</p><input style={S.inp} value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: Juan Pérez"/></div>
          <div style={S.fila}>
            <div style={{flex:1}}><p style={S.lbl}>Usuario * (sin espacios)</p><input style={S.inp} value={usuario} onChange={e=>setUsuario(e.target.value.toLowerCase().replace(/\s+/g,""))} placeholder="juanperez"/></div>
            <div style={{flex:1}}><p style={S.lbl}>{editando?"Nueva contraseña (opcional)":"Contraseña *"}</p><input type="password" style={S.inp} value={password} onChange={e=>setPassword(e.target.value)} placeholder={editando?"Dejar vacío para no cambiar":"••••••"}/></div>
          </div>
          <div style={S.fila}>
            <div style={{flex:1}}><p style={S.lbl}>Grado</p><select style={S.sel} value={grado} onChange={e=>setGrado(e.target.value)}><option value="">Sin grado</option>{GRADOS.map(g=><option key={g}>{g}</option>)}</select></div>
            <div style={{flex:1}}><p style={S.lbl}>Institución *</p><select style={S.sel} value={instId} onChange={e=>{setInstId(e.target.value);setDocsSelIds([]);}}><option value="">Seleccionar</option>{instituciones.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></div>
          </div>
          {instId && (
            <div>
              <p style={S.lbl}>Asignar docentes ({docsInst.length} disponibles)</p>
              {docsInst.length === 0 ? <p style={{color:C.textoS,fontSize:12}}>No hay docentes en esta institución.</p> : (
                <div style={{maxHeight:160,overflowY:"auto",background:"#0a1128",borderRadius:7,border:`1px solid ${C.borde}`,padding:6}}>
                  {docsInst.map(d=>(
                    <div key={d.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:6,cursor:"pointer",background:docsSelIds.includes(d.id)?"#0f2a47":"transparent"}} onClick={()=>toggleDoc(d.id)}>
                      <div style={{width:16,height:16,borderRadius:3,border:docsSelIds.includes(d.id)?`2px solid ${C.azulC}`:`2px solid ${C.borde}`,background:docsSelIds.includes(d.id)?C.azul:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {docsSelIds.includes(d.id)&&<span style={{color:"white",fontSize:10}}>✓</span>}
                      </div>
                      <span style={{fontSize:12,color:docsSelIds.includes(d.id)?C.azulC:C.texto}}>{d.name}</span>
                      <span style={{fontSize:10,color:C.textoS,marginLeft:"auto"}}>{d.cargo}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {err && <p style={S.err}>{err}</p>}
        </div>
        <div style={S.mFoot}>
          <button style={S.btnG} onClick={onCerrar}>Cancelar</button>
          <button style={{...S.btnV,opacity:guardando?0.7:1}} disabled={guardando} onClick={guardar}>{guardando?"Guardando...":"💾 Guardar"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Asignación Rápida por Grado ─────────────────
function ModalAsignacionGrado({ instituciones, docentes, onCerrar, onDone }) {
  const [instId, setInstId] = useState("");
  const [grado, setGrado] = useState("");
  const [docenteId, setDocenteId] = useState("");
  const [cargando, setCargando] = useState(false);
  const [msg, setMsg] = useState("");

  const asignar = async () => {
    if (!instId || !grado || !docenteId) { setMsg("Completa todos los campos"); return; }
    setCargando(true); setMsg("");
    try {
      const r = await fetch(`${API}/superadmin/assign/teacher-batch`, {
        method: "POST", headers: authH(),
        body: JSON.stringify({ teacherId: docenteId, institutionId: instId, grade: grado })
      });
      const d = await r.json();
      setMsg(d.mensaje || "Listo");
      if (r.ok) setTimeout(() => onDone(), 1500);
    } catch { setMsg("Error de conexión"); }
    setCargando(false);
  };

  const docsInst = docentes.filter(d => d.institutionId === instId);

  return (
    <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&onCerrar()}>
      <div style={{...S.modal,maxWidth:420}}>
        <div style={S.mHead}>
          <h3 style={{color:C.naranja,margin:0,fontSize:16}}>⚡ Asignación masiva por grado</h3>
          <button style={{...S.btnSm,fontSize:16}} onClick={onCerrar}>✕</button>
        </div>
        <div style={S.mBody}>
          <p style={{color:C.textoS,fontSize:13,margin:0}}>Asigna un docente a todos los estudiantes de un grado en una institución.</p>
          <div><p style={S.lbl}>Institución</p><select style={S.sel} value={instId} onChange={e=>{setInstId(e.target.value);setDocenteId("");}}><option value="">Seleccionar</option>{instituciones.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></div>
          <div style={S.fila}>
            <div style={{flex:1}}><p style={S.lbl}>Grado</p><select style={S.sel} value={grado} onChange={e=>setGrado(e.target.value)}><option value="">Seleccionar</option>{GRADOS.map(g=><option key={g}>{g}</option>)}</select></div>
            <div style={{flex:1}}><p style={S.lbl}>Docente</p><select style={S.sel} value={docenteId} onChange={e=>setDocenteId(e.target.value)} disabled={!instId}><option value="">Seleccionar</option>{docsInst.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          </div>
          {msg && <p style={msg.includes("✅")?S.ok_msg:S.err}>{msg}</p>}
        </div>
        <div style={S.mFoot}>
          <button style={S.btnG} onClick={onCerrar}>Cancelar</button>
          <button style={{...S.btnN,opacity:cargando?0.7:1}} disabled={cargando} onClick={asignar}>{cargando?"Asignando...":"⚡ Asignar docente al grado"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Panel principal Super Admin ───────────────────────
export default function SuperAdmin({ usuario, onSalir }) {
  const [seccion, setSeccion] = useState("dashboard");
  const [stats, setStats] = useState({});
  const [instituciones, setInstituciones] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [msg, setMsg] = useState({ texto:"", tipo:"" });

  // Filtros
  const [filtroInst, setFiltroInst] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroDoc, setFiltroDoc] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Selección múltiple
  const [selIds, setSelIds] = useState([]);

  // Modales
  const [modalEst, setModalEst] = useState(null); // null | "nuevo" | {estudiante}
  const [modalGrado, setModalGrado] = useState(false);
  const [modalCambioGrado, setModalCambioGrado] = useState(false);
  const [nuevoGrado, setNuevoGrado] = useState("");

  const mostrarMsg = (texto, tipo="ok") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg({ texto:"", tipo:"" }), 3000);
  };

  const cargarStats = useCallback(async () => {
    try { const r=await fetch(`${API}/superadmin/stats`,{headers:authH()}); const d=await r.json(); setStats(d); } catch(_){}
  }, []);

  const cargarInstituciones = useCallback(async () => {
    try { const r=await fetch(`${API}/superadmin/institutions`,{headers:authH()}); const d=await r.json(); setInstituciones(d.instituciones||[]); } catch(_){}
  }, []);

  const cargarDocentes = useCallback(async () => {
    try { const r=await fetch(`${API}/superadmin/teachers`,{headers:authH()}); const d=await r.json(); setDocentes(d.docentes||[]); } catch(_){}
  }, []);

  const cargarEstudiantes = useCallback(async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (filtroInst) params.append("institutionId", filtroInst);
      if (filtroGrado) params.append("grade", filtroGrado);
      if (filtroDoc) params.append("teacherId", filtroDoc);
      if (busqueda) params.append("search", busqueda);
      const r = await fetch(`${API}/superadmin/students?${params}`, { headers: authH() });
      const d = await r.json();
      setEstudiantes(d.estudiantes||[]);
    } catch(_){}
    setCargando(false);
  }, [filtroInst, filtroGrado, filtroDoc, busqueda]);

  useEffect(() => { cargarStats(); cargarInstituciones(); cargarDocentes(); }, []);
  useEffect(() => { if (seccion === "estudiantes") cargarEstudiantes(); }, [seccion, cargarEstudiantes]);

  const eliminarEstudiante = async id => {
    if (!window.confirm("¿Eliminar este estudiante? Esta acción no se puede deshacer.")) return;
    try {
      const r = await fetch(`${API}/superadmin/students/${id}`, { method:"DELETE", headers:authH() });
      const d = await r.json();
      if (r.ok) { mostrarMsg(d.mensaje); cargarEstudiantes(); cargarStats(); }
      else mostrarMsg(d.mensaje, "err");
    } catch { mostrarMsg("Error al eliminar", "err"); }
  };

  const cambiarGradoMasivo = async () => {
    if (!nuevoGrado || selIds.length === 0) return;
    try {
      const r = await fetch(`${API}/superadmin/assign/grade`, {
        method: "POST", headers: authH(),
        body: JSON.stringify({ studentIds: selIds, grade: nuevoGrado })
      });
      const d = await r.json();
      if (r.ok) { mostrarMsg(d.mensaje); setSelIds([]); setModalCambioGrado(false); setNuevoGrado(""); cargarEstudiantes(); }
      else mostrarMsg(d.mensaje, "err");
    } catch { mostrarMsg("Error", "err"); }
  };

  const toggleSel = id => setSelIds(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const toggleTodos = () => setSelIds(selIds.length === estudiantes.length ? [] : estudiantes.map(e=>e.id));

  const SECCIONES = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"estudiantes", icon:"👨‍🎓", label:"Estudiantes" },
    { id:"docentes", icon:"👨‍🏫", label:"Docentes" },
    { id:"instituciones", icon:"🏫", label:"Instituciones" },
  ];

  return (
    <div style={S.fondo}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.sLogo}>
          <p style={{color:C.azulC,fontWeight:"bold",margin:0,fontSize:14}}>🛡️ Super Admin</p>
          <p style={{color:C.textoS,margin:"3px 0 0",fontSize:11}}>{usuario?.name}</p>
        </div>
        {SECCIONES.map(s=>(
          <div key={s.id} style={S.sItem(seccion===s.id)} onClick={()=>setSeccion(s.id)}>
            <span>{s.icon}</span><span>{s.label}</span>
          </div>
        ))}
        <div style={{marginTop:"auto",padding:"14px 20px",borderTop:`1px solid ${C.borde}`}}>
          <button style={{...S.btnSm,width:"100%",color:C.err,borderColor:C.rojo,padding:"7px 0"}} onClick={onSalir}>← Salir del panel</button>
        </div>
      </div>

      {/* Main */}
      <div style={S.main}>
        {/* Mensaje global */}
        {msg.texto && (
          <div style={{background:msg.tipo==="ok"?"#052e16":"#2d0a0a",border:`1px solid ${msg.tipo==="ok"?C.ok:C.err}`,borderRadius:8,padding:"10px 16px",marginBottom:16}}>
            <p style={{color:msg.tipo==="ok"?C.ok:C.err,margin:0,fontSize:13,fontWeight:"bold"}}>{msg.texto}</p>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {seccion==="dashboard"&&(
          <>
            <div style={S.header}><h1 style={S.titulo}>📊 Dashboard General</h1></div>
            <div style={S.grid4}>
              {[{l:"Instituciones",v:stats.instituciones||0,c:C.azul,i:"🏫"},{l:"Docentes",v:stats.docentes||0,c:C.verde,i:"👨‍🏫"},{l:"Estudiantes",v:stats.estudiantes||0,c:C.naranja,i:"👨‍🎓"},{l:"Tareas",v:stats.tareas||0,c:C.morado,i:"📋"}].map(s=>(
                <div key={s.l} style={S.statCard(s.c)}>
                  <p style={{fontSize:28,margin:"0 0 4px"}}>{s.i}</p>
                  <p style={{color:s.c,fontSize:28,fontWeight:"bold",margin:"0 0 4px"}}>{s.v}</p>
                  <p style={{color:C.textoS,fontSize:12,margin:0}}>{s.l}</p>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <h3 style={{color:C.texto,margin:"0 0 12px",fontSize:14}}>Acciones rápidas</h3>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button style={S.btnV} onClick={()=>setSeccion("estudiantes")}>👨‍🎓 Gestionar estudiantes</button>
                <button style={S.btnA} onClick={()=>setSeccion("docentes")}>👨‍🏫 Ver docentes</button>
                <button style={S.btnN} onClick={()=>{setSeccion("estudiantes");setModalGrado(true);}}>⚡ Asignación masiva</button>
              </div>
            </div>
          </>
        )}

        {/* ── ESTUDIANTES ── */}
        {seccion==="estudiantes"&&(
          <>
            <div style={S.header}>
              <h1 style={S.titulo}>👨‍🎓 Estudiantes</h1>
              <div style={{display:"flex",gap:8}}>
                {selIds.length>0&&(
                  <button style={S.btnN} onClick={()=>setModalCambioGrado(true)}>📚 Cambiar grado ({selIds.length})</button>
                )}
                <button style={S.btnN} onClick={()=>setModalGrado(true)}>⚡ Asignación masiva</button>
                <button style={S.btnV} onClick={()=>setModalEst("nuevo")}>➕ Nuevo estudiante</button>
              </div>
            </div>

            {/* Filtros */}
            <div style={{...S.card,padding:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 2fr auto",gap:10,alignItems:"end"}}>
                <div><p style={{...S.lbl,marginBottom:4}}>Institución</p><select style={S.sel} value={filtroInst} onChange={e=>setFiltroInst(e.target.value)}><option value="">Todas</option>{instituciones.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></div>
                <div><p style={{...S.lbl,marginBottom:4}}>Grado</p><select style={S.sel} value={filtroGrado} onChange={e=>setFiltroGrado(e.target.value)}><option value="">Todos</option>{GRADOS.map(g=><option key={g}>{g}</option>)}</select></div>
                <div><p style={{...S.lbl,marginBottom:4}}>Docente</p><select style={S.sel} value={filtroDoc} onChange={e=>setFiltroDoc(e.target.value)}><option value="">Todos</option>{docentes.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                <div><p style={{...S.lbl,marginBottom:4}}>Buscar nombre</p><input style={S.inp} placeholder="Buscar..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} onKeyDown={e=>e.key==="Enter"&&cargarEstudiantes()}/></div>
                <button style={S.btnA} onClick={cargarEstudiantes}>🔍 Buscar</button>
              </div>
            </div>

            {/* Tabla */}
            <div style={S.card}>
              {cargando ? (
                <p style={{color:C.textoS,textAlign:"center",padding:24}}>Cargando...</p>
              ) : estudiantes.length===0 ? (
                <p style={{color:C.textoS,textAlign:"center",padding:24}}>No se encontraron estudiantes.</p>
              ) : (
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <p style={{color:C.textoS,fontSize:12,margin:0}}>{estudiantes.length} estudiantes · {selIds.length} seleccionados</p>
                    <button style={{...S.btnSm,fontSize:11}} onClick={toggleTodos}>{selIds.length===estudiantes.length?"Deseleccionar todos":"Seleccionar todos"}</button>
                  </div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                      <thead>
                        <tr style={{background:"#0a1128"}}>
                          <th style={{padding:"8px 10px",textAlign:"left",color:C.azulC,borderBottom:`1px solid ${C.borde}`,width:30}}>☑</th>
                          {["Nombre","Usuario","Grado","Institución","Docentes","Acciones"].map(h=>(
                            <th key={h} style={{padding:"8px 10px",textAlign:"left",color:C.azulC,borderBottom:`1px solid ${C.borde}`,whiteSpace:"nowrap"}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {estudiantes.map((e,i)=>(
                          <tr key={e.id} style={{background:i%2===0?"#0a1128":"#0d1528",borderBottom:`1px solid ${C.borde}`}}>
                            <td style={{padding:"8px 10px"}}>
                              <div style={{width:16,height:16,borderRadius:3,border:selIds.includes(e.id)?`2px solid ${C.azulC}`:`2px solid ${C.borde}`,background:selIds.includes(e.id)?C.azul:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>toggleSel(e.id)}>
                                {selIds.includes(e.id)&&<span style={{color:"white",fontSize:10}}>✓</span>}
                              </div>
                            </td>
                            <td style={{padding:"8px 10px",fontWeight:"bold",color:C.texto}}>{e.name}</td>
                            <td style={{padding:"8px 10px",color:C.textoS}}>@{e.username}</td>
                            <td style={{padding:"8px 10px"}}><span style={S.tag(C.azulC)}>{e.grade||"—"}</span></td>
                            <td style={{padding:"8px 10px",color:C.textoS,fontSize:11}}>{e.institucion||"—"}</td>
                            <td style={{padding:"8px 10px",maxWidth:200}}>
                              {e.docentes?.length===0 ? <span style={{color:"#374151",fontSize:10}}>Sin docente</span> : e.docentes?.map(d=><span key={d.id} style={S.tag(C.verdeC)}>{d.name}</span>)}
                            </td>
                            <td style={{padding:"8px 10px",whiteSpace:"nowrap"}}>
                              <div style={{display:"flex",gap:4}}>
                                <button style={{...S.btnSm,color:C.azulC,borderColor:C.azul,fontSize:10}} onClick={()=>setModalEst(e)}>✏️ Editar</button>
                                <button style={{...S.btnSm,color:C.err,borderColor:C.rojo,fontSize:10}} onClick={()=>eliminarEstudiante(e.id)}>🗑</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ── DOCENTES ── */}
        {seccion==="docentes"&&(
          <>
            <div style={S.header}><h1 style={S.titulo}>👨‍🏫 Docentes</h1></div>
            <div style={S.card}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{background:"#0a1128"}}>{["Nombre","Email","Cargo","Institución","Tareas"].map(h=>(<th key={h} style={{padding:"8px 10px",textAlign:"left",color:C.azulC,borderBottom:`1px solid ${C.borde}`}}>{h}</th>))}</tr></thead>
                <tbody>{docentes.map((d,i)=>(<tr key={d.id} style={{background:i%2===0?"#0a1128":"#0d1528",borderBottom:`1px solid ${C.borde}`}}><td style={{padding:"8px 10px",fontWeight:"bold",color:C.texto}}>{d.name}</td><td style={{padding:"8px 10px",color:C.textoS}}>{d.email}</td><td style={{padding:"8px 10px"}}><span style={S.tag(C.morado)}>{d.cargo}</span></td><td style={{padding:"8px 10px",color:C.textoS,fontSize:11}}>{d.institucion}</td><td style={{padding:"8px 10px",color:C.naranja,fontWeight:"bold"}}>{d.totalTareas}</td></tr>))}</tbody>
              </table>
            </div>
          </>
        )}

        {/* ── INSTITUCIONES ── */}
        {seccion==="instituciones"&&(
          <>
            <div style={S.header}><h1 style={S.titulo}>🏫 Instituciones</h1></div>
            <div style={S.grid4}>
              {instituciones.map(inst=>(
                <div key={inst.id} style={{...S.card,borderTop:`3px solid ${C.azul}`}}>
                  <p style={{color:C.azulC,fontWeight:"bold",margin:"0 0 6px",fontSize:13}}>{inst.name}</p>
                  <p style={{color:C.textoS,fontSize:11,margin:"0 0 10px"}}>{inst.city||"Sin ciudad"}</p>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{textAlign:"center",flex:1}}><p style={{color:C.verde,fontSize:18,fontWeight:"bold",margin:0}}>{inst.totalDocentes}</p><p style={{color:C.textoS,fontSize:10,margin:0}}>Docentes</p></div>
                    <div style={{textAlign:"center",flex:1}}><p style={{color:C.naranja,fontSize:18,fontWeight:"bold",margin:0}}>{inst.totalEstudiantes}</p><p style={{color:C.textoS,fontSize:10,margin:0}}>Estudiantes</p></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modales */}
      {modalEst&&(
        <ModalEstudiante
          estudiante={modalEst==="nuevo"?null:modalEst}
          instituciones={instituciones}
          docentes={docentes}
          onCerrar={()=>setModalEst(null)}
          onGuardado={(est,msg)=>{mostrarMsg(msg);setModalEst(null);cargarEstudiantes();cargarStats();}}
        />
      )}
      {modalGrado&&(
        <ModalAsignacionGrado
          instituciones={instituciones}
          docentes={docentes}
          onCerrar={()=>setModalGrado(false)}
          onDone={()=>{setModalGrado(false);cargarEstudiantes();mostrarMsg("Asignación completada ✅");}}
        />
      )}
      {modalCambioGrado&&(
        <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&setModalCambioGrado(false)}>
          <div style={{...S.modal,maxWidth:360}}>
            <div style={S.mHead}><h3 style={{color:C.naranja,margin:0,fontSize:15}}>📚 Cambiar grado</h3><button style={{...S.btnSm,fontSize:16}} onClick={()=>setModalCambioGrado(false)}>✕</button></div>
            <div style={S.mBody}>
              <p style={{color:C.textoS,fontSize:13,margin:0}}>Cambiar grado de {selIds.length} estudiante{selIds.length!==1?"s":""} seleccionado{selIds.length!==1?"s":""}.</p>
              <div><p style={S.lbl}>Nuevo grado</p><select style={S.sel} value={nuevoGrado} onChange={e=>setNuevoGrado(e.target.value)}><option value="">Seleccionar grado</option>{GRADOS.map(g=><option key={g}>{g}</option>)}</select></div>
            </div>
            <div style={S.mFoot}>
              <button style={S.btnG} onClick={()=>setModalCambioGrado(false)}>Cancelar</button>
              <button style={S.btnN} onClick={cambiarGradoMasivo} disabled={!nuevoGrado}>📚 Cambiar grado</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
