import { useState, useRef } from "react";

const API = "https://educlass-backend-production-92e6.up.railway.app";
const F_TITULO = "Georgia, 'Times New Roman', serif";
const F_CUERPO = "'Segoe UI', Arial, sans-serif";

// ── Estrategias ───────────────────────────────────────
const OPT_P_APERTURA=[
  {id:"cuento_p",label:"📚 Cuento pedagógico",desc:"Historia creativa relacionada con el tema"},
  {id:"cancion",label:"🎵 Canción / rima",desc:"Rima o canción para motivar"},
  {id:"pregunta",label:"❓ Pregunta impactante",desc:"Preguntas que generan asombro"},
  {id:"video",label:"🎬 Video sugerido",desc:"Video real de YouTube sobre el tema"},
  {id:"imagen",label:"🖼️ Imagen contextual",desc:"Imagen pedagógica ideal"},
  {id:"juego_i",label:"🎮 Juego de inicio",desc:"Dinámica lúdica para captar atención"},
];
const OPT_P_DESARROLLO=[
  {id:"juego_s",label:"🎯 Sopa de letras",desc:"Vocabulario en sopa de letras"},
  {id:"bingo",label:"🎰 Bingo educativo",desc:"Conceptos clave en bingo"},
  {id:"memoria",label:"🧠 Memoria conceptual",desc:"Pares de tarjetas"},
  {id:"manualidad",label:"✂️ Manualidad educativa",desc:"Maqueta, dibujo o cartel"},
  {id:"descubr",label:"🔍 Aprendizaje por descubrimiento",desc:"Experimento sencillo"},
  {id:"rincones",label:"🏫 Rincones de aprendizaje",desc:"Estaciones con actividades"},
  {id:"roles_p",label:"🎭 Juego de roles",desc:"Representar personajes"},
  {id:"lluvia_p",label:"💭 Lluvia de ideas",desc:"Aportes libres"},
];
const OPT_P_RETRO=[
  {id:"vf",label:"✅ Verdadero / Falso",desc:"Afirmaciones para validar"},
  {id:"completar",label:"📝 Completar espacios",desc:"Párrafo con espacios"},
  {id:"dibujo_r",label:"🎨 Dibujo evaluativo",desc:"Dibujar lo aprendido"},
  {id:"preguntas",label:"❓ Preguntas rápidas",desc:"5 preguntas directas"},
  {id:"relacionar",label:"🔗 Relacionar conceptos",desc:"Dos columnas"},
  {id:"ruleta",label:"🎡 Ruleta de preguntas",desc:"Preguntas al azar"},
];
const OPT_B_APERTURA=[
  {id:"problema",label:"🧩 Situación problema",desc:"Caso real de Colombia"},
  {id:"dato",label:"🔢 Dato curioso",desc:"Datos sorprendentes"},
  {id:"pregunta",label:"❓ Pregunta impactante",desc:"Pensamiento crítico"},
  {id:"video",label:"🎬 Video sugerido",desc:"Video de YouTube"},
  {id:"noticia",label:"📰 Noticia actual",desc:"Noticia reciente"},
  {id:"debate_i",label:"⚖️ Debate inicial",desc:"Postura inicial"},
];
const OPT_B_DESARROLLO=[
  {id:"magistral",label:"🎓 Clase magistral",desc:"Explicación guiada"},
  {id:"abp",label:"🧩 ABP",desc:"Aprendizaje Basado en Problemas"},
  {id:"debate_b",label:"⚖️ Debate académico",desc:"Defender posturas"},
  {id:"caso_b",label:"🔬 Estudio de caso",desc:"Analizar situaciones"},
  {id:"proyecto_b",label:"📁 Proyecto interdisciplinario",desc:"Integrar varias áreas"},
  {id:"invertida",label:"🔄 Clase invertida",desc:"Teoría en casa"},
  {id:"simulacion",label:"🎮 Simulación",desc:"Empresas, juicios, lab"},
  {id:"mapa_av",label:"🗺️ Mapa conceptual",desc:"Síntesis estructurada"},
];
const OPT_B_RETRO=[
  {id:"caso",label:"🔍 Caso práctico",desc:"Análisis crítico"},
  {id:"ensayo_c",label:"✍️ Ensayo corto",desc:"Párrafo argumentativo"},
  {id:"preguntas",label:"❓ Preguntas de análisis",desc:"Pensamiento crítico"},
  {id:"relacionar",label:"🔗 Relacionar conceptos",desc:"Dos columnas"},
  {id:"vf",label:"✅ Verdadero / Falso",desc:"Afirmaciones"},
  {id:"debate_r",label:"💬 Debate corto",desc:"Posiciones opuestas"},
];
const OPT_CIERRE=[
  {id:"resumen",label:"📋 Resumen colectivo",desc:"Construyen un resumen"},
  {id:"metacog",label:"💭 Metacognición",desc:"¿Qué aprendí?"},
  {id:"mapa_c",label:"🗺️ Mapa mental final",desc:"Organizan lo aprendido"},
  {id:"compromiso",label:"🤝 Compromiso",desc:"¿Cómo aplicaré esto?"},
  {id:"ticket",label:"🎫 Ticket de salida",desc:"1 aprendizaje y 1 duda"},
];
const OPT_TAREA=[
  {id:"investiga",label:"🔎 Investigación libre",desc:"Consultar fuentes"},
  {id:"entrevista",label:"🎤 Entrevista familiar",desc:"Preguntar en casa"},
  {id:"dibujo",label:"🎨 Dibujo / esquema",desc:"Representar visualmente"},
  {id:"redaccion",label:"✏️ Redacción",desc:"Escribir párrafo"},
  {id:"video_c",label:"📱 Video explicativo",desc:"Grabar explicación"},
];
const OPT_DURACION=[
  {val:"55",label:"1 hora (55 min)"},
  {val:"110",label:"2 horas (110 min)"},
  {val:"165",label:"3 horas (165 min)"},
  {val:"220",label:"4 horas (220 min)"},
];

const C={
  fondo:"#0e1420",panel:"#0a1128",tarjeta:"#111827",borde:"#1e2d45",
  azul:"#2563EB",azulC:"#60A5FA",verde:"#059669",verdeC:"#34D399",
  texto:"#F1F5F9",textoS:"#64748B",err:"#F87171",ok:"#4ADE80",
  naranja:"#F59E0B",morado:"#7C3AED",rojo:"#DC2626",dorado:"#D97706",
};

