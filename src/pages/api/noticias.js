import { getNoticias, serializarNoticias } from '../../../lib/data';

export default function handler(req, res) {
  const limit = parseInt(req.query.limit) || 0;
  const categoria = req.query.categoria || null;

  let noticias = serializarNoticias(getNoticias());

  if (categoria) {
    noticias = noticias.filter(n => n.categoria === categoria);
  }

  if (limit > 0) {
    noticias = noticias.slice(0, limit);
  }

  res.status(200).json(noticias);
}
