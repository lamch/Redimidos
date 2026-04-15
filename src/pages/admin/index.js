import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../../styles/Admin.module.css';

const CATEGORIAS = ['Actualidad', 'Internacional', 'Israel', 'Apocalipsis', 'Vida', 'Historia', 'Persecución'];

function ahora() {
  const d = new Date();
  return d.toISOString().slice(0, 16);
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    titulo: '',
    categoria: 'Actualidad',
    fecha: ahora(),
    contenido: '',
    imagenUrl: '',
  });
  const [imagen, setImagen] = useState(null);       // { base64, nombre, preview }
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [vista, setVista] = useState('editar');     // 'editar' | 'preview'
  const fileRef = useRef();

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw');
    if (saved) { setPassword(saved); setAutenticado(true); }
  }, []);

  async function login(e) {
    e.preventDefault();
    if (!password.trim()) return;
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError('Contraseña incorrecta');
      return;
    }
    sessionStorage.setItem('admin_pw', password);
    setAutenticado(true);
  }

  function handleImagen(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1];
      setImagen({ base64, nombre: file.name, preview: ev.target.result });
    };
    reader.readAsDataURL(file);
  }

  function campo(key, valor) {
    setForm(f => ({ ...f, [key]: valor }));
  }

  async function guardar(e) {
    e.preventDefault();
    if (!form.titulo.trim()) return setError('El título es obligatorio.');
    if (!form.contenido.trim()) return setError('El contenido es obligatorio.');
    if (!imagen && !form.imagenUrl.trim()) return setError('Agregá una imagen.');

    setLoading(true);
    setError('');
    setMensaje(null);

    try {
      const body = {
        password,
        noticia: { ...form, fecha: new Date(form.fecha).toISOString() },
        ...(imagen ? { imagenBase64: imagen.base64, imagenNombre: imagen.nombre } : {}),
      };

      const res = await fetch('/api/admin/guardar-noticia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status === 401) {
        sessionStorage.removeItem('admin_pw');
        setAutenticado(false);
        setError('Contraseña incorrecta.');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Error desconocido');

      setMensaje(`Noticia publicada correctamente. ID: ${data.id}`);
      setForm({ titulo: '', categoria: 'Actualidad', fecha: ahora(), contenido: '', imagenUrl: '' });
      setImagen(null);
      if (fileRef.current) fileRef.current.value = '';

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!autenticado) {
    return (
      <>
        <Head><title>Admin – Redimidos</title></Head>
        <div className={styles.loginWrap}>
          <form className={styles.loginBox} onSubmit={login}>
            <h1 className={styles.loginTitle}>Panel de Administración</h1>
            <input
              className={styles.input}
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className={styles.errorMsg}>{error}</p>}
            <button className={styles.btnPrimary} type="submit">Entrar</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Admin – Nueva Noticia</title></Head>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Nueva Noticia</h1>
          <button className={styles.btnSalir} onClick={() => {
            sessionStorage.removeItem('admin_pw');
            setAutenticado(false);
            setPassword('');
          }}>Salir</button>
        </header>

        <form className={styles.form} onSubmit={guardar}>

          {/* Título */}
          <div className={styles.field}>
            <label className={styles.label}>Título *</label>
            <input
              className={styles.input}
              type="text"
              value={form.titulo}
              onChange={e => campo('titulo', e.target.value)}
              placeholder="Título de la noticia"
            />
          </div>

          {/* Categoría y Fecha */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Categoría</label>
              <select className={styles.input} value={form.categoria} onChange={e => campo('categoria', e.target.value)}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Fecha</label>
              <input
                className={styles.input}
                type="datetime-local"
                value={form.fecha}
                onChange={e => campo('fecha', e.target.value)}
              />
            </div>
          </div>

          {/* Imagen */}
          <div className={styles.field}>
            <label className={styles.label}>Imagen *</label>
            <div className={styles.imagenWrap}>
              {imagen ? (
                <div className={styles.imagenPreviewWrap}>
                  <img src={imagen.preview} alt="preview" className={styles.imagenPreview} />
                  <button type="button" className={styles.btnRemove} onClick={() => {
                    setImagen(null);
                    if (fileRef.current) fileRef.current.value = '';
                  }}>✕ Quitar</button>
                </div>
              ) : (
                <label className={styles.uploadLabel}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImagen} className={styles.fileInput} />
                  <span>+ Seleccionar imagen</span>
                </label>
              )}
            </div>
          </div>

          {/* Contenido */}
          <div className={styles.field}>
            <label className={styles.label}>Contenido *</label>
            <div className={styles.tabs}>
              <button type="button" className={`${styles.tab} ${vista === 'editar' ? styles.tabActivo : ''}`} onClick={() => setVista('editar')}>Escribir</button>
              <button type="button" className={`${styles.tab} ${vista === 'preview' ? styles.tabActivo : ''}`} onClick={() => setVista('preview')}>Vista previa</button>
            </div>
            {vista === 'editar' ? (
              <textarea
                className={styles.textarea}
                value={form.contenido}
                onChange={e => campo('contenido', e.target.value)}
                placeholder="Escribí el contenido aquí. Podés usar HTML o texto plano."
                rows={16}
              />
            ) : (
              <div
                className={styles.preview}
                dangerouslySetInnerHTML={{ __html: form.contenido || '<em>Sin contenido todavía...</em>' }}
              />
            )}
          </div>

          {/* Mensajes */}
          {error && <p className={styles.errorMsg}>{error}</p>}
          {mensaje && <p className={styles.okMsg}>{mensaje}</p>}

          <button className={styles.btnPrimary} type="submit" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar noticia'}
          </button>
        </form>
      </div>
    </>
  );
}