const S={
  pantalla:{minHeight:"100vh",background:C.fondo,display:"flex",justifyContent:"center",alignItems:"center",fontFamily:F_CUERPO},
  fondo:{minHeight:"100vh",background:C.fondo,fontFamily:F_CUERPO,color:C.texto},
  header:{background:C.panel,padding:"0 28px",height:60,display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`2px solid ${C.azul}`,position:"sticky",top:0,zIndex:100},
  logo:{color:C.azulC,fontSize:19,fontWeight:"bold",fontFamily:F_TITULO},
  contenedor:{maxWidth:980,margin:"0 auto",padding:"28px 16px"},
  card:{background:C.tarjeta,padding:"38px 34px",borderRadius:16,width:"100%",maxWidth:520,display:"flex",flexDirection:"column",gap:18,boxShadow:"0 12px 40px rgba(0,0,0,0.6)",border:`1px solid ${C.borde}`},
  titulo:{color:C.azulC,fontSize:26,fontWeight:"bold",margin:0,textAlign:"center",fontFamily:F_TITULO},
  sub:{color:C.textoS,textAlign:"center",margin:"0 0 8px",fontSize:14},
  label:{color:C.textoS,fontSize:13,marginBottom:6,fontWeight:"500"},
  input:{padding:"11px 14px",borderRadius:8,border:`1px solid ${C.borde}`,background:"#0a1128",color:C.texto,fontSize:14,width:"100%",boxSizing:"border-box",fontFamily:F_CUERPO,outline:"none"},
  textarea:{padding:"11px 14px",borderRadius:8,border:`1px solid ${C.borde}`,background:"#0a1128",color:C.texto,fontSize:14,width:"100%",boxSizing:"border-box",fontFamily:F_CUERPO,outline:"none",resize:"vertical",minHeight:100},
  select:{padding:"11px 14px",borderRadius:8,border:`1px solid ${C.borde}`,background:"#0a1128",color:C.texto,fontSize:14,flex:1,fontFamily:F_CUERPO,outline:"none"},
  btnAzul:{padding:"12px 20px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${C.azul},#1d4ed8)`,color:"#fff",fontWeight:"700",fontSize:14,cursor:"pointer",width:"100%",fontFamily:F_TITULO},
  btnGris:{padding:"11px 20px",borderRadius:9,border:`1px solid ${C.borde}`,background:"transparent",color:C.textoS,fontSize:14,cursor:"pointer",width:"100%",fontFamily:F_CUERPO},
  btnVerde:{padding:"12px 20px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${C.verde},#047857)`,color:"#fff",fontWeight:"700",fontSize:14,cursor:"pointer",width:"100%",fontFamily:F_TITULO},
  btnNaranja:{padding:"12px 20px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${C.naranja},#b45309)`,color:"#fff",fontWeight:"700",fontSize:14,cursor:"pointer",fontFamily:F_TITULO},
  btnRojo:{padding:"12px 20px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${C.rojo},#991b1b)`,color:"#fff",fontWeight:"700",fontSize:14,cursor:"pointer",fontFamily:F_TITULO},
  btnSm:{padding:"6px 13px",borderRadius:7,border:`1px solid ${C.borde}`,background:"transparent",color:C.textoS,cursor:"pointer",fontSize:12},
  fila:{display:"flex",gap:12},
  bloque:{background:C.tarjeta,padding:26,borderRadius:14,marginBottom:18,border:`1px solid ${C.borde}`,boxShadow:"0 4px 20px rgba(0,0,0,0.3)"},
  tBloque:{color:C.azulC,fontSize:20,marginBottom:8,marginTop:0,fontFamily:F_TITULO,fontWeight:"bold"},
  desc:{color:C.textoS,fontSize:14,marginBottom:18,lineHeight:1.6},
  grid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},
  opcion:(sel)=>({padding:14,borderRadius:10,border:sel?`2px solid ${C.azulC}`:`1px solid ${C.borde}`,background:sel?"#0f2a47":"#0a1128",cursor:"pointer",transition:"all 0.2s"}),
  oLbl:{color:C.texto,fontWeight:"700",fontSize:14,margin:0},
  oDesc:{color:C.textoS,fontSize:12,margin:"4px 0 0"},
  pasos:{display:"flex",gap:6,marginBottom:26,justifyContent:"center",flexWrap:"wrap"},
  pasoBola:(a,c2)=>({width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:"bold",background:c2?C.verde:a?C.azul:"#111827",color:(c2||a)?"white":"#4a5a70",border:a?`2px solid ${C.azulC}`:c2?`2px solid ${C.verde}`:`1px solid ${C.borde}`}),
  resultado:{background:C.tarjeta,padding:26,borderRadius:14,border:`1px solid ${C.borde}`},
  pre:{whiteSpace:"pre-wrap",color:"#CBD5E1",fontSize:13,lineHeight:2,margin:0,fontFamily:"'Courier New', monospace"},
  sep:{borderTop:`1px solid ${C.borde}`,margin:"18px 0"},
  chip:{display:"inline-block",background:"#0f2a47",border:`1px solid ${C.azul}`,color:C.azulC,padding:"4px 12px",borderRadius:20,fontSize:12,margin:3},
  err:{color:C.err,textAlign:"center",margin:0,fontSize:14},
  ok_msg:{color:C.ok,textAlign:"center",margin:0,fontSize:14},
  badge:(col)=>({background:col,color:"#fff",fontSize:11,fontWeight:"bold",padding:"2px 8px",borderRadius:20,marginLeft:6}),
};

function Opciones({lista,val,set}){
  return(<div style={S.grid}>{lista.map(op=>(<div key={op.id} style={S.opcion(val===op.id)} onClick={()=>set(op.id)}><p style={S.oLbl}>{op.label}</p><p style={S.oDesc}>{op.desc}</p></div>))}</div>);
}

function SubirImagen({label,preview,inputRef,onChange}){
  return(
    <div style={{textAlign:"center"}}>
      <p style={{...S.label,textAlign:"center"}}>{label}</p>
      <div style={{width:86,height:86,borderRadius:10,border:`2px dashed ${C.borde}`,background:"#0a1128",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer",margin:"0 auto"}} onClick={()=>inputRef.current.click()}>
        {preview?<img src={preview} alt={label} style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<span style={{fontSize:28,color:C.textoS}}>📷</span>}
      </div>
      <p style={{color:C.textoS,fontSize:11,margin:"4px 0 0"}}>Click para subir</p>
      <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={onChange}/>
    </div>
  );
}

function DashCard({icon,titulo,desc,color,onClick,badge,disabled}){
  const [hover,setHover]=useState(false);
  return(
    <div onClick={disabled?null:onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{background:hover&&!disabled?"#131f35":"#0f1a2e",border:`1.5px solid ${hover&&!disabled?color:C.borde}`,borderRadius:14,padding:"22px 18px",cursor:disabled?"not-allowed":"pointer",transition:"all 0.2s",position:"relative",opacity:disabled?0.5:1,boxShadow:hover&&!disabled?`0 4px 20px ${color}33`:"none"}}>
      {badge&&<span style={{position:"absolute",top:10,right:10,background:color,color:"#fff",fontSize:10,fontWeight:"bold",padding:"2px 8px",borderRadius:20}}>{badge}</span>}
      <div style={{fontSize:34,marginBottom:10}}>{icon}</div>
      <p style={{color:C.texto,fontWeight:"bold",fontSize:15,margin:"0 0 5px",fontFamily:F_TITULO}}>{titulo}</p>
      <p style={{color:C.textoS,fontSize:13,margin:"0 0 12px",lineHeight:1.4}}>{desc}</p>
      <div style={{display:"inline-block",background:disabled?C.borde:color,color:disabled?C.textoS:"#fff",padding:"5px 12px",borderRadius:7,fontSize:12,fontWeight:"bold"}}>
        {disabled?"Próximamente":"Abrir →"}
      </div>
    </div>
  );
}

function TarjetaClase({clase,onVer,onEliminar}){
  const fecha=new Date(clase.creadaEn).toLocaleDateString("es-CO",{day:"2-digit",month:"short",year:"numeric"});
  return(
    <div style={{background:"#0a1128",border:`1px solid ${C.borde}`,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <p style={{color:C.azulC,fontWeight:"bold",margin:"0 0 4px",fontSize:15}}>{clase.datos?.tema||"Sin título"}</p>
          <p style={{color:C.textoS,fontSize:12,margin:"0 0 3px"}}>{clase.datos?.area} · Grado {clase.datos?.grado} · {fecha}</p>
        </div>
        <div style={{display:"flex",gap:7,marginLeft:10,flexShrink:0}}>
          <button style={{...S.btnSm,color:C.azulC,borderColor:C.azul}} onClick={()=>onVer(clase)}>👁 Ver</button>
          <button style={{...S.btnSm,color:C.err,borderColor:C.rojo}} onClick={()=>onEliminar(clase.id)}>🗑</button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
//  APP PRINCIPAL
// ======================================================
export default function App() {
  // ── Detectar portal estudiante por URL ───────────────
  const urlParams = new URLSearchParams(window.location.search);
  const codigoUrl = window.location.pathname.includes("/tarea/")
    ? window.location.pathname.split("/tarea/")[1]
    : urlParams.get("codigo");

  // ── Auth ──────────────────────────────────────────────
  const [vista,    setVista]   = useState(codigoUrl ? "portal_estudiante" : "login");
  const [usuario,  setUsuario] = useState(null);
  const [nombre,   setNombre]  = useState("");
  const [email,    setEmail]   = useState("");
  const [password, setPassword]= useState("");
  const [msgAuth,  setMsgAuth] = useState("");

  // Registro
  const [regInst,setRegInst]=useState("");
  const [regCargo,setRegCargo]=useState("Docente");
  const [regCiudad,setRegCiudad]=useState("");

  // Perfil
  const [logoPreview,   setLogoPreview]   = useState("");
  const [banderaPreview,setBanderaPreview]= useState("");
  const [logoFile,      setLogoFile]      = useState(null);
  const [banderaFile,   setBanderaFile]   = useState(null);
  const logoRef    = useRef();
  const banderaRef = useRef();

  // Datos
  const [misClases,   setMisClases]   = useState([]);
  const [misTareas,   setMisTareas]   = useState([]);
  const [claseActiva, setClaseActiva] = useState(null);
  const [tareaActiva, setTareaActiva] = useState(null);
  const [entregas,    setEntregas]    = useState([]);
  const [sinEntregar, setSinEntregar] = useState([]);

  // Wizard clase
  const [paso,setPaso]=useState(1);
  const [institucion,setInstitucion]=useState("");
  const [docente,setDocente]=useState("");
  const [area,setArea]=useState("");
  const [grado,setGrado]=useState("");
  const [periodo,setPeriodo]=useState("1");
  const [fecha,setFecha]=useState("");
  const [tema,setTema]=useState("");
  const [duracion,setDuracion]=useState("55");
  const [nivelEdu,setNivelEdu]=useState("");
  const [apertura,setApertura]=useState("");
  const [desarrollo,setDesarrollo]=useState("");
  const [retro,setRetro]=useState("");
  const [cierre,setCierre]=useState("");
  const [dejaTarea,setDejaTarea]=useState(null);
  const [tarea,setTarea]=useState("");

  // Resultado clase
  const [contenido,setContenido]=useState("");
  const [cargando,setCargando]=useState(false);
  const [descargando,setDescargando]=useState(false);
  const [descPdf,setDescPdf]=useState(false);
  const [guardando,setGuardando]=useState(false);
  const [guardadoOk,setGuardadoOk]=useState(false);

  // Crear tarea
  const [nuevaTarea_titulo,setNuevaTarea_titulo]=useState("");
  const [nuevaTarea_desc,setNuevaTarea_desc]=useState("");
  const [nuevaTarea_fecha,setNuevaTarea_fecha]=useState("");
  const [estudiantesTexto,setEstudiantesTexto]=useState("");
  const [tareaCreada,setTareaCreada]=useState(null);
  const [creandoTarea,setCreandoTarea]=useState(false);

  // Calificación
  const [calNota,setCalNota]=useState("");
  const [calComentario,setCalComentario]=useState("");
  const [calEntregaId,setCalEntregaId]=useState(null);

  // Portal estudiante
  const [est_codigo,setEst_codigo]=useState(codigoUrl||"");
  const [est_usuario,setEst_usuario]=useState("");
  const [est_password,setEst_password]=useState("");
  const [est_msg,setEst_msg]=useState("");
  const [est_sesion,setEst_sesion]=useState(null);
  const [est_tarea,setEst_tarea]=useState(null);
  const [est_yaEntrego,setEst_yaEntrego]=useState(false);
  const [est_entrega,setEst_entrega]=useState(null);
  const [est_respuesta,setEst_respuesta]=useState("");
  const [est_archivo,setEst_archivo]=useState(null);
  const [est_enviando,setEst_enviando]=useState(false);
  // eslint-disable-next-line no-unused-vars
  const [est_calificacion,setEst_calificacion]=useState(null);
  const archivoRef=useRef();

  const optApertura  = nivelEdu==="bachillerato"?OPT_B_APERTURA :OPT_P_APERTURA;
  const optDesarrollo= nivelEdu==="bachillerato"?OPT_B_DESARROLLO:OPT_P_DESARROLLO;
  const optRetro     = nivelEdu==="bachillerato"?OPT_B_RETRO     :OPT_P_RETRO;

  const cargarPerfil=(u)=>{ setInstitucion(u.institucion||""); setDocente(u.nombre||""); if(u.logoPath)setLogoPreview(`${API}/${u.logoPath}`); if(u.banderaPath)setBanderaPreview(`${API}/${u.banderaPath}`); };
  const cargarClases=async(uid)=>{ try{const r=await fetch(`${API}/mis-clases/${uid}`);const d=await r.json();setMisClases(d.clases||[]);}catch(_){} };
  const cargarTareas=async(uid)=>{ try{const r=await fetch(`${API}/mis-tareas/${uid}`);const d=await r.json();setMisTareas(d.tareas||[]);}catch(_){} };

  const reset=()=>{
    setPaso(1);setArea("");setGrado("");setPeriodo("1");setFecha("");setTema("");setDuracion("55");
    setNivelEdu("");setApertura("");setDesarrollo("");setRetro("");setCierre("");
    setDejaTarea(null);setTarea("");setContenido("");setGuardadoOk(false);setClaseActiva(null);
    if(usuario)cargarPerfil(usuario);
  };

  // Auth
  const login=async()=>{
    if(!email){setMsgAuth("Ingresa tu correo");return;}
    try{
      const r=await fetch(`${API}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      const d=await r.json();
      if(r.ok){setUsuario(d.usuario);cargarPerfil(d.usuario);setVista("dashboard");setMsgAuth("");cargarClases(d.usuario.id);cargarTareas(d.usuario.id);}
      else setMsgAuth(d.mensaje||"Error");
    }catch{setMsgAuth("No se pudo conectar al servidor");}
  };
  const registrar=async()=>{
    if(!nombre||!email||!password){setMsgAuth("Completa nombre, correo y contraseña");return;}
    try{
      const r=await fetch(`${API}/registro`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre,email,password,institucion:regInst,cargo:regCargo,ciudad:regCiudad})});
      const d=await r.json();setMsgAuth(d.mensaje);
      if(r.ok)setTimeout(()=>{setVista("login");setMsgAuth("");},1600);
    }catch{setMsgAuth("Error en el registro");}
  };
  const salir=()=>{setVista("login");setUsuario(null);reset();setEmail("");setPassword("");setMsgAuth("");setMisClases([]);setMisTareas([]);setLogoPreview("");setBanderaPreview("");};
  const subirPerfil=async()=>{
    if(!usuario)return;
    const form=new FormData();
    form.append("userId",usuario.id);form.append("nombre",usuario.nombre);
    form.append("institucion",institucion);form.append("cargo",usuario.cargo||"Docente");form.append("ciudad",usuario.ciudad||"");
    if(logoFile)form.append("logo",logoFile);
    if(banderaFile)form.append("bandera",banderaFile);
    try{const r=await fetch(`${API}/actualizar-perfil`,{method:"POST",body:form});const d=await r.json();if(r.ok){setUsuario(d.usuario);setLogoFile(null);setBanderaFile(null);alert("Perfil guardado ✅");}else alert(d.mensaje);}
    catch{alert("Error guardando perfil");}
  };

  const generarGuia=async()=>{
    setCargando(true);setContenido("");setPaso(7);setGuardadoOk(false);
    const getLbl=(l,id)=>l.find(x=>x.id===id)?.label||id;
    try{
      const r=await fetch(`${API}/generar-guia`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        institucion,docente,area,grado,periodo,fecha,tema,duracion,
        cargo:usuario?.cargo||"Docente",ciudad:usuario?.ciudad||"",nivelEducativo:nivelEdu,
        tipoApertura:getLbl(optApertura,apertura),estratDesarrollo:getLbl(optDesarrollo,desarrollo),
        retroalimentacion:getLbl(optRetro,retro),tipoCierre:getLbl(OPT_CIERRE,cierre),
        dejaTarea,estratTarea:getLbl(OPT_TAREA,tarea),
      })});
      const d=await r.json();setContenido(d.contenido||d.mensaje||"Sin contenido.");
    }catch{setContenido("❌ Error de conexión.");}
    setCargando(false);
  };

  const guardarClase=async()=>{
    if(!contenido||!usuario)return;setGuardando(true);
    try{const r=await fetch(`${API}/guardar-clase`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:usuario.id,contenido,datos:{institucion,docente,area,grado,periodo,fecha,tema,duracion}})});const d=await r.json();if(r.ok){setGuardadoOk(true);cargarClases(usuario.id);}else alert(d.mensaje);}
    catch{alert("Error guardando");}
    setGuardando(false);
  };

  const exportar=async(tipo)=>{
    if(!contenido||contenido.startsWith("❌")){alert("Genera una guía primero");return;}
    tipo==="word"?setDescargando(true):setDescPdf(true);
    try{
      const r=await fetch(`${API}/exportar-${tipo}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contenido,institucion,docente,area,grado,periodo,fecha,tema,duracion,logoPath:usuario?.logoPath||"",banderaPath:usuario?.banderaPath||"",cargo:usuario?.cargo||"Docente",ciudad:usuario?.ciudad||""})});
      if(!r.ok){alert(`Error generando ${tipo}`);tipo==="word"?setDescargando(false):setDescPdf(false);return;}
      const blob=await r.blob();const url=URL.createObjectURL(blob);
      const a=document.createElement("a");a.href=url;a.download=`PlanAula_${area}_Grado${grado}.${tipo==="word"?"docx":"pdf"}`;a.click();URL.revokeObjectURL(url);
    }catch{alert(`Error exportando ${tipo}`);}
    tipo==="word"?setDescargando(false):setDescPdf(false);
  };

  const eliminarClase=async(id)=>{if(!window.confirm("¿Eliminar?"))return;try{await fetch(`${API}/clase/${id}`,{method:"DELETE"});cargarClases(usuario.id);}catch{alert("Error");}};
  const eliminarTarea=async(id)=>{if(!window.confirm("¿Eliminar esta tarea y sus entregas?"))return;try{await fetch(`${API}/tarea/${id}`,{method:"DELETE"});cargarTareas(usuario.id);}catch{alert("Error");}};

  // Crear tarea
  const crearTarea=async()=>{
    if(!nuevaTarea_titulo||!estudiantesTexto){alert("Completa el título y la lista de estudiantes");return;}
    setCreandoTarea(true);
    const lista=estudiantesTexto.split("\n").map(s=>s.trim()).filter(s=>s.length>0);
    try{
      const r=await fetch(`${API}/crear-tarea`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({docenteId:usuario.id,titulo:nuevaTarea_titulo,descripcion:nuevaTarea_desc,area,grado,fecha,fechaEntrega:nuevaTarea_fecha,estudiantesLista:lista})});
      const d=await r.json();
      if(r.ok){setTareaCreada(d);cargarTareas(usuario.id);}else alert(d.mensaje);
    }catch{alert("Error creando tarea");}
    setCreandoTarea(false);
  };

  // Ver entregas
  const verEntregas=async(t)=>{
    setTareaActiva(t);
    try{const r=await fetch(`${API}/entregas-tarea/${t.id}`);const d=await r.json();setEntregas(d.entregas||[]);setSinEntregar(d.sinEntregar||[]);}
    catch{alert("Error cargando entregas");}
    setVista("ver_entregas");
  };

  const calificar=async()=>{
    if(!calNota){alert("Ingresa una calificación");return;}
    try{const r=await fetch(`${API}/calificar-entrega`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({entregaId:calEntregaId,calificacion:calNota,comentario:calComentario})});const d=await r.json();if(r.ok){alert("Calificación guardada ✅");setCalEntregaId(null);setCalNota("");setCalComentario("");verEntregas(tareaActiva);}else alert(d.mensaje);}
    catch{alert("Error calificando");}
  };

  // ── PORTAL ESTUDIANTE ──────────────────────────────
  const loginEstudiante=async()=>{
    if(!est_codigo||!est_usuario||!est_password){setEst_msg("Completa todos los campos");return;}
    try{
      const r=await fetch(`${API}/login-estudiante`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({codigo:est_codigo,usuario:est_usuario,password:est_password})});
      const d=await r.json();
      if(r.ok){setEst_sesion(d.estudiante);setEst_tarea(d.tarea);setEst_yaEntrego(d.yaEntrego);setEst_entrega(d.entrega);setEst_msg("");
        if(d.entrega?.calificacion!=null)setEst_calificacion(d.entrega);
      }else setEst_msg(d.mensaje||"Error");
    }catch{setEst_msg("No se pudo conectar al servidor");}
  };

  const entregarTarea=async()=>{
    if(!est_respuesta&&!est_archivo){alert("Escribe una respuesta o sube un archivo");return;}
    setEst_enviando(true);
    try{
      const form=new FormData();
      form.append("tareaId",est_tarea.id);
      form.append("estudianteId",est_sesion.id);
      form.append("respuesta",est_respuesta);
      if(est_archivo)form.append("archivo",est_archivo);
      const r=await fetch(`${API}/entregar-tarea`,{method:"POST",body:form});
      const d=await r.json();
      if(r.ok){setEst_yaEntrego(true);setEst_entrega(d.entrega);alert("Tarea entregada exitosamente ✅");}
      else alert(d.mensaje);
    }catch{alert("Error enviando tarea");}
    setEst_enviando(false);
  };

  // ── HEADER ────────────────────────────────────────────
  const Header=({showNav=true})=>(
    <div style={S.header}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <span style={S.logo}>🎓 EduClass Premium</span>
        {showNav&&(
          <div style={{display:"flex",gap:4}}>
            <button style={{...S.btnSm,color:vista==="dashboard"?C.azulC:C.textoS,borderColor:vista==="dashboard"?C.azul:C.borde}} onClick={()=>setVista("dashboard")}>🏠 Inicio</button>
            <button style={{...S.btnSm,color:vista==="ia"?C.azulC:C.textoS,borderColor:vista==="ia"?C.azul:C.borde}} onClick={()=>{reset();setVista("ia");}}>📝 Nueva clase</button>
            <button style={{...S.btnSm,color:[("historial","tareas","crear_tarea","ver_entregas")].includes(vista)?C.naranja:C.textoS,borderColor:C.borde}} onClick={()=>setVista("tareas")}>📋 Tareas {misTareas.length>0&&<span style={S.badge(C.naranja)}>{misTareas.length}</span>}</button>
            <button style={{...S.btnSm,color:vista==="historial"?C.verdeC:C.textoS,borderColor:vista==="historial"?C.verde:C.borde}} onClick={()=>setVista("historial")}>📂 Mis clases {misClases.length>0&&<span style={S.badge(C.verde)}>{misClases.length}</span>}</button>
          </div>
        )}
      </div>
      {showNav&&(
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {logoPreview&&<img src={logoPreview} alt="L" style={{width:30,height:30,borderRadius:5,objectFit:"contain",border:`1px solid ${C.borde}`}}/>}
          {banderaPreview&&<img src={banderaPreview} alt="B" style={{width:30,height:30,borderRadius:5,objectFit:"contain",border:`1px solid ${C.borde}`}}/>}
          <span style={{color:C.textoS,fontSize:12}}>👤 {usuario?.nombre}</span>
          <button style={{...S.btnSm,color:C.azulC,borderColor:C.azul}} onClick={()=>setVista("perfil")}>⚙️</button>
          <button style={{...S.btnSm,color:C.err,borderColor:C.rojo}} onClick={salir}>Salir</button>
        </div>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════
  //  PORTAL ESTUDIANTE
  // ══════════════════════════════════════════════════════
  if(vista==="portal_estudiante") return(
    <div style={{...S.fondo,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{...S.card,maxWidth:480}}>
        <div style={{textAlign:"center"}}>
          <span style={{fontSize:48}}>📚</span>
          <h1 style={{...S.titulo,fontSize:22,marginTop:8}}>Portal del Estudiante</h1>
          <p style={S.sub}>EduClass Premium — Entrega de Tareas</p>
        </div>

        {!est_sesion?(
          <>
            <div><p style={S.label}>Código de la tarea</p><input style={S.input} placeholder="Ej: ABC123" value={est_codigo} onChange={e=>setEst_codigo(e.target.value.toUpperCase())}/></div>
            <div><p style={S.label}>Tu usuario</p><input style={S.input} placeholder="Usuario que te dio el docente" value={est_usuario} onChange={e=>setEst_usuario(e.target.value)}/></div>
            <div><p style={S.label}>Contraseña</p><input type="password" style={S.input} placeholder="Contraseña que te dio el docente" value={est_password} onChange={e=>setEst_password(e.target.value)} onKeyDown={e=>e.key==="Enter"&&loginEstudiante()}/></div>
            <button style={S.btnAzul} onClick={loginEstudiante}>Ingresar a mi tarea</button>
            {est_msg&&<p style={S.err}>{est_msg}</p>}
            <button style={S.btnGris} onClick={()=>setVista("login")}>← Soy docente</button>
          </>
        ):(
          <>
            <div style={{background:"#0a1128",borderRadius:10,padding:16,border:`1px solid ${C.borde}`}}>
              <p style={{color:C.ok,fontWeight:"bold",margin:"0 0 4px"}}>👋 Hola, {est_sesion.nombre}</p>
              <p style={{color:C.azulC,fontWeight:"bold",fontSize:17,margin:"0 0 6px"}}>{est_tarea?.titulo}</p>
              <p style={{color:C.textoS,fontSize:13,margin:"0 0 4px"}}>{est_tarea?.area} · Grado {est_tarea?.grado}</p>
              {est_tarea?.fechaEntrega&&<p style={{color:C.naranja,fontSize:13,margin:0}}>📅 Entrega: {est_tarea.fechaEntrega}</p>}
            </div>

            {est_tarea?.descripcion&&(
              <div style={{background:"#0f2a47",borderRadius:8,padding:14,border:`1px solid ${C.azul}`}}>
                <p style={{color:C.azulC,fontWeight:"bold",margin:"0 0 6px",fontSize:13}}>📋 Descripción de la tarea:</p>
                <p style={{color:C.texto,fontSize:13,margin:0,lineHeight:1.6}}>{est_tarea.descripcion}</p>
              </div>
            )}

            {!est_yaEntrego?(
              <>
                <div>
                  <p style={S.label}>✏️ Tu respuesta / desarrollo</p>
                  <textarea style={S.textarea} placeholder="Escribe aquí tu respuesta, desarrollo o explicación..." value={est_respuesta} onChange={e=>setEst_respuesta(e.target.value)}/>
                </div>
                <div>
                  <p style={S.label}>📎 Adjuntar archivo (foto, PDF, documento)</p>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <button style={{...S.btnGris,width:"auto",padding:"9px 16px"}} onClick={()=>archivoRef.current.click()}>📁 Seleccionar archivo</button>
                    {est_archivo&&<span style={{color:C.ok,fontSize:13}}>✅ {est_archivo.name}</span>}
                  </div>
                  <input ref={archivoRef} type="file" accept=".pdf,.docx,.doc,.jpg,.jpeg,.png" style={{display:"none"}} onChange={e=>setEst_archivo(e.target.files[0])}/>
                </div>
                <button style={{...S.btnVerde,opacity:est_enviando?0.7:1}} disabled={est_enviando} onClick={entregarTarea}>
                  {est_enviando?"⏳ Enviando...":"📤 Entregar tarea"}
                </button>
              </>
            ):(
              <div style={{background:"#052e16",borderRadius:10,padding:18,border:`1px solid ${C.ok}`}}>
                <p style={{color:C.ok,fontWeight:"bold",fontSize:16,margin:"0 0 8px"}}>✅ Tarea entregada</p>
                {est_entrega?.calificacion!=null?(
                  <>
                    <p style={{color:C.texto,margin:"0 0 6px",fontSize:14}}>Tu calificación:</p>
                    <p style={{color:C.naranja,fontSize:28,fontWeight:"bold",margin:"0 0 8px",fontFamily:F_TITULO}}>{est_entrega.calificacion}</p>
                    {est_entrega?.comentario&&<p style={{color:C.textoS,fontSize:13,margin:0,fontStyle:"italic"}}>💬 {est_entrega.comentario}</p>}
                  </>
                ):(
                  <p style={{color:C.textoS,fontSize:13,margin:0}}>Tu docente aún no ha calificado. Vuelve más tarde.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  //  LOGIN / REGISTRO DOCENTE
  // ══════════════════════════════════════════════════════
  if(vista==="login") return(
    <div style={S.pantalla}>
      <div style={S.card}>
        <div style={{textAlign:"center"}}><span style={{fontSize:50}}>🎓</span><h1 style={S.titulo}>EduClass Premium</h1><p style={S.sub}>Plataforma de guías pedagógicas con IA</p></div>
        <div><p style={S.label}>Correo electrónico</p><input style={S.input} placeholder="docente@colegio.edu.co" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/></div>
        <div><p style={S.label}>Contraseña</p><input type="password" style={S.input} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/></div>
        <button style={S.btnAzul} onClick={login}>Ingresar a la plataforma</button>
        <button style={S.btnGris} onClick={()=>{setVista("registro");setMsgAuth("");}}>Crear cuenta nueva</button>
        <div style={S.sep}/>
        <button style={{...S.btnGris,borderColor:C.naranja,color:C.naranja}} onClick={()=>setVista("portal_estudiante")}>📚 Soy estudiante — Entregar tarea</button>
        {msgAuth&&<p style={S.err}>{msgAuth}</p>}
      </div>
    </div>
  );

  if(vista==="registro") return(
    <div style={S.pantalla}>
      <div style={{...S.card,maxWidth:540}}>
        <h1 style={{...S.titulo,color:C.ok}}>Registro de Docente 🧑‍🏫</h1>
        <p style={S.sub}>Crea tu cuenta para acceder a la plataforma</p>
        <div><p style={S.label}>Nombre completo *</p><input style={S.input} placeholder="Ej: María González" value={nombre} onChange={e=>setNombre(e.target.value)}/></div>
        <div><p style={S.label}>Correo electrónico *</p><input style={S.input} placeholder="docente@colegio.edu.co" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div><p style={S.label}>Contraseña *</p><input type="password" style={S.input} placeholder="Mínimo 6 caracteres" value={password} onChange={e=>setPassword(e.target.value)}/></div>
        <div style={S.sep}/>
        <div><p style={S.label}>Institución (opcional)</p><input style={S.input} placeholder="I.E. Rural La Esperanza" value={regInst} onChange={e=>setRegInst(e.target.value)}/></div>
        <div style={S.fila}>
          <div style={{flex:1}}><p style={S.label}>Cargo</p><select style={S.select} value={regCargo} onChange={e=>setRegCargo(e.target.value)}>{["Docente","Coordinador/a","Rector/a","Orientador/a","Otro"].map(c=><option key={c}>{c}</option>)}</select></div>
          <div style={{flex:1}}><p style={S.label}>Ciudad</p><input style={S.input} placeholder="Bogotá" value={regCiudad} onChange={e=>setRegCiudad(e.target.value)}/></div>
        </div>
        <button style={S.btnVerde} onClick={registrar}>Registrarme</button>
        <button style={S.btnGris} onClick={()=>{setVista("login");setMsgAuth("");}}>← Volver</button>
        {msgAuth&&<p style={msgAuth.includes("exitoso")?S.ok_msg:S.err}>{msgAuth}</p>}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  //  DASHBOARD
  // ══════════════════════════════════════════════════════
  if(vista==="dashboard") return(
    <div style={S.fondo}>
      <Header/>
      <div style={S.contenedor}>
        {/* Bienvenida */}
        <div style={{background:`linear-gradient(135deg,#0f2a47,#0a1a35)`,borderRadius:16,padding:"24px 28px",marginBottom:24,border:`1px solid ${C.azul}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
          <div>
            <h2 style={{color:C.texto,fontSize:20,margin:"0 0 4px",fontFamily:F_TITULO}}>¡Bienvenido/a, {usuario?.nombre?.split(" ")[0]}! 👋</h2>
            <p style={{color:C.textoS,margin:"0 0 3px",fontSize:13}}>{usuario?.cargo||"Docente"} · {usuario?.institucion||"Sin institución"}</p>
            <p style={{color:C.textoS,margin:0,fontSize:12}}>{usuario?.ciudad||""}</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{background:"#0a1128",border:`1px solid ${C.borde}`,borderRadius:10,padding:"12px 18px",textAlign:"center",minWidth:70}}>
              <p style={{color:C.azulC,fontSize:22,fontWeight:"bold",margin:0}}>{misClases.length}</p>
              <p style={{color:C.textoS,fontSize:11,margin:0}}>Clases</p>
            </div>
            <div style={{background:"#0a1128",border:`1px solid ${C.borde}`,borderRadius:10,padding:"12px 18px",textAlign:"center",minWidth:70}}>
              <p style={{color:C.naranja,fontSize:22,fontWeight:"bold",margin:0}}>{misTareas.length}</p>
              <p style={{color:C.textoS,fontSize:11,margin:0}}>Tareas</p>
            </div>
          </div>
        </div>

        {/* Módulos principales */}
        <p style={{color:C.textoS,fontSize:12,fontWeight:"600",letterSpacing:1,textTransform:"uppercase",margin:"0 0 14px"}}>Módulos principales</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12,marginBottom:24}}>
          <DashCard icon="📝" titulo="Nueva clase" desc="Crea una guía pedagógica completa con IA" color={C.azul} onClick={()=>{reset();setVista("ia");}}/>
          <DashCard icon="📋" titulo="Tareas" desc="Asigna tareas y revisa entregas de estudiantes" color={C.naranja} onClick={()=>setVista("tareas")} badge={misTareas.filter(t=>t.totalEntregas>0).length||null}/>
          <DashCard icon="📂" titulo="Mis clases" desc="Consulta y descarga tus clases guardadas" color={C.verdeC} onClick={()=>setVista("historial")} badge={misClases.length||null}/>
          <DashCard icon="⚙️" titulo="Mi perfil" desc="Actualiza datos, escudo y bandera" color={C.morado} onClick={()=>setVista("perfil")}/>
        </div>

        <p style={{color:C.textoS,fontSize:12,fontWeight:"600",letterSpacing:1,textTransform:"uppercase",margin:"0 0 14px"}}>Próximamente</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12,marginBottom:24}}>
          <DashCard icon="📊" titulo="Evaluaciones" desc="Crea evaluaciones y rúbricas" color={C.rojo} disabled/>
          <DashCard icon="📅" titulo="Planeador anual" desc="Planea todo el año escolar" color={C.dorado} disabled/>
          <DashCard icon="👥" titulo="Mis estudiantes" desc="Gestiona tus grupos" color={C.verdeC} disabled/>
          <DashCard icon="📈" titulo="Reportes" desc="Estadísticas y desempeño" color={C.azulC} disabled/>
        </div>

        {/* Clases recientes */}
        {misClases.length>0&&(
          <>
            <p style={{color:C.textoS,fontSize:12,fontWeight:"600",letterSpacing:1,textTransform:"uppercase",margin:"0 0 14px"}}>Clases recientes</p>
            <div style={S.bloque}>
              {misClases.slice(0,3).map(c=>(<TarjetaClase key={c.id} clase={c} onVer={async(clase)=>{const r=await fetch(`${API}/clase/${clase.id}`);const d=await r.json();setClaseActiva(d.clase);setVista("verClase");}} onEliminar={eliminarClase}/>))}
              {misClases.length>3&&<button style={{...S.btnGris,marginTop:8}} onClick={()=>setVista("historial")}>Ver todas ({misClases.length}) →</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  //  TAREAS
  // ══════════════════════════════════════════════════════
  if(vista==="tareas") return(
    <div style={S.fondo}>
      <Header/>
      <div style={S.contenedor}>
        <div style={S.bloque}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={S.tBloque}>📋 Gestión de Tareas</h2>
            <button style={{...S.btnAzul,width:"auto",padding:"10px 18px"}} onClick={()=>setVista("crear_tarea")}>+ Nueva tarea</button>
          </div>

          {misTareas.length===0?(
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <p style={{fontSize:48,margin:"0 0 14px"}}>📋</p>
              <p style={{color:C.textoS,fontSize:15,margin:"0 0 6px"}}>No tienes tareas creadas aún.</p>
              <p style={{color:"#374151",fontSize:13,margin:"0 0 20px"}}>Crea una tarea, comparte el código o link con tus estudiantes y ellos entregarán desde su portal.</p>
              <button style={{...S.btnVerde,width:"auto",padding:"11px 22px"}} onClick={()=>setVista("crear_tarea")}>Crear primera tarea</button>
            </div>
          ):(
            misTareas.map(t=>(
              <div key={t.id} style={{background:"#0a1128",border:`1px solid ${C.borde}`,borderRadius:10,padding:"16px 18px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                  <div style={{flex:1}}>
                    <p style={{color:C.azulC,fontWeight:"bold",margin:"0 0 4px",fontSize:15}}>{t.titulo}</p>
                    <p style={{color:C.textoS,fontSize:12,margin:"0 0 6px"}}>{t.area} · Grado {t.grado} · Código: <span style={{color:C.naranja,fontWeight:"bold"}}>{t.codigo}</span></p>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      <span style={{...S.badge(C.azul),fontSize:12,padding:"3px 10px"}}>👥 {t.totalEstudiantes} estudiantes</span>
                      <span style={{...S.badge(t.totalEntregas>0?C.verde:C.textoS),fontSize:12,padding:"3px 10px"}}>📤 {t.totalEntregas} entregas</span>
                      {t.fechaEntrega&&<span style={{...S.badge(C.naranja),fontSize:12,padding:"3px 10px"}}>📅 {t.fechaEntrega}</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:7,flexShrink:0}}>
                    <button style={{...S.btnSm,color:C.azulC,borderColor:C.azul}} onClick={()=>verEntregas(t)}>📊 Ver entregas</button>
                    <button style={{...S.btnSm,color:C.ok,borderColor:C.verde}} onClick={()=>{navigator.clipboard.writeText(`https://educlass-frontend.vercel.app?codigo=${t.codigo}`);alert("Link copiado ✅");}}>🔗 Copiar link</button>
                    <button style={{...S.btnSm,color:C.err,borderColor:C.rojo}} onClick={()=>eliminarTarea(t.id)}>🗑</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  //  CREAR TAREA
  // ══════════════════════════════════════════════════════
  if(vista==="crear_tarea") return(
    <div style={S.fondo}>
      <Header/>
      <div style={S.contenedor}>
        {!tareaCreada?(
          <div style={S.bloque}>
            <button style={{...S.btnSm,marginBottom:18}} onClick={()=>setVista("tareas")}>← Volver</button>
            <h2 style={S.tBloque}>+ Nueva tarea para estudiantes</h2>
            <p style={S.desc}>Crea la tarea, agrega los estudiantes y comparte el código o link. Ellos ingresan con usuario y contraseña.</p>

            <div style={{...S.fila,marginBottom:14}}>
              <div style={{flex:2}}><p style={S.label}>Título de la tarea *</p><input style={S.input} placeholder="Ej: Investigación sobre ecosistemas" value={nuevaTarea_titulo} onChange={e=>setNuevaTarea_titulo(e.target.value)}/></div>
            </div>
            <div style={{marginBottom:14}}><p style={S.label}>Descripción / instrucciones para el estudiante</p><textarea style={S.textarea} placeholder="Escribe aquí las instrucciones detalladas de la tarea..." value={nuevaTarea_desc} onChange={e=>setNuevaTarea_desc(e.target.value)}/></div>
            <div style={{...S.fila,marginBottom:14}}>
              <div style={{flex:1}}><p style={S.label}>Área</p><select style={S.select} value={area} onChange={e=>setArea(e.target.value)}><option value="">Seleccionar</option>{["Ciencias Naturales","Ciencias Sociales","Matemáticas","Lengua Castellana","Inglés","Educación Física","Artística","Ética","Tecnología","Filosofía","Química","Física","Biología"].map(m=><option key={m}>{m}</option>)}</select></div>
              <div style={{flex:1}}><p style={S.label}>Grado</p><select style={S.select} value={grado} onChange={e=>setGrado(e.target.value)}><option value="">Seleccionar</option>{["1°","2°","3°","4°","5°","6°","7°","8°","9°","10°","11°"].map(g=><option key={g}>{g}</option>)}</select></div>
              <div style={{flex:1}}><p style={S.label}>Fecha de entrega</p><input type="date" style={S.input} value={nuevaTarea_fecha} onChange={e=>setNuevaTarea_fecha(e.target.value)}/></div>
            </div>
            <div style={{marginBottom:20}}>
              <p style={S.label}>Lista de estudiantes * (uno por línea, entre 15 y 20)</p>
              <textarea style={{...S.textarea,minHeight:180}} placeholder={"Juan Pérez\nMaría García\nCarlos López\nAna Martínez\n..."} value={estudiantesTexto} onChange={e=>setEstudiantesTexto(e.target.value)}/>
              <p style={{color:C.textoS,fontSize:12,margin:"6px 0 0"}}>{estudiantesTexto.split("\n").filter(s=>s.trim()).length} estudiantes ingresados</p>
            </div>
            <button style={{...S.btnVerde,opacity:creandoTarea?0.7:1}} disabled={creandoTarea} onClick={crearTarea}>
              {creandoTarea?"⏳ Creando tarea...":"✅ Crear tarea y generar credenciales"}
            </button>
          </div>
        ):(
          <div style={S.bloque}>
            <div style={{background:"#052e16",border:`1px solid ${C.ok}`,borderRadius:12,padding:20,marginBottom:20}}>
              <p style={{color:C.ok,fontWeight:"bold",fontSize:18,margin:"0 0 8px"}}>✅ Tarea creada exitosamente</p>
              <p style={{color:C.texto,margin:"0 0 4px"}}><strong>Título:</strong> {tareaCreada.tarea?.titulo}</p>
              <p style={{color:C.texto,margin:"0 0 4px"}}><strong>Código de acceso:</strong> <span style={{color:C.naranja,fontSize:20,fontWeight:"bold"}}>{tareaCreada.tarea?.codigo}</span></p>
              <p style={{color:C.texto,margin:"0 0 12px"}}><strong>Link directo:</strong> <span style={{color:C.azulC,fontSize:13}}>https://educlass-frontend.vercel.app?codigo={tareaCreada.tarea?.codigo}</span></p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button style={{...S.btnAzul,width:"auto",padding:"9px 16px"}} onClick={()=>{navigator.clipboard.writeText(`https://educlass-frontend.vercel.app?codigo=${tareaCreada.tarea?.codigo}`);alert("Link copiado ✅");}}>🔗 Copiar link</button>
                <button style={{...S.btnNaranja,width:"auto",padding:"9px 16px"}} onClick={()=>{
                  const txt=tareaCreada.estudiantes?.map(e=>`${e.nombre} | Usuario: ${e.usuario} | Contraseña: ${e.password}`).join("\n");
                  navigator.clipboard.writeText(`TAREA: ${tareaCreada.tarea?.titulo}\nCódigo: ${tareaCreada.tarea?.codigo}\n\nCREDENCIALES:\n${txt}`);
                  alert("Credenciales copiadas ✅");
                }}>📋 Copiar credenciales</button>
              </div>
            </div>

            <h3 style={{color:C.azulC,margin:"0 0 14px",fontFamily:F_TITULO}}>Credenciales de estudiantes</h3>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead>
                  <tr style={{background:"#0a1128"}}>
                    {["Nombre","Usuario","Contraseña"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",color:C.azulC,borderBottom:`1px solid ${C.borde}`}}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tareaCreada.estudiantes?.map((e,i)=>(
                    <tr key={i} style={{background:i%2===0?"#0a1128":"#0d1528"}}>
                      <td style={{padding:"9px 14px",color:C.texto,borderBottom:`1px solid ${C.borde}`}}>{e.nombre}</td>
                      <td style={{padding:"9px 14px",color:C.naranja,borderBottom:`1px solid ${C.borde}`,fontFamily:"monospace"}}>{e.usuario}</td>
                      <td style={{padding:"9px 14px",color:C.ok,borderBottom:`1px solid ${C.borde}`,fontFamily:"monospace"}}>{e.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{color:C.textoS,fontSize:12,margin:"12px 0 16px"}}>💡 Comparte el código y las credenciales con cada estudiante. Ellos ingresan en: <strong>https://educlass-frontend.vercel.app?codigo={tareaCreada.tarea?.codigo}</strong></p>
            <div style={S.fila}>
              <button style={S.btnVerde} onClick={()=>{setTareaCreada(null);setNuevaTarea_titulo("");setNuevaTarea_desc("");setEstudiantesTexto("");setNuevaTarea_fecha("");setVista("tareas");}}>Ir a mis tareas</button>
              <button style={S.btnGris} onClick={()=>{setTareaCreada(null);setNuevaTarea_titulo("");setNuevaTarea_desc("");setEstudiantesTexto("");setNuevaTarea_fecha("");}}>+ Crear otra tarea</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  //  VER ENTREGAS
  // ══════════════════════════════════════════════════════
  if(vista==="ver_entregas"&&tareaActiva) return(
    <div style={S.fondo}>
      <Header/>
      <div style={S.contenedor}>
        <button style={{...S.btnSm,marginBottom:18}} onClick={()=>setVista("tareas")}>← Volver a tareas</button>
        <div style={S.bloque}>
          <h2 style={S.tBloque}>📊 Entregas — {tareaActiva.titulo}</h2>
          <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
            <span style={S.chip}>📚 {tareaActiva.area}</span>
            <span style={S.chip}>🎓 Grado {tareaActiva.grado}</span>
            <span style={{...S.chip,borderColor:C.ok,color:C.ok}}>✅ {entregas.length} entregaron</span>
            <span style={{...S.chip,borderColor:C.err,color:C.err}}>⏳ {sinEntregar.length} pendientes</span>
          </div>

          {/* Calificador */}
          {calEntregaId&&(
            <div style={{background:"#0f2a47",border:`1px solid ${C.azul}`,borderRadius:10,padding:18,marginBottom:20}}>
              <h3 style={{color:C.azulC,margin:"0 0 14px"}}>✏️ Calificar entrega</h3>
              <div style={S.fila}>
                <div style={{flex:1}}><p style={S.label}>Calificación (ej: 4.5, Excelente, 85/100)</p><input style={S.input} placeholder="Ej: 4.5" value={calNota} onChange={e=>setCalNota(e.target.value)}/></div>
              </div>
              <div style={{marginTop:12}}><p style={S.label}>Comentario / corrección (opcional)</p><textarea style={S.textarea} placeholder="Escribe observaciones, correcciones o felicitaciones..." value={calComentario} onChange={e=>setCalComentario(e.target.value)}/></div>
              <div style={{...S.fila,marginTop:14}}>
                <button style={{...S.btnVerde,width:"auto",padding:"10px 20px"}} onClick={calificar}>💾 Guardar calificación</button>
                <button style={{...S.btnGris,width:"auto"}} onClick={()=>{setCalEntregaId(null);setCalNota("");setCalComentario("");}}>Cancelar</button>
              </div>
            </div>
          )}

          {/* Entregas recibidas */}
          {entregas.length>0&&(
            <>
              <p style={{color:C.ok,fontWeight:"bold",margin:"0 0 12px"}}>📤 Entregas recibidas ({entregas.length})</p>
              {entregas.map(e=>(
                <div key={e.id} style={{background:"#0a1128",border:`1px solid ${C.borde}`,borderRadius:10,padding:16,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                    <div style={{flex:1}}>
                      <p style={{color:C.texto,fontWeight:"bold",margin:"0 0 4px"}}>{e.nombreEstudiante}</p>
                      <p style={{color:C.textoS,fontSize:12,margin:"0 0 6px"}}>📅 {new Date(e.entregadoEn).toLocaleString("es-CO")}</p>
                      {e.respuesta&&<p style={{color:"#CBD5E1",fontSize:13,margin:"0 0 6px",fontStyle:"italic",background:"#0d1528",padding:"8px 12px",borderRadius:6}}>"{e.respuesta.substring(0,200)}{e.respuesta.length>200?"...":""}"</p>}
                      {e.archivoNombre&&<p style={{color:C.azulC,fontSize:12,margin:0}}>📎 {e.archivoNombre}</p>}
                      {e.calificacion!=null&&<p style={{color:C.naranja,fontWeight:"bold",margin:"6px 0 0"}}>✅ Calificado: {e.calificacion} {e.comentario&&`— ${e.comentario}`}</p>}
                    </div>
                    <div style={{display:"flex",gap:7,flexShrink:0}}>
                      {e.archivoNombre&&<a href={`${API}/descargar-entrega/${e.tareaId}/${e.estudianteId}`} style={{...S.btnSm,color:C.azulC,borderColor:C.azul,textDecoration:"none",padding:"6px 12px",borderRadius:7,fontSize:12}}>⬇️ Archivo</a>}
                      <button style={{...S.btnSm,color:C.naranja,borderColor:C.naranja}} onClick={()=>{setCalEntregaId(e.id);setCalNota(e.calificacion||"");setCalComentario(e.comentario||"");}}>
                        {e.calificacion!=null?"✏️ Editar nota":"📝 Calificar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Sin entregar */}
          {sinEntregar.length>0&&(
            <>
              <p style={{color:C.err,fontWeight:"bold",margin:"16px 0 12px"}}>⏳ Pendientes por entregar ({sinEntregar.length})</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                {sinEntregar.map((e,i)=>(
                  <div key={i} style={{background:"#1a0a0a",border:`1px solid ${C.rojo}33`,borderRadius:8,padding:"10px 14px"}}>
                    <p style={{color:C.textoS,margin:0,fontSize:13}}>{e.nombreEstudiante}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  //  PERFIL
  // ══════════════════════════════════════════════════════
  if(vista==="perfil") return(
    <div style={S.fondo}>
      <Header/>
      <div style={S.contenedor}>
        <div style={S.bloque}>
          <button style={{...S.btnSm,marginBottom:18}} onClick={()=>setVista("dashboard")}>← Volver al inicio</button>
          <h2 style={S.tBloque}>⚙️ Mi perfil institucional</h2>
          <p style={S.desc}>Sube el escudo y la bandera de tu institución. Aparecerán en Word y PDF.</p>
          <div style={{display:"flex",gap:40,justifyContent:"center",marginBottom:26}}>
            <SubirImagen label="🏫 Escudo" preview={logoPreview} inputRef={logoRef} onChange={e=>{const f=e.target.files[0];if(f){setLogoFile(f);setLogoPreview(URL.createObjectURL(f));}}}/>
            <SubirImagen label="🚩 Bandera" preview={banderaPreview} inputRef={banderaRef} onChange={e=>{const f=e.target.files[0];if(f){setBanderaFile(f);setBanderaPreview(URL.createObjectURL(f));}}}/>
          </div>
          <div style={S.sep}/>
          <div style={{...S.fila,marginBottom:12}}>
            <div style={{flex:2}}><p style={S.label}>Institución educativa</p><input style={S.input} value={institucion} onChange={e=>setInstitucion(e.target.value)}/></div>
            <div style={{flex:1}}><p style={S.label}>Cargo</p><select style={S.select} value={usuario?.cargo||"Docente"} onChange={e=>setUsuario({...usuario,cargo:e.target.value})}>{["Docente","Coordinador/a","Rector/a","Orientador/a","Otro"].map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div style={{...S.fila,marginBottom:22}}>
            <div style={{flex:1}}><p style={S.label}>Ciudad</p><input style={S.input} value={usuario?.ciudad||""} onChange={e=>setUsuario({...usuario,ciudad:e.target.value})}/></div>
            <div style={{flex:1}}><p style={S.label}>Municipio</p><input style={S.input} value={usuario?.municipio||""} onChange={e=>setUsuario({...usuario,municipio:e.target.value})}/></div>
          </div>
          <button style={{...S.btnVerde,width:"auto",padding:"12px 26px"}} onClick={subirPerfil}>💾 Guardar perfil y logos</button>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  //  HISTORIAL
  // ══════════════════════════════════════════════════════
  if(vista==="historial") return(
    <div style={S.fondo}>
      <Header/>
      <div style={S.contenedor}>
        <div style={S.bloque}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={S.tBloque}>📂 Mis clases guardadas</h2>
            <button style={{...S.btnVerde,width:"auto",padding:"10px 18px"}} onClick={()=>{reset();setVista("ia");}}>+ Nueva guía</button>
          </div>
          {misClases.length===0?<p style={{color:C.textoS,textAlign:"center",padding:30}}>Aún no tienes clases guardadas.</p>
            :misClases.map(c=>(<TarjetaClase key={c.id} clase={c} onVer={async(clase)=>{const r=await fetch(`${API}/clase/${clase.id}`);const d=await r.json();setClaseActiva(d.clase);setVista("verClase");}} onEliminar={eliminarClase}/>))}
        </div>
      </div>
    </div>
  );

  // Ver clase
  if(vista==="verClase"&&claseActiva) return(
    <div style={S.fondo}>
      <Header/>
      <div style={S.contenedor}>
        <button style={{...S.btnSm,marginBottom:16}} onClick={()=>setVista("historial")}>← Volver</button>
        <div style={S.resultado}>
          <h2 style={{color:C.azulC,fontSize:20,marginBottom:4,marginTop:0,fontFamily:F_TITULO}}>{claseActiva.datos?.tema}</h2>
          <p style={{color:C.textoS,fontSize:13,marginBottom:20}}>{claseActiva.datos?.area} · Grado {claseActiva.datos?.grado}</p>
          <div style={S.sep}/>
          <pre style={S.pre}>{claseActiva.contenido}</pre>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  //  CREADOR PASO A PASO
  // ══════════════════════════════════════════════════════
  const PASOS=["Nivel","Datos","Apertura","Desarrollo","Retroalim.","Cierre","Resultado"];
  return(
    <div style={S.fondo}>
      <Header/>
      <div style={S.contenedor}>
        {paso<7&&(
          <div style={S.pasos}>
            {PASOS.map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={S.pasoBola(paso===i+1,paso>i+1)}>{paso>i+1?"✓":i+1}</div>
                <span style={{color:paso===i+1?C.azulC:"#4a5a70",fontSize:11}}>{p}</span>
                {i<PASOS.length-1&&<span style={{color:C.borde,margin:"0 2px",fontSize:14}}>›</span>}
              </div>
            ))}
          </div>
        )}

        {paso===1&&(<div style={S.bloque}>
          <button style={{...S.btnSm,marginBottom:14}} onClick={()=>setVista("dashboard")}>← Inicio</button>
          <h2 style={S.tBloque}>🎓 ¿Para qué nivel es la clase?</h2>
          <div style={S.grid}>
            <div style={S.opcion(nivelEdu==="primaria")} onClick={()=>setNivelEdu("primaria")}><p style={S.oLbl}>🏫 Primaria</p><p style={S.oDesc}>Grados 1° a 5° · Juego y exploración</p></div>
            <div style={S.opcion(nivelEdu==="bachillerato")} onClick={()=>setNivelEdu("bachillerato")}><p style={S.oLbl}>📚 Bachillerato</p><p style={S.oDesc}>Grados 6° a 11° · Pensamiento crítico</p></div>
          </div>
          <button style={{...S.btnVerde,marginTop:20}} onClick={()=>{if(!nivelEdu){alert("Selecciona el nivel");return;}setPaso(2);}}>Continuar →</button>
        </div>)}

        {paso===2&&(<div style={S.bloque}>
          <button style={{...S.btnSm,marginBottom:14}} onClick={()=>setPaso(1)}>← Volver</button>
          <h2 style={S.tBloque}>📋 Información de la clase</h2>
          <div style={{...S.fila,marginBottom:12}}><div style={{flex:2}}><p style={S.label}>Institución</p><input style={S.input} value={institucion} onChange={e=>setInstitucion(e.target.value)}/></div></div>
          <div style={{...S.fila,marginBottom:12}}><div style={{flex:2}}><p style={S.label}>Docente</p><input style={S.input} value={docente} onChange={e=>setDocente(e.target.value)}/></div><div style={{flex:1}}><p style={S.label}>Periodo</p><select style={S.select} value={periodo} onChange={e=>setPeriodo(e.target.value)}>{["1","2","3","4"].map(p=><option key={p}>Periodo {p}</option>)}</select></div></div>
          <div style={{...S.fila,marginBottom:12}}>
            <div style={{flex:1}}><p style={S.label}>Área</p><select style={S.select} value={area} onChange={e=>setArea(e.target.value)}><option value="">Seleccionar</option>{["Ciencias Naturales","Ciencias Sociales","Matemáticas","Lengua Castellana","Inglés","Educación Física","Artística","Ética y Valores","Tecnología e Informática","Filosofía","Química","Física","Biología"].map(m=><option key={m}>{m}</option>)}</select></div>
            <div style={{flex:1}}><p style={S.label}>Grado</p><select style={S.select} value={grado} onChange={e=>setGrado(e.target.value)}><option value="">Seleccionar</option>{(nivelEdu==="primaria"?["1°","2°","3°","4°","5°"]:["6°","7°","8°","9°","10°","11°"]).map(g=><option key={g}>{g}</option>)}</select></div>
          </div>
          <div style={{...S.fila,marginBottom:12}}><div style={{flex:2}}><p style={S.label}>Tema</p><input style={S.input} placeholder="Ej: La fotosíntesis" value={tema} onChange={e=>setTema(e.target.value)}/></div><div style={{flex:1}}><p style={S.label}>Duración</p><select style={S.select} value={duracion} onChange={e=>setDuracion(e.target.value)}>{OPT_DURACION.map(d=><option key={d.val} value={d.val}>{d.label}</option>)}</select></div></div>
          <div style={{marginBottom:20}}><p style={S.label}>Fecha</p><input type="date" style={{...S.input,width:"auto"}} value={fecha} onChange={e=>setFecha(e.target.value)}/></div>
          <button style={S.btnVerde} onClick={()=>{if(!area||!grado||!tema){alert("Completa área, grado y tema");return;}setPaso(3);}}>Continuar → Apertura</button>
        </div>)}

        {paso===3&&(<div style={S.bloque}><button style={{...S.btnSm,marginBottom:14}} onClick={()=>setPaso(2)}>← Volver</button><h2 style={S.tBloque}>🚀 ¿Cómo iniciar la clase?</h2><p style={S.desc}>Estrategias para {nivelEdu==="bachillerato"?"bachillerato":"primaria"}.</p><Opciones lista={optApertura} val={apertura} set={setApertura}/><button style={{...S.btnVerde,marginTop:20}} onClick={()=>{if(!apertura){alert("Selecciona apertura");return;}setPaso(4);}}>Continuar →</button></div>)}

        {paso===4&&(<div style={S.bloque}><button style={{...S.btnSm,marginBottom:14}} onClick={()=>setPaso(3)}>← Volver</button><h2 style={S.tBloque}>⚙️ ¿Cómo desarrollar el contenido?</h2><p style={S.desc}>Estrategias para {nivelEdu==="bachillerato"?"bachillerato":"primaria"}.</p><Opciones lista={optDesarrollo} val={desarrollo} set={setDesarrollo}/><button style={{...S.btnVerde,marginTop:20}} onClick={()=>{if(!desarrollo){alert("Selecciona estrategia");return;}setPaso(5);}}>Continuar →</button></div>)}

        {paso===5&&(<div style={S.bloque}><button style={{...S.btnSm,marginBottom:14}} onClick={()=>setPaso(4)}>← Volver</button><h2 style={S.tBloque}>🔄 ¿Cómo verificar el aprendizaje?</h2><p style={S.desc}>Retroalimentación para {nivelEdu==="bachillerato"?"bachillerato":"primaria"}.</p><Opciones lista={optRetro} val={retro} set={setRetro}/><button style={{...S.btnVerde,marginTop:20}} onClick={()=>{if(!retro){alert("Selecciona estrategia");return;}setPaso(6);}}>Continuar →</button></div>)}

        {paso===6&&(<div style={S.bloque}>
          <button style={{...S.btnSm,marginBottom:14}} onClick={()=>setPaso(5)}>← Volver</button>
          <h2 style={S.tBloque}>🏁 Cierre y tarea</h2>
          <p style={{color:C.texto,fontWeight:"bold",marginBottom:10,fontFamily:F_TITULO}}>Estrategia de cierre</p>
          <Opciones lista={OPT_CIERRE} val={cierre} set={setCierre}/>
          <div style={S.sep}/>
          <p style={{color:C.texto,fontWeight:"bold",marginBottom:10,fontFamily:F_TITULO}}>¿Vas a dejar tarea?</p>
          <div style={{...S.fila,marginBottom:16}}>
            <div style={{...S.opcion(dejaTarea===true),flex:1}} onClick={()=>setDejaTarea(true)}><p style={S.oLbl}>✅ Sí</p><p style={S.oDesc}>Incluir actividad para casa</p></div>
            <div style={{...S.opcion(dejaTarea===false),flex:1}} onClick={()=>{setDejaTarea(false);setTarea("");}}><p style={S.oLbl}>❌ No</p><p style={S.oDesc}>Finalizar en clase</p></div>
          </div>
          {dejaTarea===true&&<><p style={{color:C.textoS,fontSize:13,marginBottom:10}}>Estrategia de tarea:</p><Opciones lista={OPT_TAREA} val={tarea} set={setTarea}/></>}
          <button style={{...S.btnVerde,marginTop:20,opacity:cargando?0.7:1}} disabled={cargando} onClick={()=>{
            if(!cierre){alert("Selecciona cierre");return;}
            if(dejaTarea===null){alert("Indica si hay tarea");return;}
            if(dejaTarea&&!tarea){alert("Selecciona estrategia de tarea");return;}
            generarGuia();
          }}>{cargando?"⏳ Generando guía...":"✨ Generar guía completa"}</button>
        </div>)}

        {paso===7&&(<div>
          {!cargando&&contenido&&!contenido.startsWith("❌")&&(
            <>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
                <span style={S.chip}>📚 {area}</span><span style={S.chip}>🎓 {grado}</span>
                <span style={S.chip}>⏱️ {OPT_DURACION.find(d=>d.val===duracion)?.label}</span>
                <span style={S.chip}>{nivelEdu==="bachillerato"?"📗 Bachillerato":"📘 Primaria"}</span>
              </div>
              <div style={{...S.fila,marginBottom:20,flexWrap:"wrap",gap:8}}>
                <button style={{...S.btnAzul,width:"auto",padding:"11px 18px"}} onClick={()=>exportar("word")} disabled={descargando}>{descargando?"⏳...":"📥 Word"}</button>
                <button style={{...S.btnNaranja,width:"auto",padding:"11px 18px"}} onClick={()=>exportar("pdf")} disabled={descPdf}>{descPdf?"⏳...":"📄 PDF"}</button>
                {!guardadoOk?<button style={{...S.btnVerde,width:"auto",padding:"11px 18px",opacity:guardando?0.7:1}} onClick={guardarClase} disabled={guardando}>{guardando?"💾...":"💾 Guardar"}</button>
                  :<span style={{...S.chip,background:"#052e16",borderColor:C.ok,color:C.ok,padding:"11px 16px"}}>✅ Guardada</span>}
                <button style={{...S.btnGris,width:"auto"}} onClick={()=>setVista("dashboard")}>🏠 Inicio</button>
                <button style={{...S.btnGris,width:"auto"}} onClick={reset}>+ Nueva</button>
              </div>
            </>
          )}
          {cargando&&(<div style={{...S.resultado,textAlign:"center",padding:56}}><p style={{fontSize:44,margin:"0 0 14px"}}>✨</p><p style={{color:C.azulC,fontSize:18,fontFamily:F_TITULO}}>Generando tu guía pedagógica...</p><p style={{color:C.textoS,fontSize:13,marginTop:8}}>La IA está diseñando tu clase.</p></div>)}
          {!cargando&&contenido&&(<div style={S.resultado}><h2 style={{color:C.azulC,fontSize:20,marginBottom:4,marginTop:0,fontFamily:F_TITULO}}>📄 {tema}</h2><p style={{color:C.textoS,fontSize:13,marginBottom:20}}>{area} · {grado} · {OPT_DURACION.find(d=>d.val===duracion)?.label}</p><div style={S.sep}/><pre style={S.pre}>{contenido}</pre></div>)}
        </div>)}
      </div>
    </div>
  );
}